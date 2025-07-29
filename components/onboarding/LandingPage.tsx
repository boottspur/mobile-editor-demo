import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';

interface LandingPageProps {
  onStartTrial: () => void;
  onSkipToEditor: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const isMobile = screenWidth < 768;

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartTrial,
  onSkipToEditor,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
          <Text style={styles.logo}>📧 EmailCraft</Text>
          <Text style={styles.tagline}>Create Beautiful Newsletters</Text>
          <Text style={styles.headline}>
            The Mobile-First Email Editor That Works Everywhere
          </Text>
          <Text style={styles.subheadline}>
            Design stunning newsletters on your phone, tablet, or desktop. 
            No coding required. Professional results guaranteed.
          </Text>
          
          <View style={styles.ctaContainer}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={onStartTrial}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start Free Trial</Text>
              <Text style={styles.trialNote}>No credit card required</Text>
            </TouchableOpacity>
            
            {/* Dev/demo skip button */}
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={onSkipToEditor}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip to Editor →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Why Choose EmailCraft?</Text>
        
        <View style={styles.featureGrid}>
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📱</Text>
            <Text style={styles.featureTitle}>Mobile-First Design</Text>
            <Text style={styles.featureDescription}>
              Create and edit newsletters anywhere, anytime. Optimized for touch.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🎨</Text>
            <Text style={styles.featureTitle}>Professional Templates</Text>
            <Text style={styles.featureDescription}>
              Start with beautiful, responsive templates for every industry.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureTitle}>Lightning Fast</Text>
            <Text style={styles.featureDescription}>
              Real-time editing with instant preview. No waiting, no lag.
            </Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🌐</Text>
            <Text style={styles.featureTitle}>Cross-Platform</Text>
            <Text style={styles.featureDescription}>
              Perfect on mobile, tablet, and desktop. One editor, everywhere.
            </Text>
          </View>
        </View>
      </View>

      {/* Social Proof */}
      <View style={styles.socialProof}>
        <Text style={styles.socialProofText}>
          "Finally, an email editor that actually works on mobile!" 
        </Text>
        <Text style={styles.socialProofAuthor}>- Sarah K., Marketing Director</Text>
      </View>

      {/* Footer CTA */}
      <View style={styles.footerCta}>
        <Text style={styles.footerCtaText}>Ready to create your first newsletter?</Text>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={onStartTrial}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Get Started Free</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingBottom: 40,
  },
  
  // Hero Section
  hero: {
    paddingHorizontal: 20,
    paddingVertical: isMobile ? 40 : 60,
    backgroundColor: '#f8fffe',
    borderBottomWidth: 1,
    borderBottomColor: '#e8f4f8',
  },
  heroContent: {
    maxWidth: 600,
    alignSelf: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headline: {
    fontSize: isMobile ? 28 : 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: isMobile ? 34 : 42,
  },
  subheadline: {
    fontSize: 16,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: isMobile ? 0 : 20,
  },
  
  // CTA Section
  ctaContainer: {
    alignItems: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    minWidth: 200,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  trialNote: {
    color: '#bbdefb',
    fontSize: 12,
    marginTop: 4,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    color: '#666666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  
  // Features Section
  features: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    backgroundColor: '#ffffff',
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 40,
  },
  featureGrid: {
    flexDirection: isMobile ? 'column' : 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 800,
    alignSelf: 'center',
  },
  featureCard: {
    backgroundColor: '#f8f9fa',
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: isMobile ? 0 : 10,
    width: isMobile ? '100%' : '45%',
    alignItems: 'center',
    textAlign: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Social Proof
  socialProof: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#f8fffe',
    alignItems: 'center',
  },
  socialProofText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
    maxWidth: 400,
  },
  socialProofAuthor: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  
  // Footer CTA
  footerCta: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  footerCtaText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 24,
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#1976d2',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 180,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '600',
  },
});