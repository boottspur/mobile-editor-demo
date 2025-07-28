import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAppContext } from '@/contexts/AppContext';
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
    return (
      <View style={styles.container}>
        <MobileEmailEditor />
        {isMobileWeb && <NativeAppBanner />}
      </View>
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