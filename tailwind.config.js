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
        // macOS Dark Pastel Theme (Catppuccin Mocha-inspired)
        'spio-base': '#1e1e2e',
        'spio-surface': '#24283b',
        'spio-overlay': '#313244',
        'spio-text': '#cdd6f4',
        'spio-text-subtle': '#a6adc8',
        'spio-accent': '#818cf8',      // Soft Indigo
        'spio-accent-hover': '#6366f1',
        'spio-mint': '#34d399',         // Muted Mint
        'spio-red': '#f38ba8',          // Soft Red (close)
        'spio-yellow': '#f9e2af',       // Soft Yellow (minimize)
        'spio-green': '#a6e3a1',        // Soft Green (maximize)
        'spio-blue': '#89b4fa',         // Soft Blue
        'spio-purple': '#cba6f7',       // Soft Purple
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
        'dock': '1.5rem',
      },
      backdropBlur: {
        'glass': '20px',
        'glass-heavy': '40px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'macos-dark': 'linear-gradient(135deg, #1e1e2e 0%, #24283b 50%, #1a1a28 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'dock': '0 12px 48px rgba(0, 0, 0, 0.4)',
        'window': '0 16px 64px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};
