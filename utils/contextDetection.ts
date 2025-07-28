import { Platform, Dimensions } from 'react-native';
import { AppContext, ContextDetection } from '../types';

class ContextDetectionImpl implements ContextDetection {
  private context: AppContext | null = null;

  getAppContext(): AppContext {
    if (this.context) return this.context;

    // Check for URL parameter override (for demo purposes)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const contextParam = urlParams.get('context');
      if (contextParam === 'desktop' || contextParam === 'mobile-web' || contextParam === 'native') {
        this.context = contextParam;
        return this.context;
      }
    }

    // Primary detection: Check if we're running in native
    if (Platform.OS !== 'web') {
      this.context = 'native';
      return this.context;
    }

    // For web contexts, determine desktop vs mobile
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const { width } = Dimensions.get('window');
      
      // Check viewport width - Demo focused on phone sizes only
      // Anything wider than 480px (phone size) shows desktop placeholder
      if (width > 480) {
        this.context = 'desktop';
        return this.context;
      }

      // Phone-sized viewports show the mobile editor
      this.context = 'mobile-web';
      return this.context;
    }

    // Default to desktop if we can't determine
    this.context = 'desktop';
    return this.context;
  }

  isDesktop(): boolean {
    return this.getAppContext() === 'desktop';
  }

  isMobileWeb(): boolean {
    return this.getAppContext() === 'mobile-web';
  }

  isNative(): boolean {
    return this.getAppContext() === 'native';
  }

  // Reset context (useful for testing or when window resizes)
  resetContext(): void {
    this.context = null;
  }
}

// Export singleton instance
export const contextDetection = new ContextDetectionImpl();