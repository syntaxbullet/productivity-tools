import { useEffect, useState } from 'react';
import { GenericWidget } from './GenericWidget';
import { useWidgetStore } from '@/stores/WidgetStore';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';

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
  const [isHovered, setIsHovered] = useState(false);
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
  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourAngle = (hours / 12) * 360 + (minutes / 60) * 30;

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
      <div
        className={`flex justify-end p-2 ${widget?.position.y > 80 ? 'top-[-56px]' : 'bottom-[-52px]'} left-[40px] absolute ${isHovered ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
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
            className="w-40"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between space-x-4">
              <span>Analog Clock</span>
              <Switch
                checked={widget?.data.isAnalog || false}
                onCheckedChange={() =>
                  updateWidgetData(id, { isAnalog: !widget.data.isAnalog })
                }
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {widget?.data.isAnalog ? (
        <div className="flex justify-center items-center p-2 w-full h-full box-border overflow-hidden">
          <svg
            width={analogClockSize}
            height={analogClockSize}
            viewBox="0 0 100 100"
            className="border border-border rounded-full bg-background"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              height: 'auto',
              width: 'auto',
            }}
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              className="stroke-border"
              fill="none"
              strokeWidth="2"
            />
            {/* Minute ticks */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-border"
              fill="none"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            {/* Hour ticks */}
            {[...Array(12)].map((_, i) => {
              const angle = i * 30;
              return (
                <line
                  key={i}
                  x1="50"
                  y1={50 - 48}
                  x2="50"
                  y2={50 - 42}
                  className="stroke-primary"
                  strokeWidth={2}
                  strokeLinecap="round"
                  transform={`rotate(${angle} 50 50)`}
                />
              );
            })}
            {/* 12, 3, 6, 9 indicators */}
            <text
              x="50"
              y="18"
              textAnchor="middle"
              fontSize="10"
              className="fill-primary font-bold"
            >
              12
            </text>
            <text
              x="82"
              y="55"
              textAnchor="middle"
              fontSize="10"
              className="fill-primary font-bold"
            >
              3
            </text>
            <text
              x="50"
              y="90"
              textAnchor="middle"
              fontSize="10"
              className="fill-primary font-bold"
            >
              6
            </text>
            <text
              x="18"
              y="55"
              textAnchor="middle"
              fontSize="10"
              className="fill-primary font-bold"
            >
              9
            </text>
            {/* Hour hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="30"
              className="stroke-primary"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 50 50)`}
            />
            {/* Minute hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="20"
              className="stroke-primary"
              strokeWidth="3"
              strokeLinecap="round"
              transform={`rotate(${minuteAngle} 50 50)`}
            />
            {/* Second hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="15"
              className="stroke-destructive"
              strokeWidth="1"
              strokeLinecap="round"
              transform={`rotate(${secondAngle} 50 50)`}
            />
            <circle cx="50" cy="50" r="2" className="fill-primary" />
          </svg>
        </div>
      ) : (
        <div
          className="flex justify-center items-center p-2 w-full h-full overflow-hidden"
          style={{ fontSize: `${fontSizePx}px` }}
        >
          {formattedTime}
        </div>
      )}
    </GenericWidget>
  );
}
