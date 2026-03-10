# DJ Personal AI Assistant

## Current State
- Knowledge page stores items as encoded memory strings with fields: type, title, url, content
- `knowledgeSources.ts` encodes/parses these strings; search already covers title/url/content
- No category field in KnowledgeSource; no summary field
- KnowledgePage has a "My Sources" tab with search bar, but no category filter
- No auto-summary card shown after adding a PDF or website

## Requested Changes (Diff)

### Add
- `category` field to `KnowledgeSource` interface (default: "General")
- `summary` field to `KnowledgeSource` interface (short auto-generated excerpt)
- Preset categories: Work, Personal, Technical, Research, Other
- Ability for users to create custom categories (stored in localStorage)
- Category selector when adding a website or file (before saving)
- Summary card shown immediately after saving a knowledge item: title, short summary (first ~200 chars of content), source type badge
- Category filter tabs/chips above the sources list
- Search already covers content; confirm it works and is visible

### Modify
- `encodeKnowledgeSource` to include `category` and `summary` fields
- `parseKnowledgeSource` to extract `category` and `summary` (backward compatible: missing = defaults)
- KnowledgePage "My Sources" tab: add category filter bar above grid
- Website save flow: add category picker step before saving
- File upload review step: add category picker
- Source cards: show summary text and category badge

### Remove
- Nothing removed

## Implementation Plan
1. Update `knowledgeSources.ts`: add category/summary to interface, encode/parse functions (backward compat)
2. Update `KnowledgePage.tsx`:
   a. Add category state (preset list + custom categories from localStorage)
   b. Add custom category creation UI
   c. Website flow: add category dropdown before Save
   d. File upload review: add category dropdown
   e. On save: generate summary from first 200 chars of content, store with category
   f. After saving: show a summary card (toast-style or inline) with title, summary, source type
   g. My Sources tab: add category filter chips above grid
   h. Source cards: show category badge and summary snippet
