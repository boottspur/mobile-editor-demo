import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { EmailDocument } from '../types';
import { documentStorage } from '../utils/documentStorage';

interface NativeAppBannerProps {
  currentDocument?: EmailDocument | null;
}

export const NativeAppBanner: React.FC<NativeAppBannerProps> = ({ currentDocument }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleOpenInApp = async () => {
    try {
      // Save current document state if editing
      if (currentDocument) {
        await documentStorage.saveDocument(currentDocument);
      }

      // For demo purposes within Snack interface, provide multiple options
      // This showcases the cross-platform capabilities to engineers
      const snackBaseUrl = 'https://snack.expo.dev/@boottspur/mobile-editor-demo';
      
      // Add query parameters for iOS-specific demo
      const iosQueryParams = new URLSearchParams({
        platform: 'ios',
        supportedPlatforms: 'ios,android,web',
        // Deep link to editor if we have a document
        ...(currentDocument && { docId: currentDocument.id })
      });
      
      const iosSnackUrl = `${snackBaseUrl}?${iosQueryParams.toString()}`;
      
      console.log('Demo: Switching to iOS preview within Snack');
      
      // Show options for engineers to understand the cross-platform demo
      Alert.alert(
        '📱 Cross-Platform Demo',
        'This demonstrates seamless mobile web → native iOS transition. Choose how to experience the iOS version:',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: '🔄 Switch to iOS (Same Tab)', 
            onPress: () => {
              // Reload current page with iOS platform parameter
              if (typeof window !== 'undefined') {
                window.location.href = iosSnackUrl;
              }
            }
          },
          { 
            text: '📱 Open iOS Preview (New Tab)', 
            onPress: async () => {
              try {
                await WebBrowser.openBrowserAsync(iosSnackUrl, {
                  presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
                  controlsColor: '#1976d2',
                });
              } catch (error) {
                console.error('Error opening iOS preview:', error);
              }
            }
          },
        ]
      );
      
      return; // Skip the fallback logic since we're handling it above
      
      try {
        // This code is kept for reference but won't execute due to return above
        console.warn('Fallback code - should not reach here in Snack demo');
        
        // Fallback: Traditional Expo Go deep link
        const expoDeepLink = 'exp://exp.host/@boottspur/mobile-editor-demo';
        const deepLinkUrl = currentDocument 
          ? `${expoDeepLink}?docId=${currentDocument.id}`
          : expoDeepLink;
          
        try {
          await Linking.openURL(deepLinkUrl);
        } catch (deepLinkError) {
          console.error('Deep link also failed:', deepLinkError);
          // Final fallback: Show Expo Go installation instructions
          Alert.alert(
            'Experience Our iOS App',
            'See this demo running natively on iOS! Choose your preferred method:',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'View iOS Preview', 
                onPress: () => WebBrowser.openBrowserAsync(snackUrl.replace('?', '?platform=ios&'))
              },
              { 
                text: 'Install Expo Go', 
                onPress: () => openExpoGoStore() 
              },
            ]
          );
        }
      }
    } catch (error) {
      console.error('Error in handleOpenInApp:', error);
      Alert.alert('Error', 'Unable to open native preview');
    }
  };

  const openExpoGoStore = async () => {
    const iosUrl = 'https://apps.apple.com/app/expo-go/id982107779';
    const androidUrl = 'https://play.google.com/store/apps/details?id=host.exp.exponent';
    
    try {
      // Detect platform and open appropriate store
      // For web, we'll try iOS first, then Android
      await WebBrowser.openBrowserAsync(iosUrl);
    } catch (error) {
      // Fallback to Android store
      try {
        await WebBrowser.openBrowserAsync(androidUrl);
      } catch (fallbackError) {
        Alert.alert('Error', 'Unable to open app store');
      }
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={() => setIsDismissed(true)}
      >
        <Text style={styles.dismissText}>×</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.bannerText}>📱 See this running natively on iOS!</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleOpenInApp}>
          <Text style={styles.ctaButtonText}>Try iOS Version</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1976d2',
    paddingBottom: 25, // Account for safe area
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dismissText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingRight: 45, // Make room for dismiss button
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 10,
  },
  ctaButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ctaButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '600',
  },
});