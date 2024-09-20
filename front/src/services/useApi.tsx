import {useEffect, useMemo} from "react";
import {createStore} from "../utils/createStore";
import {Client, createClient} from "@cuple/client";
import {Routes} from "../../../back/src/index";

export const token: string | undefined = undefined;

type CupleClient = Client<Routes, Record<string, unknown>>;
type CupleAuthedClient = Client<
  Routes,
  {
    headers: {
      Authorization: string;
    };
  }
>;

const [useApiStore] = createStore<CupleClient | null>(null);

type Operation = {
  type: "v1-create-item";
  item: {
    id: string | null;
    parentId: string | null;
    name: string;
  };
};

const listOfOperations: Operation[] = [];

interface WarehouseService {
  create: CupleClient["warehouse"]["create"]["post"];
  remove: CupleClient["warehouse"]["delete"]["delete"];
  getOrCreate: CupleClient["warehouse"]["getOrCreate"]["post"];
  list: CupleClient["warehouse"]["list"]["get"];
  update: CupleClient["warehouse"]["update"]["put"];
}

function createOfflineWarehouseService(
  _client: CupleAuthedClient,
): WarehouseService {
  return {
    async create(props) {
      listOfOperations.push({
        type: "v1-create-item",
        item: props.body,
      });
      return {
        result: "success",
        entry: {
          id: props.body.id,
        },
      };
    },

    async remove(props) {
      return await _client.warehouse.delete.delete(props);
    },

    async getOrCreate(props) {
      return await _client.warehouse.getOrCreate.post(props);
    },

    async list(props) {
      return await _client.warehouse.list.get(props);
    },

    async update(props) {
      return await _client.warehouse.update.put(props);
    },
  };
}

function createOnlineWarehouseService(
  _client: CupleAuthedClient,
): WarehouseService {
  return {
    async create(props) {
      return await _client.warehouse.create.post(props);
    },

    async remove(props) {
      return await _client.warehouse.delete.delete(props);
    },

    async getOrCreate(props) {
      return await _client.warehouse.getOrCreate.post(props);
    },

    async list(props) {
      return await _client.warehouse.list.get(props);
    },

    async update(props) {
      return await _client.warehouse.update.put(props);
    },
  };
}

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

  const authedApi = useMemo(() => {
    const token = localStorage.getItem("token");
    return api?.with(() => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }));
  }, [api]);

  return {
    api: authedApi,
  };
};
