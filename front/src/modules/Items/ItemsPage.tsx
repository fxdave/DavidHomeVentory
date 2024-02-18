import {Button, Divider, InputAdornment, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import {useState} from "react";
import {useAuthedApi} from "services/useApi";
import SaveIcon from "@mui/icons-material/Save";
import {useInvalidate} from "utils/useInvalidate";
import {Search} from "@mui/icons-material";
import {Container} from "@mui/system";
import {useParams} from "react-router-dom";
import {useLoggedInAuth} from "services/useAuth";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {Item} from "./components/Item";
import {useNavigation} from "./useNavigation";
import {useAsyncEffect} from "utils/useAsyncEffect";
import {asyncCallback} from "utils/useAsyncCallback";
import {CuttingBar} from "./components/CuttingBar";
import {BreadcrumbsBar} from "./components/BreadcrumbsBar";

export default function ItemsScreen() {
  const auth = useLoggedInAuth();
  const {api} = useAuthedApi();
  const [keyword, setKeyword] = useState<string>("");
  const nav = useNavigation();
  const [list, setList] = useState<WarehouseEntryWithPath[]>([]);
  const [newItemName, setNewItemName] = useState("");
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

  const handleCreateItem = asyncCallback(async () => {
    await api.warehouse.create.post({
      body: {
        name: newItemName,
        parentId: nav.parent.id,
        id: null,
      },
    });

    listInvalidate.invalidate();
    setNewItemName("");
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

      <List>
        {list.map(item => (
          <Item
            key={item.id}
            isSearch={!!keyword}
            item={item}
            onDelete={() => handleDeleteItem(item.id)}
            onGoForward={() => {
              nav.goForward(item.id, item.name);
            }}
            onEdit={handleUpdateItem}
            onCutStart={() => {
              setCutting({item});
            }}
            cutting={cutting}
          />
        ))}
        <ListItem
          secondaryAction={
            <IconButton
              edge="end"
              onClick={handleCreateItem}
              disabled={!!cutting}>
              <SaveIcon />
            </IconButton>
          }>
          <TextField
            disabled={!!cutting}
            label="Name of the new Item or Box"
            onChange={e => setNewItemName(e.target.value)}
            onKeyUp={e => {
              if (e.code === "Enter") handleCreateItem();
            }}
            value={newItemName}
          />
        </ListItem>
      </List>
      <Divider>HomeVentory</Divider>
      <Button onClick={() => auth.logout()} fullWidth>
        Logout
      </Button>
    </Container>
  );
}

export type ItemProps = {
  isSearch: boolean;
  item: WarehouseEntryWithPath;
  onDelete: () => void;
  onGoForward: () => void;
  onCutStart: () => void;
  onEdit: (entry: WarehouseEntryWithPath) => void;
  cutting: null | {item: WarehouseEntryWithPath};
};
