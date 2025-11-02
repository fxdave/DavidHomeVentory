import {styled} from "@macaron-css/react";
import {useState} from "react";
import {useAuthedApi} from "services/useApi";
import {useInvalidate} from "utils/useInvalidate";
import {Search} from "lucide-react";
import {useParams} from "react-router-dom";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {useNavigation} from "./useNavigation";
import {useAsyncEffect} from "utils/useAsyncEffect";
import {asyncCallback} from "utils/useAsyncCallback";
import {CuttingBar} from "./components/CuttingBar";
import {BreadcrumbsBar} from "./components/BreadcrumbsBar";
import {ItemList} from "./ItemList";
import {Navigation} from "modules/Common/Navigation";
import {TextField} from "@ui/Input";

export default function ItemsScreen() {
  const {api} = useAuthedApi();
  const nav = useNavigation();
  const [list, setList] = useState<{
    arr: WarehouseEntryWithPath[];
    key: number;
  }>({arr: [], key: 0});
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
        keyword: nav.keyword,
        parentId: nav.parent.id,
      },
    });
    if (response.result === "success") {
      setList(old => ({arr: response.list, key: old.key + 1}));
    }
  }, [nav.keyword, parent, listInvalidate.id, nav.path]);

  const handleCreateItem = asyncCallback(async (item: {name: string}) => {
    console.log(item);

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
    <Container>
      <Navigation />
      {cutting && (
        <CuttingBar
          item={cutting.item}
          onPaste={handlePaste}
          onCancel={() => setCutting(null)}
        />
      )}

      <BreadcrumbsBar nav={nav} />

      <TextField
        value={nav.keyword}
        onChange={e => nav.setKeyword(e.target.value)}
        label="Find something"
        startAdornment={<Search size={20} />}
      />

      <ItemList
        key={list.key}
        list={list.arr}
        cutting={cutting}
        isSearch={!!nav.keyword}
        onCreateItem={item => handleCreateItem(item)}
        onDeleteItem={item => handleDeleteItem(item.id)}
        onUpdateItem={item => handleUpdateItem(item)}
        onOpenItem={item => nav.goForward(item.id, item.name)}
        onStartCutting={item => setCutting({item})}
      />
    </Container>
  );
}

const Container = styled("div", {
  base: {
    overflow: "auto",
    height: "100vh",
    maxWidth: "1200px",
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
