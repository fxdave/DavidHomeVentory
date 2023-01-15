import { useEffect } from "react";
import { createStore } from "../utils/createStore";
import { useApi } from "./useApi";

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

const [useAuthStore] = createStore<AuthInfo>((() => {
  const url = localStorage.getItem('url')
  const token = localStorage.getItem('token')

  if (url && token) {
    return {
      isLoggedIn: true,
      token,
      url
    }
  } else {
    return {
      isLoggedIn: false,
    }
  }
})());

export const useAuth = () => {
  const { setBaseUrl } = useApi();
  const [authInfo, setAuthInfo] = useAuthStore();

  function setCredentials(url: string, token: string) {
    localStorage.setItem("url", url)
    localStorage.setItem("token", token)
  }

  const login = async (url: string, password: string) => {
    try {
      const api = setBaseUrl(url);
      const setResponse = await api.AuthRawClient.setPassword({
        password
      });

      if (setResponse.type === 'GenericError') {
        setAuthInfo({
          isLoggedIn: false,
          error: `${setResponse.message}`,
        });
        return false
      }


      let authResponse = await api.AuthRawClient.authenticate({
        password
      });
      if (authResponse.type === 'Error') {
        setAuthInfo({
          isLoggedIn: false,
          error: `${authResponse.error}`,
        });
        return false
      } else {
        setCredentials(url, authResponse.token)
        setAuthInfo({
          isLoggedIn: true,
          token: authResponse.token,
          url,
        });
        return true
      }
    } catch (e) {
      setAuthInfo({
        isLoggedIn: false,
        error: `${e}`
      })
      return false
    }
  };

  return {
    login,
    ...authInfo,
  };
};
