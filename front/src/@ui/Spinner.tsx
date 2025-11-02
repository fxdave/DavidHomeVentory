import {styled} from "styled-system/jsx";

type SpinnerProps = {
  size?: "small" | "medium" | "large";
};

export const Spinner = ({size = "medium"}: SpinnerProps) => (
  <StyledSpinner data-size={size} role="status" aria-label="Loading">
    <Circle />
  </StyledSpinner>
);

const StyledSpinner = styled("div", {
  base: {
    display: "inline-block",
    "&[data-size='small']": {
      width: "16px",
      height: "16px",
    },
    "&[data-size='medium']": {
      width: "24px",
      height: "24px",
    },
    "&[data-size='large']": {
      width: "40px",
      height: "40px",
    },
  },
});

const Circle = styled("div", {
  base: {
    width: "100%",
    height: "100%",
    border: "2px solid token(colors.border)",
    borderTopColor: "primary",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },
});
