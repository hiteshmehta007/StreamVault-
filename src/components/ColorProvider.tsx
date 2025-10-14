

import { createContext, useContext, useState, useEffect } from 'react';

type BackgroundTheme = 'light' | 'dark' | 'default';

interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  ring: string;
  description: string;
}

interface ColorContextType {
  backgroundTheme: BackgroundTheme;
  setBackgroundTheme: (theme: BackgroundTheme) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  availableColorSchemes: ColorScheme[];
}

const defaultColorSchemes: ColorScheme[] = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    primary: '#3b82f6',
    secondary: '#e0f2fe',
    accent: '#0ea5e9',
    border: '#bfdbfe',
    ring: '#3b82f6',
    description: 'Classic blue ocean theme'
  },
  {
    id: 'green',
    name: 'Forest Green',
    primary: '#22c55e',
    secondary: '#dcfce7',
    accent: '#16a34a',
    border: '#bbf7d0',
    ring: '#22c55e',
    description: 'Natural forest green'
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    primary: '#8b5cf6',
    secondary: '#f3f4f6',
    accent: '#7c3aed',
    border: '#e5e7eb',
    ring: '#8b5cf6',
    description: 'Elegant royal purple'
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    primary: '#f97316',
    secondary: '#fed7aa',
    accent: '#ea580c',
    border: '#fdba74',
    ring: '#f97316',
    description: 'Warm sunset orange'
  },
  {
    id: 'pink',
    name: 'Cherry Blossom',
    primary: '#ec4899',
    secondary: '#fdf2f8',
    accent: '#db2777',
    border: '#fbb6ce',
    ring: '#ec4899',
    description: 'Soft cherry blossom pink'
  },
  {
    id: 'red',
    name: 'Crimson Red',
    primary: '#ef4444',
    secondary: '#fee2e2',
    accent: '#dc2626',
    border: '#fca5a5',
    ring: '#ef4444',
    description: 'Bold crimson red'
  },
  {
    id: 'yellow',
    name: 'Golden Sun',
    primary: '#eab308',
    secondary: '#fef3c7',
    accent: '#ca8a04',
    border: '#fed877',
    ring: '#eab308',
    description: 'Bright golden yellow'
  },
  {
    id: 'indigo',
    name: 'Deep Indigo',
    primary: '#6366f1',
    secondary: '#e0e7ff',
    accent: '#4f46e5',
    border: '#c7d2fe',
    ring: '#6366f1',
    description: 'Deep mystical indigo'
  },
  {
    id: 'teal',
    name: 'Tropical Teal',
    primary: '#14b8a6',
    secondary: '#ccfbf1',
    accent: '#0d9488',
    border: '#99f6e4',
    ring: '#14b8a6',
    description: 'Tropical teal waters'
  },
  {
    id: 'cyan',
    name: 'Electric Cyan',
    primary: '#06b6d4',
    secondary: '#cffafe',
    accent: '#0891b2',
    border: '#a5f3fc',
    ring: '#06b6d4',
    description: 'Electric cyan blue'
  },
  {
    id: 'lime',
    name: 'Electric Lime',
    primary: '#84cc16',
    secondary: '#ecfccb',
    accent: '#65a30d',
    border: '#d9f99d',
    ring: '#84cc16',
    description: 'Vibrant electric lime'
  },
  {
    id: 'rose',
    name: 'Romantic Rose',
    primary: '#f43f5e',
    secondary: '#fff1f2',
    accent: '#e11d48',
    border: '#fbb6ce',
    ring: '#f43f5e',
    description: 'Romantic rose petals'
  }
];

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('default');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorSchemes[0]);

  useEffect(() => {
    // Load settings from localStorage on mount
    const savedBackgroundTheme = localStorage.getItem('streamvault-background-theme') as BackgroundTheme;
    const savedColorScheme = localStorage.getItem('streamvault-color-scheme');
    
    if (savedBackgroundTheme && ['light', 'dark', 'default'].includes(savedBackgroundTheme)) {
      setBackgroundTheme(savedBackgroundTheme);
    } else {
      // Default to system preference for background
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setBackgroundTheme(systemTheme);
    }

    if (savedColorScheme) {
      try {
        const parsed = JSON.parse(savedColorScheme);
        const foundScheme = defaultColorSchemes.find(s => s.id === parsed.id) || parsed;
        setColorScheme(foundScheme);
      } catch (e) {
        // Use default if parsing fails
      }
    }
  }, []);

  useEffect(() => {
    // Apply themes to document and save to localStorage
    const root = window.document.documentElement;
    
    // Remove all background theme classes
    root.classList.remove('light', 'dark', 'default');
    
    // Add current background theme class
    root.classList.add(backgroundTheme);
    
    // Apply color scheme variables
    root.style.setProperty('--color-scheme-primary', colorScheme.primary);
    root.style.setProperty('--color-scheme-secondary', colorScheme.secondary);
    root.style.setProperty('--color-scheme-accent', colorScheme.accent);
    root.style.setProperty('--color-scheme-border', colorScheme.border);
    root.style.setProperty('--color-scheme-ring', colorScheme.ring);
    
    // Save to localStorage
    localStorage.setItem('streamvault-background-theme', backgroundTheme);
    localStorage.setItem('streamvault-color-scheme', JSON.stringify(colorScheme));
  }, [backgroundTheme, colorScheme]);

  return (
    <ColorContext.Provider value={{
      backgroundTheme,
      setBackgroundTheme,
      colorScheme,
      setColorScheme,
      availableColorSchemes: defaultColorSchemes
    }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColor must be used within a ColorProvider');
  }
  return context;
}

