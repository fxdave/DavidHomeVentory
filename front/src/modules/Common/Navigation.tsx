/* eslint-disable sonarjs/no-duplicate-string */
import {styled} from "styled-system/jsx";
import {useRef, useState} from "react";
import {Boxes, LogOut, Menu, Printer, ScanLine, Search, X} from "lucide-react";
import {ROUTES} from "Router";
import {Link, NavLink} from "react-router-dom";
import {useLoggedInAuth} from "services/useAuth";
import {TextField} from "@ui/Input";
import {IconButton} from "@ui/Button";
import {BrandSticker} from "./BrandSticker";

type SearchProps = {
  value: string;
  onChange: (value: string) => void;
};

/** The top bar. With `search`, it has a search field that takes the whole bar while in use. */
export const Navigation = ({search}: {search?: SearchProps}) => {
  const auth = useLoggedInAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isSearching = !!search && (isSearchFocused || search.value !== "");

  function closeSearch() {
    search?.onChange("");
    searchInputRef.current?.blur();
  }

  return (
    <>
      <Header>
        {!isSearching && (
          <Brand to={ROUTES.ITEMS()} aria-label="HomeVentory">
            <BrandSticker />
          </Brand>
        )}
        {search && (
          <SearchField
            ref={searchInputRef}
            aria-label="Search everything"
            placeholder={isSearching ? "Search everything" : "Search"}
            enterKeyHint="search"
            value={search.value}
            onChange={e => search.onChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onKeyDown={e => {
              if (e.key === "Escape") closeSearch();
            }}
            startAdornment={<Search size={18} />}
            endAdornment={
              isSearching && (
                <IconButton
                  // Keep the focus, or the button disappears before it's clicked.
                  onMouseDown={e => e.preventDefault()}
                  onClick={closeSearch}
                  aria-label="Close search">
                  <X size={18} />
                </IconButton>
              )
            }
          />
        )}
        {!isSearching && (
          <>
            <HeaderLink to={ROUTES.QR_SCANNER} aria-label="Scan a box">
              <ScanLine size={22} />
            </HeaderLink>
            <HeaderButton
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}>
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </HeaderButton>
          </>
        )}
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
    flexShrink: 0,
    marginRight: "auto",
    textDecoration: "none",
    borderRadius: "8px",
  },
});

/** Borderless like the header's buttons, so it reads as part of the bar. */
const SearchField = styled(TextField, {
  base: {
    flex: 1,
    // Evens out the bar's padding, which is narrower on the buttons' side.
    margin: "0 8px 0 4px",
    // The field's box.
    "& > div": {
      backgroundColor: "transparent",
      borderColor: "transparent",
      color: "text.secondary",
      transition: "background-color 0.15s",
      _hover: {backgroundColor: "hover"},
      "&:focus-within": {
        borderColor: "transparent",
        backgroundColor: "transparent",
      },
    },
    "& input": {
      // 16px keeps iOS from zooming in on focus.
      fontSize: "16px",
    },
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
