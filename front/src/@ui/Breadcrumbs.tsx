import {styled} from "styled-system/jsx";
import {ChevronRight} from "lucide-react";
import {useEffect, useRef} from "react";

type BreadcrumbItem = {
  label: string;
  onClick: () => void;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export const Breadcrumbs = ({items}: BreadcrumbsProps) => {
  const ref = useRef<HTMLOListElement>(null);

  // Keep the deepest crumb in view when the path is wider than the screen.
  useEffect(() => {
    ref.current?.scrollTo({left: ref.current.scrollWidth});
  }, [items.length]);

  return (
    <StyledBreadcrumbs aria-label="Location">
      <List ref={ref}>
        {items.map((item, index) => (
          <Crumb key={index}>
            <BreadcrumbButton type="button" onClick={item.onClick}>
              {item.label}
            </BreadcrumbButton>
            <Separator aria-hidden>
              <ChevronRight size={14} />
            </Separator>
          </Crumb>
        ))}
      </List>
    </StyledBreadcrumbs>
  );
};

const StyledBreadcrumbs = styled("nav", {
  base: {
    minWidth: 0,
  },
});

const List = styled("ol", {
  base: {
    display: "flex",
    alignItems: "center",
    margin: 0,
    padding: 0,
    listStyle: "none",
    overflowX: "auto",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {display: "none"},
  },
});

const Crumb = styled("li", {
  base: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
});

const BreadcrumbButton = styled("button", {
  base: {
    background: "transparent",
    border: "none",
    color: "text.secondary",
    cursor: "pointer",
    padding: "4px 6px",
    margin: "0 -2px",
    fontFamily: "inherit",
    fontSize: "13px",
    borderRadius: "6px",
    whiteSpace: "nowrap",
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
