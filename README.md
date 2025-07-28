# Mobile Email Editor Demo

A cross-platform mobile email editor demo built with React Native and Expo, showcasing how a single codebase can deliver optimal experiences across desktop web, mobile web, and native mobile contexts.

## 🌐 Live Demo

- **Web Demo**: https://mobile-editor-demo.vercel.app/
- **Native Demo**: `exp://u.expo.dev/e82ab0ce-e88c-43ed-8e7b-694ddf55336a`

## 🎯 Demo Flow

### Desktop Experience (width ≥ 1024px)
Visit the web demo on a desktop browser to see a professional placeholder page explaining the mobile-first approach.

### Mobile Web Experience  
Visit the same URL on a mobile device or browser dev tools mobile mode to access the full WYSIWYG email editor with a native app transition banner.

### Native Experience
Scan the QR code from your EAS dashboard or use the native demo URL above in Expo Go to experience the full editor without the banner.

## ✨ Key Features

- **Context Detection**: Smart routing between desktop/mobile-web/native experiences
- **WYSIWYG Editor**: Touch-optimized email builder with Container, Text, and Image blocks
- **Document Management**: Cross-platform storage with pre-seeded demo documents
- **Deep Linking**: Seamless handoffs between web and native with document state preservation
- **Single Codebase**: Same React Native components work across all platforms

## 🛠 Development

### Prerequisites
- Node.js 18+
- Expo CLI
- EAS CLI (for publishing)

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on web
npx expo start --web

# Build for web
npx expo export --platform web
```

### Testing Different Contexts
- **Desktop**: Visit web URL on desktop browser
- **Mobile Web**: Same URL on mobile or browser dev tools mobile mode
- **Native**: Scan QR code with Expo Go
- **Context Override**: Add `?context=desktop|mobile-web|native` to URL

## 📋 Project Structure

- `/src/components/` - React Native components (blocks, editor, toolbox)
- `/src/contexts/` - React contexts for app state and deep linking
- `/src/utils/` - Context detection, document storage, deep linking utilities
- `/src/types/` - TypeScript interfaces
- `/assets/documents/` - Pre-seeded demo email documents
- `/docs/` - Project requirements and specifications

## 🚀 Deployment

### Web Deployment (Vercel)
```bash
npx expo export --platform web
cd dist
vercel --prod
```

### Native Distribution (EAS Update)
```bash
eas login
eas update:configure
eas update --branch production --message "Release"
```

## 📖 Documentation

- **CLAUDE.md** - Development workflow and architecture guide
- **PRODUCTION-NOTES.md** - Production implementation patterns
- **ROADMAP.md** - Development phases and technical decisions
- **test-app.md** - Detailed testing instructions

## 🎨 Architecture Highlights

This demo showcases a production-ready architecture for cross-platform mobile applications:

- **Context-Aware Components**: Components adapt behavior based on detected context
- **Unified Storage API**: Same document storage interface across web and native
- **Deep Link Handling**: Seamless state transfer between platforms  
- **Touch-Optimized UI**: 44px+ touch targets and mobile-first interactions
- **EAS Update Compatible**: No custom native modules, works in Expo Go

Perfect for demonstrating "single codebase, multiple contexts" mobile architecture concepts.