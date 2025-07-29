# Mobile Email Editor Demo

A professional email editor DEMO built specifically for mobile contexts (web and native), demonstrating how a single React Native codebase can deliver exceptional experiences across iOS, Android, and mobile web platforms. This is NOT intended to be production or integration ready code, NOR is it intended to anchor implementation to any particular technology. Many features are either missing or mocked for demonstration purposes.

![Mobile Email Editor Demo](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue)
![Expo SDK](https://img.shields.io/badge/Expo-SDK%2053-000020)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.75-61dafb)

## 🚀 Live Demo

- **Web**: [https://snack.expo.dev/@boottspur/mobile-editor-demo](https://snack.expo.dev/@boottspur/mobile-editor-demo)
- **Mobile**: Open in Expo Go app using the QR code from the web link
- **Instrutions**: Walk through mocked onboarding in the "web" view and notice it loads a mobile friendly editor within the mobile web context. Notice several CTAs that nudge users to the native mobile app if they wish, but it is not necessary to complete the task. Switch to the iOS/Android emulators to see that this single codebase is delivering the same mobile editing experience regardless of native vs web context, and users could swap between them.

## ✨ Features

### Three-Page Workflow
- **Design**: Configure global styles and mobile-specific settings
- **Edit**: Build emails with intuitive block-based editor
- **Preview**: See exactly how emails look on mobile and desktop

### Editor
- 📝 **8 Block Types**: Text, Image, Button, Divider, Spacer, Video, Product, Container
- ↩️ **Undo/Redo**: Complete history tracking
- 📱 **Touch Optimized**: 44px minimum touch targets
- 💾 **Cloud Sync**: Limited saving with Supabase
- 🎨 **Inline Editing**: Tap to edit text and properties

### Mobile-First Design
- 👆 **Swipe Navigation**: Natural gesture-based page switching
- 📐 **Responsive Preview**: Toggle between mobile and desktop views
- 🔄 **Persistent UI**: Header and toolbar stay visible
- ⚡ **Fast**: Optimized for mobile performance

## 🛠️ Tech Stack

- **Frontend**: React Native + TypeScript
- **Framework**: Expo SDK 53
- **Database**: Supabase
- **Animations**: React Native Reanimated
- **Gestures**: React Native Gesture Handler
- **Deployment**: Expo EAS + Vercel

## 📦 Installation

**The project can be editing/forked directly in Snack if desired**

```bash
# Clone the repository
git clone https://github.com/boottspur/mobile-editor-demo.git
cd mobile-editor-demo

# Install dependencies
npm install

# Start development server
npx expo start
```

## 🏗️ Project Structure

```
/components         # React Native components
  /blocks          # Email block components
  /MobileEmailEditor.tsx  # Main editor component
  /SwipeableEditor.tsx    # Three-page navigation
  /PropertyPanel.tsx      # Block property editor
/contexts          # React contexts
/types             # TypeScript definitions
/utils             # Helper functions
/docs              # Documentation
```

## 🎯 Key Components

### MobileEmailEditor
The main orchestrator that manages:
- Document state and persistence
- Undo/redo history
- Block selection and editing
- Page navigation

### SwipeableEditor
Handles the three-page workflow:
- Smooth swipe gestures
- Page indicators
- Content transitions

### PropertyPanel
Mobile-optimized property editor:
- Absolute positioned overlay
- Touch-friendly inputs
- Responsive keyboard handling

## 🚦 Getting Started

1. **Create a Document**: Tap the + button on the document list
2. **Design**: Swipe to the Design page to set global styles
3. **Edit**: Add blocks by tapping the floating action button
4. **Preview**: Swipe to Preview to see your email
5. **Save**: Changes auto-save to the cloud

## 📱 Platform Support

- **iOS**: 13.0+
- **Android**: 6.0+ (API 23)
- **Web**: Modern browsers (Chrome, Safari, Firefox)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- UI inspired by Material Design
- Images from [Unsplash](https://unsplash.com)

---

**Note**: This is a demonstration project showcasing mobile email editing capabilities. For production use, additional features like real email sending, analytics, and team collaboration would be needed.