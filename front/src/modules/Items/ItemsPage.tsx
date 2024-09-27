/* eslint-disable prettier/prettier */
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { useAuthedApi } from "services/useApi";
import { useInvalidate } from "utils/useInvalidate";
import { Search } from "@mui/icons-material";
import { Container } from "@mui/system";
import { useParams } from "react-router-dom";
import { WarehouseEntryWithPath } from "../../../../back/src/modules/warehouse";
import { useNavigation } from "./useNavigation";
import { useAsyncEffect } from "utils/useAsyncEffect";
import { asyncCallback } from "utils/useAsyncCallback";
import { CuttingBar } from "./components/CuttingBar";
import { BreadcrumbsBar } from "./components/BreadcrumbsBar";
import { ItemList } from "./ItemList";
import { Navigation } from "modules/Common/Navigation";

export default function ItemsScreen() {
  const { api } = useAuthedApi();
  const nav = useNavigation();
  const [list, setList] = useState<WarehouseEntryWithPath[]>([]);
  const [cutting, setCutting] = useState<null | { item: WarehouseEntryWithPath }>(
    null,
  );
  const listInvalidate = useInvalidate();
  const query = useParams();

  useAsyncEffect(async () => {
    const initialItemId = query?.id;
    if (initialItemId) {
      const response = await api.warehouse.getOrCreate.post({
        query: {
          id: initialItemId,
        },
      });
      if (response.result === "success") {
        nav.initFromParent(response.entry);
      }
    }
  }, [query?.id]);

  useAsyncEffect(async () => {
    const response = await api.warehouse.list.get({
      query: {
        keyword: nav.keyword,
        parentId: nav.parent.id,
      },
    });
    if (response.result === "success") {
      setList(response.list);
    }
  }, [nav.keyword, parent, listInvalidate.id, nav.path]);

  const handleCreateItem = asyncCallback(async (item: { name: string }) => {
    await api.warehouse.create.post({
      body: {
        name: item.name,
        parentId: nav.parent.id,
        id: null,
      },
    });

    listInvalidate.invalidate();
  });

  const handlePaste = asyncCallback(async () => {
    if (cutting && nav.parent.id) {
      await api.warehouse.update.put({
        body: {
          id: cutting.item.id,
          name: cutting.item.name,
          variant: cutting.item.variant,
          parentId: nav.parent.id,
        },
      });

      setCutting(null);
      listInvalidate.invalidate();
    }
  });

  const handleUpdateItem = asyncCallback(
    async (newEntry: WarehouseEntryWithPath) => {
      await api.warehouse.update.put({ body: newEntry });
      listInvalidate.invalidate();
    },
  );

  const handleDeleteItem = asyncCallback(async (itemId: string) => {
    await api.warehouse.delete.delete({ query: { id: itemId } });
    listInvalidate.invalidate();
  });

  return (
    <Container style={{ overflow: "auto", height: "100vh" }}>
      <h1>Items</h1>
      {cutting && (
        <CuttingBar
          item={cutting.item}
          onPaste={handlePaste}
          onCancel={() => setCutting(null)}
        />
      )}

      <TextField
        value={nav.keyword}
        onChange={e => nav.setKeyword(e.target.value)}
        fullWidth
        label="Find something"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <BreadcrumbsBar nav={nav} />

      <ItemList
        list={list}
        cutting={cutting}
        isSearch={!!nav.keyword}
        onCreateItem={item => handleCreateItem(item)}
        onDeleteItem={item => handleDeleteItem(item.id)}
        onUpdateItem={item => handleUpdateItem(item)}
        onOpenItem={item => nav.goForward(item.id, item.name)}
        onStartCutting={item => setCutting({ item })}
      />
      <Navigation />
    </Container>
  );
}
