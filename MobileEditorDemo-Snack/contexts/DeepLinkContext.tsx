import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { EmailDocument } from '../types';
import { handleDeepLink } from '../utils/deepLinking';

interface DeepLinkContextValue {
  pendingDocument: EmailDocument | null;
  clearPendingDocument: () => void;
}

const DeepLinkContext = createContext<DeepLinkContextValue | undefined>(undefined);

export const useDeepLink = () => {
  const context = useContext(DeepLinkContext);
  if (!context) {
    throw new Error('useDeepLink must be used within DeepLinkProvider');
  }
  return context;
};

interface DeepLinkProviderProps {
  children: React.ReactNode;
}

export const DeepLinkProvider: React.FC<DeepLinkProviderProps> = ({ children }) => {
  const [pendingDocument, setPendingDocument] = useState<EmailDocument | null>(null);

  useEffect(() => {
    // Handle initial URL (app opened via link)
    const handleInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        await handleDeepLink(initialUrl, setPendingDocument);
      }
    };

    // Handle URLs while app is running
    const handleIncomingURL = (event: { url: string }) => {
      handleDeepLink(event.url, setPendingDocument);
    };

    handleInitialURL();

    const subscription = Linking.addEventListener('url', handleIncomingURL);

    return () => subscription?.remove();
  }, []);

  const clearPendingDocument = () => {
    setPendingDocument(null);
  };

  return (
    <DeepLinkContext.Provider value={{ pendingDocument, clearPendingDocument }}>
      {children}
    </DeepLinkContext.Provider>
  );
};