import { useThemeStore } from '../stores/themeStore';
import { ThemeDialog } from './ThemeDialog';
import { Palette } from 'lucide-react';
import { Button } from './ui/button';

export function NavigationBar() {
  const { isDialogOpen, toggleDialog } = useThemeStore();

  return (
    <>
      <Button
        variant="ghost"
        size="default"
        onClick={() => toggleDialog()}
        aria-haspopup="dialog"
        aria-expanded={isDialogOpen}
        className="inline-flex items-center m-4"
      >
        <Palette className="w-5 h-5 mr-2" aria-hidden="true" />
        Change theme
      </Button>
      <ThemeDialog />
    </>
  );
}
