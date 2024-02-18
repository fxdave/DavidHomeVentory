import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "Router";
import {useAuth} from "services/useAuth";
import Logo from "../../assets/rgb-cube.svg";

type IFields = {
  target: string;
  password: string;
};

const API_TARGET_KEY = "API_TARGET";

export default function LoginPage() {
  const {handleSubmit, register, setError} = useForm<IFields>({
    defaultValues: async () => ({
      target: localStorage.getItem(API_TARGET_KEY) || "",
      password: "",
    }),
  });
  const auth = useAuth();
  const navigate = useNavigate();
  const onSubmit = handleSubmit(data => {
    auth
      .login(data.target, data.password)
      .then(isSuccess => {
        localStorage.setItem(API_TARGET_KEY, data.target);

        if (isSuccess) {
          navigate(ROUTES.ITEMS(""));
        } else {
          setError("root", {
            message: "Couldn't log in",
          });
        }
      })
      .catch(e => {
        setError("root", {
          message: e instanceof Error ? e.message : e,
        });
      });
  });
  return (
    <Container maxWidth="xs">
      <img
        src={Logo}
        alt=""
        style={{
          zIndex: -1,
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          margin: "auto",
          opacity: "0.1",
        }}
      />
      <Typography
        variant="h3"
        component="h1"
        align="center"
        sx={{mt: 3, mb: 3}}
        fontWeight="bold"
        noWrap>
        HomeVentory
      </Typography>
      <Divider variant="middle" sx={{m: 3}}>
        Login
      </Divider>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{flexDirection: "column", display: "flex", gap: 2}}>
        {!auth.isLoggedIn && auth.error && (
          <Alert severity="error">{auth.error}</Alert>
        )}
        <TextField
          label="Server hostname and port:"
          {...register("target")}
          name="target"
          helperText="Usually something like: http://192.168.0.???:3000/api"
        />
        <TextField
          label="Password"
          helperText="Login password / new password (only for the first time)"
          {...register("password")}
          name="password"
          type="password"
        />
        <Button onClick={onSubmit} type="submit">
          Connect
        </Button>
      </Box>
    </Container>
  );
}
