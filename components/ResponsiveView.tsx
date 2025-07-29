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

export const ResponsiveView: React.FC<ResponsiveViewProps> = ({
  viewMode,
  children,
  style,
}) => {
  if (viewMode === 'desktop') {
    // Desktop view: centered with max width, simulating desktop email client
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
              {children}
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
    backgroundColor: '#f0f0f0', // Simulates desktop email client background
  },
  desktopScrollView: {
    flex: 1,
  },
  desktopContent: {
    paddingVertical: 20,
    alignItems: 'center',
    minHeight: screenHeight - 200, // Account for headers
  },
  desktopEmailWrapper: {
    width: '100%',
    maxWidth: 600, // Standard email width
    paddingHorizontal: 20,
  },
  desktopEmail: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    // Add subtle shadow to simulate email preview
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});