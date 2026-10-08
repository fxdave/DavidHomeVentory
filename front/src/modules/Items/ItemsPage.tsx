import {styled} from "styled-system/jsx";
import {useEffect, useState} from "react";
import {useAuthedApi} from "services/useApi";
import {Search, X} from "lucide-react";
import {fetchCuple} from "@cuple/client";
import {Boundary, useAction, useGetWrapped} from "@cuple/react";
import {useParams} from "react-router-dom";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {useNavigation} from "./useNavigation";
import {CuttingBar} from "./components/CuttingBar";
import {BreadcrumbsBar, displayName} from "./components/BreadcrumbsBar";
import {ItemList} from "./ItemList";
import {Navigation} from "modules/Common/Navigation";
import {TextField} from "@ui/Input";
import {Button, IconButton} from "@ui/Button";
import {Spinner} from "@ui/Spinner";
import {Alert} from "@ui/Alert";

type EntryUpdate = Pick<
  WarehouseEntryWithPath,
  "id" | "name" | "parentId" | "variant"
>;

export default function ItemsScreen() {
  const {api} = useAuthedApi();
  const nav = useNavigation();
  const [cutting, setCutting] = useState<null | {item: WarehouseEntryWithPath}>(
    null,
  );
  const query = useParams();
  const changesList = {refresh: [api.warehouse.list]};

  // An item opened by its id (a scanned sticker): created if it's new.
  const openItem = useAction(
    (id: string) =>
      fetchCuple(api.warehouse.getOrCreate.post, {
        query: {id},
      }).thenKeepSuccess(),
    changesList,
  );
  useEffect(() => {
    const initialItemId = query?.id;
    if (!initialItemId) return;
    void openItem.run(initialItemId).then(state => {
      if (state.status === "done") nav.initFromParent(state.value.entry);
    });
  }, [query?.id]);

  const createItem = useAction(
    (item: {name: string}) =>
      fetchCuple(api.warehouse.create.post, {
        body: {
          name: item.name,
          parentId: nav.parent.id,
          id: null,
        },
      }).thenKeepSuccess(),
    changesList,
  );

  const updateItem = useAction(
    (entry: EntryUpdate) =>
      fetchCuple(api.warehouse.update.put, {
        body: entry,
      }).thenKeepSuccess(),
    changesList,
  );

  const deleteItem = useAction(
    (itemId: string) =>
      fetchCuple(api.warehouse.delete.delete, {
        query: {id: itemId},
      }).thenKeepSuccess(),
    changesList,
  );

  const handlePaste = async () => {
    if (!cutting || !nav.parent.id) return;
    const state = await updateItem.run({
      id: cutting.item.id,
      name: cutting.item.name,
      variant: cutting.item.variant,
      parentId: nav.parent.id,
    });
    if (state.status === "done") setCutting(null);
  };

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

      <SearchField
        aria-label="Search"
        placeholder={
          nav.parent.id === null
            ? "Search everything"
            : `Search in ${displayName(nav.parent)}`
        }
        value={nav.keyword}
        onChange={e => nav.setKeyword(e.target.value)}
        startAdornment={<Search size={18} />}
        endAdornment={
          nav.keyword && (
            <IconButton
              onClick={() => nav.setKeyword("")}
              aria-label="Clear search">
              <X size={18} />
            </IconButton>
          )
        }
      />

      <Boundary
        fallback={
          <Centered>
            <Spinner />
          </Centered>
        }
        error={(error, retry) => (
          <Alert severity="error">
            {error.message} <Button onClick={retry}>Retry</Button>
          </Alert>
        )}>
        <Contents
          keyword={nav.keyword}
          parentId={nav.parent.id}
          cutting={cutting}
          onCreateItem={createItem.run}
          onDeleteItem={item => deleteItem.run(item.id)}
          onUpdateItem={updateItem.run}
          onOpenItem={item => nav.goForward(item.id, item.name)}
          onStartCutting={item => setCutting({item})}
        />
      </Boundary>
    </Container>
  );
}

type ContentsProps = Omit<
  Parameters<typeof ItemList>[0],
  "list" | "isSearch"
> & {
  keyword: string;
  parentId: string | null;
};

/** The listed items. While the next folder or search loads, the current one stays, dimmed. */
function Contents({keyword, parentId, ...props}: ContentsProps) {
  const {api} = useAuthedApi();
  const found = useGetWrapped(
    api.warehouse.list,
    {query: {keyword, parentId}},
    {config: {loading: {debounceMs: 150}}},
  );

  return (
    <Dimmed data-pending={found.isPending || undefined}>
      <ItemList {...props} list={found.data.list} isSearch={!!keyword} />
    </Dimmed>
  );
}

const Container = styled("div", {
  base: {
    overflow: "auto",
    height: "100vh",
    maxWidth: "720px",
    margin: "0 auto",
    padding: "0 16px 96px",
    width: "100%",
  },
});

const SearchField = styled(TextField, {
  base: {
    marginBottom: "12px",
  },
});

const Centered = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
    padding: "24px",
  },
});

const Dimmed = styled("div", {
  base: {
    transition: "opacity 0.15s",
    "&[data-pending]": {
      opacity: 0.6,
    },
  },
});
