type ModuleNode = {
  id: string;
  name: string;
  prerequisiteIds: string[];
};

export function buildGraph(modules: ModuleNode[]) {
  const prerequisiteMap = new Map<string, string[]>();
  const requiredForMap = new Map<string, string[]>();

  for (const m of modules) {
    prerequisiteMap.set(m.id, m.prerequisiteIds);

    if (!requiredForMap.has(m.id)) {
      requiredForMap.set(m.id, []);
    }

    for (const prereqId of m.prerequisiteIds) {
      const existing = requiredForMap.get(prereqId) ?? [];
      existing.push(m.id);
      requiredForMap.set(prereqId, existing);
    }
  }

  return { prerequisiteMap, requiredForMap };
}

function getReachable(
  startId: string,
  adjacencyMap: Map<string, string[]>,
): Set<string> {
  const visited = new Set<string>();
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.pop()!;
    const neighbours = adjacencyMap.get(current) ?? [];

    for (const neighbour of neighbours) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push(neighbour);
      }
    }
  }

  return visited;
}

export function getDescendants(
  moduleId: string,
  requiredForMap: Map<string, string[]>,
): Set<string> {
  return getReachable(moduleId, requiredForMap);
}

export function getAncestors(
  moduleId: string,
  prerequisiteMap: Map<string, string[]>,
): Set<string> {
  return getReachable(moduleId, prerequisiteMap);
}

export type LayoutNode = {
  id: string;
  name: string;
  x: number;
  y: number;
};

export type LayoutEdge = {
  sourceId: string;
  targetId: string;
};

function computeRanks(
  modules: ModuleNode[],
  prerequisiteMap: Map<string, string[]>,
): Map<string, number> {
  const ranks = new Map<string, number>();

  function computeRank(id: string, visited: Set<string>): number {
    if (ranks.has(id)) return ranks.get(id)!;
    if (visited.has(id)) return 0;
    visited.add(id);

    const prereqs = prerequisiteMap.get(id) ?? [];
    const rank =
      prereqs.length === 0
        ? 0
        : Math.max(...prereqs.map((p) => computeRank(p, visited) + 1));

    ranks.set(id, rank);
    return rank;
  }

  for (const m of modules) {
    computeRank(m.id, new Set());
  }

  return ranks;
}

export function layoutGraph(modules: ModuleNode[]): {
  nodes: LayoutNode[];
  edges: LayoutEdge[];
} {
  if (modules.length === 0) return { nodes: [], edges: [] };

  const { prerequisiteMap } = buildGraph(modules);
  const nameMap = new Map(modules.map((m) => [m.id, m.name]));

  const rank = computeRanks(modules, prerequisiteMap);

  const rankGroups = new Map<number, string[]>();
  for (const m of modules) {
    const r = rank.get(m.id) ?? 0;
    const group = rankGroups.get(r) ?? [];

    group.push(m.id);
    rankGroups.set(r, group);
  }

  for (const group of rankGroups.values()) {
    group.sort((a, b) =>
      (nameMap.get(a) ?? "").localeCompare(nameMap.get(b) ?? ""),
    );
  }

  const NODE_WIDTH = 200;
  const NODE_HEIGHT = 50;
  const X_GAP = 30;
  const Y_GAP = 100;

  const nodes: LayoutNode[] = [];

  const maxRank = Math.max(...rankGroups.keys());

  for (let r = 0; r <= maxRank; r++) {
    const group = rankGroups.get(r) ?? [];
    const totalWidth = group.length * NODE_WIDTH + (group.length - 1) * X_GAP;
    const startX = -totalWidth / 2;

    for (let i = 0; i < group.length; i++) {
      const id = group[i]!;
      nodes.push({
        id,
        name: nameMap.get(id) ?? "",
        x: startX + i * (NODE_WIDTH + X_GAP),
        y: r * (NODE_HEIGHT + Y_GAP),
      });
    }
  }

  const edges: LayoutEdge[] = [];
  for (const m of modules) {
    for (const prereqId of m.prerequisiteIds) {
      edges.push({ sourceId: prereqId, targetId: m.id });
    }
  }

  return { nodes, edges };
}

export function computeModuleLevels(
  modules: ModuleNode[],
): Map<string, number> {
  const { prerequisiteMap } = buildGraph(modules);
  return computeRanks(modules, prerequisiteMap);
}
