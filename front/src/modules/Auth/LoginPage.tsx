import {styled} from "@macaron-css/react";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "Router";
import {useAuth} from "services/useAuth";
import Logo from "../../assets/rgb-cube.svg";
import {useEffect} from "react";
import {Alert} from "@ui/Alert";
import {Button} from "@ui/Button";
import {Divider} from "@ui/Divider";
import {TextField} from "@ui/Input";

type IFields = {
  target: string;
  password: string;
};

const API_TARGET_KEY = "API_TARGET";

export default function LoginPage() {
  const {handleSubmit, register, setError, setValue} = useForm<IFields>({
    defaultValues: async () => ({
      target: localStorage.getItem(API_TARGET_KEY) || "",
      password: "",
    }),
  });

  useEffect(() => {
    if (window.location.href.includes("localhost:3000"))
      setValue("target", "http://localhost:3001/api");
  }, []);

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
    <Container>
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
      <Title>HomeVentory</Title>
      <Divider>Login</Divider>
      <Form onSubmit={onSubmit}>
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
      </Form>
    </Container>
  );
}

const Container = styled("div", {
  base: {
    maxWidth: "444px",
    margin: "0 auto",
    padding: "16px",
    width: "100%",
    "@media": {
      "(max-width: 600px)": {
        padding: "8px",
      },
    },
  },
});

const Title = styled("h1", {
  base: {
    fontSize: "3rem",
    fontWeight: "bold",
    margin: "24px 0",
    textAlign: "center",
    color: "#fff",
  },
});

const Form = styled("form", {
  base: {
    flexDirection: "column",
    display: "flex",
    gap: "16px",
  },
});
