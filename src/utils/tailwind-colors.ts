// Utility to generate Tailwind color classes for your custom color scheme
// This ensures all your brand colors are available as Tailwind utilities

const customColors = {
  cream: {
    50: '#fdfbf7',
    100: '#faf6ef',
    200: '#f5ede0',
    300: '#f1e8dc', // DEFAULT
    400: '#e6ddcf', // hover
    500: '#d4c5ad',
    600: '#c2a885',
    700: '#a8916d',
    800: '#8f7a56',
    900: '#6b5c42',
  },
  brown: {
    50: '#f6f4f1',
    100: '#ece8e2',
    200: '#d9d0c5',
    300: '#c1b4a3',
    400: '#a89885',
    500: '#8a7d6a',
    600: '#6b5f4f',
    700: '#4a3628', // DEFAULT
    800: '#3d2d22', // hover
    900: '#2d1f17',
  },
  orange: {
    50: '#fdf7f0',
    100: '#faefe0',
    200: '#f4dcbe',
    300: '#ecc591',
    400: '#e0a866',
    500: '#d48f44',
    600: '#c17a36',
    700: '#966f35', // DEFAULT
    800: '#7d5c2b', // hover
    900: '#654924',
  },
  sage: {
    50: '#f7f7f4',
    100: '#eeefe8',
    200: '#dddfd1',
    300: '#c8cbb3',
    400: '#b0b491',
    500: '#9ca076',
    600: '#8a8653', // DEFAULT
    700: '#787346', // hover
    800: '#5f5c38',
    900: '#4a472c',
  },
  rosemary: {
    50: '#f7f8f6',
    100: '#eff0ec',
    200: '#dee1d8',
    300: '#c8ccbe',
    400: '#b2b49c', // DEFAULT (note: your variable is misspelled as 'rosmary')
    500: '#a0a28a', // hover
    600: '#8a8c74',
    700: '#70725d',
    800: '#575947',
    900: '#424333',
  },
  cta: {
    50: '#fef7ed',
    100: '#fdeeda',
    200: '#fad9b3',
    300: '#f6be82',
    400: '#f19c4f',
    500: '#ee7e2a',
    600: '#d9892a', // DEFAULT
    700: '#c87f24', // hover
    800: '#a06520',
    900: '#81521c',
  },
};

// Text colors based on your design system
const textColors = {
  'primary-dark': '#5e431d',
  'alt-dark': customColors.orange[700],
  'primary-light': '#fdf3dd',
  'alt-light': customColors.rosemary[400],
};

export { customColors, textColors };
