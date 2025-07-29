import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ViewMode } from './ViewModeToggle';

interface ResponsiveViewProps {
  viewMode: ViewMode;
  children: React.ReactNode;
  style?: any;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Calculate scale factor for desktop view
const DESKTOP_EMAIL_WIDTH = 600;
const MOBILE_CONTENT_WIDTH = screenWidth - 40; // Account for padding
const DESKTOP_SCALE = Math.min(DESKTOP_EMAIL_WIDTH / MOBILE_CONTENT_WIDTH, 1.2);

export const ResponsiveView: React.FC<ResponsiveViewProps> = ({
  viewMode,
  children,
  style,
}) => {
  if (viewMode === 'desktop') {
    // Desktop view: scaled content in email client simulation
    return (
      <View style={[styles.desktopContainer, style]}>
        <ScrollView 
          style={styles.desktopScrollView}
          contentContainerStyle={styles.desktopContent}
          showsVerticalScrollIndicator={true}
          indicatorStyle="default"
        >
          <View style={styles.desktopEmailWrapper}>
            <View style={styles.desktopEmail}>
              <View style={[
                styles.scaledContent,
                {
                  transform: [{ scale: DESKTOP_SCALE }],
                  width: MOBILE_CONTENT_WIDTH,
                  minHeight: 400 / DESKTOP_SCALE, // Ensure minimum height
                }
              ]}>
                {children}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Mobile view: full width, natural mobile behavior
  return (
    <View style={[styles.mobileContainer, style]}>
      {children}
    </View>
  );
};

// Higher-order component for responsive layout components
export const withResponsiveLayout = <P extends object>(
  Component: React.ComponentType<P & { viewMode: ViewMode }>
) => {
  return (props: P & { viewMode: ViewMode }) => {
    return <Component {...props} />;
  };
};

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
  },
  desktopContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Simulates desktop email client background
  },
  desktopScrollView: {
    flex: 1,
  },
  desktopContent: {
    paddingVertical: 30,
    alignItems: 'center',
    minHeight: screenHeight - 150, // Account for headers
  },
  desktopEmailWrapper: {
    width: '100%',
    maxWidth: DESKTOP_EMAIL_WIDTH + 40, // Email width + padding
    paddingHorizontal: 20,
  },
  desktopEmail: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    // Add subtle shadow to simulate email preview
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    // Center the scaled content
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scaledContent: {
    // Transform origin should be top-left for proper scaling
    transformOrigin: 'top left',
    // Ensure content is centered after scaling
    alignSelf: 'center',
  },
});