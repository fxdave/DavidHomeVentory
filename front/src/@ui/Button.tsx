import {styled} from "styled-system/jsx";
import {forwardRef, ButtonHTMLAttributes} from "react";

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
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    "&[data-variant='primary']": {
      backgroundColor: "primary",
      color: "#000",
      _hover: {
        _disabled: {},
        backgroundColor: "primaryHover",
      },
      _active: {
        _disabled: {},
        backgroundColor: "primaryDark",
      },
    },
    "&[data-variant='secondary']": {
      backgroundColor: "paper",
      color: "text.primary",
      border: "1px solid token(colors.border)",
      _hover: {
        _disabled: {},
        backgroundColor: "hover",
        borderColor: "secondary",
      },
    },
    "&[data-variant='outlined']": {
      backgroundColor: "transparent",
      color: "primary",
      border: "1px solid token(colors.primary)",
      _hover: {
        _disabled: {},
        backgroundColor: "rgba(144, 202, 249, 0.13)",
        borderColor: "primaryHover",
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
    color: "text.primary",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
    _hover: {
      _disabled: {},
      backgroundColor: "hover",
    },
    _active: {
      _disabled: {},
      backgroundColor: "border",
    },
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      color: "text.disabled",
    },
  },
});
