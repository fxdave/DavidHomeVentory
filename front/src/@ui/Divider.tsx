/* eslint-disable sonarjs/no-duplicate-string */
import {styled} from "styled-system/jsx";
import {ReactNode} from "react";

type DividerProps = {
  children?: ReactNode;
};

export const Divider = ({children}: DividerProps) => {
  if (children) {
    return <StyledDividerWithText>{children}</StyledDividerWithText>;
  }
  return <StyledDivider />;
};

const StyledDivider = styled("hr", {
  base: {
    border: "none",
    borderTop: "1px solid #333",
    margin: "24px 0",
  },
});

const StyledDividerWithText = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    margin: "24px 0",
    color: "#b0b0b0",
    "&::before": {
      content: '""',
      flex: 1,
      borderBottom: "1px solid #333",
      marginRight: "8px",
    },
    "&::after": {
      content: '""',
      flex: 1,
      borderBottom: "1px solid #333",
      marginLeft: "8px",
    },
  },
});
