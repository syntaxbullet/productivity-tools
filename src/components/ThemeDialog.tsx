import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
} from './ui/dialog';
import { useThemeStore } from '../stores/themeStore';
import { Card } from './ui/card';
import { cn } from '../lib/utils';

export function ThemeDialog() {
  const { isDialogOpen, toggleDialog, currentTheme, setTheme, themes } =
    useThemeStore();

  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
      <DialogPortal>
        <DialogOverlay className="z-[9999]" />
        <DialogContent className="sm:max-w-[425px] z-[9999]">
          <DialogHeader>
            <DialogTitle>Choose Theme</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {themes.map((theme) => (
              <Card
                key={theme.name}
                className={cn(
                  'p-4 cursor-pointer hover:bg-accent transition-colors',
                  currentTheme === theme.name && 'border-primary'
                )}
                onClick={() => setTheme(theme.name)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{theme.label}</span>
                  <div className="flex gap-2">
                    {['primary', 'secondary', 'accent'].map((color) => (
                      <div
                        key={color}
                        className="w-6 h-6 rounded-full border"
                        style={{
                          backgroundColor:
                            theme.colors[color as keyof typeof theme.colors],
                          borderColor: theme.colors.border,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
