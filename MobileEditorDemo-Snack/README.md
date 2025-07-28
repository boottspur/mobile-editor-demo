# Mobile Email Editor Demo - Snack Version

This is the Expo Snack-optimized version of the Mobile Email Editor Demo. This version has been specifically prepared for upload to Expo Snack to enable public access via Expo Go.

## Snack Upload Instructions

1. **Create a new Snack**: Go to https://snack.expo.dev/ and create a new project
2. **Replace all files**: Delete the default files and upload all files from this directory
3. **Update the deep link URL**: After publishing to Snack, update the URL in `components/NativeAppBanner.tsx`:
   - Find line 23: `const baseUrl = 'exp://exp.host/@YOUR_SNACK_USERNAME/YOUR_SNACK_ID';`
   - Replace with your actual Snack URL (e.g., `exp://exp.host/@your-username/your-snack-slug`)

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
- **Cross-Platform Storage**: Seamless document sync between web and native
- **Deep Linking**: Native app banner with Expo Go integration
- **Block-Based Editor**: Container, Text, and Image blocks with property panels

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