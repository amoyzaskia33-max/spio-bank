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
        // Soft Light Pastel Theme - Nordic Morning
        'spio-base': '#F8FAFC',        // Slate 50
        'spio-surface': '#FFFFFF',     // White
        'spio-overlay': '#F1F5F9',     // Slate 100
        'spio-text': '#475569',        // Slate 700
        'spio-text-subtle': '#64748b', // Slate 500
        'spio-text-muted': '#94a3b8',  // Slate 400
        'spio-accent': '#6366f1',      // Indigo 500
        'spio-accent-hover': '#4f46e5',// Indigo 600
        'spio-accent-light': '#e0e7ff',// Indigo 100
        'spio-mint': '#10b981',        // Emerald 500
        'spio-mint-light': '#d1fae5',  // Emerald 100
        'spio-red': '#fb7185',         // Rose 400
        'spio-yellow': '#fbbf24',      // Amber 400
        'spio-green': '#34d399',       // Emerald 400
        'spio-blue': '#60a5fa',        // Blue 400
        'spio-purple': '#a78bfa',      // Violet 400
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
        'light-pastel': 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 50%, #E8F0F6 100%)',
      },
      boxShadow: {
        'glass': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'dock': '0 12px 40px rgba(0, 0, 0, 0.06)',
        'window': '0 0 0 1px rgba(226, 232, 240, 0.5), 0 8px 30px rgba(0, 0, 0, 0.04)',
        'window-lg': '0 0 0 1px rgba(226, 232, 240, 0.6), 0 16px 50px rgba(0, 0, 0, 0.06)',
        'window-active': '0 0 0 1px rgba(226, 232, 240, 0.7), 0 8px 30px rgba(0, 0, 0, 0.05), 0 0 50px rgba(99, 102, 241, 0.08)',
        'soft': '0 4px 20px rgba(0, 0, 0, 0.03)',
        'soft-lg': '0 8px 40px rgba(0, 0, 0, 0.05)',
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
