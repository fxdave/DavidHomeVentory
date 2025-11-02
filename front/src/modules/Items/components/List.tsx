import {styled} from "@macaron-css/react";
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

type ListItemButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

type ListItemTextProps = {
  primary: ReactNode;
  secondary?: ReactNode;
};

type ListItemAvatarProps = {
  children: ReactNode;
};

type AvatarProps = {
  children: ReactNode;
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

export const ListItemButton = ({
  children,
  onClick,
  disabled,
}: ListItemButtonProps) => (
  <StyledListItemButton onClick={onClick} disabled={disabled}>
    {children}
  </StyledListItemButton>
);

export const ListItemText = ({primary, secondary}: ListItemTextProps) => (
  <TextWrapper>
    <Primary>{primary}</Primary>
    {secondary && <Secondary>{secondary}</Secondary>}
  </TextWrapper>
);

export const ListItemAvatar = ({children}: ListItemAvatarProps) => (
  <AvatarWrapper>{children}</AvatarWrapper>
);

export const Avatar = ({children}: AvatarProps) => (
  <StyledAvatar>{children}</StyledAvatar>
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
    display: "flex",
    alignItems: "stretch",
    padding: "8px 16px",
    borderBottom: "1px solid #333",
    transition: "background-color 0.2s",
    selectors: {
      '&[data-clickable="true"]': {
        cursor: "pointer",
      },
      '&[data-clickable="true"]:hover:not([data-disabled="true"])': {
        backgroundColor: "#2a2a2a",
      },
      '&[data-disabled="true"]': {
        opacity: 0.5,
        cursor: "not-allowed",
      },
    },
  },
});

const AvatarWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
  },
});

const StyledListItemButton = styled("button", {
  base: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    padding: "8px",
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
    transition: "background-color 0.2s",
    "&:disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
});

const TextWrapper = styled("div", {
  base: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

const Primary = styled("div", {
  base: {
    color: "#fff",
  },
});

const Secondary = styled("div", {
  base: {
    fontSize: "12px",
    color: "#b0b0b0",
  },
});

const StyledAvatar = styled("div", {
  base: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#90caf9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "8px",
    color: "#000",
    flexShrink: 0,
  },
});
