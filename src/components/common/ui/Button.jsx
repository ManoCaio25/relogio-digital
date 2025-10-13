import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 hover:bg-primary-500 text-white px-5 py-2 shadow-soft',
        ghost: 'bg-white/5 hover:bg-white/10 text-white px-5 py-2 border border-white/10'
      },
      size: {
        md: 'text-sm',
        lg: 'text-base px-6 py-3'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export const Button = ({ className, variant, size, ...props }) => (
  <button className={twMerge(buttonStyles({ variant, size }), className)} {...props} />
);

export default Button;
