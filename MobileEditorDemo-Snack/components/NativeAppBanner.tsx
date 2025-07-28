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

      // Generate deep link URL for Expo Snack
      // UPDATE THIS URL after uploading to Snack!
      const baseUrl = 'exp://exp.host/@YOUR_SNACK_USERNAME/YOUR_SNACK_ID';
      const deepLinkUrl = currentDocument 
        ? `${baseUrl}?docId=${currentDocument.id}`
        : baseUrl;

      // Try to open in Expo Go
      console.log('Attempting to open deep link:', deepLinkUrl);
      
      try {
        await Linking.openURL(deepLinkUrl);
      } catch (error) {
        console.error('Error opening deep link:', error);
        // Fallback: Show instructions to install Expo Go
        Alert.alert(
          'Install Expo Go',
          'To experience the native version, please install Expo Go from your app store first.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Get Expo Go', 
              onPress: () => openExpoGoStore() 
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error in handleOpenInApp:', error);
      Alert.alert('Error', 'Unable to open in native app');
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
        <Text style={styles.bannerText}>Get the full experience in our native app</Text>
        <TouchableOpacity style={styles.ctaButton} onPress={handleOpenInApp}>
          <Text style={styles.ctaButtonText}>Open in App</Text>
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