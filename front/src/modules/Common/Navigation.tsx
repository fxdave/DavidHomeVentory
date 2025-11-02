/* eslint-disable sonarjs/no-duplicate-string */
import {styled} from "styled-system/jsx";
import {useState} from "react";
import {Menu, X} from "lucide-react";
import {ROUTES} from "Router";
import {Link} from "react-router-dom";
import {useLoggedInAuth} from "services/useAuth";

export const Navigation = () => {
  const auth = useLoggedInAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Header>
        <AppTitle>HomeVentory</AppTitle>
        <ToggleButton
          onClick={() => setIsOpen(!isOpen)}
          data-open={isOpen}
          aria-label={isOpen ? "Close navigation" : "Open navigation"}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </ToggleButton>
      </Header>
      <Backdrop data-open={isOpen} onClick={() => setIsOpen(false)} />
      <NavigationContainer data-open={isOpen}>
        <NavItem to={ROUTES.ITEMS()}>Items</NavItem>
        <NavItem to={ROUTES.STICKERS}>Box Sticker Generator</NavItem>
        <NavItem to={ROUTES.QR_SCANNER}>QR Code Scanner</NavItem>
        <NavButton onClick={() => auth.logout()}>Logout</NavButton>
      </NavigationContainer>
    </>
  );
};

const Header = styled("header", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    margin: "-16px -16px 16px -16px",
    backgroundColor: "paper",
    borderBottom: "token(1px solid {colors.border})",
    "@media (max-width: 600px)": {
      padding: "8px 12px",
      margin: "-8px -8px 8px -8px",
    },
  },
});

const AppTitle = styled("h1", {
  base: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 600,
    color: "text.primary",
    "@media (max-width: 600px)": {
      fontSize: "18px",
    },
  },
});

const Backdrop = styled("div", {
  base: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: 999,
    transition: "opacity 0.3s ease",
    opacity: 0,
    pointerEvents: "none",
    "&[data-open='true']": {
      opacity: 1,
      pointerEvents: "auto",
    },
  },
});

const ToggleButton = styled("button", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    color: "text.primary",
    _hover: {
      backgroundColor: "hover",
    },
  },
});

const NavigationContainer = styled("div", {
  base: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "280px",
    padding: "24px 1rem",
    backgroundColor: "paper",
    borderRight: "token(1px solid {colors.border})",
    boxShadow: "4px 0 12px rgba(0, 0, 0, 0.3)",
    transition: "transform 0.3s ease",
    zIndex: 1000,
    overflowY: "auto",
    "@media (max-width: 600px)": {
      width: "calc(100% - 72px)",
      padding: "16px 0.5rem",
    },
    "&[data-open='true']": {
      transform: "translateX(0)",
    },
    "&[data-open='false']": {
      transform: "translateX(-100%)",
    },
  },
});

const NavItem = styled(Link, {
  base: {
    display: "block",
    padding: "12px 16px",
    textDecoration: "none",
    color: "text.primary",
    fontSize: "14px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    _hover: {
      backgroundColor: "hover",
    },
    "@media (max-width: 600px)": {
      padding: "10px 12px",
      fontSize: "13px",
    },
  },
});

const NavButton = styled("button", {
  base: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    textAlign: "left",
    border: "none",
    backgroundColor: "transparent",
    color: "text.primary",
    fontSize: "14px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    _hover: {
      backgroundColor: "hover",
    },
    "@media (max-width: 600px)": {
      padding: "10px 12px",
      fontSize: "13px",
    },
  },
});
