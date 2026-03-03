import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white dark:bg-white dark:text-slate-900',
        secondary: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
      }
    },
    defaultVariants: { variant: 'default' }
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
