/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      "colors": {
        // Primary uses CSS vars so the accent color updates live without rebuild
        "primary": {
          DEFAULT: "rgb(var(--p-500) / <alpha-value>)",
          "50":  "rgb(var(--p-50)  / <alpha-value>)",
          "100": "rgb(var(--p-100) / <alpha-value>)",
          "200": "rgb(var(--p-200) / <alpha-value>)",
          "300": "rgb(var(--p-300) / <alpha-value>)",
          "400": "rgb(var(--p-400) / <alpha-value>)",
          "500": "rgb(var(--p-500) / <alpha-value>)",
          "600": "rgb(var(--p-600) / <alpha-value>)",
          "700": "rgb(var(--p-700) / <alpha-value>)",
          "800": "rgb(var(--p-800) / <alpha-value>)",
          "900": "rgb(var(--p-900) / <alpha-value>)",
          "container": "rgb(var(--p-100) / <alpha-value>)",
          "fixed":     "rgb(var(--p-200) / <alpha-value>)",
        },
        "secondary": {
          DEFAULT: "#6366f1",
          "50": "#eef2ff",
          "100": "#e0e7ff",
          "200": "#c7d2fe",
          "300": "#a5b4fc",
          "400": "#818cf8",
          "500": "#6366f1",
          "600": "#4f46e5",
          "container": "#e0e7ff",
          "fixed": "#c7d2fe",
        },
        "tertiary": {
          DEFAULT: "#f59e0b",
          "container": "#fef3c7",
          "fixed": "#fde68a",
        },
        "error": {
          DEFAULT: "#ef4444",
          "container": "#fee2e2",
        },
        "background": "#f8fafc",
        "surface": {
          DEFAULT: "#ffffff",
          "variant": "#f1f5f9",
          "dim": "#e2e8f0",
          "bright": "#ffffff",
          "container": {
            DEFAULT: "#f8fafc",
            "low": "#ffffff",
            "high": "#f1f5f9",
            "highest": "#e2e8f0",
            "lowest": "#ffffff",
          }
        },
        "on": {
          "primary": "#ffffff",
          "primary-container": "#4c1d95",
          "primary-fixed": "#5b21b6",
          "primary-fixed-variant": "#6d28d9",
          "secondary": "#ffffff",
          "secondary-container": "#1e293b",
          "secondary-fixed": "#3730a3",
          "secondary-fixed-variant": "#4338ca",
          "tertiary": "#ffffff",
          "tertiary-container": "#92400e",
          "tertiary-fixed": "#b45309",
          "tertiary-fixed-variant": "#d97706",
          "surface": "#0f172a",
          "surface-variant": "#475569",
          "error": "#ffffff",
          "error-container": "#991b1b",
          "background": "#0f172a",
        },
        "outline": "#cbd5e1",
        "outline-variant": "#e2e8f0",
        "inverse-surface": "#1e293b",
        "inverse-on-surface": "#f8fafc",
        "inverse-primary": "#c4b5fd",
      },
      "borderRadius": {
        "DEFAULT": "0.375rem",
        "sm": "0.25rem",
        "md": "0.5rem",
        "lg": "0.625rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      "spacing": {
        "container-padding": "24px",
        "base": "8px",
        "gutter": "16px",
        "toolbar-height": "64px",
        "sidebar-width": "280px"
      },
      "fontFamily": {
        "label-md": ["Inter"],
        "headline-lg-mobile": ["Inter"],
        "headline-md": ["Inter"],
        "headline-xl": ["Inter"],
        "label-sm": ["Inter"],
        "headline-lg": ["Inter"],
        "body-lg": ["Inter"],
        "body-md": ["Inter"]
      },
      "fontSize": {
        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "600"}],
        "headline-lg-mobile": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
        "headline-md": ["20px", {"lineHeight": "28px", "fontWeight": "600"}],
        "headline-xl": ["36px", {"lineHeight": "44px", "letterSpacing": "-0.02em", "fontWeight": "700"}],
        "label-sm": ["11px", {"lineHeight": "14px", "fontWeight": "500"}],
        "headline-lg": ["28px", {"lineHeight": "36px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}]
      }
    }
  },
  plugins: [],
}
