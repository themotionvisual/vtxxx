import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  isCompact: boolean;
  setIsCompact: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isCompact, setIsCompact] = useState(false);

  return (
    <AppContext.Provider value={{ isCompact, setIsCompact }}>
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
