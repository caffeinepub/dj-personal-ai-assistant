# DJ Personal AI Assistant

## Current State

The app has:
- Internet Identity login with authorization component
- Dashboard, Chat, Profile, Settings pages
- Setup Wizard and Teach DJ Story Mode
- Self-improvement engine: memories, custom commands, behavior rules, personality settings
- Three modules: Excel analysis, Coding assistant, Website generation
- Plugin activation/deactivation system
- Chat history persistence
- Improvement log

Backend stores: UserProfile, Memory, Command, BehaviorRule, ChatMessage, ImprovementLog, ExcelFile, CodeSnippet, Website.

No blob-storage component is currently selected.

## Requested Changes (Diff)

### Add
- **ExternalSource** type in backend to store metadata about external knowledge sources (URL, PDF, Word doc, PowerPoint)
- `addExternalSource(sourceType, title, url, extractedContent)` - saves a source with extracted text content
- `getAllExternalSources()` - returns all saved sources
- `deleteExternalSource(id)` - removes a source
- `searchExternalSources(query)` - searches source content by keyword
- **Knowledge Sources page** (new page `/knowledge`) - UI for managing all external sources
  - Tab/section: "Add Website" - paste URL, app fetches page content (via fetch in browser) and saves title + extracted text
  - Tab/section: "Upload File" - drag-and-drop for PDF, Word (.docx), PowerPoint (.pptx) files; client-side text extraction then saves to backend
  - List of all saved sources with title, type icon, date added, content preview, and delete button
  - Search bar to find sources by keyword
- **Chat integration**: when DJ replies, it searches saved external sources for relevant content and appends matching context to responses with a "Based on: [source title]" citation
- Navigation link to Knowledge Sources page in sidebar/nav
- blob-storage component selection for future file storage scalability

### Modify
- **ChatPage** - DJ response logic now queries external sources and weaves relevant content into replies
- **DashboardPage** - Add "Knowledge Sources" stat card showing count of saved sources
- **App.tsx / navigation** - Add route and nav item for `/knowledge`

### Remove
- Nothing removed

## Implementation Plan

1. Select blob-storage component (for file uploads)
2. Update backend (main.mo) to add ExternalSource type and CRUD + search functions
3. Generate updated backend.d.ts
4. Create KnowledgePage.tsx with:
   - Add Website tab: URL input → browser fetch → text extraction → save to backend
   - Upload File tab: drag-drop file input → client-side PDF/DOCX/PPTX text extraction → save to backend
   - Source list with type icons, previews, delete
   - Search across all sources
5. Update ChatPage.tsx: when building DJ response, load all external sources, search for relevance, inject matching content as context with citation
6. Update DashboardPage.tsx: add knowledge sources count card
7. Update App.tsx: add /knowledge route
8. Update navigation component to include Knowledge Sources link
