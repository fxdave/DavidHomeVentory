import {styled, keyframes} from "@macaron-css/react";
import {colors} from "./theme";

type SpinnerProps = {
  size?: "small" | "medium" | "large";
};

export const Spinner = ({size = "medium"}: SpinnerProps) => (
  <StyledSpinner data-size={size} role="status" aria-label="Loading">
    <Circle />
  </StyledSpinner>
);

const spin = keyframes({
  "0%": {transform: "rotate(0deg)"},
  "100%": {transform: "rotate(360deg)"},
});

const StyledSpinner = styled("div", {
  base: {
    display: "inline-block",
  },
  variants: {
    size: {
      small: {
        width: "16px",
        height: "16px",
      },
      medium: {
        width: "24px",
        height: "24px",
      },
      large: {
        width: "40px",
        height: "40px",
      },
    },
  },
});

const Circle = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    border: `2px solid ${colors.border}`,
    borderTopColor: colors.primary,
    borderRadius: "50%",
    animation: `${spin} 0.6s linear infinite`,
  },
});
