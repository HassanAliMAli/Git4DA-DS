import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'monospace'],
      },
      colors: {
        'ink': '#0a0b0f',
        'ink-2': '#0f1117',
        'ink-3': '#151924',
        'sage': '#0ea5a3',
        'sage-ink': '#0b3b3a',
        'amber': '#f59e0b',
        'violet': '#8b5cf6',
      },
      boxShadow: {
        'glow': '0 0 0 1px rgba(14,165,163,0.15), 0 8px 40px rgba(14,165,163,0.12), 0 2px 8px rgba(0,0,0,0.4)',
        'glow-violet': '0 0 0 1px rgba(139,92,246,0.18), 0 8px 40px rgba(139,92,246,0.15)',
        'terminal': '0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.03)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
