import styled from "@emotion/styled";
import {Button, Divider} from "@mui/material";
import {ROUTES} from "Router";
import {Link} from "react-router-dom";
import {useLoggedInAuth} from "services/useAuth";

export const Navigation = () => {
  const auth = useLoggedInAuth();
  return (
    <NavigationContainer>
      <Divider sx={{marginBottom: "0.5rem"}}>HomeVentory</Divider>
      <Link to={ROUTES.ITEMS()}>
        <Button fullWidth>Items</Button>
      </Link>
      <Link to={ROUTES.STICKERS}>
        <Button fullWidth>Box Sticker Generator</Button>
      </Link>
      <Button onClick={() => auth.logout()} fullWidth color="warning">
        Logout
      </Button>
    </NavigationContainer>
  );
};

const NavigationContainer = styled("div")({
  width: "100%",
  padding: "1rem",
});
