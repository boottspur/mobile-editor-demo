import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';
import { DesktopPlaceholder } from './DesktopPlaceholder';
import { MobileEmailEditor } from './MobileEmailEditor';
import { NativeAppBanner } from './NativeAppBanner';
import { OnboardingFlow, useOnboarding } from './onboarding/OnboardingFlow';

export const AppShell: React.FC = () => {
  const { context, isDesktop, isMobileWeb, isNative } = useAppContext();
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();

  // Show desktop placeholder for desktop context
  if (isDesktop) {
    // For desktop, skip onboarding and go straight to placeholder
    return <DesktopPlaceholder />;
  }

  // Show onboarding flow for first-time mobile/native users
  if ((isMobileWeb || isNative) && showOnboarding) {
    const Container = isNative ? SafeAreaView : View;
    const containerStyle = isNative 
      ? [styles.container, styles.nativeContainer] 
      : styles.container;

    return (
      <Container style={containerStyle} edges={isNative ? ['top', 'bottom'] : undefined}>
        <OnboardingFlow 
          onComplete={completeOnboarding}
          onSkipToEditor={skipOnboarding}
        />
      </Container>
    );
  }

  // Show mobile email editor for mobile web and native contexts (after onboarding)
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