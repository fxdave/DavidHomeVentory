import {styled} from "@macaron-css/react";
import {ReactNode} from "react";

type BreadcrumbsProps = {
  children: ReactNode;
};

export const Breadcrumbs = ({children}: BreadcrumbsProps) => (
  <StyledBreadcrumbs>{children}</StyledBreadcrumbs>
);

const StyledBreadcrumbs = styled("nav", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 0",
    color: "#b0b0b0",
  },
});
