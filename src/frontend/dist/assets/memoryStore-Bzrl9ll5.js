const MEMORY_PREFIX = "MEMORY_GRAPH:";
function generateMemoryId() {
  return `mg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function serialize(node) {
  const { backendId: _backendId, ...rest } = node;
  return MEMORY_PREFIX + JSON.stringify(rest);
}
function parseMemoryNode(mem) {
  try {
    if (!mem.content.startsWith(MEMORY_PREFIX)) return null;
    const json = mem.content.slice(MEMORY_PREFIX.length);
    const parsed = JSON.parse(json);
    parsed.backendId = mem.id;
    return parsed;
  } catch {
    return null;
  }
}
function parseMemoryNodes(memories, includeArchived = false) {
  return memories.map(parseMemoryNode).filter((n) => n !== null).filter((n) => includeArchived || !n.archived);
}
async function saveMemoryNode(actor, data) {
  const node = {
    id: generateMemoryId(),
    type: data.type,
    content: data.content,
    tags: data.tags,
    importance: data.importance,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
    archived: false
  };
  await actor.addMemory(serialize(node));
  return node;
}
async function updateMemoryNode(actor, node) {
  if (node.backendId !== void 0) {
    await actor.deleteMemory(node.backendId);
  }
  await actor.addMemory(serialize(node));
}
async function deleteMemoryNode(actor, backendId) {
  await actor.deleteMemory(backendId);
}
async function deduplicateOrSave(actor, memories, data) {
  const existing = parseMemoryNodes(memories);
  const duplicate = existing.find(
    (n) => n.content.toLowerCase() === data.content.toLowerCase()
  );
  if (duplicate) {
    const updated = {
      ...duplicate,
      lastAccessed: Date.now()
    };
    await updateMemoryNode(actor, updated);
    return null;
  }
  return saveMemoryNode(actor, data);
}
export {
  deleteMemoryNode as a,
  deduplicateOrSave as d,
  parseMemoryNodes as p,
  saveMemoryNode as s,
  updateMemoryNode as u
};
