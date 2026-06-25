import { createContext, useContext, type ReactNode } from 'react';
import type { BackgroundId } from './backgroundOptions';

type BackgroundSelectionContextValue = {
  value: BackgroundId;
  onChange: (id: BackgroundId) => void;
};

const BackgroundSelectionContext = createContext<BackgroundSelectionContextValue | null>(null);

export function BackgroundSelectionProvider({
  value,
  onChange,
  children,
}: BackgroundSelectionContextValue & { children: ReactNode }) {
  return (
    <BackgroundSelectionContext.Provider value={{ value, onChange }}>
      {children}
    </BackgroundSelectionContext.Provider>
  );
}

export function useBackgroundSelection() {
  return useContext(BackgroundSelectionContext);
}
