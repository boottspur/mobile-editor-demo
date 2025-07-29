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

export type ConversationStep = 
  | 'greeting'
  | 'goal_selection'
  | 'business_input'
  | 'content_generation'
  | 'template_preview'
  | 'customization'
  | 'completion';

export type MarketingGoal = 
  | 'promote_product'
  | 'welcome_customers' 
  | 'share_news'
  | 'collect_feedback'
  | 'announce_event';

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
  type: 'goal' | 'text' | 'confirmation';
}

interface AIAssistantProps {
  onBusinessData?: (data: {
    businessName: string;
    goal: MarketingGoal;
    step: ConversationStep;
  }) => void;
  onTemplateGenerated?: (success: boolean) => void;
  isVisible: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const AIAssistant: React.FC<AIAssistantProps> = ({
  onBusinessData,
  onTemplateGenerated,
  isVisible,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
  const [userInput, setUserInput] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState<MarketingGoal | null>(null);
  const [isAITyping, setIsAITyping] = useState(false);
  
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
        addAIMessage(
          "Hi! I'm your AI marketing assistant. I'll help you create a professional email campaign in just a few minutes. What's your main goal today?",
          'goal_selection',
          [
            { id: 'promote', label: '🛍️ Promote a Product/Service', value: 'promote_product', type: 'goal' },
            { id: 'welcome', label: '👋 Welcome New Customers', value: 'welcome_customers', type: 'goal' },
            { id: 'news', label: '📢 Share News/Updates', value: 'share_news', type: 'goal' },
            { id: 'feedback', label: '💭 Collect Feedback', value: 'collect_feedback', type: 'goal' },
            { id: 'event', label: '🎉 Announce an Event', value: 'announce_event', type: 'goal' },
          ]
        );
      }, 500);
    }
  }, [isVisible]);

  const addAIMessage = (
    content: string,
    nextStep?: ConversationStep,
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
    }, 1000 + Math.random() * 1500); // Realistic AI response delay
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

  const handleGoalSelection = (goal: MarketingGoal, goalLabel: string) => {
    setSelectedGoal(goal);
    addUserMessage(goalLabel);
    
    const responses = {
      promote_product: "Excellent choice! Product promotions work great with email campaigns. What's your business name or website?",
      welcome_customers: "Perfect! Welcome emails are so important for building relationships. What's your business called?",
      share_news: "Great idea! Keeping customers informed builds loyalty. What's your business name?",
      collect_feedback: "Smart approach! Customer feedback is invaluable. What's your business name so I can create a personalized survey?",
      announce_event: "Events are exciting! I'll help you create buzz. What's your business name?"
    };

    addAIMessage(responses[goal], 'business_input');
  };

  const handleBusinessNameSubmit = () => {
    if (!userInput.trim()) return;
    
    const name = userInput.trim();
    setBusinessName(name);
    addUserMessage(name);
    
    // Notify parent component
    if (onBusinessData && selectedGoal) {
      onBusinessData({
        businessName: name,
        goal: selectedGoal,
        step: 'content_generation'
      });
    }
    
    addAIMessage(
      `Perfect! I'm analyzing ${name} and creating a professional email campaign for you. This will just take a moment...`,
      'content_generation'
    );
    
    // Simulate content generation
    setTimeout(() => {
      addAIMessage(
        `✨ Your email is ready! I've created a custom design with appropriate colors, content, and call-to-action for ${name}. You can see it above. What would you like to do next?`,
        'template_preview',
        [
          { id: 'customize', label: '✏️ Customize Content', value: 'customize', type: 'confirmation' },
          { id: 'approve', label: '✅ Looks Great - Continue', value: 'approve', type: 'confirmation' },
          { id: 'regenerate', label: '🔄 Try Different Style', value: 'regenerate', type: 'confirmation' },
        ]
      );
      
      // Notify that template was generated
      onTemplateGenerated?.(true);
    }, 3000);
  };

  const handleTemplateAction = (action: string, actionLabel: string) => {
    addUserMessage(actionLabel);
    
    switch (action) {
      case 'customize':
        addAIMessage(
          "Perfect! You can tap any part of the email above to edit it. I'll provide suggestions as you go. The template is fully customizable while keeping the professional design.",
          'customization'
        );
        break;
        
      case 'approve':
        addAIMessage(
          "Wonderful! Your email looks professional and is ready to send. In a real campaign, you'd add your subscriber list and hit send. The email is optimized for mobile and desktop viewing.",
          'completion'
        );
        break;
        
      case 'regenerate':
        addAIMessage(
          "No problem! Let me create a different style for you...",
          'content_generation'
        );
        
        setTimeout(() => {
          addAIMessage(
            "Here's a fresh take on your email! I've used different colors and a new layout approach. How does this version look?",
            'template_preview',
            [
              { id: 'customize', label: '✏️ Customize This Version', value: 'customize', type: 'confirmation' },
              { id: 'approve', label: '✅ Perfect - Continue', value: 'approve', type: 'confirmation' },
              { id: 'back', label: '↩️ Go Back to Previous', value: 'back', type: 'confirmation' },
            ]
          );
        }, 2500);
        break;
    }
  };

  const handleSuggestionTap = (suggestion: UserAction) => {
    switch (suggestion.type) {
      case 'goal':
        handleGoalSelection(suggestion.value as MarketingGoal, suggestion.label);
        break;
      case 'confirmation':
        handleTemplateAction(suggestion.value, suggestion.label);
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

  const canShowTextInput = currentStep === 'business_input' && !isAITyping;

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
          {/* Drag Handle */}
          <View style={styles.dragHandle} />
          
          <View style={styles.headerContent}>
            <View style={styles.aiAvatar}>
              <Text style={styles.aiAvatarText}>🤖</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>AI Marketing Assistant</Text>
              <Text style={styles.headerSubtitle}>Creating your email campaign</Text>
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
              placeholder="Enter your business name..."
              placeholderTextColor="#999"
              onSubmitEditing={handleBusinessNameSubmit}
              returnKeyType="send"
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={[styles.sendButton, userInput.trim() ? styles.sendButtonActive : null]}
              onPress={handleBusinessNameSubmit}
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
    maxHeight: screenHeight * 0.7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 16,
  },
  keyboardAvoid: {
    flex: 1,
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
    maxHeight: screenHeight * 0.4,
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
    fontSize: 16,
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
    // Animation would be added here in real implementation
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
    alignItems: 'center',
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

export default AIAssistant;