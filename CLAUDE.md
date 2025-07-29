# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a cross-platform mobile email editor demo built with React Native and Expo. The project demonstrates how a single codebase can deliver optimal experiences across desktop web, mobile web, and native mobile contexts.

**Current Status**: Feature-complete email editor with Design | Edit | Preview workflow implemented. Ready for testing and deployment optimization.

## Technology Stack

- **Framework**: Expo SDK 53.0.20 with React Native 0.75.x
- **Language**: TypeScript
- **Editor**: Custom WYSIWYG editor built with React Native components
- **Package Manager**: npm
- **Build Tools**: Expo CLI (via npx expo), EAS CLI for native builds

## Project Initialization

To initialize this project from scratch:
```bash
npx create-expo-app@latest . --template blank-typescript
npx expo install expo-dev-client expo-web-browser expo-linking expo-file-system
npm install react-native-reanimated react-native-gesture-handler react-native-draggable
```

## Development Commands

Once initialized, use these commands:
```bash
# Start development server (local network only)
npx expo start

# Run on web
npx expo start --web

# Build for web
npx expo export --platform web

# Login to EAS (required for global distribution)
eas login

# Configure EAS Update (one-time setup)
eas update:configure

# Publish to EAS Update for global Expo Go access
eas update --branch production --message "Description of changes"

# Get update URL for QR code generation
eas update:list

# Run tests (once configured)
npm test
```

## Architecture Overview

### Context Detection System
The app detects three contexts:
1. **Desktop** (width ≥ 1024px, fine pointer) - Shows placeholder
2. **Mobile Web** (width < 1024px, web platform) - Full editor with native app banner
3. **Native** (Platform.OS !== 'web') - Full editor without banner

### Core Components
- `<AppShell />` - Root component handling context detection
- `<MobileEmailEditor />` - Main component with persistent header/toolbar and undo/redo system
- `<SwipeableEditor />` - Three-page navigation (Design | Edit | Preview) with gesture support
- `<GlobalStylesEditor />` - Integrated design page with mobile-specific optimizations
- `<EmailPreview />` - Responsive preview with mobile/desktop view modes
- `<ResponsiveView />` - Component for scaling desktop email previews
- `<DesktopPlaceholder />` - Desktop view component
- `<NativeAppBanner />` - Mobile web to native transition UI

### Current Feature Set
- **Three-Page Workflow**: Design | Edit | Preview with swipe navigation
- **Undo/Redo System**: Full history tracking with visual controls
- **Responsive Preview**: Mobile/desktop view toggle with proper column stacking
- **Global Styles Editor**: Integrated design page with mobile-specific optimizations
- **Persistent UI**: Header/toolbar remain visible across all modes
- **Touch-Optimized**: Gesture-based navigation with proper activation thresholds

### Document Storage
- Native: Expo FileSystem API
- Web: localStorage
- Documents stored as JSON with editor block structure
- Global styles stored as part of document metadata

### Key Directories (once initialized)
- `/app/` or `/src/` - Application source code
- `/assets/` - Images, fonts, and document storage
- `/components/` - Reusable React components
- `/utils/` - Utility functions and helpers

## Important Implementation Notes

1. **Platform Detection**: Always use Expo's built-in APIs (Platform, Dimensions, expo-device) for platform detection
2. **Touch Targets**: Ensure minimum 44px touch targets for mobile UI elements
3. **Deep Linking**: Use scheme `mobileemail` for Expo Go deep links
4. **State Persistence**: Preserve document state across web-to-native transitions

## Testing Approach

The project should be tested on:
- Real mobile devices (iOS Safari, Android Chrome)
- Desktop browsers for context detection
- Expo Go app for native functionality
- Various screen sizes for responsive behavior

## Development Workflow

### Current Development Status
The project has completed core implementation with the following features:
- ✅ **Phase 0-3**: Foundation, context detection, document management, and core editor
- ✅ **Design Integration**: Global styles editor with mobile-specific controls
- ✅ **Navigation System**: Three-page swipe navigation (Design | Edit | Preview)
- ✅ **Undo/Redo**: Complete history tracking and state management
- ✅ **Responsive Preview**: Mobile/desktop view modes with proper layout
- ✅ **UI Polish**: Persistent header/toolbar, optimized touch targets

### Remaining Tasks (See `/ROADMAP.md` for details)
- **Phase 4**: Advanced editor interactions and drag-and-drop
- **Phase 5**: Platform-specific features and optimizations
- **Phase 6-8**: Testing, documentation, and deployment

### Key Technical Decisions
1. **Editor Strategy**: Custom React Native component-based WYSIWYG editor for true cross-platform compatibility
2. **Document Storage**: Bundle demo documents, use FileSystem API for native and localStorage for web
3. **Distribution**: EAS Update for global Expo Go access (no server required)

### Common Development Tasks
```bash
# Check TypeScript errors
npx tsc --noEmit

# Format code (once prettier is configured)
npm run format

# Clean and rebuild
npx expo start -c

# Run on specific platform
npx expo start --ios
npx expo start --android
npx expo start --web
```

## Global Distribution Requirements

**Critical Requirement**: The demo must be accessible worldwide via Expo Go without running a local server.

### Live Demo URLs:
- **Web Demo**: https://mobile-editor-demo.vercel.app/
- **Native Demo**: `exp://u.expo.dev/e82ab0ce-e88c-43ed-8e7b-694ddf55336a`

### Setup for Global Access:
1. Ensure you have an Expo account
2. Run `eas login` before deployment
3. Use `eas update:configure` for initial setup
4. Publish updates with `eas update --branch production`
5. Share the generated EAS Update URL/QR code with demo users

### Development Considerations:
- Design with EAS Update constraints in mind
- Bundle all critical assets
- Test in Expo Go before publishing
- Use environment variables compatible with EAS Update

## Reference Documentation

- **PRD**: `/docs/PRD.md` - Complete product requirements and specifications
- **Roadmap**: `/ROADMAP.md` - Detailed development plan with phases and risk mitigation
- **Known Issues**: Check ROADMAP.md for identified concerns and technical decisions