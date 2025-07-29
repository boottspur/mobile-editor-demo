import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export type OnboardingStep = 
  | 'welcome'
  | 'business_discovery'
  | 'industry_identification'
  | 'website_analysis'
  | 'contact_discovery'
  | 'contact_source'
  | 'goal_discovery'
  | 'goal_prioritization'
  | 'campaign_focus'
  | 'completion';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  timestamp: Date;
  suggestions?: UserAction[];
  isTyping?: boolean;
}

export interface UserAction {
  id: string;
  label: string;
  value: string;
  type: 'selection' | 'text' | 'confirmation' | 'skip';
}

export interface OnboardingData {
  businessName: string;
  website?: string;
  industry?: string;
  businessType?: string;
  hasContacts: boolean;
  contactSource?: string;
  contactCount?: number;
  primaryGoal: string;
  goalDescription?: string;
  urgency?: string;
  campaignType: 'email' | 'sms' | 'survey' | 'multichannel';
}

interface AIOnboardingAssistantProps {
  userData: { name: string; email: string; company: string };
  onComplete: (data: OnboardingData) => void;
  isVisible: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const AIOnboardingAssistant: React.FC<AIOnboardingAssistantProps> = ({
  userData,
  onComplete,
  isVisible,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [userInput, setUserInput] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({
    campaignType: 'email', // Default to email for demo
  });
  
  const scrollViewRef = useRef<ScrollView>(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Animation for sliding in/out
  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  // Initialize conversation
  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setTimeout(() => {
        const firstName = userData.name?.split(' ')[0] || 'there';
        addAIMessage(
          `Hi ${firstName}! 👋 Welcome to EmailCraft! I'm your AI marketing assistant, and I'm here to help you get started.\n\nI'll ask you a few quick questions to understand your business and marketing goals. This will help me create the perfect first campaign for you.\n\nLet's start with the basics - tell me about your business. What do you do?`,
          'business_discovery'
        );
      }, 800);
    }
  }, [isVisible, userData]);

  const addAIMessage = (
    content: string,
    nextStep?: OnboardingStep,
    suggestions?: UserAction[]
  ) => {
    const messageId = `ai-${Date.now()}`;
    
    // Show typing indicator first
    setIsAITyping(true);
    
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: messageId,
        sender: 'ai',
        content,
        timestamp: new Date(),
        suggestions,
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsAITyping(false);
      
      if (nextStep) {
        setCurrentStep(nextStep);
      }
      
      // Auto-scroll to bottom
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200 + Math.random() * 1000); // Realistic AI response delay
  };

  const addUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleBusinessDiscovery = () => {
    if (!userInput.trim()) return;
    
    const businessDescription = userInput.trim();
    addUserMessage(businessDescription);
    
    // Simple industry detection based on keywords
    const industry = detectIndustry(businessDescription);
    const businessType = detectBusinessType(businessDescription);
    
    setOnboardingData(prev => ({
      ...prev,
      businessName: userData.company || extractBusinessName(businessDescription),
      businessType,
      industry,
    }));
    
    // Generate contextual response based on detected industry
    const industryResponse = getIndustryResponse(industry, businessType);
    
    addAIMessage(
      industryResponse,
      'website_analysis',
      [
        { id: 'has_website', label: 'Yes, I have a website', value: 'yes', type: 'selection' },
        { id: 'no_website', label: 'No website yet', value: 'no', type: 'selection' },
        { id: 'website_soon', label: 'Building one soon', value: 'soon', type: 'selection' },
      ]
    );
  };

  const handleWebsiteResponse = (hasWebsite: string, websiteLabel: string) => {
    addUserMessage(websiteLabel);
    
    let nextMessage = '';
    if (hasWebsite === 'yes') {
      nextMessage = "Great! If you'd like, you can share your website URL and I can analyze it to understand your brand better. Or we can skip this step and continue.\n\nNow, let's talk about your contacts. Do you already have a list of customers or subscribers you'd like to reach?";
    } else {
      nextMessage = "No problem! We can work on building your online presence later.\n\nFor now, let's talk about your contacts. Do you already have a list of customers or potential customers you'd like to reach?";
    }
    
    addAIMessage(
      nextMessage,
      'contact_discovery',
      [
        { id: 'has_contacts', label: 'Yes, I have contacts', value: 'yes', type: 'selection' },
        { id: 'no_contacts', label: 'No, I need to build a list', value: 'no', type: 'selection' },
        { id: 'some_contacts', label: 'I have a few contacts', value: 'some', type: 'selection' },
      ]
    );
  };

  const handleContactDiscovery = (contactStatus: string, contactLabel: string) => {
    addUserMessage(contactLabel);
    
    setOnboardingData(prev => ({
      ...prev,
      hasContacts: contactStatus !== 'no',
    }));
    
    let nextMessage = '';
    let suggestions: UserAction[] = [];
    
    if (contactStatus === 'yes') {
      nextMessage = "Excellent! Where do you currently keep your contact list? This will help me understand how we can import them.";
      suggestions = [
        { id: 'csv_excel', label: '📊 Excel/CSV file', value: 'csv', type: 'selection' },
        { id: 'google_contacts', label: '📱 Google Contacts', value: 'google', type: 'selection' },
        { id: 'crm_system', label: '💼 CRM system', value: 'crm', type: 'selection' },
        { id: 'email_list', label: '📧 Email platform', value: 'email_platform', type: 'selection' },
        { id: 'other_source', label: '🗂️ Other source', value: 'other', type: 'selection' },
      ];
    } else if (contactStatus === 'some') {
      nextMessage = "That's a good start! Where do you keep those contacts currently?";
      suggestions = [
        { id: 'phone_contacts', label: '📱 Phone contacts', value: 'phone', type: 'selection' },
        { id: 'email_contacts', label: '📧 Email contacts', value: 'email', type: 'selection' },
        { id: 'business_cards', label: '💳 Business cards', value: 'cards', type: 'selection' },
        { id: 'social_media', label: '📱 Social media followers', value: 'social', type: 'selection' },
      ];
    } else {
      nextMessage = "No worries! Building a contact list is part of the journey. We can help you create lead magnets and signup forms to grow your audience.\n\nFor now, let's focus on your immediate marketing goals. What's the main thing you want to achieve with your marketing right now?";
      setCurrentStep('goal_discovery');
      return;
    }
    
    addAIMessage(nextMessage, 'contact_source', suggestions);
  };

  const handleContactSource = (source: string, sourceLabel: string) => {
    addUserMessage(sourceLabel);
    
    setOnboardingData(prev => ({
      ...prev,
      contactSource: source,
    }));
    
    addAIMessage(
      "Perfect! We can help you import those contacts later.\n\nNow for the fun part - let's talk about your goals! What's the main thing you want to achieve with your marketing right now? Feel free to describe it in your own words.",
      'goal_discovery'
    );
  };

  const handleGoalDiscovery = () => {
    if (!userInput.trim()) return;
    
    const goalDescription = userInput.trim();
    addUserMessage(goalDescription);
    
    // Analyze the goal and suggest campaign type
    const analyzedGoal = analyzeGoal(goalDescription);
    
    setOnboardingData(prev => ({
      ...prev,
      primaryGoal: analyzedGoal.category,
      goalDescription: goalDescription,
    }));
    
    addAIMessage(
      `I understand! ${analyzedGoal.response}\n\nBased on what you've told me, I think an ${analyzedGoal.recommendedCampaign} would be perfect for achieving your goals.\n\nWould you like me to help you create that now?`,
      'campaign_focus',
      [
        { id: 'create_now', label: '🚀 Yes, let\'s create it!', value: 'yes', type: 'confirmation' },
        { id: 'learn_more', label: '🤔 Tell me more about this approach', value: 'learn_more', type: 'selection' },
        { id: 'different_approach', label: '💭 I had something different in mind', value: 'different', type: 'selection' },
      ]
    );
  };

  const handleCampaignFocus = (action: string, actionLabel: string) => {
    addUserMessage(actionLabel);
    
    if (action === 'yes') {
      addAIMessage(
        "Awesome! I have everything I need to get started.\n\nI'll create a personalized email campaign based on:\n" +
        `• Your ${onboardingData.businessType || 'business'}\n` +
        `• Your goal: ${onboardingData.goalDescription}\n` +
        `• Your ${onboardingData.hasContacts ? 'existing contacts' : 'contact building needs'}\n\n` +
        "Let's create something amazing together! 🎉",
        'completion'
      );
      
      // Complete onboarding after a delay
      setTimeout(() => {
        onComplete({
          businessName: onboardingData.businessName || userData.company || '',
          website: onboardingData.website,
          industry: onboardingData.industry,
          businessType: onboardingData.businessType,
          hasContacts: onboardingData.hasContacts || false,
          contactSource: onboardingData.contactSource,
          primaryGoal: onboardingData.primaryGoal || 'general',
          goalDescription: onboardingData.goalDescription,
          campaignType: 'email', // For demo, always funnel to email
        });
      }, 2000);
      
    } else if (action === 'learn_more') {
      addAIMessage(
        "Great question! Here's why I think an email campaign would work well for you:\n\n" +
        "📧 **Direct Communication**: Reach people right in their inbox\n" +
        "📊 **Measurable Results**: See exactly who opens and clicks\n" +
        "💰 **Cost Effective**: High ROI compared to other channels\n" +
        "🎨 **Professional Design**: Beautiful templates that work on mobile\n" +
        "⚡ **Quick to Create**: We can have your first campaign ready in minutes\n\n" +
        "Ready to give it a try?",
        'campaign_focus',
        [
          { id: 'create_now', label: '🚀 Yes, let\'s do it!', value: 'yes', type: 'confirmation' },
          { id: 'different_approach', label: '💭 I prefer a different approach', value: 'different', type: 'selection' },
        ]
      );
    } else {
      addAIMessage(
        "I'd love to hear your thoughts! What kind of marketing approach did you have in mind? The more you tell me, the better I can help you.",
        'goal_discovery'
      );
    }
  };

  const handleSuggestionTap = (suggestion: UserAction) => {
    switch (currentStep) {
      case 'website_analysis':
        handleWebsiteResponse(suggestion.value, suggestion.label);
        break;
      case 'contact_discovery':
        handleContactDiscovery(suggestion.value, suggestion.label);
        break;
      case 'contact_source':
        handleContactSource(suggestion.value, suggestion.label);
        break;
      case 'campaign_focus':
        handleCampaignFocus(suggestion.value, suggestion.label);
        break;
    }
  };

  const handleTextSubmit = () => {
    switch (currentStep) {
      case 'business_discovery':
        handleBusinessDiscovery();
        break;
      case 'goal_discovery':
        handleGoalDiscovery();
        break;
    }
  };

  const renderMessage = (message: ChatMessage) => {
    const isAI = message.sender === 'ai';
    
    return (
      <View key={message.id} style={[styles.messageContainer, isAI ? styles.aiMessage : styles.userMessage]}>
        <View style={[styles.messageBubble, isAI ? styles.aiBubble : styles.userBubble]}>
          <Text style={[styles.messageText, isAI ? styles.aiText : styles.userText]}>
            {message.content}
          </Text>
        </View>
        
        {message.suggestions && (
          <View style={styles.suggestionsContainer}>
            {message.suggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion.id}
                style={styles.suggestionButton}
                onPress={() => handleSuggestionTap(suggestion)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{suggestion.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessage]}>
      <View style={[styles.messageBubble, styles.aiBubble]}>
        <View style={styles.typingIndicator}>
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
          <View style={styles.typingDot} />
        </View>
      </View>
    </View>
  );

  const canShowTextInput = (currentStep === 'business_discovery' || currentStep === 'goal_discovery') && !isAITyping;

  const getInputPlaceholder = () => {
    if (currentStep === 'business_discovery') {
      return "Tell me about your business...";
    } else if (currentStep === 'goal_discovery') {
      return "Describe your marketing goals...";
    }
    return "Type your response...";
  };

  if (!isVisible) return null;

  return (
    <Animated.View 
      style={[
        styles.overlay,
        {
          opacity: slideAnimation,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{
              translateY: slideAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              }),
            }],
          },
        ]}
      >
        <KeyboardAvoidingView 
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragHandle} />
            
            <View style={styles.headerContent}>
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarText}>🤖</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.headerTitle}>AI Setup Assistant</Text>
                <Text style={styles.headerSubtitle}>Getting to know you and your business</Text>
              </View>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map(renderMessage)}
            {isAITyping && renderTypingIndicator()}
          </ScrollView>

          {/* Input Area */}
          {canShowTextInput && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={userInput}
                onChangeText={setUserInput}
                placeholder={getInputPlaceholder()}
                placeholderTextColor="#999"
                onSubmitEditing={handleTextSubmit}
                returnKeyType="send"
                multiline
              />
              <TouchableOpacity
                style={[styles.sendButton, userInput.trim() ? styles.sendButtonActive : null]}
                onPress={handleTextSubmit}
                disabled={!userInput.trim()}
              >
                <Text style={styles.sendButtonText}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </Animated.View>
    </Animated.View>
  );
};

// Helper functions for natural language processing
const detectIndustry = (description: string): string => {
  const text = description.toLowerCase();
  
  if (text.includes('restaurant') || text.includes('food') || text.includes('cafe') || text.includes('kitchen')) return 'restaurant';
  if (text.includes('tech') || text.includes('software') || text.includes('app') || text.includes('saas')) return 'technology';
  if (text.includes('retail') || text.includes('store') || text.includes('shop') || text.includes('ecommerce')) return 'retail';
  if (text.includes('service') || text.includes('consulting') || text.includes('agency')) return 'services';
  if (text.includes('health') || text.includes('medical') || text.includes('doctor') || text.includes('clinic')) return 'healthcare';
  if (text.includes('real estate') || text.includes('property') || text.includes('realtor')) return 'real_estate';
  if (text.includes('education') || text.includes('school') || text.includes('training')) return 'education';
  
  return 'general';
};

const detectBusinessType = (description: string): string => {
  const text = description.toLowerCase();
  
  if (text.includes('startup') || text.includes('new business')) return 'startup';
  if (text.includes('small business') || text.includes('local')) return 'small_business';
  if (text.includes('freelance') || text.includes('consultant')) return 'freelancer';
  if (text.includes('nonprofit') || text.includes('charity')) return 'nonprofit';
  
  return 'business';
};

const extractBusinessName = (description: string): string => {
  // Simple extraction - look for quoted business names or capitalize first meaningful words
  const words = description.split(' ');
  const meaningfulWords = words.filter(word => 
    word.length > 2 && 
    !['the', 'and', 'for', 'with', 'our', 'we'].includes(word.toLowerCase())
  );
  
  if (meaningfulWords.length > 0) {
    return meaningfulWords.slice(0, 2).map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
  
  return 'Your Business';
};

const getIndustryResponse = (industry: string, businessType: string): string => {
  const responses = {
    restaurant: "I love working with restaurants! The food industry has such great opportunities for email marketing. Food photos, special offers, and event announcements always perform well.",
    technology: "Tech companies are perfect for email marketing! Whether it's product updates, feature announcements, or onboarding sequences, there's so much potential.",
    retail: "Retail is fantastic for email campaigns! Product showcases, sales announcements, and seasonal promotions can really drive sales.",
    services: "Service businesses do great with email marketing! Building trust, showcasing expertise, and nurturing client relationships are key.",
    healthcare: "Healthcare marketing requires a thoughtful approach. I can help you create professional, compliant communications that build patient trust.",
    real_estate: "Real estate is perfect for email marketing! Market updates, new listings, and community information keep clients engaged.",
    education: "Education organizations can do amazing things with email! Student communications, parent updates, and community building are all powerful uses.",
    general: "That sounds like an interesting business! I can help you create professional email campaigns regardless of your industry."
  };
  
  return responses[industry as keyof typeof responses] || responses.general + "\n\nDo you have a website where I can learn more about your business?";
};

const analyzeGoal = (description: string) => {
  const text = description.toLowerCase();
  
  if (text.includes('sale') || text.includes('sell') || text.includes('revenue') || text.includes('purchase')) {
    return {
      category: 'sales',
      response: "You want to drive sales and revenue - that's a great goal!",
      recommendedCampaign: 'promotional email campaign'
    };
  }
  
  if (text.includes('awareness') || text.includes('brand') || text.includes('known') || text.includes('visibility')) {
    return {
      category: 'awareness',
      response: "Building brand awareness is so important for long-term growth!",
      recommendedCampaign: 'brand awareness email series'
    };
  }
  
  if (text.includes('customer') || text.includes('client') || text.includes('retention') || text.includes('loyalty')) {
    return {
      category: 'retention',
      response: "Keeping existing customers engaged is smart business!",
      recommendedCampaign: 'customer engagement newsletter'
    };
  }
  
  if (text.includes('lead') || text.includes('prospect') || text.includes('signup') || text.includes('subscriber')) {
    return {
      category: 'leads',
      response: "Growing your contact list is the foundation of great marketing!",
      recommendedCampaign: 'lead nurturing email sequence'
    };
  }
  
  if (text.includes('event') || text.includes('announcement') || text.includes('launch')) {
    return {
      category: 'announcement',
      response: "Events and announcements are perfect for email marketing!",
      recommendedCampaign: 'event announcement email'
    };
  }
  
  return {
    category: 'general',
    response: "I can help you achieve that goal!",
    recommendedCampaign: 'customized email campaign'
  };
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },
  keyboardAvoid: {
    maxHeight: screenHeight * 0.8,
  },
  
  // Header
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'relative',
  },
  dragHandle: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiAvatarText: {
    fontSize: 20,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  
  // Messages
  messagesContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
    maxHeight: screenHeight * 0.5,
  },
  messagesContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  messageContainer: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '85%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#1976d2',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: '#333',
  },
  userText: {
    color: '#ffffff',
  },
  
  // Typing Indicator
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 2,
  },
  
  // Suggestions
  suggestionsContainer: {
    marginTop: 12,
    alignSelf: 'stretch',
  },
  suggestionButton: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#1976d2',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  suggestionText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1976d2',
  },
  sendButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default AIOnboardingAssistant;