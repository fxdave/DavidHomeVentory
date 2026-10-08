/* eslint-disable sonarjs/no-duplicate-string */
import {styled} from "styled-system/jsx";
import {useState} from "react";
import {Boxes, LogOut, Menu, Printer, ScanLine, X} from "lucide-react";
import {ROUTES} from "Router";
import {Link, NavLink} from "react-router-dom";
import {useLoggedInAuth} from "services/useAuth";

export const Navigation = () => {
  const auth = useLoggedInAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Header>
        <Brand to={ROUTES.ITEMS()}>
          <img src="/favicon.svg" alt="" width={32} height={32} />
          HomeVentory
        </Brand>
        <HeaderLink to={ROUTES.QR_SCANNER} aria-label="Scan a box">
          <ScanLine size={22} />
        </HeaderLink>
        <HeaderButton
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close menu" : "Open menu"}>
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </HeaderButton>
      </Header>
      <Backdrop data-open={isOpen} onClick={() => setIsOpen(false)} />
      <Drawer data-open={isOpen} aria-hidden={!isOpen}>
        <NavItem to={ROUTES.ITEMS()} onClick={() => setIsOpen(false)}>
          <Boxes size={20} /> Boxes
        </NavItem>
        <NavItem to={ROUTES.QR_SCANNER} onClick={() => setIsOpen(false)}>
          <ScanLine size={20} /> Scan a box
        </NavItem>
        <NavItem to={ROUTES.STICKERS} onClick={() => setIsOpen(false)}>
          <Printer size={20} /> Print stickers
        </NavItem>
        <DrawerSpacer />
        <NavButton onClick={() => auth.logout()}>
          <LogOut size={20} /> Log out
        </NavButton>
      </Drawer>
    </>
  );
};

const Header = styled("header", {
  base: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: "4px",
    height: "56px",
    padding: "0 8px 0 16px",
    margin: "0 -16px",
    backgroundColor: "background",
    borderBottom: "1px solid token(colors.border)",
    "@media print": {display: "none"},
  },
});

const Brand = styled(Link, {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginRight: "auto",
    fontSize: "18px",
    fontWeight: 700,
    color: "text.primary",
    textDecoration: "none",
    borderRadius: "8px",
  },
});

const headerButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "44px",
  height: "44px",
  padding: 0,
  border: "none",
  borderRadius: "8px",
  backgroundColor: "transparent",
  color: "text.primary",
  cursor: "pointer",
  _hover: {backgroundColor: "hover"},
} as const;

const HeaderButton = styled("button", {base: headerButtonStyle});
const HeaderLink = styled(Link, {base: headerButtonStyle});

const Backdrop = styled("div", {
  base: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    transition: "opacity 0.2s ease",
    opacity: 0,
    pointerEvents: "none",
    "&[data-open='true']": {
      opacity: 1,
      pointerEvents: "auto",
    },
  },
});

const Drawer = styled("nav", {
  base: {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: "min(280px, calc(100% - 56px))",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "16px 8px",
    backgroundColor: "paper",
    borderLeft: "1px solid token(colors.border)",
    transition: "transform 0.2s ease, visibility 0.2s",
    zIndex: 1000,
    overflowY: "auto",
    "&[data-open='true']": {
      transform: "translateX(0)",
      visibility: "visible",
    },
    "&[data-open='false']": {
      transform: "translateX(100%)",
      visibility: "hidden",
    },
  },
});

const navItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  width: "100%",
  minHeight: "44px",
  padding: "0 12px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "transparent",
  color: "text.primary",
  fontFamily: "inherit",
  fontSize: "15px",
  fontWeight: 600,
  textAlign: "left",
  textDecoration: "none",
  cursor: "pointer",
  _hover: {backgroundColor: "hover"},
} as const;

const NavItem = styled(NavLink, {
  base: {
    ...navItemStyle,
    "&.active": {backgroundColor: "raised"},
  },
});

const NavButton = styled("button", {
  base: {
    ...navItemStyle,
    color: "text.secondary",
  },
});

const DrawerSpacer = styled("div", {
  base: {flex: 1},
});
