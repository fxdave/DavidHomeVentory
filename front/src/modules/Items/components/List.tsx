import {styled} from "styled-system/jsx";
import {ReactNode, HTMLAttributes} from "react";

type ListProps = {
  children: ReactNode;
};

type ListItemProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
} & HTMLAttributes<HTMLLIElement>;

type ListItemTextProps = {
  primary: ReactNode;
  secondary?: ReactNode;
  className?: string;
};

export const List = ({children}: ListProps) => (
  <StyledList>{children}</StyledList>
);

export const ListItem = ({
  children,
  className,
  onClick,
  disabled,
  ...props
}: ListItemProps) => (
  <StyledListItem
    className={className}
    onClick={onClick}
    data-clickable={!!onClick}
    data-disabled={disabled}
    {...props}>
    {children}
  </StyledListItem>
);

export const ListItemText = ({
  primary,
  secondary,
  className,
}: ListItemTextProps) => (
  <TextWrapper className={className}>
    <Primary>{primary}</Primary>
    {secondary && <Secondary>{secondary}</Secondary>}
  </TextWrapper>
);

const StyledList = styled("ul", {
  base: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
});

const StyledListItem = styled("li", {
  base: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    minHeight: "56px",
    // The buttons sit 8px from the right edge, as far as from the top and bottom of a 56px row.
    padding: "6px 8px 6px 12px",
    "&[data-clickable='true']": {
      cursor: "pointer",
    },
    // A rounded overlay, so plain rows highlight like the box cards.
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "10px",
      pointerEvents: "none",
      transition: "background-color 0.15s",
    },
    "&[data-clickable='true']:hover:not([data-disabled='true'])::after": {
      backgroundColor: "hover",
    },
    "&[data-disabled='true']": {
      opacity: 0.4,
      cursor: "not-allowed",
    },
  },
});

const TextWrapper = styled("div", {
  base: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "2px",
  },
});

const Primary = styled("div", {
  base: {
    color: "text.primary",
    overflowWrap: "anywhere",
  },
});

const Secondary = styled("div", {
  base: {
    fontSize: "13px",
    color: "text.secondary",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});
