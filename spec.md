# DJ Personal AI Assistant

## Current State

The app is a full-stack ICP application with:
- Internet Identity login
- Dashboard with module tiles
- Chat interface with DJ AI responses and voice input/output
- Self-Improvement Engine (memories, custom commands, behavior rules)
- Excel analysis module
- Coding assistant module
- Website generation module
- Plugin activation/deactivation system
- Profile/Settings page with name and communication style

Backend stores: UserProfile, Memory, Command, BehaviorRule, ChatMessage, ImprovementLog, ExcelFile, CodeSnippet, Website.

Issue noted: Chat flow broken (messages displayed in wrong order/layout - shown in uploaded screenshot).

## Requested Changes (Diff)

### Add

1. **Quick Setup Wizard** - Onboarding flow that runs on first login. Multi-step wizard collecting: name, profession, interests, preferred DJ communication style, and initial rules. Saves to user profile and creates initial behavior rules/memories. Has a "Skip" option.

2. **DJ Settings Page** - New `/settings` page with:
   - Toggle switches for common behaviors (always use bullet points, keep responses brief, formal tone, proactive suggestions, etc.)
   - Response length slider (brief ↔ detailed)
   - Formality slider (casual ↔ formal)
   - Response format toggles (bullet points, numbered lists, headers)
   - All toggles/sliders map to backend behavior rules

3. **Quick Rule Shortcuts** - In the Settings page, a grid of pre-written common rules as tap-to-apply buttons:
   - "Always respond in bullet points"
   - "Keep responses under 3 sentences"
   - "Use formal language"
   - "Always greet me by name"
   - "Explain technical terms simply"
   - "Give examples in every response"
   - Each can be toggled on/off

4. **"Tell DJ About Yourself" Form** - A guided form section (in Settings or its own page) with fields:
   - Name, Profession/Role, Location
   - Key interests and hobbies
   - Work style (solo/collaborative/mixed)
   - Current projects/goals
   - Submit saves all as memories + updates profile

5. **Voice-to-Rule Capture** - Button in the Chat page and Settings page: user taps microphone, speaks a rule naturally, and the app converts the spoken text into a structured behavior rule and saves it automatically. Shows confirmation with the parsed rule.

6. **DJ Mood Board** - Visual personality card grid in Settings page with cards:
   - "Professional" - structured, formal, task-focused
   - "Friendly" - warm, encouraging, casual
   - "Witty" - clever, humorous, creative
   - "Concise" - brief, precise, minimal
   - "Mentor" - educational, detailed, explanatory
   - "Motivator" - energetic, positive, action-oriented
   - Selecting a card applies a preset rule bundle and updates communication style

7. **Smart Rule Suggestions** - After saving 3+ chat messages, show a floating suggestion banner in chat:
   - Analyzes message patterns (length preferences, topics, response reactions)
   - Shows up to 3 rule suggestions with Yes/No buttons
   - Each confirmation saves the rule to backend

8. **Rule Template Library** - In Settings page, four template packs:
   - "Business Mode" - formal, structured, data-driven responses
   - "Creative Mode" - imaginative, exploratory, metaphor-rich
   - "Quick Mode" - ultra-brief, bullet-only, no fluff
   - "Teacher Mode" - step-by-step, examples, analogies
   - Each pack is a bundle of 4-5 behavior rules applied at once
   - Shows which pack is currently active with a visual indicator

9. **DJ Profile Card** - New component in Dashboard showing:
   - Avatar/initials circle with glow
   - DJ's current personality mode (from mood board)
   - Active rule count
   - Memory count
   - Current communication style
   - "Edit" button linking to Settings
   - Quick stats: total commands, sessions

10. **"Teach DJ" Story Mode** - New page `/teach` with conversational setup:
    - DJ asks one question at a time in a chat-like UI
    - Questions: name, profession, work style, interests, response preferences, goals
    - User answers each question naturally
    - DJ confirms and saves as memories/profile data
    - Final summary screen showing everything learned

11. **Drag-to-Prioritize Rules** - In the Settings/Rules section:
    - Rules displayed as draggable cards
    - Drag handles on each card
    - Visual order reflects priority (top = highest)
    - Backend stores rule priority order
    - DJ applies rules in priority order

### Modify

- **ChatPage**: Fix chat flow - messages should display in correct chronological order (oldest at top, newest at bottom), with proper scrolling. User messages right-aligned, DJ messages left-aligned. Fix any layout issues visible in the screenshot.
- **ProfilePage**: Integrate the DJ Profile Card, link to new Settings page
- **App.tsx**: Add routes for `/settings`, `/teach`
- **Backend**: Add `updateRulePriority` function and `priority` field to BehaviorRule; add `userRulePriorities` storage

### Remove

- Nothing removed

## Implementation Plan

1. **Backend changes**: Add `priority` field to BehaviorRule type; add `updateRulePriority(id, priority)` function; add `getRulesOrdered()` function that returns rules sorted by priority

2. **New pages**:
   - `SetupWizardPage.tsx` - multi-step onboarding wizard
   - `SettingsPage.tsx` - main settings with toggles, sliders, mood board, template library, quick shortcuts, drag-to-prioritize rules, about-you form
   - `TeachDJPage.tsx` - story mode conversational setup

3. **New components**:
   - `DJProfileCard.tsx` - profile card for dashboard
   - `MoodBoard.tsx` - personality cards grid
   - `RuleTemplateLibrary.tsx` - template packs
   - `QuickRuleShortcuts.tsx` - shortcut grid
   - `VoiceToRule.tsx` - voice capture button for rules
   - `SmartSuggestions.tsx` - suggestion banner in chat
   - `DraggableRulesList.tsx` - priority drag list

4. **Fix ChatPage**: Correct message ordering (chronological), fix layout and scrolling

5. **Update App.tsx** with new routes

6. **Update Dashboard** to include DJ Profile Card
