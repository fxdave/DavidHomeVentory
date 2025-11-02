import {styled} from "styled-system/jsx";
import {ChevronRight} from "lucide-react";

type BreadcrumbItem = {
  label: string;
  onClick: () => void;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({items}: BreadcrumbsProps) => {
  return (
    <StyledBreadcrumbs>
      {items.map((item, index) => (
        <BreadcrumbWrapper key={index}>
          <BreadcrumbButton onClick={item.onClick}>
            {item.label}
          </BreadcrumbButton>
          {index < items.length - 1 && (
            <Separator>
              <ChevronRight size={16} />
            </Separator>
          )}
        </BreadcrumbWrapper>
      ))}
    </StyledBreadcrumbs>
  );
};

const StyledBreadcrumbs = styled("nav", {
  base: {
    display: "flex",
    alignItems: "center",
    padding: "8px 0",
    color: "text.secondary",
    flexWrap: "wrap",
  },
});

const BreadcrumbWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
});

const BreadcrumbButton = styled("button", {
  base: {
    background: "transparent",
    border: "none",
    color: "text.secondary",
    cursor: "pointer",
    padding: "4px 8px",
    fontSize: "14px",
    borderRadius: "4px",
    transition: "background-color 0.2s, color 0.2s",
    _hover: {
      backgroundColor: "hover",
      color: "text.primary",
    },
  },
});

const Separator = styled("span", {
  base: {
    display: "flex",
    alignItems: "center",
    color: "text.disabled",
  },
});
