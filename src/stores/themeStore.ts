import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Theme {
  name: string;
  label: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    'card-foreground': string;
    popover: string;
    'popover-foreground': string;
    primary: string;
    'primary-foreground': string;
    secondary: string;
    'secondary-foreground': string;
    muted: string;
    'muted-foreground': string;
    accent: string;
    'accent-foreground': string;
    destructive: string;
    border: string;
    input: string;
    ring: string;
  };
}

interface ThemeStore {
  currentTheme: string;
  isDialogOpen: boolean;
  themes: Theme[];
  setTheme: (theme: string) => void;
  toggleDialog: () => void;
  addTheme: (theme: Theme) => void;
}

const initialThemes: Theme[] = [
  {
    name: 'light',
    label: 'Light',
    colors: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.145 0 0)',
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.145 0 0)',
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.145 0 0)',
      primary: 'oklch(0.205 0 0)',
      'primary-foreground': 'oklch(0.985 0 0)',
      secondary: 'oklch(0.97 0 0)',
      'secondary-foreground': 'oklch(0.205 0 0)',
      muted: 'oklch(0.97 0 0)',
      'muted-foreground': 'oklch(0.556 0 0)',
      accent: 'oklch(0.97 0 0)',
      'accent-foreground': 'oklch(0.205 0 0)',
      destructive: 'oklch(0.577 0.245 27.325)',
      border: 'oklch(0.922 0 0)',
      input: 'oklch(0.922 0 0)',
      ring: 'oklch(0.708 0 0)',
    },
  },
  {
    name: 'dark',
    label: 'Dark',
    colors: {
      background: 'oklch(0.145 0 0)',
      foreground: 'oklch(0.985 0 0)',
      card: 'oklch(0.205 0 0)',
      'card-foreground': 'oklch(0.985 0 0)',
      popover: 'oklch(0.205 0 0)',
      'popover-foreground': 'oklch(0.985 0 0)',
      primary: 'oklch(0.922 0 0)',
      'primary-foreground': 'oklch(0.205 0 0)',
      secondary: 'oklch(0.269 0 0)',
      'secondary-foreground': 'oklch(0.985 0 0)',
      muted: 'oklch(0.269 0 0)',
      'muted-foreground': 'oklch(0.708 0 0)',
      accent: 'oklch(0.269 0 0)',
      'accent-foreground': 'oklch(0.985 0 0)',
      destructive: 'oklch(0.704 0.191 22.216)',
      border: 'oklch(1 0 0 / 10%)',
      input: 'oklch(1 0 0 / 15%)',
      ring: 'oklch(0.556 0 0)',
    },
  },
  {
    name: 'neon',
    label: 'Neon',
    colors: {
      background: 'oklch(0.1 0 0)',
      foreground: 'oklch(0.98 0.05 120)',
      card: 'oklch(0.15 0 0)',
      'card-foreground': 'oklch(0.98 0.05 120)',
      popover: 'oklch(0.15 0 0)',
      'popover-foreground': 'oklch(0.98 0.05 120)',
      primary: 'oklch(0.7 0.3 120)',
      'primary-foreground': 'oklch(0.1 0 0)',
      secondary: 'oklch(0.6 0.3 280)',
      'secondary-foreground': 'oklch(0.1 0 0)',
      muted: 'oklch(0.2 0 0)',
      'muted-foreground': 'oklch(0.7 0.1 120)',
      accent: 'oklch(0.6 0.3 280)',
      'accent-foreground': 'oklch(0.1 0 0)',
      destructive: 'oklch(0.7 0.3 30)',
      border: 'oklch(0.7 0.3 120 / 30%)',
      input: 'oklch(0.2 0 0)',
      ring: 'oklch(0.7 0.3 120)',
    },
  },
];

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: 'light',
      isDialogOpen: false,
      themes: initialThemes,
      setTheme: (theme) => {
        console.log('setTheme called with:', theme);
        console.log(
          'Current themes:',
          get().themes.map((t) => t.name)
        );
        if (get().themes.some((t) => t.name === theme)) {
          set({ currentTheme: theme });
        }
      },
      toggleDialog: () =>
        set((state) => ({ isDialogOpen: !state.isDialogOpen })),
      addTheme: (theme) => {
        set((state) => ({
          themes: [...state.themes, theme],
        }));
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Initialize localStorage with default values if not present
const initializeThemeStorage = () => {
  // Removed old initialization code
};

// Call the initialization function
// Removed old initialization call

// Removed old duplicate useThemeStore declaration
