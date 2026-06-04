import { createContext, useContext } from 'react';
import { useThemePreference } from '@/hooks/useThemePreference';

import type { ReactNode } from 'react';
import type { Theme } from '@/hooks/useThemePreference';

interface ThemeContextValue {
    theme: Theme,
    toggle: () => void
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, toggle] = useThemePreference();
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}