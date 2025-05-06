/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... existing code ...
  theme: {
    extend: {
      // ... existing code ...
      keyframes: {
        scale: {
          '0%': { transform: 'scale(0)' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  // ... existing code ...
}