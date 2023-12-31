import { useEffect, useMemo } from "react";
import { createStore } from "../utils/createStore";
import { Client, createClient } from '@cuple/client';
import { Routes } from '../../../new-back/src/index';

export const token: string | undefined = undefined

const [useApiStore] = createStore<Client<Routes, {}> | null>(null);

export const useApi = () => {
  const [api, setApi] = useApiStore();
  const token = localStorage.getItem("token")
  const authedApi = useMemo(() => {
    return api?.with(() => ({
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }))
  }, [api])

  const setBaseUrl = (basePath: string) => {
    localStorage.setItem("url", basePath)

    const client = createClient<Routes>({
      path: '/api/rpc',
    });
    setApi(client);
    return client;
  };

  useEffect(() => {
    const url = localStorage.getItem("url");
    if (url)
      setBaseUrl(url)
  }, [])

  return {
    api,
    authedApi: () => {
      if (authedApi) return authedApi
      throw new Error("You cannot use AuthedAPI because auth has not done yet")
    },
    setBaseUrl,
  };
};