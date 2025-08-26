import type { Config } from 'tailwindcss';
import { customColors, textColors } from './src/utils/tailwind-colors';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Your custom brand colors with full color scales
        ...customColors,
        // Single-value colors for CSS variable integration
        cream: {
          DEFAULT: 'var(--color-cream)',
          hover: 'var(--color-cream-hover)',
        },
        brown: {
          DEFAULT: 'var(--color-brown)',
          hover: 'var(--color-brown-hover)',
        },
        'light-orange': {
          DEFAULT: 'var(--color-light-orange)',
          hover: 'var(--color-light-orange-hover)',
        },
        rosemary: {
          DEFAULT: 'var(--color-rosmary)',
          hover: 'var(--color-rosmary-hover)',
        },
        orange: {
          DEFAULT: 'var(--color-orange)',
          hover: 'var(--color-orange-hover)',
        },
        sage: {
          DEFAULT: 'var(--color-sage)',
          hover: 'var(--color-sage-hover)',
        },
        'pale-orange': {
          DEFAULT: 'var(--color-pale-orange)',
          hover: 'var(--color-pale-orange-hover)',
        },
        cta: {
          DEFAULT: 'var(--color-cta)',
          hover: 'var(--color-cta-hover)',
        },
      },
      textColor: {
        ...textColors,
      },
      backgroundColor: {
        // Ensure hover states work
        'orange-hover': 'var(--color-orange-hover)',
        'sage-hover': 'var(--color-sage-hover)',
        'brown-hover': 'var(--color-brown-hover)',
        'cream-hover': 'var(--color-cream-hover)',
        'cta-hover': 'var(--color-cta-hover)',
      },
      borderColor: {
        // Ensure hover states work for borders
        'orange-hover': 'var(--color-orange-hover)',
        'sage-hover': 'var(--color-sage-hover)',
        'brown-hover': 'var(--color-brown-hover)',
        'cream-hover': 'var(--color-cream-hover)',
        'cta-hover': 'var(--color-cta-hover)',
      },
      animation: {
        spin: 'spin 1s linear infinite',
      },
      transitionProperty: {
        button: 'background-color, border-color, color, box-shadow, transform',
      },
      scale: {
        '95': '0.95',
      },
      ringColor: {
        orange: 'var(--color-orange)',
        sage: 'var(--color-sage)',
        brown: 'var(--color-brown)',
        cta: 'var(--color-cta)',
      },
      fontFamily: {
        // Add your custom fonts here if needed
      },
      spacing: {
        // Add custom spacing if needed
      },
    },
  },
  plugins: [],
};

export default config;
