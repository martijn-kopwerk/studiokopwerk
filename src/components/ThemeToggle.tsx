import React from 'react';
import { Sun, Moon, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { ResolvedTheme, ThemeMode } from '../types';

interface ThemeToggleProps {
  themeMode: ThemeMode;
  resolvedTheme: ResolvedTheme;
  onThemeChange: (mode: ThemeMode) => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  themeMode,
  resolvedTheme,
  onThemeChange,
}) => {
  const options: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: 'system', label: 'Systeemvoorkeur', icon: Settings },
    { mode: 'light', label: 'Licht', icon: Sun },
    { mode: 'dark', label: 'Donker', icon: Moon },
  ];

  return (
    <div
      id="theme-toggle-container"
      className="inline-flex items-center p-1 rounded-full border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-xs transition-colors duration-300"
      role="group"
      aria-label="Weergave modus schakelaar"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = themeMode === opt.mode;

        return (
          <button
            key={opt.mode}
            id={`theme-btn-${opt.mode}`}
            type="button"
            onClick={() => onThemeChange(opt.mode)}
            aria-label={opt.label}
            aria-pressed={isActive}
            title={`${opt.label} ${opt.mode === 'system' ? `(${resolvedTheme === 'dark' ? 'Donker' : 'Licht'})` : ''}`}
            className={`relative flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-colors duration-200 outline-hidden focus-visible:ring-2 focus-visible:ring-amber-500/60 ${
              isActive
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="theme-active-indicator"
                className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800 shadow-xs"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}
            <span className="relative z-10">
              <Icon className="w-4 h-4" />
            </span>
          </button>
        );
      })}
    </div>
  );
};
