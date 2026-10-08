import {fetchCuple} from "@cuple/client";
import {createStore} from "../utils/createStore";
import {useApi} from "./useApi";
import {store} from "./cuple";

export enum AuthStatus {
  LoggedIn,
  Waiting,
  Error,
}

export type AuthInfo =
  | {
      isLoggedIn: false;
      error?: string;
    }
  | {
      isLoggedIn: true;
      token: string;
      url: string;
    };

const [useAuthStore] = createStore<AuthInfo>(
  (() => {
    const url = localStorage.getItem("url");
    const token = localStorage.getItem("token");

    if (url && token) {
      return {
        isLoggedIn: true,
        token,
        url,
      };
    } else {
      return {
        isLoggedIn: false,
      };
    }
  })(),
);

export const useAuth = () => {
  const {setBaseUrl} = useApi();
  const [authInfo, setAuthInfo] = useAuthStore();

  function setCredentials(url: string, token: string) {
    localStorage.setItem("url", url);
    localStorage.setItem("token", token);
  }

  const login = async (url: string, password: string) => {
    try {
      const api = setBaseUrl(url);
      // Sets the password on first login; afterwards it answers unauthorized.
      await fetchCuple(api.auth.setPassword.post, {
        body: {
          password,
        },
      }).thenKeep(["success", "unauthorized-error"]);

      const authResponse = await fetchCuple(api.auth.authenticate.post, {
        body: {
          password,
        },
      }).thenKeep(["success", "invalid-body"]);
      if (authResponse.result === "success") {
        setCredentials(url, authResponse.token);
        store.clear();
        setAuthInfo({
          isLoggedIn: true,
          token: authResponse.token,
          url,
        });
        return true;
      } else {
        setAuthInfo({
          isLoggedIn: false,
          error: authResponse.issues[0]?.message ?? authResponse.message,
        });
        return false;
      }
    } catch (e) {
      setAuthInfo({
        isLoggedIn: false,
        error: `${e}`,
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    store.clear();
    setAuthInfo({
      isLoggedIn: false,
    });
  };

  return {
    logout,
    login,
    ...authInfo,
  };
};

export function useLoggedInAuth() {
  const auth = useAuth();

  if (!auth.isLoggedIn) {
    throw new Error("Not logged in");
  }

  return auth;
}
