import {defineConfig} from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          background: {value: "#121212"},
          paper: {value: "#1e1e1e"},
          border: {value: "#333"},
          hover: {value: "#ffffff2a"},
          primary: {value: "#90caf9"},
          primaryHover: {value: "#64b5f6"},
          primaryDark: {value: "#42a5f5"},
          secondary: {value: "#b0b0b0"},
          error: {value: "#f44336"},
          errorHover: {value: "#d32f2f"},
          warning: {value: "#ff9800"},
          warningHover: {value: "#f57c00"},
          success: {value: "#4caf50"},
          text: {
            primary: {value: "#ffffff"},
            secondary: {value: "#b0b0b0"},
            disabled: {value: "#666"},
          },
        },
        spacing: {
          xs: {value: "4px"},
          sm: {value: "8px"},
          md: {value: "16px"},
          lg: {value: "24px"},
          xl: {value: "32px"},
        },
      },
      semanticTokens: {
        colors: {
          bg: {
            DEFAULT: {value: "{colors.background}"},
            paper: {value: "{colors.paper}"},
          },
          border: {
            DEFAULT: {value: "{colors.border}"},
          },
        },
      },
    },
  },

  // Enable JSX style props
  jsxFramework: "react",

  // The output directory for your css system
  outdir: "styled-system",

  // Global styles and animations
  globalCss: {
    "@keyframes spin": {
      "0%": {transform: "rotate(0deg)"},
      "100%": {transform: "rotate(360deg)"},
    },
  },
});
