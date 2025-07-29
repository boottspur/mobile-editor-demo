import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Animated, Platform, Image } from 'react-native';
import { EmailDocument } from '../types';
import { documentStorage } from '../utils/documentStorage';

interface MobileAppFABProps {
  currentDocument?: EmailDocument | null;
}

export const MobileAppFAB: React.FC<MobileAppFABProps> = ({ currentDocument }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDismissed(true);
    });
  };

  const handleOpenInApp = async () => {
    try {
      // Save current document state if editing
      if (currentDocument) {
        await documentStorage.saveDocument(currentDocument);
      }

      // Show options for mobile app handoff
      Alert.alert(
        '📱 Edit on Mobile',
        'Would you like to continue editing this email in our mobile app? This will save your current progress and open the mobile app.',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Save & Open App', 
            onPress: async () => {
              try {
                // In production, this would:
                // 1. Save the current document
                // 2. Check if app is installed
                // 3. Either deep link to app with document ID or redirect to app store
                
                Alert.alert(
                  '✅ Document Saved',
                  'Your document has been saved. In a production app, this would now:\n\n• Check if the mobile app is installed\n• Open the app with your document ready to edit\n• Or redirect to the app store if not installed\n\nYou would be automatically authenticated if already logged in.',
                  [{ text: 'Got it!' }]
                );
              } catch (error) {
                console.error('Error in mobile handoff:', error);
                Alert.alert('Error', 'Unable to save document for mobile editing');
              }
            }
          },
        ]
      );
    } catch (error) {
      console.error('Error in handleOpenInApp:', error);
      Alert.alert('Error', 'Unable to prepare mobile handoff');
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <Animated.View style={[styles.fab, { opacity: fadeAnim }]}>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={handleDismiss}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.dismissText}>×</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.fabButton} onPress={handleOpenInApp}>
        <Image
          source={Platform.OS === 'ios' 
            ? require('../assets/ios.svg') 
            : require('../assets/android2.png')
          }
          style={styles.iconImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 150,
    right: 20,
    backgroundColor: '#1976d2',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    zIndex: 1001,
  },
  dismissButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff5722',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  dismissText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 28,
    height: 28,
  },
});