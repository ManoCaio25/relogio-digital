import React from 'react';

export function TruncatedTooltipText({
  text,
  as: Component = 'p',
  className,
  tooltipClassName,
}) {
  const [open, setOpen] = React.useState(false);
  const tooltipId = React.useId();
  const showTooltip = React.useCallback(() => setOpen(true), []);
  const hideTooltip = React.useCallback(() => setOpen(false), []);

  const elementClass = ['line-clamp-2', className].filter(Boolean).join(' ');
  const tooltipClass = [
    'absolute left-0 top-full z-50 mt-2 w-max max-w-xs rounded-lg border border-border/60 bg-surface/90 px-3 py-2 text-xs text-white/90 shadow-e2 backdrop-blur-md',
    tooltipClassName,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="relative">
      <Component
        className={elementClass}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        tabIndex={0}
        aria-describedby={open ? tooltipId : undefined}
      >
        {text}
      </Component>
      {open && (
        <div id={tooltipId} role="tooltip" className={tooltipClass}>
          {text}
        </div>
      )}
    </div>
  );
}
