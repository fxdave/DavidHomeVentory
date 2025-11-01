import {styled} from "@macaron-css/react";
import {ROUTES} from "Router";
import {Link} from "react-router-dom";
import {useLoggedInAuth} from "services/useAuth";
import {Button} from "@ui/Button";
import {Divider} from "@ui/Divider";

export const Navigation = () => {
  const auth = useLoggedInAuth();
  return (
    <NavigationContainer>
      <StyledDivider>HomeVentory</StyledDivider>
      <StyledLink to={ROUTES.ITEMS()}>
        <StyledButton>Items</StyledButton>
      </StyledLink>
      <StyledLink to={ROUTES.STICKERS}>
        <StyledButton>Box Sticker Generator</StyledButton>
      </StyledLink>
      <StyledLink to={ROUTES.QR_SCANNER}>
        <StyledButton>QR Code Scanner</StyledButton>
      </StyledLink>
      <LogoutButton onClick={() => auth.logout()}>Logout</LogoutButton>
    </NavigationContainer>
  );
};

const NavigationContainer = styled("div", {
  base: {
    width: "100%",
    padding: "1rem",
  },
});

const StyledDivider = styled(Divider, {
  base: {
    marginBottom: "0.5rem",
  },
});

const StyledLink = styled(Link, {
  base: {
    textDecoration: "none",
    display: "block",
  },
});

const StyledButton = styled(Button, {
  base: {
    width: "100%",
  },
});

const LogoutButton = styled(Button, {
  base: {
    width: "100%",
    backgroundColor: "#ff9800",
    ":hover": {
      backgroundColor: "#f57c00",
    },
  },
});
