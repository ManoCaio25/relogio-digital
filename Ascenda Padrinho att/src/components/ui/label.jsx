import React from 'react';
import { cn } from '@/utils';

export const Label = React.forwardRef(function Label({ className, ...props }, ref) {
  return (
    <label
      ref={ref}
      className={cn('text-xs font-medium uppercase tracking-wide text-muted', className)}
      {...props}
    />
  );
});

