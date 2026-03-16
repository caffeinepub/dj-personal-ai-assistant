# DJ Personal AI Assistant

## Current State

DJ is a full-stack PWA running on React + TypeScript frontend and Motoko backend on ICP. The assistant pipeline is:

User Input → Intent Engine → Entity Extraction → Context Engine → Decision Engine → Skill Router → Skill Execution → Reply Composer → Response Generator → Voice + Chat Output

Skills: tasksSkill, notesSkill, financeSkill, knowledgeSkill registered in skillRegistry.ts.
Proactive state persists in localStorage via proactiveState.ts.
No memory graph system exists. DJ has no long-term memory of user facts, goals, habits, or preferences beyond what is stored in UserProfile.

## Requested Changes (Diff)

### Add
- `assistant/memory/memoryGraph.ts` — MemoryNode type, MemoryType enum, MemoryRelationship interface (for future graph links)
- `assistant/memory/memoryStore.ts` — CRUD wrappers: saveMemory, updateMemory, deleteMemory, getMemoryById, getMemoriesByTag; duplicate guard; decay logic
- `assistant/memory/memorySearch.ts` — searchRelevantMemories(query), getRecentMemories(), getImportantMemories(); returns up to 5 results
- `assistant/memory/memoryExtractor.ts` — pattern-matching rules for all 7 memory types; retroactive scan on first run using memoryExtractionInitialized flag; duplicate prevention; skips short (<10 char) and system messages
- `pages/MemoryPage.tsx` — /memory route with search bar, filter tabs (All/Profile/Goals/Preferences/Habits/Knowledge), memory cards (content, type badge, tags, importance stars, created date, edit + delete)
- New Motoko backend methods: saveMemory, updateMemory, deleteMemory, getMemoryById, getMemoriesByTag, searchMemories
- New backend.ts wrapper methods for all 6 memory canister calls
- `memoryExtractionInitialized` boolean field added to proactiveState.ts persistent shape

### Modify
- `assistantController.ts` — insert Memory Extraction after Stage 2 (entity extraction); insert Memory Search after Stage 6.5 (reply compose); pass relevantMemories to replyComposer; handle REMEMBER/FORGET/MEMORY_QUERY intents via memoryStore
- `replyComposer.ts` — extend ReplyComposerInput with optional `relevantMemories?: MemoryNode[]`; reference memories in context prefix when present
- `intentEngine.ts` — add REMEMBER, FORGET, MEMORY_QUERY intents
- `App.tsx` — add /memory protected route pointing to MemoryPage
- Navigation (Layout or nav component) — add Memory link
- `proactiveState.ts` — add memoryExtractionInitialized to state shape

### Remove
- Nothing removed

## Implementation Plan

1. Regenerate Motoko backend with 6 new memory methods
2. Add backend.ts wrapper methods for all memory calls
3. Create assistant/memory/ directory with 4 files
4. Extend proactiveState.ts with memoryExtractionInitialized flag
5. Update intentEngine.ts with 3 new intents
6. Update assistantController.ts to run extraction and search in pipeline
7. Update replyComposer.ts to accept and use relevantMemories
8. Build MemoryPage.tsx with full CRUD UI
9. Add /memory route to App.tsx and nav link
