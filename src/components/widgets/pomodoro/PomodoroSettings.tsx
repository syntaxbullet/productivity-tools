import { WidgetSettingsPopover } from '../WidgetSettingsPopover';
import { WidgetSettingsContent } from '../WidgetSettingsContent';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface PomodoroSettingsProps {
  state: {
    pomodoroDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    autoStartNext: boolean;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
  };
  setSettings: (
    settings: Partial<{
      pomodoroDuration: number;
      shortBreakDuration: number;
      longBreakDuration: number;
      autoStartNext: boolean;
      soundEnabled: boolean;
      notificationsEnabled: boolean;
    }>
  ) => void;
}

export function PomodoroSettings({
  state,
  setSettings,
}: PomodoroSettingsProps) {
  return (
    <WidgetSettingsPopover popoverContentClassName="w-80">
      <WidgetSettingsContent>
        <div className="flex flex-col space-y-1">
          <label htmlFor="pomodoroDuration" className="font-semibold leading-6">
            Pomodoro Duration (minutes)
          </label>
          <Input
            id="pomodoroDuration"
            type="number"
            min={1}
            value={state.pomodoroDuration / 60}
            onChange={(e) => {
              let val = Number(e.target.value);
              if (isNaN(val) || val < 1) val = 1;
              if (val > 180) val = 180;
              setSettings({ pomodoroDuration: val * 60 });
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="shortBreakDuration"
            className="font-semibold leading-6"
          >
            Short Break Duration (minutes)
          </label>
          <Input
            id="shortBreakDuration"
            type="number"
            min={1}
            value={state.shortBreakDuration / 60}
            onChange={(e) => {
              const val = Math.max(1, Number(e.target.value));
              setSettings({ shortBreakDuration: val * 60 });
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full"
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label
            htmlFor="longBreakDuration"
            className="font-semibold leading-6"
          >
            Long Break Duration (minutes)
          </label>
          <Input
            id="longBreakDuration"
            type="number"
            min={1}
            value={state.longBreakDuration / 60}
            onChange={(e) => {
              const val = Math.max(1, Number(e.target.value));
              setSettings({ longBreakDuration: val * 60 });
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-full"
          />
        </div>
        <div className="flex flex-col space-y-1 mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="autoStartNext"
              checked={state.autoStartNext}
              onCheckedChange={(checked) =>
                setSettings({ autoStartNext: checked })
              }
              onPointerDown={(e) => e.stopPropagation()}
            />
            <label htmlFor="autoStartNext" className="font-semibold leading-6">
              Auto-start next phase
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="soundEnabled"
              checked={state.soundEnabled}
              onCheckedChange={(checked) =>
                setSettings({ soundEnabled: checked })
              }
              onPointerDown={(e) => e.stopPropagation()}
            />
            <label htmlFor="soundEnabled" className="font-semibold leading-6">
              Enable sound
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="notificationsEnabled"
              checked={state.notificationsEnabled}
              onCheckedChange={(checked) =>
                setSettings({ notificationsEnabled: checked })
              }
              onPointerDown={(e) => e.stopPropagation()}
            />
            <label
              htmlFor="notificationsEnabled"
              className="font-semibold leading-6"
            >
              Enable notifications
            </label>
          </div>
        </div>
      </WidgetSettingsContent>
    </WidgetSettingsPopover>
  );
}
