import { Switch } from '@/components/ui/switch';
import { WidgetSettingsPopover } from '../../WidgetSettingsPopover';
import { WidgetSettingsContent } from '../../WidgetSettingsContent';

interface ClockSettingsProps {
  isAnalog: boolean;
  toggleAnalog: () => void;
}

export function ClockSettings({ isAnalog, toggleAnalog }: ClockSettingsProps) {
  return (
    <WidgetSettingsPopover popoverContentClassName="w-40">
      <WidgetSettingsContent>
        <div className="flex items-center justify-between space-x-4">
          <label className="font-semibold leading-6 select-none">
            Analog Clock
          </label>
          <Switch checked={isAnalog} onCheckedChange={toggleAnalog} />
        </div>
      </WidgetSettingsContent>
    </WidgetSettingsPopover>
  );
}
