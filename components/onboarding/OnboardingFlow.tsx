import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LandingPage } from './LandingPage';
import { AccountSetup } from './AccountSetup';
import { WelcomeScreen } from './WelcomeScreen';
import { AIOnboardingAssistant, OnboardingData } from '../ai/AIOnboardingAssistant';

export type OnboardingStep = 'landing' | 'account-setup' | 'welcome' | 'ai-discovery' | 'complete';

interface OnboardingFlowProps {
  onComplete: (onboardingData?: OnboardingData) => void;
  onSkipToEditor: () => void;
}

interface UserData {
  name: string;
  email: string;
  company: string;
}

interface AppState {
  userData: UserData | null;
  onboardingData: OnboardingData | null;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onSkipToEditor,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('landing');
  const [appState, setAppState] = useState<AppState>({
    userData: null,
    onboardingData: null,
  });

  const handleStartTrial = () => {
    setCurrentStep('account-setup');
  };

  const handleAccountSetupComplete = (data: UserData) => {
    setAppState(prev => ({ ...prev, userData: data }));
    setCurrentStep('welcome');
  };

  const handleWelcomeComplete = () => {
    setCurrentStep('ai-discovery');
  };

  const handleAIDiscoveryComplete = (onboardingData: OnboardingData) => {
    setAppState(prev => ({ ...prev, onboardingData }));
    setCurrentStep('complete');
    onComplete(onboardingData);
  };

  const handleSkipAIDiscovery = () => {
    setCurrentStep('complete');
    onComplete();
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
  };

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return (
          <LandingPage
            onStartTrial={handleStartTrial}
            onSkipToEditor={onSkipToEditor}
          />
        );

      case 'account-setup':
        return (
          <AccountSetup
            onComplete={handleAccountSetupComplete}
            onBack={handleBackToLanding}
          />
        );

      case 'welcome':
        return (
          <WelcomeScreen
            userData={appState.userData!}
            onContinue={handleWelcomeComplete}
          />
        );

      case 'ai-discovery':
        return (
          <View style={styles.aiDiscoveryContainer}>
            <AIOnboardingAssistant
              userData={appState.userData!}
              onComplete={handleAIDiscoveryComplete}
              isVisible={true}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderCurrentStep()}
    </View>
  );
};

// Hook for managing onboarding state across the app
export const useOnboarding = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    setShowOnboarding(false);
  };

  const skipOnboarding = () => {
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
    setShowOnboarding(true);
  };

  return {
    hasCompletedOnboarding,
    showOnboarding,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  aiDiscoveryContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'flex-end',
  },
});