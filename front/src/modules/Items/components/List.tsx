import {styled} from "@macaron-css/react";
import {ReactNode, HTMLAttributes} from "react";

type ListProps = {
  children: ReactNode;
};

type ListItemProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLLIElement>;

type ListItemButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

type ListItemTextProps = {
  primary: ReactNode;
  secondary?: ReactNode;
  onClick?: () => void;
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

export const ListItem = ({children, className, ...props}: ListItemProps) => (
  <StyledListItem className={className} {...props}>
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

export const ListItemText = ({
  primary,
  secondary,
  onClick,
}: ListItemTextProps) => (
  <TextWrapper onClick={onClick}>
    <Primary>{primary}</Primary>
    {secondary && <Secondary>{secondary}</Secondary>}
  </TextWrapper>
);

export const ListItemAvatar = ({children}: ListItemAvatarProps) => (
  <div>{children}</div>
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
    alignItems: "center",
    padding: "8px 16px",
    borderBottom: "1px solid #333",
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
    ":hover": {
      backgroundColor: "#333",
    },
    ":disabled": {
      opacity: 0.5,
      cursor: "not-allowed",
    },
  },
});

const TextWrapper = styled("div", {
  base: {
    flex: 1,
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
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#90caf9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "16px",
    color: "#000",
  },
});
