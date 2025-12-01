<!-- a838d437-ae4d-4da5-b8a9-887dc62e754f 71c4d45c-f239-489c-8aea-cfc95ff31750 -->
# Implement Keyboard Shortcuts for Claude.ai

## Overview

Add keyboard shortcuts to the Key Wizard extension for Claude.ai web interface. The implementation will use a registry pattern for extensibility and work alongside existing Google search functionality.

## Architecture

### 1. Keyboard Shortcut Registry System

Create a new registry module (`src/content/shortcut-registry.ts`) that allows registering/unregistering shortcuts with:

- Unique IDs
- Key combinations (supporting Ctrl/Cmd, Shift, Alt modifiers)
- Handler functions
- Optional descriptions

### 2. Site Detection

Update `src/content/index.ts` to detect which site the extension is running on (Google vs Claude.ai) and initialize appropriate handlers.

### 3. Claude.ai Handlers

Create `src/content/claude-handlers.ts` with:

- `openModelDropdown()` - Finds and clicks the model dropdown button
- `toggleResearchOption()` - Finds and toggles the research option checkbox/toggle

### 4. Manifest Updates

Update `manifest.json` to:

- Add Claude.ai host permissions (`*://claude.ai/*`, `*://*.claude.ai/*`)
- Add Claude.ai to content_scripts matches

### 5. Type Definitions

Extend `src/shared/types.ts` to include:

- Shortcut registry types
- Site detection types

## Implementation Details

### Files to Create

- `src/content/shortcut-registry.ts` - Registry system for managing shortcuts
- `src/content/claude-handlers.ts` - Claude.ai specific action handlers

### Files to Modify

- `manifest.json` - Add Claude.ai permissions and content script matches
- `src/content/index.ts` - Add site detection and registry initialization
- `src/shared/types.ts` - Add shortcut registry types
- `src/shared/constants.ts` - Add Claude.ai selectors (to be discovered)

### Key Combinations

- `Ctrl+M` / `Cmd+'` (Mac) - Open model dropdown (using `'` instead of `M` on Mac to avoid minimize conflict)
- `Ctrl+Shift+.` / `Cmd+Shift+.` (Mac) - Toggle research option

### Element Detection Strategy

Since we're using a generic approach, the handlers will:

1. Use common patterns (buttons, dropdowns, toggles)
2. Search by text content, ARIA labels, or data attributes
3. Fall back to multiple selector strategies
4. Log helpful debug information if elements aren't found

### Extensibility

The registry pattern allows easy addition of new shortcuts:

```typescript
registry.register({
  id: 'new-shortcut',
  description: 'Description',
  combos: [{ key: 'K', ctrl: true }],
  handler: () => { /* action */ },
});
```

### To-dos

- [x] Create shortcut-registry.ts with register/unregister methods and key combination matching logic
- [x] Create claude-handlers.ts with openModelDropdown() and toggleResearchOption() functions using generic element detection
- [x] Add shortcut registry types to shared/types.ts (ShortcutCombo, ShortcutDefinition, etc.)
- [x] Add Claude.ai host permissions and content script matches to manifest.json
- [x] Update content/index.ts to detect site (Google vs Claude.ai) and initialize appropriate shortcut registry
- [x] Register Ctrl+M and Ctrl+Shift+. shortcuts in content/index.ts for Claude.ai