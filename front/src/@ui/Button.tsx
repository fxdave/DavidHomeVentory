import {styled} from "@macaron-css/react";
import {forwardRef, ButtonHTMLAttributes} from "react";
import {colors} from "./theme";

type ButtonVariant = "primary" | "secondary" | "outlined";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  "aria-label"?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({variant = "primary", ...props}, ref) => (
    <StyledButton ref={ref} data-variant={variant} {...props} />
  ),
);

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => <StyledIconButton ref={ref} {...props} />,
);

const StyledButton = styled("button", {
  base: {
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "uppercase",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s",
    minHeight: "36px",
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: colors.primary,
        color: "#000",
        "&:hover:not(:disabled)": {
          backgroundColor: colors.primaryHover,
        },
        "&:active:not(:disabled)": {
          backgroundColor: colors.primaryDark,
        },
      },
      secondary: {
        backgroundColor: colors.paper,
        color: colors.text.primary,
        border: `1px solid ${colors.border}`,
        "&:hover:not(:disabled)": {
          backgroundColor: colors.hover,
          borderColor: colors.secondary,
        },
      },
      outlined: {
        backgroundColor: "transparent",
        color: colors.primary,
        border: `1px solid ${colors.primary}`,
        "&:hover:not(:disabled)": {
          backgroundColor: `${colors.primary}22`,
          borderColor: colors.primaryHover,
        },
      },
    },
  },
});

const StyledIconButton = styled("button", {
  base: {
    minWidth: "44px",
    minHeight: "44px",
    padding: "12px",
    border: "none",
    borderRadius: "10%",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: colors.text.primary,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
    "&:hover:not(:disabled)": {
      backgroundColor: colors.hover,
    },
    "&:active:not(:disabled)": {
      backgroundColor: colors.border,
    },
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
      color: colors.text.disabled,
    },
  },
});
