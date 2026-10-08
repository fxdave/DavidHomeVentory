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
          background: {value: "#15171c"},
          paper: {value: "#1d2027"},
          raised: {value: "#252932"},
          border: {value: "#2e333d"},
          hover: {value: "#ffffff0f"},
          primary: {value: "#eceef2"},
          primaryHover: {value: "#ffffff"},
          primaryDark: {value: "#cfd3db"},
          secondary: {value: "#9098a6"},
          error: {value: "#f0716a"},
          errorHover: {value: "#e0554d"},
          warning: {value: "#f2b45c"},
          warningHover: {value: "#e09a3a"},
          success: {value: "#6cc58f"},
          // Cardboard, from the box in the logo.
          cardboard: {value: "#221e1c"},
          cardboardEdge: {value: "#5a3d27"},
          cardboardLight: {value: "#c88a52"},
          text: {
            primary: {value: "#eceef2"},
            secondary: {value: "#9098a6"},
            disabled: {value: "#5c6370"},
          },
        },
        fonts: {
          body: {
            value:
              '"Atkinson Hyperlegible Next Variable", system-ui, sans-serif',
          },
          label: {value: '"SourceCodePro", ui-monospace, monospace'},
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
    "html, body": {
      margin: 0,
      backgroundColor: "background",
      color: "text.primary",
      fontFamily: "body",
      fontSize: "15px",
      lineHeight: 1.4,
      WebkitTapHighlightColor: "transparent",
    },
    "*": {boxSizing: "border-box"},
    ":focus-visible": {
      outline: "2px solid token(colors.primary)",
      outlineOffset: "2px",
    },
    "@media (prefers-reduced-motion: reduce)": {
      "*": {transition: "none !important", animation: "none !important"},
    },
    "@keyframes spin": {
      "0%": {transform: "rotate(0deg)"},
      "100%": {transform: "rotate(360deg)"},
    },
  },
});
