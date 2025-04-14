import { useEffect, useRef, useReducer, useCallback } from 'react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroSettings {
  pomodoroDuration: number; // in seconds
  shortBreakDuration: number; // in seconds
  longBreakDuration: number; // in seconds
  autoStartNext: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  adhdMode: boolean;
}

interface PomodoroState extends PomodoroSettings {
  mode: TimerMode;
  secondsLeft: number;
  isRunning: boolean;
}

type Action =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESET' }
  | { type: 'TICK' }
  | { type: 'SET_MODE'; mode: TimerMode }
  | { type: 'SET_SETTINGS'; settings: Partial<PomodoroSettings> }
  | { type: 'SET_SECONDS_LEFT'; secondsLeft: number };

function pomodoroReducer(state: PomodoroState, action: Action): PomodoroState {
  switch (action.type) {
    case 'START':
      return { ...state, isRunning: true };
    case 'PAUSE':
      return { ...state, isRunning: false };
    case 'RESET': {
      let resetSeconds = 0;
      if (state.mode === 'pomodoro') resetSeconds = state.pomodoroDuration;
      else if (state.mode === 'shortBreak')
        resetSeconds = state.shortBreakDuration;
      else if (state.mode === 'longBreak')
        resetSeconds = state.longBreakDuration;
      return { ...state, isRunning: false, secondsLeft: resetSeconds };
    }
    case 'TICK': {
      if (state.secondsLeft <= 1) {
        return { ...state, secondsLeft: 0, isRunning: false };
      }
      return { ...state, secondsLeft: state.secondsLeft - 1 };
    }
    case 'SET_MODE': {
      let newSeconds = 0;
      if (action.mode === 'pomodoro') newSeconds = state.pomodoroDuration;
      else if (action.mode === 'shortBreak')
        newSeconds = state.shortBreakDuration;
      else if (action.mode === 'longBreak')
        newSeconds = state.longBreakDuration;
      return {
        ...state,
        mode: action.mode,
        secondsLeft: newSeconds,
        isRunning: false,
      };
    }
    case 'SET_SETTINGS': {
      const newState = { ...state, ...action.settings };
      // If durations changed and current mode matches, update secondsLeft accordingly
      if (action.settings.pomodoroDuration && state.mode === 'pomodoro') {
        newState.secondsLeft = action.settings.pomodoroDuration;
      } else if (
        action.settings.shortBreakDuration &&
        state.mode === 'shortBreak'
      ) {
        newState.secondsLeft = action.settings.shortBreakDuration;
      } else if (
        action.settings.longBreakDuration &&
        state.mode === 'longBreak'
      ) {
        newState.secondsLeft = action.settings.longBreakDuration;
      }
      return newState;
    }
    case 'SET_SECONDS_LEFT':
      return { ...state, secondsLeft: action.secondsLeft };
    default:
      return state;
  }
}

export function usePomodoroTimer(
  initialState: PomodoroState,
  onStateChange: (state: PomodoroState) => void
) {
  const [state, dispatch] = useReducer(pomodoroReducer, initialState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to handle timer ticking
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.isRunning]);

  // Effect to handle timer end and mode switching
  useEffect(() => {
    if (state.secondsLeft === 0 && state.isRunning === false) {
      // Play sound if enabled
      if (state.soundEnabled && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      // Show notification if enabled and permission granted
      if (
        state.notificationsEnabled &&
        'Notification' in window &&
        Notification.permission === 'granted'
      ) {
        let notificationTitle = '';
        if (state.mode === 'pomodoro') notificationTitle = 'Pomodoro finished!';
        else if (state.mode === 'shortBreak')
          notificationTitle = 'Short break finished!';
        else if (state.mode === 'longBreak')
          notificationTitle = 'Long break finished!';
        new Notification(notificationTitle);
      }

      if (state.autoStartNext) {
        let nextMode: TimerMode = 'pomodoro';
        if (state.mode === 'pomodoro') nextMode = 'shortBreak';
        else if (state.mode === 'shortBreak') nextMode = 'pomodoro';
        else if (state.mode === 'longBreak') nextMode = 'pomodoro';
        dispatch({ type: 'SET_MODE', mode: nextMode });
        dispatch({ type: 'START' });
      }
    }
  }, [
    state.secondsLeft,
    state.isRunning,
    state.mode,
    state.autoStartNext,
    state.soundEnabled,
    state.notificationsEnabled,
  ]);

  // Request notification permission on mount if notifications enabled
  useEffect(() => {
    if (
      state.notificationsEnabled &&
      'Notification' in window &&
      Notification.permission !== 'granted'
    ) {
      Notification.requestPermission();
    }
  }, [state.notificationsEnabled]);

  // Expose controls
  const start = useCallback(() => {
    if (state.secondsLeft === 0 && !state.autoStartNext) {
      // Move to next phase and start timer
      let nextMode: TimerMode = 'pomodoro';
      if (state.mode === 'pomodoro') nextMode = 'shortBreak';
      else if (state.mode === 'shortBreak') nextMode = 'pomodoro';
      else if (state.mode === 'longBreak') nextMode = 'pomodoro';
      dispatch({ type: 'SET_MODE', mode: nextMode });
      dispatch({ type: 'START' });
    } else {
      dispatch({ type: 'START' });
    }
  }, [state.secondsLeft, state.autoStartNext, state.mode]);
  const pause = useCallback(() => dispatch({ type: 'PAUSE' }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setMode = useCallback(
    (mode: TimerMode) => dispatch({ type: 'SET_MODE', mode }),
    []
  );
  const setSettings = useCallback(
    (settings: Partial<PomodoroSettings>) =>
      dispatch({ type: 'SET_SETTINGS', settings }),
    []
  );

  // Sync state changes to parent/store
  useEffect(() => {
    onStateChange(state);
  }, [state, onStateChange]);

  return {
    state,
    start,
    pause,
    reset,
    setMode,
    setSettings,
    audioRef,
  };
}
