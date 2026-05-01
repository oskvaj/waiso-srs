import { Handle, Position, type NodeProps } from "@xyflow/react";

export function ModuleGraphNodeComponent({
  data,
}: NodeProps & { data: { name: string } }) {
  return (
    <div className="bg-theme-card border-theme-border flex h-20 w-50 items-center justify-center rounded-lg border">
      <Handle
        type="target"
        position={Position.Top}
        className="bg-theme-primary! size-2! border-none!"
      />
      <p className="line-clamp-2 truncate font-semibold">{data.name}</p>
      <Handle
        type="source"
        position={Position.Bottom}
        className="bg-theme-primary! size-2! border-none!"
      />
    </div>
  );
}
