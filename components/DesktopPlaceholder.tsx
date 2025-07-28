import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export const DesktopPlaceholder: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mobile Email Editor Demo</Text>
        <Text style={styles.subtitle}>Desktop-optimized mobile email editor loads here</Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>This is a mobile-first demo</Text>
          <Text style={styles.infoText}>
            To experience the full email editor functionality, please access this demo on a mobile device or resize your browser window to mobile dimensions.
          </Text>
        </View>

        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>What you'll see on mobile:</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Drag-and-drop email builder</Text>
            <Text style={styles.featureItem}>• Touch-optimized interface</Text>
            <Text style={styles.featureItem}>• Real-time preview</Text>
            <Text style={styles.featureItem}>• Seamless native app transition</Text>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <Text style={styles.ctaText}>
            Try it now: Resize your window or visit on mobile
          </Text>
          <Text style={styles.urlText}>
            Or add ?context=mobile-web to the URL for demo purposes
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    maxWidth: 600,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 20,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  },
  previewSection: {
    marginBottom: 30,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  featureList: {
    paddingLeft: 10,
  },
  featureItem: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    lineHeight: 24,
  },
  ctaSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976d2',
    textAlign: 'center',
    marginBottom: 8,
  },
  urlText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});