import { useEffect, useState } from "react";
import { RawClient as WarehouseRawClient } from '../../../back/ts-warehouse-api/client'
import { RawClient as AuthRawClient } from '../../../back/ts-auth-api/client'
import { createStore } from "../utils/createStore";

type Client = {
  WarehouseRawClient: WarehouseRawClient,
  AuthRawClient: AuthRawClient
}

export const token: string | undefined = undefined

const [useApiStore] = createStore<Client | null>(null);
export const useApi = () => {
  const [api, setApi] = useApiStore();

  const setBaseUrl = (basePath: string) => {
    localStorage.setItem("url", basePath)
    const newApi = {
      AuthRawClient: new AuthRawClient({
        async request(method, params) {
          const res = await fetch(`${basePath}/auth`, {
            method: 'POST',
            headers: {
              "content-type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              name: method,
              params
            })
          })

          return await res.json()
        },
        notification(method, params) {
          throw new Error("unimplemented")
        },
      }),
      WarehouseRawClient: new WarehouseRawClient({
        async request(method, params) {
          const res = await fetch(`${basePath}/warehouse`, {
            method: 'POST',
            headers: {
              "content-type": "application/json",
              ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              name: method,
              params
            })
          })

          return await res.json()
        },
        notification(method, params) {
          throw new Error("unimplemented")
        },
      })
    };
    setApi(newApi);
    return newApi;
  };

  useEffect(() => {
    const url = localStorage.getItem("url");
    if (url)
      setBaseUrl(url)
  }, [])

  return {
    api,
    setBaseUrl,
  };
};
