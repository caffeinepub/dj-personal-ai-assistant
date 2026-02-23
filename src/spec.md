# DJ - Personal AI Assistant

## Current State

The workspace contains a basic Caffeine project scaffolding with:
- React + TypeScript frontend setup with Vite
- Internet Identity integration hooks (`useInternetIdentity.ts`, `useActor.ts`)
- Shadcn/ui component library (buttons, cards, dialogs, forms, charts, etc.)
- Tailwind CSS configuration
- Basic config structure for backend integration
- No backend API or application logic yet
- No App.tsx component yet

## Requested Changes (Diff)

### Add

**Backend (Motoko):**
- User profile system with name storage and preferences
- Self-improvement engine with four key systems:
  - Memory system: store/retrieve/delete user memories with timestamps
  - Custom command system: create/execute/delete user-defined commands with actions
  - Behavior rules system: store personality rules and formatting preferences
  - Personality settings: store communication style preferences (formal/casual/concise/detailed)
- Chat system: store conversation history with timestamps
- Module management: track active/inactive modules (Excel, Coding, Website)
- Improvement log: track all changes (memories added, commands created, rules set, personality changes)
- Excel data storage: store uploaded file data and analysis results
- Code snippet storage: store templates and user-created code
- Website template storage: store generated website HTML/CSS/JS

**Frontend:**
- **Dashboard page**: Futuristic HUD-style main screen with:
  - Personal greeting with user's name
  - Current time and date display
  - Module tiles (Excel, Coding, Website) that show/hide based on active state
  - "DJ Brain" stats panel: total memories, commands, modules, automations
  - Recent activity feed
  - Animated "DJ is listening" pulse ring with central mic button
  - Dark theme with electric blue/cyan neon glow aesthetic
- **Internet Identity login flow**: Welcome screen with "Login with Internet Identity" button
- **User profile setup**: Name input on first login
- **Self-Improvement UI**: Panels for viewing memories, custom commands, rules, improvement log
- **Chat interface**: 
  - Full-screen chat view with message history
  - Text input with send button
  - Voice input button with Web Speech API integration
  - Voice output using browser text-to-speech
  - Wake word detection for "Hey DJ"
  - Command parser that recognizes self-improvement commands
  - Markdown rendering for messages
- **Excel Module**:
  - File upload interface (.xlsx, .csv, .xls)
  - Data table viewer
  - Basic chart visualizations (bar, line, pie)
  - Question interface for data analysis
  - Download results button
- **Coding Module**:
  - Code editor with syntax highlighting (Monaco Editor or CodeMirror)
  - Language selector
  - Template library (common patterns: API calls, data structures, algorithms)
  - Code explanation feature
  - Copy/download code buttons
- **Website Module**:
  - Template selector (Landing Page, Portfolio, Business Site, Blog)
  - Customization form (colors, title, content sections)
  - Live preview iframe
  - Download as ZIP button
- **PWA configuration**: manifest.json, service worker for offline capability, mobile-optimized viewport settings

### Modify

None (starting from scratch)

### Remove

None (starting from scratch)

## Implementation Plan

1. **Select authorization component** to enable user identity and data storage
2. **Generate Motoko backend** with:
   - User profile CRUD (create profile with name, get profile, update preferences)
   - Memory CRUD (add memory, get all memories, delete memory by ID)
   - Custom command CRUD (create command, get all commands, execute command by name, delete command)
   - Behavior rule CRUD (set rule, get all rules, delete rule)
   - Personality settings (set style preference, get style)
   - Chat history (add message, get messages with pagination)
   - Module management (activate module, deactivate module, get active modules)
   - Improvement log (add log entry, get all entries with pagination)
   - Excel storage (save file data, get file data, save analysis result)
   - Code storage (save snippet, get all snippets)
   - Website storage (save template, get all templates)
3. **Build frontend Dashboard and Login**:
   - Create App.tsx with routing (Dashboard, Chat, Excel, Coding, Website, Profile)
   - Build LoginPage component with Internet Identity integration
   - Build Dashboard component with HUD design
   - Wire up user profile creation on first login
4. **Build Self-Improvement Engine UI**:
   - Create SelfImprovementPanel component showing memories, commands, rules, log
   - Integrate with backend APIs
5. **Build Chat Interface**:
   - Create ChatPage component with message list and input
   - Implement command parser for recognizing self-improvement commands
   - Add Web Speech API integration for voice input/output
   - Implement wake word detection using continuous listening
   - Wire up backend chat history storage
6. **Build Excel Module**:
   - Create ExcelPage component with file upload
   - Use SheetJS library for parsing Excel files
   - Create data visualization with Recharts
   - Implement simple data analysis (sum, average, min, max, trends)
7. **Build Coding Module**:
   - Create CodingPage component with code editor
   - Integrate syntax highlighting library
   - Build template library with common code patterns
   - Add code explanation logic (pattern matching for common constructs)
8. **Build Website Module**:
   - Create WebsitePage component with template selector
   - Build HTML/CSS/JS templates for 4 site types
   - Implement live preview
   - Add ZIP file download using JSZip library
9. **Add PWA configuration**: Create manifest.json, configure service worker, add meta tags
10. **Validate frontend**: Run typecheck, lint, and build to ensure no errors

## UX Notes

**Visual Design:**
- Dark theme only (black background with blue/cyan accents)
- Iron Man-inspired HUD aesthetic: glowing borders, hexagonal elements, animated pulse effects
- Mobile-first responsive design with large touch targets
- Smooth animations for module activation, voice listening indicator

**Voice Interaction:**
- "Hey DJ" wake word activates listening mode
- Visual feedback: pulsing blue ring when listening
- Voice responses read aloud using natural browser TTS
- Fallback to manual mic button press if wake word detection unavailable

**Self-Improvement Commands (examples):**
- "DJ, remember I prefer morning meetings" → stores memory
- "DJ, create command called Daily Briefing that shows my tasks and calendar" → creates custom command
- "DJ, your new rule is always respond in bullet points" → sets behavior rule
- "DJ, be more concise" → adjusts personality setting
- "DJ, what do you remember about me?" → lists all memories
- "DJ, activate Excel module" → shows Excel tile on dashboard
- "DJ, deactivate Website module" → hides Website tile

**Module Activation:**
- All modules pre-installed but hidden by default
- User activates via voice command or dashboard toggle
- Active modules appear as glowing tiles on dashboard
- Each module accessible via navigation menu

**Data Persistence:**
- All user data stored on-chain via backend
- Chat history, memories, commands, rules synced across devices
- Excel files and analysis results stored for later access
- Code snippets and website templates saved to user's library
