import {styled} from "@macaron-css/react";
import {ReactNode} from "react";

type AlertProps = {
  children: ReactNode;
  severity?: "error" | "warning" | "info" | "success";
};

export const Alert = ({children, severity = "info"}: AlertProps) => {
  return <StyledAlert data-severity={severity}>{children}</StyledAlert>;
};

const StyledAlert = styled("div", {
  base: {
    padding: "12px 16px",
    borderRadius: "4px",
    border: "1px solid",
  },
  variants: {
    severity: {
      error: {
        backgroundColor: "#d32f2f33",
        color: "#f44336",
        borderColor: "#f44336",
      },
      warning: {
        backgroundColor: "#ff980033",
        color: "#ff9800",
        borderColor: "#ff9800",
      },
      info: {
        backgroundColor: "#2196f333",
        color: "#2196f3",
        borderColor: "#2196f3",
      },
      success: {
        backgroundColor: "#4caf5033",
        color: "#4caf50",
        borderColor: "#4caf50",
      },
    },
  },
});
