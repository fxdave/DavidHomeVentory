/* eslint-disable sonarjs/no-duplicate-string */
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
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "0 16px",
    minHeight: "40px",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: 600,
    border: "1px solid transparent",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.15s, border-color 0.15s",
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    "&[data-variant='primary']": {
      backgroundColor: "primary",
      color: "background",
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
      backgroundColor: "raised",
      color: "text.primary",
      _hover: {
        _disabled: {},
        backgroundColor: "border",
      },
    },
    "&[data-variant='outlined']": {
      backgroundColor: "transparent",
      color: "text.primary",
      borderColor: "border",
      _hover: {
        _disabled: {},
        backgroundColor: "hover",
      },
    },
  },
});

const StyledIconButton = styled("button", {
  base: {
    width: "40px",
    height: "40px",
    flexShrink: 0,
    padding: 0,
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "text.secondary",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.15s, color 0.15s",
    _hover: {
      _disabled: {},
      backgroundColor: "hover",
      color: "text.primary",
    },
    _active: {
      _disabled: {},
      backgroundColor: "border",
    },
    _disabled: {
      cursor: "not-allowed",
      color: "text.disabled",
      opacity: 0.4,
    },
  },
});
