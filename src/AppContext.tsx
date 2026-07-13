import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AppView = 'dashboard' | 'integrations';

interface AppContextType {
  isCompact: boolean;
  setIsCompact: (value: boolean) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isCompact, setIsCompact] = useState(false);
  const [activeView, setActiveView] = useState<AppView>('dashboard');

  return (
    <AppContext.Provider value={{ isCompact, setIsCompact, activeView, setActiveView }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
