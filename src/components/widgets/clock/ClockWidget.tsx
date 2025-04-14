import { useEffect, useState } from 'react';
import { GenericWidget } from '@/components/widgets/GenericWidget';
import { useWidgetStore } from '@/stores/WidgetStore';
import { ClockSettings } from './ClockSettings';
import { AnalogClock } from './AnalogClock';
import { DigitalClockDisplay } from './DigitalClockDisplay';

export function ClockWidget({
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
  const [time, setTime] = useState(new Date());
  const [, setIsHovered] = useState(false);
  const widget = useWidgetStore((state) => state.widgets[id]);
  const updateWidgetData = useWidgetStore((state) => state.updateWidgetData);
  const width = widget?.size?.width ?? 200; // fallback width
  const height = widget?.size?.height ?? 200; // fallback height
  // Calculate font size proportional to the smaller dimension, with min and max limits
  const smallerDimension = Math.min(width, height);
  const fontSizePx = Math.min(Math.max(smallerDimension * 0.25, 16), 128);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Calculate size for analog clock (square) based on smaller dimension, with min and max limits
  const analogClockSize = Math.min(Math.max(smallerDimension * 0.8, 80), 300);

  // Calculate angles for analog clock hands
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const toggleAnalog = () => {
    updateWidgetData(id, { isAnalog: !widget.data.isAnalog });
  };

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
        <ClockSettings
          isAnalog={widget?.data.isAnalog || false}
          toggleAnalog={toggleAnalog}
        />
      }
      customButtonsPosition={widget?.position.y > 80 ? 'above' : 'below'}
    >
      {widget?.data.isAnalog ? (
        <div className="flex justify-center items-center p-2 w-full h-full box-border overflow-hidden">
          <AnalogClock
            size={analogClockSize}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
          />
        </div>
      ) : (
        <DigitalClockDisplay
          formattedTime={formattedTime}
          fontSizePx={fontSizePx}
        />
      )}
    </GenericWidget>
  );
}
