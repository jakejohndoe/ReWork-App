import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark minimal color system
        background: '#0A0A0B',
        foreground: '#E8E8ED',
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          foreground: '#E8E8ED'
        },
        popover: {
          DEFAULT: 'rgba(255, 255, 255, 0.03)',
          foreground: '#E8E8ED'
        },
        primary: {
          DEFAULT: '#FFFFFF',
          foreground: '#0A0A0B',
        },
        secondary: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          foreground: '#E8E8ED',
        },
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.25)',
          foreground: 'rgba(255, 255, 255, 0.45)'
        },
        accent: {
          DEFAULT: '#34D399',
          foreground: '#0A0A0B'
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF'
        },
        border: 'rgba(255, 255, 255, 0.08)',
        input: 'rgba(255, 255, 255, 0.06)',
        ring: 'rgba(255, 255, 255, 0.2)',

        // Additional colors
        success: '#34D399',
        error: '#EF4444',
        premium: 'rgba(99, 102, 241, 0.8)',
        surface: 'rgba(255, 255, 255, 0.03)',
        'text-primary': '#E8E8ED',
        'text-secondary': 'rgba(255, 255, 255, 0.45)',
        'text-muted': 'rgba(255, 255, 255, 0.25)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'label': '11px',
        'body-sm': '12px',
        'body': '13px',
        'section': '14px',
        'header': '15px',
        'title': '18px',
      },
      letterSpacing: {
        'tight': '-0.3px',
        'normal': '-0.01em',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config