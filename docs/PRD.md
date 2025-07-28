# Product Requirements Document: Cross-Platform Mobile Email Editor Demo

## Project Overview

**Objective:** Build a demonstration application that proves a single React Native codebase can deliver optimal mobile email editing experiences across desktop web, mobile web, and native mobile contexts.

**Target Audience:** Product stakeholders and engineering teams evaluating cross-platform architecture decisions for mobile email marketing tools.

**Success Criteria:** Users can seamlessly transition from mobile web to native app while maintaining document state and experiencing context-appropriate interfaces.

## Technical Foundation

### Core Technology Stack
- **Framework:** Expo SDK 53.0.20 (latest stable)
- **CLI Tools:**
  - Expo CLI: Built into `expo` package (uses `@expo/cli` internally)
  - EAS CLI: `eas-cli@latest` (13.x series)
- **React Native:** 0.75.x (bundled with Expo 53)
- **Editor Library:** `@craftjs/core@latest` with `@craftjs/utils@latest`
- **Platform Detection:** Built-in Expo APIs (`Platform`, `Dimensions`, `expo-device`)

### Development Environment Setup
```bash
# Install EAS CLI globally (Expo CLI comes with the expo package)
npm install -g eas-cli@latest

# Verify EAS CLI version
eas --version   # Should show 13.x

# Note: Expo CLI will be available via npx expo after project creation
```

### Project Initialization
```bash
# Create new Expo project
npx create-expo-app@latest MobileEmailEditorDemo --template blank-typescript
cd MobileEmailEditorDemo

# Verify Expo CLI is available
npx expo --version  # Should show 53.0.20

# Install required dependencies
npx expo install expo-dev-client expo-web-browser expo-linking expo-file-system
npm install @craftjs/core @craftjs/utils react-native-reanimated react-native-gesture-handler
```

## Application Architecture

### Context Detection System

**Primary Detection Logic:**
```typescript
type AppContext = 'desktop' | 'mobile-web' | 'native';

interface ContextDetection {
  getAppContext(): Promise<AppContext>;
  isDesktop(): boolean;
  isMobileWeb(): boolean;
  isNative(): boolean;
}
```

**Implementation Requirements:**
- Use `Platform.OS !== 'web'` as primary native detection
- For web contexts, combine:
  - User agent analysis (`navigator.userAgent`)
  - Viewport width (`Dimensions.get('window').width >= 1024`)
  - Pointer capability (`window.matchMedia('(pointer: fine)').matches`)
- Include URL parameter override for demo purposes: `?context=desktop|mobile-web|native`

### Component Architecture

**Core Components:**
1. `<AppShell />` - Root component with context detection
2. `<DesktopPlaceholder />` - Desktop experience simulation
3. `<MobileEmailEditor />` - Craft.js-based mobile email editor
4. `<NativeAppBanner />` - Mobile web to native transition component
5. `<MobileEmailCanvas />` - Craft.js rendering surface
6. `<BlockToolbox />` - Component selection interface

### Document Management

**File-Based Persistence:**
- Documents stored as JSON in `/assets/documents/` directory
- Document schema:
```typescript
interface EmailDocument {
  id: string;
  name: string;
  content: SerializedNodes; // Craft.js serialized state
  lastModified: string; // ISO 8601
  created: string; // ISO 8601
}
```

**Storage API:**
- Native: Expo FileSystem for local persistence
- Web: localStorage with JSON serialization
- Unified interface across platforms

**Pre-seeded Content:**
Include 3 sample documents demonstrating:
- Simple single-column layout
- Two-column with image and text
- Complex layout with multiple containers

## Feature Specifications

### Mobile Email Editor Core

**Craft.js Integration:**
- Version: `@craftjs/core@latest` (ensure 0.2.x compatibility)
- Mobile-optimized drag and drop using `react-native-gesture-handler`
- Touch-friendly selection indicators (minimum 44px touch targets)

**Supported Block Types:**
1. **Container Block**
   - Configurable padding, background color
   - Nested block support
   - Responsive width settings

2. **Text Block**
   - Rich text editing (bold, italic, links)
   - Font size, color, alignment controls
   - Mobile-optimized text selection

3. **Image Block**
   - Asset picker (demo images from `/assets/images/`)
   - Alt text configuration
   - Responsive sizing options

**Editor Controls:**
- Floating toolbar for selected elements
- Mobile-optimized property panels
- Undo/redo functionality
- Save button with visual feedback

### Context-Specific Behaviors

**Desktop Context (`width >= 1024px`, fine pointer):**
- Display `<DesktopPlaceholder />` component
- Show message: "Desktop-optimized mobile email editor loads here"
- Include small preview of mobile email editor capabilities
- No editor functionality (intentional limitation)

**Mobile Web Context (`width < 1024px`, web platform):**
- Full `<MobileEmailEditor />` functionality
- `<NativeAppBanner />` pinned to bottom
- Banner text: "Get the full experience in our native app"
- Banner CTA: "Open in App" button

**Native Context (`Platform.OS !== 'web'`):**
- Full `<MobileEmailEditor />` functionality
- No banner display
- Enhanced touch interactions
- Native-optimized animations

### Mobile Web to Native Handoff

**Banner Implementation:**
- Fixed position bottom banner (dismissible)
- Save current document state on CTA click
- Generate Expo Go deep link with document ID
- Fallback to Expo Go installation if not detected

**Deep Link Structure:**
```
exp://exp.host/@your-username/MobileEmailEditorDemo?docId=DOCUMENT_ID
```

**Error Handling:**
- Detect Expo Go installation
- Graceful fallback with installation prompt
- Preserve document state across transitions

## Platform Configuration

### Expo Configuration (app.json)
```json
{
  "expo": {
    "name": "Mobile Email Editor Demo",
    "slug": "mobile-email-editor-demo",
    "version": "1.0.0",
    "sdkVersion": "53.0.20",
    "platforms": ["ios", "android", "web"],
    "web": {
      "bundler": "metro"
    },
    "scheme": "mobileemail"
  }
}
```

### EAS Build Configuration
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "channel": "preview"
    }
  }
}
```

## Development Workflow

### Phase 1: Project Foundation
1. Initialize Expo project with specified versions
2. Configure platform detection utilities
3. Implement basic routing between contexts
4. Set up document management structure

### Phase 2: Mobile Email Editor Implementation
1. Integrate Craft.js with mobile optimizations
2. Build block components (Container, Text, Image)
3. Implement touch-friendly drag and drop
4. Add save/load functionality

### Phase 3: Context Behaviors
1. Build desktop placeholder component
2. Implement mobile web banner with deep linking
3. Configure native context without banner
4. Test cross-platform document persistence

### Phase 4: Polish and Distribution
1. Configure EAS for Expo Go distribution
2. Optimize web build for deployment
3. Test deep linking and state transfer
4. Performance optimization

## Testing Requirements

**Cross-Platform Validation:**
- Test on actual mobile devices (iOS Safari, Android Chrome)
- Verify desktop detection accuracy
- Confirm Expo Go deep link functionality
- Validate document state preservation

**Edge Cases:**
- iPad/tablet detection
- Mobile browsers with desktop user agent
- Expo Go not installed scenarios
- Network connectivity issues

## Deployment Strategy

**Web Deployment:**
- Build: `expo export --platform web`
- Host: Static hosting (Vercel, Netlify, or Expo hosting)
- Domain: Custom domain for professional demo

**Native Distribution:**
- **Critical Requirement**: Must be accessible globally via Expo Go without manual server running
- **Method**: EAS Update (not EAS Build) for Expo Go compatibility
- **Setup**: `eas login` → `eas update:configure`
- **Publishing**: `eas update --branch production --message "Demo release"`
- **Access**: Permanent URL like `exp://u.expo.dev/update/[update-id]`
- **QR Code**: Generate from EAS Update URL for instant global access
- **Key Benefit**: Demo users anywhere in the world can scan QR code and immediately access the app in Expo Go

## Success Metrics

**Technical Proof Points:**
- Single codebase serving three distinct contexts
- Seamless document handoff between web and native
- Mobile-optimized email editing experience
- Sub-2-second context switching

**Demonstration Flow:**
1. Show desktop placeholder on large screen
2. Switch to mobile browser, interact with mobile email editor
3. Save document, click banner CTA
4. Same document loads in Expo Go
5. Demonstrate identical functionality across contexts

This PRD provides comprehensive guidance for Claude Code while emphasizing the critical proof-of-concept elements that validate your cross-platform mobile email editor architecture hypothesis.