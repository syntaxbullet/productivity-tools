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
  {
    name: 'sunset',
    label: 'Sunset',
    colors: {
      background: 'oklch(0.95 0.1 45)',
      foreground: 'oklch(0.2 0.15 30)',
      card: 'oklch(0.9 0.1 40)',
      'card-foreground': 'oklch(0.2 0.15 30)',
      popover: 'oklch(0.9 0.1 40)',
      'popover-foreground': 'oklch(0.2 0.15 30)',
      primary: 'oklch(0.7 0.2 40)',
      'primary-foreground': 'oklch(0.95 0.1 45)',
      secondary: 'oklch(0.6 0.15 50)',
      'secondary-foreground': 'oklch(0.95 0.1 45)',
      muted: 'oklch(0.85 0.05 40)',
      'muted-foreground': 'oklch(0.3 0.1 30)',
      accent: 'oklch(0.6 0.15 50)',
      'accent-foreground': 'oklch(0.95 0.1 45)',
      destructive: 'oklch(0.7 0.3 30)',
      border: 'oklch(0.8 0.1 40 / 30%)',
      input: 'oklch(0.8 0.1 40)',
      ring: 'oklch(0.7 0.2 40)',
    },
  },
  {
    name: 'ocean',
    label: 'Ocean',
    colors: {
      background: 'oklch(0.15 0.1 220)',
      foreground: 'oklch(0.9 0.1 190)',
      card: 'oklch(0.2 0.1 210)',
      'card-foreground': 'oklch(0.9 0.1 190)',
      popover: 'oklch(0.2 0.1 210)',
      'popover-foreground': 'oklch(0.9 0.1 190)',
      primary: 'oklch(0.6 0.2 200)',
      'primary-foreground': 'oklch(0.15 0.1 220)',
      secondary: 'oklch(0.5 0.15 230)',
      'secondary-foreground': 'oklch(0.15 0.1 220)',
      muted: 'oklch(0.3 0.05 210)',
      'muted-foreground': 'oklch(0.6 0.1 190)',
      accent: 'oklch(0.5 0.15 230)',
      'accent-foreground': 'oklch(0.15 0.1 220)',
      destructive: 'oklch(0.7 0.3 30)',
      border: 'oklch(0.4 0.1 210 / 30%)',
      input: 'oklch(0.4 0.1 210)',
      ring: 'oklch(0.6 0.2 200)',
    },
  },
  {
    name: 'forest',
    label: 'Forest',
    colors: {
      background: 'oklch(0.2 0.15 120)',
      foreground: 'oklch(0.85 0.2 100)',
      card: 'oklch(0.25 0.15 110)',
      'card-foreground': 'oklch(0.85 0.2 100)',
      popover: 'oklch(0.25 0.15 110)',
      'popover-foreground': 'oklch(0.85 0.2 100)',
      primary: 'oklch(0.55 0.25 110)',
      'primary-foreground': 'oklch(0.2 0.15 120)',
      secondary: 'oklch(0.45 0.2 130)',
      'secondary-foreground': 'oklch(0.2 0.15 120)',
      muted: 'oklch(0.35 0.1 110)',
      'muted-foreground': 'oklch(0.55 0.15 100)',
      accent: 'oklch(0.45 0.2 130)',
      'accent-foreground': 'oklch(0.2 0.15 120)',
      destructive: 'oklch(0.7 0.3 30)',
      border: 'oklch(0.5 0.15 110 / 30%)',
      input: 'oklch(0.5 0.15 110)',
      ring: 'oklch(0.55 0.25 110)',
    },
  },
  {
    name: 'pastel',
    label: 'Pastel',
    colors: {
      background: 'oklch(0.95 0.1 90)',
      foreground: 'oklch(0.3 0.1 90)',
      card: 'oklch(0.9 0.1 90)',
      'card-foreground': 'oklch(0.3 0.1 90)',
      popover: 'oklch(0.9 0.1 90)',
      'popover-foreground': 'oklch(0.3 0.1 90)',
      primary: 'oklch(0.6 0.15 90)',
      'primary-foreground': 'oklch(0.95 0.1 90)',
      secondary: 'oklch(0.5 0.1 100)',
      'secondary-foreground': 'oklch(0.95 0.1 90)',
      muted: 'oklch(0.85 0.05 90)',
      'muted-foreground': 'oklch(0.4 0.1 90)',
      accent: 'oklch(0.5 0.1 100)',
      'accent-foreground': 'oklch(0.95 0.1 90)',
      destructive: 'oklch(0.7 0.3 30)',
      border: 'oklch(0.8 0.1 90 / 30%)',
      input: 'oklch(0.8 0.1 90)',
      ring: 'oklch(0.6 0.15 90)',
    },
  },
  {
    name: 'midnight',
    label: 'Midnight',
    colors: {
      background: 'oklch(0.1 0.05 260)',
      foreground: 'oklch(0.9 0.1 280)',
      card: 'oklch(0.15 0.05 260)',
      'card-foreground': 'oklch(0.9 0.1 280)',
      popover: 'oklch(0.15 0.05 260)',
      'popover-foreground': 'oklch(0.9 0.1 280)',
      primary: 'oklch(0.6 0.2 270)',
      'primary-foreground': 'oklch(0.1 0.05 260)',
      secondary: 'oklch(0.5 0.15 280)',
      'secondary-foreground': 'oklch(0.1 0.05 260)',
      muted: 'oklch(0.3 0.05 260)',
      'muted-foreground': 'oklch(0.6 0.1 280)',
      accent: 'oklch(0.5 0.15 280)',
      'accent-foreground': 'oklch(0.1 0.05 260)',
      destructive: 'oklch(0.7 0.3 30)',
      border: 'oklch(0.4 0.1 260 / 30%)',
      input: 'oklch(0.4 0.1 260)',
      ring: 'oklch(0.6 0.2 270)',
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
