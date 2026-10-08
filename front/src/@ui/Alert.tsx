import {styled} from "styled-system/jsx";
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
    padding: "10px 12px",
    borderRadius: "8px",
    borderLeft: "4px solid",
    backgroundColor: "paper",
    color: "text.primary",
    "&[data-severity='error']": {borderColor: "error"},
    "&[data-severity='warning']": {borderColor: "warning"},
    "&[data-severity='info']": {borderColor: "secondary"},
    "&[data-severity='success']": {borderColor: "success"},
  },
});
