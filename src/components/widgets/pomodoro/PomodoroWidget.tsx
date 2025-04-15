import { useState, useMemo, useEffect } from 'react';
import { GenericWidget } from '@/components/widgets/GenericWidget';
import { useWidgetStore } from '@/stores/WidgetStore';
import { usePomodoroTimer } from '@/hooks/usePomodoroTimer';
import { PomodoroSettings } from './PomodoroSettings';
import { TimerModeButtons } from './TimerModeButtons';
import { TimerDisplay } from './TimerDisplay';
import { TimerStatusLabel } from './TimerStatusLabel';
import { TimerControls } from './TimerControls';
import { VisualTimerDisplay } from './VisualTimerDisplay';

const chimeSoundUrl =
  'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg';

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
  const [, setIsHovered] = useState(false);
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
      invertedDisplay: widget?.data?.invertedDisplay || false,
      displayType: widget?.data?.displayType || 'text',
    }),
    [widget?.data]
  );

  // Callback to sync state changes to the store with shallow comparison
  const onStateChange = (state: any) => {
    if (!widget) {
      // Widget no longer exists, skip updating
      return;
    }
    const currentData = widget.data || {};
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

  // Calculate displayed time based on invertedDisplay flag
  let displaySeconds = state.secondsLeft;
  if (state.invertedDisplay) {
    // Calculate elapsed time counting up
    const totalDuration =
      state.mode === 'pomodoro'
        ? state.pomodoroDuration
        : state.mode === 'shortBreak'
          ? state.shortBreakDuration
          : state.longBreakDuration;
    displaySeconds = totalDuration - state.secondsLeft;
  }

  // Format displaySeconds as mm:ss
  const minutes = Math.floor(displaySeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (displaySeconds % 60).toString().padStart(2, '0');
  const formattedTime = `${minutes}:${seconds}`;

  // Update document title with remaining time when timer is running
  useEffect(() => {
    if (state.isRunning) {
      document.title = `Pomodoro - ${formattedTime}`;
    } else {
      document.title = 'Syntaxbullet Productivity Tools';
    }
  }, [state.isRunning, formattedTime]);

  const width = widget?.size?.width ?? 200; // fallback width
  const height = widget?.size?.height ?? 200; // fallback height
  const smallerDimension = Math.min(width, height);
  const fontSizePx = Math.min(Math.max(smallerDimension * 0.25, 16), 128);

  const totalDuration =
    state.mode === 'pomodoro'
      ? state.pomodoroDuration
      : state.mode === 'shortBreak'
        ? state.shortBreakDuration
        : state.longBreakDuration;

  return (
    <GenericWidget
      id={id}
      type={type}
      minWidth={minWidth}
      minHeight={minHeight}
      maxHeight={maxHeight}
      maxWidth={maxWidth}
      onHoverChange={setIsHovered}
      customActionButtons={
        <PomodoroSettings state={state} setSettings={setSettings} />
      }
      customButtonsPosition={widget?.position.y > 80 ? 'above' : 'below'}
    >
      <audio ref={audioRef} src={chimeSoundUrl} preload="auto" />
      <div
        className="flex flex-col items-center justify-center h-full p-4 select-none space-y-4 min-h-[220px]"
        style={{
          transformOrigin: 'top center',
          transform: `scale(${Math.min(Math.max(smallerDimension / 220, 0.5), 1)})`,
        }}
      >
        <TimerModeButtons currentMode={state.mode} setMode={setMode} />
        {state.displayType === 'visual' ? (
          <VisualTimerDisplay
            secondsLeft={state.secondsLeft}
            totalSeconds={totalDuration}
            fontSizePx={fontSizePx}
            inverted={state.invertedDisplay}
          />
        ) : (
          <TimerDisplay formattedTime={formattedTime} fontSizePx={fontSizePx} />
        )}
        <TimerStatusLabel currentMode={state.mode} />
        <TimerControls
          isRunning={state.isRunning}
          start={start}
          pause={pause}
          reset={reset}
        />
      </div>
    </GenericWidget>
  );
}
