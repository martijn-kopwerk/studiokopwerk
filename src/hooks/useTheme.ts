import { useCallback, useEffect, useState } from 'react';
import { ResolvedTheme, ThemeMode } from '../types';

// Keep in sync with public/theme-init.js, which applies the theme before first paint.
const STORAGE_KEY = 'kopwerk_theme_preference';

function readStoredMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // Storage can be blocked (private mode, sandboxed frames); fall back to the system preference.
  }
  return 'system';
}

export function useTheme() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(readStoredMode);

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const resolvedTheme: ResolvedTheme = themeMode === 'system' ? systemTheme : themeMode;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.classList.toggle('light', resolvedTheme === 'light');
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const updateTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage errors if private browsing restricts localStorage
    }
  }, []);

  // One-button toggle: flip light/dark. Landing back on the system's own theme
  // forgets the manual choice, so the site follows the system again.
  const toggleTheme = useCallback(() => {
    const next: ResolvedTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    updateTheme(next === systemTheme ? 'system' : next);
  }, [resolvedTheme, systemTheme, updateTheme]);

  return {
    themeMode,
    resolvedTheme,
    toggleTheme,
  };
}
