import {styled} from "@macaron-css/react";
import {forwardRef, ButtonHTMLAttributes} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <StyledButton ref={ref} {...props} />,
);

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
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
    backgroundColor: "#90caf9",
    color: "#000",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#64b5f6",
    },
  },
});

const StyledIconButton = styled("button", {
  base: {
    padding: "8px",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#333",
    },
  },
});
