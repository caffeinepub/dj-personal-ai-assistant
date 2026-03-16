# DJ Personal AI Assistant

## Current State
Settings page has editable Tell DJ About Yourself form with inputs for name, profession, location, goal, interests, work style, projects and a Save button.

## Requested Changes (Diff)

### Add
- Read-only display of personal profile fields in Settings
- Edit in Teach DJ button navigating to /teach

### Modify
- Settings Tell DJ About Yourself section: all inputs become read-only text, Save button removed

### Remove
- Editable inputs and Save button from Settings profile section

## Implementation Plan
1. Replace editable form in SettingsPage.tsx Tell DJ About Yourself section with read-only display
2. Add Edit in Teach DJ button that navigates to /teach
3. Remove unused state and handler if no longer needed
