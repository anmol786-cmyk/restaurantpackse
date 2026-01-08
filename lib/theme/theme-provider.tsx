'use client';

/**
 * Theme Provider
 *
 * React context provider for theme management with dynamic theme switching,
 * persistence, and CSS variable injection.
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { defaultTheme, themes, type ThemeName, type ThemeConfig } from '@/config/theme.config';
import { applyTheme, loadGoogleFonts, getThemeFonts } from './theme-utils';

interface ThemeContextType {
  theme: ThemeConfig;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  customTheme: ThemeConfig | null;
  setCustomTheme: (theme: ThemeConfig) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeName?: ThemeName;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultThemeName = 'default',
  storageKey = 'site-theme',
}: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(defaultThemeName);
  const [customTheme, setCustomTheme] = useState<ThemeConfig | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true);

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.themeName && themes[data.themeName as ThemeName]) {
          setThemeName(data.themeName as ThemeName);
        }
        if (data.customTheme) {
          setCustomTheme(data.customTheme);
        }
      } catch {
        // Invalid storage data, use default
      }
    }
  }, [storageKey]);

  // Get current active theme
  const activeTheme = customTheme || themes[themeName] || defaultTheme;

  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return;

    // Apply theme CSS variables
    applyTheme(activeTheme);

    // Load Google Fonts
    const fonts = getThemeFonts(activeTheme);
    if (fonts.length > 0) {
      loadGoogleFonts(fonts);
    }

    // Save to localStorage
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        themeName,
        customTheme,
      })
    );
  }, [activeTheme, themeName, customTheme, mounted, storageKey]);

  const handleSetTheme = (name: ThemeName) => {
    setThemeName(name);
    setCustomTheme(null); // Clear custom theme when selecting preset
  };

  const handleSetCustomTheme = (theme: ThemeConfig) => {
    setCustomTheme(theme);
  };

  const handleResetTheme = () => {
    setThemeName('default');
    setCustomTheme(null);
    localStorage.removeItem(storageKey);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        themeName,
        setTheme: handleSetTheme,
        customTheme,
        setCustomTheme: handleSetCustomTheme,
        resetTheme: handleResetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
