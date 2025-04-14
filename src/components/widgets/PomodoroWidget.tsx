import { useState, useMemo } from 'react';
import { GenericWidget } from './GenericWidget';
import { useWidgetStore } from '@/stores/WidgetStore';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';

const chimeSoundUrl =
  'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export function PomodoroWidget({
  id,
  type,
  minWidth = 150,
  maxWidth = 600,
  minHeight = 150,
  maxHeight = 600,
}: {
  id: string;
  type: string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const widget = useWidgetStore((state) => state.widgets[id]);
  const updateWidgetData = useWidgetStore((state) => state.updateWidgetData);

  // Prepare initial state for the timer hook
  const initialState = useMemo(
    () => ({
      mode: widget?.data?.mode || 'pomodoro',
      secondsLeft: widget?.data?.secondsLeft ?? 25 * 60,
      isRunning: widget?.data?.isRunning || false,
      pomodoroDuration: widget?.data?.pomodoroDuration ?? 25 * 60,
      shortBreakDuration: widget?.data?.shortBreakDuration ?? 5 * 60,
      longBreakDuration: widget?.data?.longBreakDuration ?? 15 * 60,
      autoStartNext: widget?.data?.autoStartNext || false,
      soundEnabled: widget?.data?.soundEnabled || false,
      notificationsEnabled: widget?.data?.notificationsEnabled || false,
      adhdMode: false,
    }),
    [widget?.data]
  );

  // Callback to sync state changes to the store with shallow comparison
  const onStateChange = (state: any) => {
    const currentData = widget?.data || {};
    const keys = Object.keys(state);
    let hasChanges = false;
    for (const key of keys) {
      if (state[key] !== currentData[key]) {
        hasChanges = true;
        break;
      }
    }
    if (hasChanges) {
      updateWidgetData(id, state);
    }
  };

  const { state, start, pause, reset, setMode, setSettings, audioRef } =
    usePomodoroTimer(initialState, onStateChange);

  // Format secondsLeft as mm:ss
  const minutes = Math.floor(state.secondsLeft / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (state.secondsLeft % 60).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

  // Update document title with remaining time when timer is running
  if (state.isRunning) {
    document.title = `Pomodoro - ${formattedTime}`;
  } else {
    document.title = 'Pomodoro';
  }

  const width = widget?.size?.width ?? 200; // fallback width
  const height = widget?.size?.height ?? 200; // fallback height
  const smallerDimension = Math.min(width, height);
  const fontSizePx = Math.min(Math.max(smallerDimension * 0.25, 16), 128);

  return (
    <GenericWidget
      id={id}
      type={type}
      minWidth={minWidth}
      minHeight={minHeight}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      onHoverChange={setIsHovered}
    >
      <audio ref={audioRef} src={chimeSoundUrl} preload="auto" />
      <div
        className={`flex justify-end p-2 ${
          widget?.position.y > 80 ? 'top-[-56px]' : 'bottom-[-52px]'
        } left-[40px] absolute ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Settings />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 space-y-8 p-3"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex flex-col space-y-1">
                <label
                  htmlFor="pomodoroDuration"
                  className="text-sm font-semibold leading-6 text-muted-foreground"
                >
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
                  className="text-sm font-semibold leading-6 text-muted-foreground"
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
                  className="text-sm font-semibold leading-6 text-muted-foreground"
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
                  <label
                    htmlFor="autoStartNext"
                    className="text-sm font-semibold leading-6 text-muted-foreground"
                  >
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
                  <label
                    htmlFor="soundEnabled"
                    className="text-sm font-semibold leading-6 text-muted-foreground"
                  >
                    Enable sound
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notificationsEnabled"
                    checked={state.notificationsEnabled}
                    onCheckedChange={(checked: boolean) =>
                      setSettings({ notificationsEnabled: checked })
                    }
                    onPointerDown={(e) => e.stopPropagation()}
                  />
                  <label
                    htmlFor="notificationsEnabled"
                    className="text-sm font-semibold leading-6 text-muted-foreground"
                  >
                    Enable notifications
                  </label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div
        className="flex flex-col items-center justify-center h-full p-4 select-none space-y-4"
        style={{
          minHeight: '220px',
          transformOrigin: 'top center',
          transform: `scale(${Math.min(Math.max(smallerDimension / 220, 0.5), 1)})`,
        }}
      >
        <div className="flex flex-wrap justify-center gap-2 w-full max-w-md">
          <Button
            className="flex-1 min-w-[90px]"
            variant={state.mode === 'pomodoro' ? 'default' : 'outline'}
            onClick={() => setMode('pomodoro')}
            onPointerDown={(e) => e.stopPropagation()}
            size="sm"
          >
            Pomodoro
          </Button>
          <Button
            className="flex-1 min-w-[90px]"
            variant={state.mode === 'shortBreak' ? 'default' : 'outline'}
            onClick={() => setMode('shortBreak')}
            onPointerDown={(e) => e.stopPropagation()}
            size="sm"
          >
            Short Break
          </Button>
          <Button
            className="flex-1 min-w-[90px]"
            variant={state.mode === 'longBreak' ? 'default' : 'outline'}
            onClick={() => setMode('longBreak')}
            onPointerDown={(e) => e.stopPropagation()}
            size="sm"
          >
            Long Break
          </Button>
        </div>
        <div
          className="font-mono font-bold text-center"
          style={{ fontSize: `${fontSizePx}px`, lineHeight: 1 }}
        >
          {formattedTime}
        </div>
        <div className="text-center text-lg font-semibold text-muted-foreground capitalize">
          {state.mode === 'pomodoro'
            ? 'Pomodoro'
            : state.mode === 'shortBreak'
              ? 'Short Break'
              : 'Long Break'}
        </div>
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-xs">
          <Button
            className="flex-1 min-w-[90px]"
            onClick={state.isRunning ? pause : start}
            variant="outline"
            size="sm"
            onPointerDown={(e) => e.stopPropagation()}
          >
            {state.isRunning ? 'Pause' : 'Start'}
          </Button>
          <Button
            className="flex-1 min-w-[90px]"
            onClick={reset}
            variant="outline"
            size="sm"
            onPointerDown={(e) => e.stopPropagation()}
          >
            Reset
          </Button>
        </div>
      </div>
    </GenericWidget>
  );
}
