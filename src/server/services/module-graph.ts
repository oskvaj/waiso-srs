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
