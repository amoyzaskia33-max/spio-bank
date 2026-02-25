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
        // Premium Light Theme
        'spio-base': '#FAFAFA',
        'spio-surface': '#FFFFFF',
        'spio-overlay': '#F8FAFC',
        'spio-text': '#0F172A',        // Slate 900
        'spio-text-subtle': '#475569', // Slate 700
        'spio-text-muted': '#64748B',  // Slate 500
        'spio-accent': '#6366f1',      // Indigo 500
        'spio-accent-hover': '#4f46e5',// Indigo 600
        'spio-accent-light': '#e0e7ff',// Indigo 100
        'spio-mint': '#10b981',        // Emerald 500
        'spio-mint-light': '#d1fae5',  // Emerald 100
        'spio-red': '#f43f5e',         // Rose 500
        'spio-yellow': '#f59e0b',      // Amber 500
        'spio-green': '#22c55e',       // Green 500
        'spio-blue': '#3b82f6',        // Blue 500
        'spio-purple': '#8b5cf6',      // Violet 500
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'dock': '1rem',
      },
      backdropBlur: {
        'glass': '24px',
        'glass-heavy': '32px',
        'glass-premium': '28px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'premium-light': 'linear-gradient(135deg, #FAFAFA 0%, #F8FAFC 50%, #F1F5F9 100%)',
      },
      boxShadow: {
        'glass': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'dock': '0 0 0 1px rgba(226, 232, 240, 0.6), 0 4px 12px rgba(0, 0, 0, 0.04), 0 12px 40px -10px rgba(0, 0, 0, 0.08)',
        'window': '0 0 0 1px rgba(226, 232, 240, 0.5), 0 2px 4px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.03), 0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'window-lg': '0 0 0 1px rgba(226, 232, 240, 0.6), 0 4px 8px rgba(0, 0, 0, 0.03), 0 16px 48px rgba(0, 0, 0, 0.05), 0 30px 60px -20px rgba(0, 0, 0, 0.1)',
        'window-active': '0 0 0 1px rgba(226, 232, 240, 0.7), 0 2px 4px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.03), 0 20px 40px -15px rgba(0, 0, 0, 0.08), 0 0 60px rgba(99, 102, 241, 0.06)',
        'soft': '0 0 0 1px rgba(226, 232, 240, 0.5), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 0 0 1px rgba(226, 232, 240, 0.5), 0 8px 24px rgba(0, 0, 0, 0.04), 0 20px 48px -12px rgba(0, 0, 0, 0.06)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      fontSize: {
        '11': '0.6875rem',
        '12': '0.75rem',
        '13': '0.8125rem',
      },
      letterSpacing: {
        'tight-premium': '-0.02em',
      },
    },
  },
  plugins: [],
};
