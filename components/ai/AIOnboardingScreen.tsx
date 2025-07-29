import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { AIAssistant, MarketingGoal, ConversationStep } from './AIAssistant';
import { AISmartTemplate } from '../templates/AISmartTemplate';
import { AIContentGenerator, AIContentData, BrandData } from '../../services/aiContentGenerator';

interface AIOnboardingScreenProps {
  onComplete?: (document: any) => void;
  onBack?: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const AIOnboardingScreen: React.FC<AIOnboardingScreenProps> = ({
  onComplete,
  onBack,
}) => {
  const [showAI, setShowAI] = useState(true);
  const [businessData, setBusinessData] = useState<{
    businessName: string;
    goal: MarketingGoal;
    step: ConversationStep;
  } | null>(null);
  
  const [aiContent, setAIContent] = useState<AIContentData | null>(null);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const aiGenerator = new AIContentGenerator();

  // Handle business data from AI conversation
  const handleBusinessData = (data: {
    businessName: string;
    goal: MarketingGoal;
    step: ConversationStep;
  }) => {
    setBusinessData(data);
    
    if (data.step === 'content_generation') {
      generateTemplate(data.businessName, data.goal);
    }
  };

  // Generate template content and branding
  const generateTemplate = async (businessName: string, goal: MarketingGoal) => {
    setIsGenerating(true);
    
    try {
      // Generate content and branding in parallel
      const [content, branding] = await Promise.all([
        aiGenerator.generateContent(businessName, goal),
        aiGenerator.generateBrandData(businessName),
      ]);
      
      setAIContent(content);
      setBrandData(branding);
      setShowTemplate(true);
      
    } catch (error) {
      console.error('Error generating template:', error);
      // Fallback to basic template
      setAIContent({
        businessName,
        businessInitials: aiGenerator.generateBusinessInitials(businessName),
        headline: `Welcome to ${businessName}!`,
        tagline: 'We\'re excited to work with you',
        bodyText: 'Thank you for your interest in our services. We look forward to helping you achieve your goals.',
        ctaText: 'Get Started',
        ctaAction: 'get_started',
        contactInfo: `${businessName} • Contact us for more information`,
      });
      
      setBrandData({
        colors: {
          primary: '#1976d2',
          secondary: '#3498db',
          accent: '#27ae60',
          text: '#2c3e50',
          background: '#ffffff',
        },
        typography: {
          headingFont: 'Inter',
          bodyFont: 'Inter',
          personality: 'professional',
        },
      });
      
      setShowTemplate(true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle when template is generated and ready
  const handleTemplateGenerated = (success: boolean) => {
    if (success) {
      // Template is ready - AI will show it
      console.log('Template generated successfully');
    }
  };

  // Handle completion
  const handleComplete = () => {
    if (aiContent && brandData && businessData) {
      // Create a mock document structure for demo
      const document = {
        id: `ai-generated-${Date.now()}`,
        name: `${businessData.businessName} - ${businessData.goal}`,
        subject: aiContent.headline,
        fromName: businessData.businessName,
        fromEmail: `hello@${businessData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        preheader: aiContent.tagline,
        aiContent,
        brandData,
        sections: [], // Would be populated with actual email blocks
        globalStyles: {
          bodyBackgroundColor: brandData.colors.background,
          primaryColor: brandData.colors.primary,
          textColor: brandData.colors.text,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      onComplete?.(document);
    }
  };

  // Toggle AI assistant visibility
  const toggleAI = () => {
    setShowAI(!showAI);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>AI Email Creator</Text>
        
        <TouchableOpacity style={styles.aiToggle} onPress={toggleAI}>
          <Text style={styles.aiToggleText}>🤖</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        {/* Template Preview */}
        {showTemplate && aiContent && brandData ? (
          <View style={styles.templateContainer}>
            <Text style={styles.previewTitle}>Your AI-Generated Email</Text>
            <View style={styles.templateWrapper}>
              <AISmartTemplate
                aiContent={aiContent}
                brandData={brandData}
                onContentUpdate={(updatedContent) => {
                  if (aiContent) {
                    setAIContent({ ...aiContent, ...updatedContent });
                  }
                }}
              />
            </View>
            
            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.secondaryButton]} 
                onPress={toggleAI}
              >
                <Text style={styles.secondaryButtonText}>✏️ Customize with AI</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryButton]} 
                onPress={handleComplete}
              >
                <Text style={styles.primaryButtonText}>✅ Use This Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Welcome State */
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>🚀 AI Email Creator</Text>
            <Text style={styles.welcomeSubtitle}>
              Create professional email campaigns in minutes with AI assistance
            </Text>
            
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🎨</Text>
                <Text style={styles.featureText}>Smart branding based on your business</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>✍️</Text>
                <Text style={styles.featureText}>AI-generated content that converts</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📱</Text>
                <Text style={styles.featureText}>Mobile-optimized design</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>⚡</Text>
                <Text style={styles.featureText}>Ready to send in under 5 minutes</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.getStartedButton} onPress={() => setShowAI(true)}>
              <Text style={styles.getStartedButtonText}>Get Started with AI</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Loading State */}
        {isGenerating && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContent}>
              <Text style={styles.loadingIcon}>🤖</Text>
              <Text style={styles.loadingTitle}>AI Creating Your Email...</Text>
              <Text style={styles.loadingSubtitle}>
                Analyzing your business and generating custom content
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* AI Assistant Overlay */}
      <AIAssistant
        isVisible={showAI}
        onBusinessData={handleBusinessData}
        onTemplateGenerated={handleTemplateGenerated}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  aiToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiToggleText: {
    fontSize: 20,
  },
  
  // Main Content
  mainContent: {
    flex: 1,
    position: 'relative',
  },
  
  // Welcome State
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  featureList: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
  },
  featureText: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  getStartedButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  
  // Template Preview
  templateContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  templateWrapper: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#1976d2',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#1976d2',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#1976d2',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Loading State
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500,
  },
  loadingContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default AIOnboardingScreen;