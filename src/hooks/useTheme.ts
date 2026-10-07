import { useCallback, useEffect, useState } from 'react';
import { ResolvedTheme, ThemeMode } from '../types';

// Keep in sync with public/theme-init.js, which applies the theme before first paint.
const STORAGE_KEY = 'kopwerk_theme_preference';

// The build prerenders pages without a browser. The markup never depends on the theme
// (the toggle switches icons with dark: classes), so server and client may start from different values.
const isBrowser = typeof window !== 'undefined';

// Dark first, the person decides: only a system setting for light makes the system theme light.
// No setting, or no way to tell, is dark (design system, Themes).
const LIGHT_QUERY = '(prefers-color-scheme: light)';

function readSystemTheme(): ResolvedTheme {
  return isBrowser && window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark';
}

function readStoredMode(): ThemeMode {
  if (!isBrowser) return 'system';
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

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(readSystemTheme);

  useEffect(() => {
    const mediaQuery = window.matchMedia(LIGHT_QUERY);

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'light' : 'dark');
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
