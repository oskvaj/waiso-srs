"use client";

import { layoutGraph } from "@/lib/module-graph";
import type { ModuleGraphNode } from "@/server/services/course";
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { ModuleGraphNodeComponent } from "./module-graph-node";
import { useCallback, useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

function buildReactFlowElements(modules: ModuleGraphNode[]) {
  const { nodes: layoutNodes, edges: layoutEdges } = layoutGraph(modules);

  const nodes: Node[] = layoutNodes.map((n) => ({
    id: n.id,
    type: "moduleNode",
    position: { x: n.x, y: n.y },
    data: { name: n.name },
  }));

  const edges: Edge[] = layoutEdges.map((e) => ({
    id: `${e.sourceId}-${e.targetId}`,
    source: e.sourceId,
    target: e.targetId,
    style: { stroke: "var(--app-border)", strokeWidth: 2 },
    deletable: true,
    markerEnd: { type: MarkerType.ArrowClosed, color: "var(--app-border)" },
  }));

  return { nodes, edges };
}

const nodeTypes = {
  moduleNode: ModuleGraphNodeComponent,
};

export function DependencyGraph({
  courseId,
  courseName,
  modules,
}: {
  courseId: string;
  courseName: string;
  modules: ModuleGraphNode[];
}) {
  const router = useRouter();
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildReactFlowElements(modules),
    [modules],
  );

  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  const styledEdges = edges.map((edge) => ({
    ...edge,
    style: {
      stroke:
        edge.id === selectedEdgeId ? "var(--app-danger)" : "var(--app-border)",
      strokeWidth: edge.id === selectedEdgeId ? 3 : 2,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color:
        edge.id === selectedEdgeId ? "var(--app-danger)" : "var(--app-border)",
    },
  }));

  const addPrerequisite = api.module.addPrerequisite.useMutation({
    onSuccess: () => {
      toast.success("Dependency added");
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const removePrerequisite = api.module.removePrerequisite.useMutation({
    onSuccess: () => {
      toast.success("Dependency removed");
      setSelectedEdgeId(null);
      router.refresh();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      addPrerequisite.mutate({
        moduleId: connection.target,
        prerequisiteId: connection.source,
      });
    },
    [addPrerequisite],
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      for (const edge of deletedEdges) {
        removePrerequisite.mutate({
          moduleId: edge.target,
          prerequisiteId: edge.source,
        });
      }
    },
    [removePrerequisite],
  );

  function handleDeleteSelected() {
    const edge = edges.find((e) => e.id === selectedEdgeId);
    if (!edge) return;

    setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
    removePrerequisite.mutate({
      moduleId: edge.target,
      prerequisiteId: edge.source,
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0">
        <Link
          href={`/courses/${courseId}`}
          className="text-theme-muted hover:text-theme-text mb-2 inline-flex items-center gap-1 text-sm transition-colors"
        >
          <MoveLeft className="text-theme-primary size-6" />
          {courseName}
        </Link>
        <h1 className="font-theme-heading text-2xl font-bold">
          Dependency graph
        </h1>
        <p className="text-theme-muted mt-1 text-sm">
          {modules.length} modules • {edges.length} dependencies
        </p>
      </div>

      <div className="border-theme-border relative mt-4 min-h-0 flex-1 rounded-lg border">
        {selectedEdgeId && (
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
            disabled={removePrerequisite.isPending}
            className="absolute top-3 right-3 z-10 hover:cursor-pointer"
          >
            {removePrerequisite.isPending ? "Removing..." : "Delete dependency"}
          </Button>
        )}
        <ReactFlow
          nodes={nodes}
          edges={styledEdges}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={true}
          elementsSelectable={true}
          deleteKeyCode="Delete"
          onConnect={onConnect}
          onEdgesDelete={onEdgesDelete}
          onSelectionChange={({ edges: selectedEdges }) => {
            setSelectedEdgeId(
              selectedEdges.length === 1 ? selectedEdges[0]!.id : null,
            );
          }}
        >
          <Background color="var(--app-border)" gap={20} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}
