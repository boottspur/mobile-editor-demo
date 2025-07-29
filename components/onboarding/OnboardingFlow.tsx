import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { LandingPage } from './LandingPage';
import { AccountSetup } from './AccountSetup';
import { WelcomeScreen } from './WelcomeScreen';

export type OnboardingStep = 'landing' | 'account-setup' | 'welcome' | 'complete';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkipToEditor: () => void;
}

interface UserData {
  name: string;
  email: string;
  company: string;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onSkipToEditor,
}) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('landing');
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleStartTrial = () => {
    setCurrentStep('account-setup');
  };

  const handleAccountSetupComplete = (data: UserData) => {
    setUserData(data);
    setCurrentStep('welcome');
  };

  const handleWelcomeComplete = () => {
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
            userData={userData!}
            onContinue={handleWelcomeComplete}
          />
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
});