import React from 'react';

type CustomResizeHandleProps = React.HTMLProps<HTMLSpanElement> & {
  handleAxis?: any;
};

export const CustomResizeHandle = React.forwardRef<
  HTMLSpanElement,
  CustomResizeHandleProps
>(function CustomResizeHandle(props, ref) {
  // Filter out non-DOM props like handleAxis
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleAxis, ...rest } = props;
  return (
    <span
      ref={ref}
      className="custom-resize-handle"
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      tabIndex={0}
      role="slider"
      aria-label="Resize widget"
      {...rest}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 20 20"
        preserveAspectRatio="none"
      >
        <polyline points="20,0 20,20 0,20" fill="rgba(0, 0, 0, 0.2)" />
      </svg>
    </span>
  );
});
