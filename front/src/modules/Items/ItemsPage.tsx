import {Button, Divider, InputAdornment, TextField} from "@mui/material";
import {useState} from "react";
import {useAuthedApi} from "services/useApi";
import {useInvalidate} from "utils/useInvalidate";
import {Search} from "@mui/icons-material";
import {Container} from "@mui/system";
import {Link, useParams} from "react-router-dom";
import {useLoggedInAuth} from "services/useAuth";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {useNavigation} from "./useNavigation";
import {useAsyncEffect} from "utils/useAsyncEffect";
import {asyncCallback} from "utils/useAsyncCallback";
import {CuttingBar} from "./components/CuttingBar";
import {BreadcrumbsBar} from "./components/BreadcrumbsBar";
import {ROUTES} from "Router";
import {ItemList} from "./ItemList";

export default function ItemsScreen() {
  const auth = useLoggedInAuth();
  const {api} = useAuthedApi();
  const [keyword, setKeyword] = useState<string>("");
  const nav = useNavigation();
  const [list, setList] = useState<WarehouseEntryWithPath[]>([]);
  const [cutting, setCutting] = useState<null | {item: WarehouseEntryWithPath}>(
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
        keyword: keyword,
        parentId: nav.parent.id,
      },
    });
    if (response.result === "success") {
      setList(response.list);
    }
  }, [keyword, parent, listInvalidate.id, nav.path]);

  const handleCreateItem = asyncCallback(async (item: {name: string}) => {
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
      await api.warehouse.update.put({body: newEntry});
      listInvalidate.invalidate();
    },
  );

  const handleDeleteItem = asyncCallback(async (itemId: string) => {
    await api.warehouse.delete.delete({query: {id: itemId}});
    listInvalidate.invalidate();
  });

  return (
    <Container style={{overflow: "auto", height: "100vh"}}>
      <h1>Items</h1>
      {cutting && (
        <CuttingBar
          item={cutting.item}
          onPaste={handlePaste}
          onCancel={() => setCutting(null)}
        />
      )}

      <TextField
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
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
        isSearch={!!keyword}
        onCreateItem={item => handleCreateItem(item)}
        onDeleteItem={item => handleDeleteItem(item.id)}
        onUpdateItem={item => handleUpdateItem(item)}
        onOpenItem={item => nav.goForward(item.id, item.name)}
        onStartCutting={item => setCutting({item})}
      />
      <Divider>HomeVentory</Divider>
      <Button onClick={() => auth.logout()} fullWidth>
        Logout
      </Button>
      <Link to={ROUTES.STICKERS}>
        <Button fullWidth>Box Sticker Generator</Button>
      </Link>
    </Container>
  );
}
