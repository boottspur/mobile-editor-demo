# Mobile Email Editor Demo

A cross-platform mobile email editor that demonstrates single codebase serving desktop web, mobile web, and native mobile contexts with real-time cross-device synchronization.

## Quick Setup

1. **Set up Supabase** (required for cross-device sync): Follow `SUPABASE_SETUP.md`
2. **Deploy to Snack**: Upload all files to https://snack.expo.dev/
3. **Update deep link URL**: In `components/NativeAppBanner.tsx`, replace placeholder with your Snack URL

## Key Changes for Snack Compatibility

- **Flattened directory structure**: Removed `src/` folder, moved all files to root level
- **Fixed import paths**: Changed all `@/` aliases to relative paths (`../`, `./`)
- **JSON to JS conversion**: Converted all `.json` documents to `.js` exports
- **Removed path aliases**: Updated tsconfig.json to remove path mapping

## Files Structure

```
/
├── components/          # React components
│   ├── blocks/         # Editor block components
│   ├── AppShell.tsx    # Main app shell with context routing
│   ├── MobileEmailEditor.tsx  # Core email editor
│   └── ...
├── contexts/           # React contexts
├── utils/             # Utility functions
├── types.ts           # TypeScript types
├── assets/            # Documents and sample data
├── App.tsx            # Entry point
└── package.json       # Dependencies
```

## Features

- **Context Detection**: Automatically detects desktop, mobile web, and native contexts
- **WYSIWYG Email Editor**: Touch-optimized editor with drag-and-drop blocks
- **Cross-Device Storage**: Real-time document sync via Supabase database
- **Deep Linking**: Native app banner with Expo Go integration
- **Block-Based Editor**: Container, Text, and Image blocks with property panels
- **Offline Fallback**: Works with bundled documents when offline

## Testing the Demo

1. **Web Version**: Test in Snack's web preview
2. **Native Version**: Use "Open on device" in Snack to test in Expo Go
3. **Context Switching**: Resize browser or add `?context=mobile-web` to URL
4. **Deep Linking**: Test banner CTA after updating the URL

## Troubleshooting

- **Import errors**: All imports should use relative paths (`../`, `./`)
- **Asset loading**: Documents are now JS exports instead of JSON imports
- **Deep links**: Update the banner URL after publishing to Snack

This version maintains all the core functionality while being optimized for Snack's constraints.