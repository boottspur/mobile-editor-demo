import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';
import { DesktopPlaceholder } from './DesktopPlaceholder';
import { MobileEmailEditor } from './MobileEmailEditor';
import { NativeAppBanner } from './NativeAppBanner';

export const AppShell: React.FC = () => {
  const { context, isDesktop, isMobileWeb, isNative } = useAppContext();

  // Show desktop placeholder for desktop context
  if (isDesktop) {
    return <DesktopPlaceholder />;
  }

  // Show mobile email editor for mobile web and native contexts
  if (isMobileWeb || isNative) {
    // Use SafeAreaView for native, regular View for mobile web
    const Container = isNative ? SafeAreaView : View;
    const containerStyle = isNative 
      ? [styles.container, styles.nativeContainer] 
      : styles.container;
    
    return (
      <Container style={containerStyle} edges={isNative ? ['top', 'bottom'] : undefined}>
        <MobileEmailEditor />
        {isMobileWeb && <NativeAppBanner />}
      </Container>
    );
  }

  // Fallback loading state
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#1976d2" />
      <Text style={styles.loadingText}>Detecting context...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  nativeContainer: {
    // Additional styles for native context if needed
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});