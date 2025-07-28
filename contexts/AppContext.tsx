import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { AppContext as AppContextType } from '../types';
import { contextDetection } from '../utils/contextDetection';

interface AppContextValue {
  context: AppContextType;
  isDesktop: boolean;
  isMobileWeb: boolean;
  isNative: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};

interface AppContextProviderProps {
  children: React.ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [appContext, setAppContext] = useState<AppContextType>(() => 
    contextDetection.getAppContext()
  );

  useEffect(() => {
    // Handle window resize on web
    if (contextDetection.getAppContext() !== 'native') {
      const handleResize = () => {
        contextDetection.resetContext();
        const newContext = contextDetection.getAppContext();
        if (newContext !== appContext) {
          setAppContext(newContext);
        }
      };

      const subscription = Dimensions.addEventListener('change', handleResize);
      return () => subscription?.remove();
    }
  }, [appContext]);

  const value: AppContextValue = {
    context: appContext,
    isDesktop: appContext === 'desktop',
    isMobileWeb: appContext === 'mobile-web',
    isNative: appContext === 'native',
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};