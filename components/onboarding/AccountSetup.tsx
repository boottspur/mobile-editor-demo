import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface AccountSetupProps {
  onComplete: (userData: { name: string; email: string; company: string }) => void;
  onBack: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const isMobile = screenWidth < 768;

export const AccountSetup: React.FC<AccountSetupProps> = ({
  onComplete,
  onBack,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Auto-fill mock data when field is focused
  const handleNameFocus = () => {
    if (!name) {
      setName('Alex Johnson');
    }
  };

  const handleEmailFocus = () => {
    if (!email) {
      setEmail('alex.johnson@company.com');
    }
  };

  const handleCompanyFocus = () => {
    if (!company) {
      setCompany('Acme Marketing Co.');
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onComplete({
      name: name || 'Alex Johnson',
      email: email || 'alex.johnson@company.com',
      company: company || 'Acme Marketing Co.',
    });
  };

  const isFormValid = name.length > 0 || email.length > 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Start your free trial - no credit card required
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                onFocus={handleNameFocus}
                placeholder="Enter your full name"
                placeholderTextColor="#999999"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                onFocus={handleEmailFocus}
                placeholder="Enter your email address"
                placeholderTextColor="#999999"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Company (Optional)</Text>
              <TextInput
                style={styles.input}
                value={company}
                onChangeText={setCompany}
                onFocus={handleCompanyFocus}
                placeholder="Enter your company name"
                placeholderTextColor="#999999"
                autoCapitalize="words"
                returnKeyType="done"
              />
            </View>

            {/* Demo hint */}
            <View style={styles.demoHint}>
              <Text style={styles.demoHintText}>
                💡 Demo tip: Tap any field to auto-fill with sample data
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isFormValid || isLoading) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid || isLoading}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.submitButtonText,
                (!isFormValid || isLoading) && styles.submitButtonTextDisabled
              ]}>
                {isLoading ? 'Creating Account...' : 'Start Free Trial'}
              </Text>
            </TouchableOpacity>

            {/* Terms */}
            <Text style={styles.terms}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          {/* Trust Indicators */}
          <View style={styles.trustIndicators}>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>🔒</Text>
              <Text style={styles.trustText}>Secure & Private</Text>
            </View>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>⚡</Text>
              <Text style={styles.trustText}>Instant Setup</Text>
            </View>
            <View style={styles.trustItem}>
              <Text style={styles.trustIcon}>💳</Text>
              <Text style={styles.trustText}>No Credit Card</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  formContainer: {
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  
  // Header
  header: {
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: isMobile ? 28 : 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Form
  form: {
    marginBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  
  // Demo hint
  demoHint: {
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: '#1976d2',
  },
  demoHintText: {
    fontSize: 14,
    color: '#1976d2',
    fontStyle: 'italic',
  },
  
  // Submit button
  submitButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButtonTextDisabled: {
    color: '#888888',
  },
  
  // Terms
  terms: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#1976d2',
    textDecorationLine: 'underline',
  },
  
  // Trust indicators
  trustIndicators: {
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isMobile ? 8 : 0,
    marginHorizontal: isMobile ? 0 : 16,
  },
  trustIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  trustText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
});