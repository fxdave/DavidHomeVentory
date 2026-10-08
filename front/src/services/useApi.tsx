import {useEffect, useMemo} from "react";
import {createStore} from "../utils/createStore";
import {Client, createClient} from "@cuple/client";
import {Routes} from "../../../back/src/index";

export const token: string | undefined = undefined;

const [useApiStore] = createStore<Client<Routes> | null>(null);

export const useApi = () => {
  const [api, setApi] = useApiStore();

  const setBaseUrl = (basePath: string) => {
    localStorage.setItem("url", basePath);

    const client = createClient<Routes>({
      path: `${basePath}/rpc`,
    });
    setApi(client);
    return client;
  };

  useEffect(() => {
    const url = localStorage.getItem("url");
    if (url) setBaseUrl(url);
  }, []);

  return {
    api,
    setBaseUrl,
  };
};

export const useAuthedApi = () => {
  const {api} = useApi();

  if (!api) {
    throw new Error("Api is null");
  }

  const authedApi = useMemo(
    () =>
      api.with({
        middleware: () => ({
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      }),
    [api],
  );

  return {
    api: authedApi,
  };
};
