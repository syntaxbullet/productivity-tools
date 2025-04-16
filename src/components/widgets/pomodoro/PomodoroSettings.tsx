import { WidgetSettingsPopover } from '../../WidgetSettingsPopover';
import { WidgetSettingsContent } from '../../WidgetSettingsContent';
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
    invertedDisplay?: boolean;
    displayType?: 'text' | 'visual';
  };
  setSettings: (
    settings: Partial<{
      pomodoroDuration: number;
      shortBreakDuration: number;
      longBreakDuration: number;
      autoStartNext: boolean;
      soundEnabled: boolean;
      notificationsEnabled: boolean;
      invertedDisplay?: boolean;
      displayType?: 'text' | 'visual';
    }>
  ) => void;
}

export function PomodoroSettings({
  state,
  setSettings,
}: PomodoroSettingsProps) {
  return (
    <WidgetSettingsPopover popoverContentClassName="w-80">
      <WidgetSettingsContent className="z-[9999]">
        <div className="flex flex-col space-y-1">
          <label htmlFor="pomodoroDuration" className="font-semibold leading-6">
            Focus Duration (minutes)
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
        <div className="flex items-center space-x-2 mt-4">
          <Switch
            id="invertedDisplay"
            checked={state.invertedDisplay || false}
            onCheckedChange={(checked) =>
              setSettings({ invertedDisplay: checked })
            }
            onPointerDown={(e) => e.stopPropagation()}
          />
          <label htmlFor="invertedDisplay" className="font-semibold leading-6">
            Inverted Timer Display (Count Up)
          </label>
        </div>
        <div className="flex flex-col space-y-1 mt-4">
          <label htmlFor="displayType" className="font-semibold leading-6">
            Timer Display Type
          </label>
          <select
            id="displayType"
            className="block w-full rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={state.displayType || 'text'}
            onChange={(e) =>
              setSettings({ displayType: e.target.value as 'text' | 'visual' })
            }
            onPointerDown={(e) => e.stopPropagation()}
          >
            <option value="text">Text</option>
            <option value="visual">Visual</option>
          </select>
        </div>
      </WidgetSettingsContent>
    </WidgetSettingsPopover>
  );
}
