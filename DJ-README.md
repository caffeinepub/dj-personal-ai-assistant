# DJ - Personal AI Assistant

## Overview

DJ is a complete Iron Man-inspired personal AI assistant web application built on the Internet Computer. This is a fully functional, mobile-first Progressive Web App (PWA) featuring a futuristic dark HUD design with electric blue and cyan neon aesthetics.

## ✨ Features Implemented

### 🔐 Authentication
- **Internet Identity Integration**: Secure, decentralized, password-free login
- **User Profile Creation**: First-time setup flow prompts for user's name
- **Protected Routes**: All app pages require authentication

### 🏠 Dashboard (Home Page)
- **Personalized Greeting**: Displays "Welcome back, {userName}"
- **Live Time & Date**: Real-time clock display with formatted date
- **Central Voice Interface**: Animated pulsing ring around microphone icon
- **DJ Brain Stats Panel**: Shows counts for:
  - Total memories stored
  - Custom commands created
  - Active modules
  - Improvement log entries
- **Module Management**: Visual tiles for Excel, Coding, and Website modules with activate/deactivate toggles
- **Recent Activity Feed**: Last 5 improvement log entries

### 💬 Chat Interface
- **Text Chat**: Full chat interface with message history
- **Voice Input**: Browser-based Web Speech API for voice commands
- **Voice Output**: Text-to-speech responses from DJ
- **Wake Word Detection**: "Hey DJ" activation (continuous listening mode)
- **Command Parser**: Intelligent parsing of natural language commands:
  - `"DJ, remember [text]"` → Adds memory
  - `"DJ, forget [text]"` → Deletes memory
  - `"DJ, what do you remember?"` → Lists all memories
  - `"DJ, create command called [name] that does [action]"` → Creates custom command
  - `"DJ, your new rule is [rule]"` → Sets behavior rule
  - `"DJ, be more formal/casual/concise/detailed"` → Adjusts personality
  - `"DJ, activate/deactivate [module]"` → Toggles modules
- **Markdown Support**: Rich message rendering with ReactMarkdown
- **Persistent History**: All messages saved to backend

### 🧠 Self-Improvement Engine
Complete self-learning system accessible via Profile page:

#### Memories Tab
- Add new memories with text input
- View all stored memories with timestamps
- Delete individual memories with confirmation dialog
- Automatic improvement log entry on add/delete

#### Custom Commands Tab
- Create custom commands with name and action description
- View all commands with metadata
- Delete commands with confirmation
- Automatic logging of command creation/deletion

#### Behavior Rules Tab
- Set new behavior rules
- View all active rules
- Delete rules with confirmation
- Improvement log tracking

#### Improvement Log Tab
- Read-only log of all DJ improvements
- Categorized by type (Memory, Command, Rule, Module, Personality)
- Timestamped entries with descriptions
- Sortable and filterable view

### 📊 Excel Module
- **File Upload**: Supports .xlsx, .xls, and .csv files
- **Data Parsing**: Uses SheetJS (xlsx) library to parse spreadsheets
- **Table View**: Displays data in responsive table (first 50 rows)
- **Statistics Display**: Shows row count, column count
- **Natural Language Analysis**: 
  - "What's the total of [column]?"
  - "Show me the average [column]"
  - "What's the maximum/minimum [column]?"
- **Chart Visualizations**:
  - Bar charts for numeric columns
  - Line charts for time series data
  - Up to 3 numeric columns displayed at once
  - Recharts integration with dark theme
- **Download**: Export modified data back to Excel
- **Persistent Storage**: Files saved to backend

### 💻 Coding Module
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Multi-Language Support**: JavaScript, Python, HTML, CSS, TypeScript, Motoko
- **Template Library**: Pre-built code snippets by language:
  - JavaScript: API Fetch, Array Methods
  - Python: List Comprehension, File I/O
  - HTML: Basic Structure, Form
  - CSS: Flexbox, Grid Layout
  - Motoko: Basic Actor
- **Snippet Management**:
  - Save snippets with title and language
  - Load previously saved snippets
  - View all saved snippets in sidebar
- **Export Functions**:
  - Copy to clipboard
  - Download as file with correct extension
- **Dark Theme**: Matches HUD aesthetic

### 🌐 Website Module
- **Template System**: 2 pre-built templates
  - Landing Page: Hero section with CTA
  - Portfolio: Project showcase grid
- **Customization Form**:
  - Website title input
  - Primary color picker (visual + hex input)
  - Custom heading and content
- **Live Preview**: Real-time iframe preview of generated site
- **Code View Tabs**: View HTML, CSS, and JavaScript separately
- **Download as ZIP**: Uses JSZip to bundle files
- **Save to Backend**: Store templates for later use
- **Load Saved Sites**: Browse and reload previously generated websites

### 👤 Profile Page
- **Personal Information**: Update display name
- **Personality Settings**: Choose communication style (Professional, Casual, Formal, Concise, Detailed)
- **Self-Improvement Panel**: Full access to all DJ learning features
- **Danger Zone**: Reset all data option (with confirmation dialog)

## 🎨 Design System

### Color Palette (OKLCH)
- **Background**: Pure black (`#000000`)
- **Primary (Electric Blue)**: `0.65 0.25 220`
- **Secondary (Cyan)**: `0.75 0.18 195`
- **Accent**: `0.70 0.22 195`
- **Destructive**: `0.55 0.24 25`
- **Chart Colors**: 5 distinct neon colors for data visualization

### Typography
- **Display Font**: Orbitron (futuristic, geometric)
- **Body Font**: Rajdhani (clean, modern)
- **Mono Font**: Share Tech Mono (technical, HUD-style)

### Visual Effects
- **Neon Glow**: Custom CSS classes for glowing borders and text
  - `.glow-border`: Blue pulsing border effect
  - `.glow-border-cyan`: Cyan variant
  - `.glow-text`: Glowing text shadow
  - `.pulse-ring`: Animated pulsing ring for voice interface
- **Hexagonal Elements**: Clip-path utility for Iron Man-inspired shapes
- **Zero Border Radius**: Sharp, technical aesthetic throughout

## 🏗️ Architecture

### Frontend Stack
- **React 19** with TypeScript
- **React Router DOM**: Client-side routing
- **TanStack React Query**: Server state management
- **shadcn/ui**: Component library (customized for dark theme)
- **Tailwind CSS**: Utility-first styling with custom OKLCH tokens

### Key Libraries
- **xlsx**: Excel file parsing and generation
- **recharts**: Data visualization charts
- **@monaco-editor/react**: Code editor
- **jszip**: ZIP file creation for website downloads
- **react-markdown**: Markdown rendering in chat
- **sonner**: Toast notifications

### Backend Integration
All data persistence handled via Motoko backend:
- User profiles with Internet Identity
- Memory storage
- Custom commands
- Behavior rules
- Personality settings
- Chat message history
- Improvement logs
- Code snippets
- Excel files
- Website templates
- Module activation state

## 📱 PWA Features

### Installability
- **Manifest.json**: Configured for home screen installation
- **App Name**: "DJ - Personal AI Assistant"
- **Display Mode**: Standalone (full-screen app experience)
- **Theme Color**: Black background
- **Icons**: Custom SVG icons with DJ branding

### Mobile Optimization
- **Mobile-First Design**: All layouts optimized for small screens first
- **Touch Targets**: Minimum 44px tap targets
- **Responsive Navigation**: 
  - Desktop: Horizontal nav in header
  - Mobile: Bottom tab bar navigation
- **Viewport Settings**: Proper scaling and zoom controls
- **Safe Areas**: Respects mobile notches and rounded corners

### Accessibility
- **Keyboard Navigation**: Full keyboard support throughout
- **Focus Management**: Visible focus rings with `:focus-visible`
- **ARIA Labels**: Proper semantic HTML and ARIA attributes
- **Contrast Ratios**: AA+ compliance for text readability
- **Screen Reader Support**: Meaningful alt text and labels

## 🚀 Performance

### Optimizations
- **Code Splitting**: Route-based lazy loading
- **Optimistic UI**: Immediate feedback with rollback on error
- **Efficient Queries**: React Query caching and invalidation
- **Virtualization Ready**: ScrollArea components for large lists
- **Asset Optimization**: SVG icons, web fonts loaded async

### Build Output
- TypeScript compilation: ✅ No errors
- ESLint validation: ✅ Clean (warnings only in generated files)
- Production build: ✅ Successful

## 📂 File Structure

```
src/frontend/src/
├── App.tsx                          # Main app with routing
├── main.tsx                         # Entry point
├── hooks/
│   ├── useQueries.ts                # React Query hooks for all backend calls
│   ├── useActor.ts                  # Backend actor hook (generated)
│   └── useInternetIdentity.ts       # Auth hook (generated)
├── pages/
│   ├── LoginPage.tsx                # Login with Internet Identity
│   ├── DashboardPage.tsx            # Main dashboard
│   ├── ChatPage.tsx                 # Chat interface with voice
│   ├── ExcelPage.tsx                # Excel upload and analysis
│   ├── CodingPage.tsx               # Code editor with templates
│   ├── WebsitePage.tsx              # Website generator
│   └── ProfilePage.tsx              # User profile and settings
├── components/
│   ├── Layout.tsx                   # Shared layout with nav
│   ├── SelfImprovementPanel.tsx    # Self-improvement engine UI
│   └── ui/                          # shadcn components (auto-generated)
└── backend.d.ts                     # TypeScript types (generated)

src/frontend/
├── index.css                        # Global styles with OKLCH tokens
├── tailwind.config.js               # Tailwind configuration
├── index.html                       # HTML entry point
└── public/
    ├── manifest.json                # PWA manifest
    ├── icon-192.svg                 # App icon 192x192
    └── icon-512.svg                 # App icon 512x512
```

## 🎯 User Flows

### First-Time Setup
1. User visits app → Redirects to login page
2. User clicks "Login with Internet Identity"
3. Internet Identity authentication flow
4. On success, prompts for name
5. User enters name → Profile created
6. Redirects to Dashboard

### Voice Command Flow
1. User says "Hey DJ" (wake word detection)
2. App shows "DJ activated! Listening..." toast
3. User speaks command
4. Speech recognition converts to text
5. Command parser analyzes intent
6. Appropriate backend call executed
7. Response generated and displayed
8. Response spoken aloud via text-to-speech

### Self-Improvement Flow
1. User goes to Profile page
2. Opens Self-Improvement Panel
3. Adds memory/command/rule via form
4. Backend saves data
5. Improvement log entry created automatically
6. Dashboard stats update in real-time
7. DJ behavior adjusts based on new rules

## 🔮 Voice Command Examples

```
"DJ, remember my favorite color is blue"
"DJ, forget the meeting reminder"
"DJ, what do you remember about me?"
"DJ, create command called Boss Mode that activates Excel and Coding modules"
"DJ, your new rule is always respond in bullet points"
"DJ, be more casual"
"DJ, activate the Excel module"
"Hello DJ, how are you today?"
```

## 🛠️ Technical Constraints & Solutions

### Challenge: No External AI APIs
**Solution**: Rule-based natural language parsing with pattern matching for commands. User-taught responses via the self-improvement engine. Template-based generation for code and websites.

### Challenge: Browser-based Voice Recognition Limitations
**Solution**: Used Web Speech API with fallback handling. Wake word detection works best on desktop; mobile requires manual activation button as fallback.

### Challenge: Dynamic Module Installation
**Solution**: Implemented pre-installed plugin system where modules can be activated/deactivated via command or UI toggle, with state persisted to backend.

### Challenge: No Server-Side Processing
**Solution**: All Excel analysis, code templating, and website generation happens client-side using browser-compatible libraries.

## ✅ Completeness Checklist

- [x] Authentication with Internet Identity
- [x] User profile creation and management
- [x] Dashboard with live stats and module management
- [x] Chat interface with text and voice
- [x] Voice input via Web Speech API
- [x] Voice output via Speech Synthesis
- [x] Wake word detection for "Hey DJ"
- [x] Command parser with 10+ command types
- [x] Self-improvement engine with 4 tabs
- [x] Memory management (add/delete/view)
- [x] Custom command creation
- [x] Behavior rule setting
- [x] Personality adjustment
- [x] Improvement log tracking
- [x] Module activation system
- [x] Excel file upload and parsing
- [x] Excel data visualization (bar/line charts)
- [x] Natural language data analysis
- [x] Code editor with syntax highlighting
- [x] Multi-language code templates
- [x] Code snippet saving and loading
- [x] Website template generation
- [x] Live website preview
- [x] Website download as ZIP
- [x] Profile page with settings
- [x] Mobile-first responsive design
- [x] PWA manifest and icons
- [x] Iron Man HUD aesthetic
- [x] Neon glow effects
- [x] Dark theme only
- [x] Custom OKLCH color tokens
- [x] Distinctive fonts (Orbitron, Rajdhani)
- [x] All TypeScript checks passed
- [x] ESLint validation passed
- [x] Production build successful

## 🎨 Design Highlights

### Iron Man-Inspired Elements
1. **Animated Pulse Ring**: Central mic button with glowing, pulsing rings
2. **Hexagonal Shapes**: Available via `.hexagon` utility class
3. **HUD Typography**: Orbitron display font for headings
4. **Neon Borders**: Glowing blue/cyan borders on cards
5. **Technical Aesthetic**: Monospace fonts for data display
6. **Black Background**: Pure black with no gradients
7. **Electric Accents**: Sharp, vibrant blue and cyan colors

### Unique Features
- **Zero Border Radius**: All elements are sharp-edged
- **Pulsing Animations**: Voice interface has breathing effect
- **Split Font System**: Orbitron for display, Rajdhani for UI, Share Tech Mono for code
- **Layered Glow Effects**: Multiple shadow layers for depth

## 🚦 Next Steps (Future Enhancements)

While the current implementation is fully functional, here are potential future enhancements:

1. **Enhanced Voice**: Integrate higher-quality voice synthesis when available
2. **Module Plugins**: Allow true dynamic module installation via backend
3. **Advanced Excel**: More complex data transformations and formulas
4. **AI Integration**: Connect to external AI APIs when platform supports it
5. **Offline Mode**: Full service worker with offline capabilities
6. **Collaboration**: Multi-user shared workspaces
7. **Export All**: Bulk export of all data
8. **Dark/Light Toggle**: Optional light mode (currently dark-only)

## 📄 License & Credits

© 2026. Built with love using [caffeine.ai](https://caffeine.ai)

---

**Built with:**
- React 19 + TypeScript
- Internet Computer (ICP)
- Motoko Backend
- shadcn/ui Components
- OKLCH Color System
- Web Speech API
