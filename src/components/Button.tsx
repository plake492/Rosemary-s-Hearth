import { forwardRef } from 'react';
import type { ButtonProps } from '@/types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    // Base styles with proper Tailwind classes
    const baseStyles = `
      inline-flex items-center justify-center font-medium rounded
      transition-button duration-200 ease-in-out
      focus:outline-none focus:ring-2 focus:ring-offset-2 
      disabled:cursor-not-allowed disabled:opacity-50 
      active:scale-95 active:transition-transform active:duration-75
      ${fullWidth ? 'w-full' : ''}
    `;

    // Size variants
    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm gap-1.5 min-h-[32px]',
      md: 'px-4 py-2 text-base gap-2 min-h-[40px]',
      lg: 'px-6 py-3 text-lg gap-2.5 min-h-[48px]',
    };

    // Variant styles using your color scheme with proper Tailwind classes
    const variantStyles = {
      primary: `
        text-cream border
        bg-orange border-orange hover:bg-orange-hover hover:border-orange-hover
        focus:ring-orange focus:ring-opacity-50
        disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-200
      `,
      secondary: `
        text-cream border
        bg-sage border-sage hover:bg-sage-hover hover:border-sage-hover
        focus:ring-sage focus:ring-opacity-50
        disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-200
      `,
      border: `
        bg-transparent border-2
        text-brown border-brown hover:bg-brown hover:text-cream
        focus:ring-brown focus:ring-opacity-50
        disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-300
      `,
      error: `
        text-white border
        bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700
        focus:ring-red-500 focus:ring-opacity-50
        disabled:bg-gray-400 disabled:border-gray-400 disabled:text-gray-200
      `,
      'error-border': `
        bg-transparent border-2
        text-red-600 border-red-600 hover:bg-red-600 hover:text-white
        focus:ring-red-500 focus:ring-opacity-50
        disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-300
      `,
    };

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-4 w-4 flex-shrink-0"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    );

    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          ${baseStyles.trim()}
          ${sizeStyles[size]}
          ${variantStyles[variant].trim()}
          ${className}
        `
          .replace(/\s+/g, ' ')
          .trim()}
        {...props}
      >
        {loading && <LoadingSpinner />}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span className={`${loading ? 'sr-only' : ''} flex-shrink-0`}>
          {loading && loadingText ? loadingText : children}
        </span>
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
