import { useThemeStore } from '../stores/themeStore';
import { useEffect } from 'react';

/**
 * ThemeProvider component that applies the selected theme to the document
 * This provides a more React-friendly approach to theme application
 * compared to directly manipulating the DOM in the store
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const themes = useThemeStore((state) => state.themes);

  useEffect(() => {
    const selectedTheme = themes.find((t) => t.name === currentTheme);
    if (selectedTheme) {
      // Apply theme variables to the document root
      Object.entries(selectedTheme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty('--' + key, value);
      });
    }
  }, [currentTheme, themes]);

  return <>{children}</>;
}
