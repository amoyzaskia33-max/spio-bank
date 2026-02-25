/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Enterprise Dark Theme
        'spio-base': '#0a0a0a',
        'spio-surface': '#121212',
        'spio-overlay': '#1a1a1a',
        'spio-text': '#dcdce6',
        'spio-text-subtle': '#a0a0b4',
        'spio-accent': '#6366f1',      // Indigo 500
        'spio-accent-hover': '#4f46e5', // Indigo 600
        'spio-mint': '#34d399',         // Emerald 400
        'spio-red': '#f43f5e',          // Rose 500
        'spio-yellow': '#facc15',       // Amber 400
        'spio-green': '#22c55e',        // Green 500
        'spio-blue': '#60a5fa',         // Blue 400
        'spio-purple': '#a78bfa',       // Violet 400
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
        'dock': '1rem',
      },
      backdropBlur: {
        'glass': '24px',
        'glass-heavy': '32px',
        'glass-premium': '28px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'premium-dark': 'linear-gradient(135deg, #0a0a0a 0%, #121212 50%, #0f0f0f 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'dock': '0 12px 48px rgba(0, 0, 0, 0.5)',
        'window': '0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.4)',
        'window-lg': '0 0 0 1px rgba(255, 255, 255, 0.06), 0 16px 64px rgba(0, 0, 0, 0.5)',
        'window-active': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(99, 102, 241, 0.1)',
        'soft-diffused': '0 40px 120px rgba(0, 0, 0, 0.5)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontSize: {
        '11': '0.6875rem',
        '12': '0.75rem',
        '13': '0.8125rem',
      },
    },
  },
  plugins: [],
};
