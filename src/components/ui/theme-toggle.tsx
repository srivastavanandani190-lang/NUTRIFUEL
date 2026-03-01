import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: '☀️ Light', color: 'text-yellow-500' },
    { value: 'dark' as const, icon: Moon, label: '🌙 Night', color: 'text-cyan-400' },
    { value: 'system' as const, icon: Monitor, label: '🌤️ System', color: 'text-primary' },
  ];

  return (
    <div className="glass rounded-full p-1 flex items-center gap-1">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.value;
        
        return (
          <Button
            key={t.value}
            variant="ghost"
            size="sm"
            onClick={() => setTheme(t.value)}
            className={cn(
              "relative rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300",
              isActive 
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg" 
                : "hover:bg-white/10 dark:hover:bg-black/20"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className={cn("relative z-10 flex items-center gap-1", isActive ? "text-white" : t.color)}>
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{t.label.split(' ')[1]}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export const ThemeToggleMobile: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'dark':
        return <Moon className="w-5 h-5 text-cyan-400" />;
      case 'system':
        return <Monitor className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={cycleTheme}
      className="rounded-full hover:bg-primary/10 transition-all duration-300"
      title={`Current: ${theme} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {getIcon()}
      </motion.div>
    </Button>
  );
};
