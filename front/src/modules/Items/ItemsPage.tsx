import {styled} from "styled-system/jsx";
import {RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useAuthedApi} from "services/useApi";
import {fetchCuple} from "@cuple/client";
import {Boundary, useAction, useGetWrapped} from "@cuple/react";
import {useParams} from "react-router-dom";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {PathSegment, useNavigation} from "./useNavigation";
import {CuttingBar} from "./components/CuttingBar";
import {BreadcrumbsBar, displayName} from "./components/BreadcrumbsBar";
import {ItemList} from "./ItemList";
import {Navigation} from "modules/Common/Navigation";
import {Button} from "@ui/Button";
import {Spinner} from "@ui/Spinner";
import {Alert} from "@ui/Alert";

type EntryUpdate = Pick<
  WarehouseEntryWithPath,
  "id" | "name" | "parentId" | "variant"
>;

export default function ItemsScreen() {
  const {api} = useAuthedApi();
  const nav = useNavigation();
  const scrollerRef = useRef<HTMLDivElement>(null);
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
    if (!cutting) return;
    const state = await updateItem.run({
      id: cutting.item.id,
      name: cutting.item.name,
      variant: cutting.item.variant,
      parentId: nav.parent.id,
    });
    if (state.status === "done") setCutting(null);
  };

  return (
    <Container ref={scrollerRef}>
      <Navigation search={{value: nav.keyword, onChange: nav.setKeyword}} />
      {cutting && (
        <CuttingBar
          item={cutting.item}
          onPaste={handlePaste}
          onCancel={() => setCutting(null)}
        />
      )}

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
          path={nav.path}
          onGoBack={nav.goBack}
          scrollerRef={scrollerRef}
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
  "list" | "isSearch" | "parentName"
> & {
  keyword: string;
  path: PathSegment[];
  onGoBack: (id: string) => void;
  scrollerRef: RefObject<HTMLDivElement | null>;
};

/** What's on screen: the title and list change together, once the new list has loaded. */
type Shown = {path: PathSegment[]; keyword: string};

/** Typing a search doesn't replay the animation, only switching what's shown does. */
function keyOf({path, keyword}: Shown) {
  return keyword ? "search" : path[path.length - 1].id;
}

/** Deeper slides in from the right, up from the left; searches just fade. */
function directionOf(from: Shown, to: Shown) {
  if (from.keyword || to.keyword) return "fade";
  return to.path.length >= from.path.length ? "forward" : "back";
}

/** The open box's title and items. While the next box or search loads, the current one stays,
 * then the new one slides in. A search always looks through every box, not just the open one. */
function Contents({
  keyword,
  path,
  onGoBack,
  scrollerRef,
  ...props
}: ContentsProps) {
  const {api} = useAuthedApi();
  const parentId = path[path.length - 1].id;
  const found = useGetWrapped(
    api.warehouse.list,
    {query: keyword ? {keyword, parentId: null} : {keyword, parentId}},
    // Waits for typing to pause, but opens a box at once (with 0 the old list wouldn't stay).
    {config: {loading: {debounceMs: keyword ? 150 : 1}}},
  );

  const [shown, setShown] = useState<Shown>({path, keyword});
  const [direction, setDirection] =
    useState<ReturnType<typeof directionOf>>("fade");
  const shownKey = keyOf(shown);
  if (!found.isPending && (shown.path !== path || shown.keyword !== keyword)) {
    setShown({path, keyword});
    if (keyOf({path, keyword}) !== shownKey)
      setDirection(directionOf(shown, {path, keyword}));
  }
  useLayoutEffect(() => {
    scrollerRef.current?.scrollTo({top: 0});
  }, [shownKey]);

  return (
    <Dimmed data-pending={found.isPending || undefined}>
      <Page key={shownKey} data-direction={direction}>
        {/* Search results come from every box, not the open one. */}
        {shown.keyword ? (
          <SearchSpacer />
        ) : (
          <BreadcrumbsBar path={shown.path} onGoBack={onGoBack} />
        )}
        <ItemList
          {...props}
          list={found.data.list}
          isSearch={!!shown.keyword}
          parentName={displayName(shown.path[shown.path.length - 1])}
        />
      </Page>
    </Dimmed>
  );
}

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    height: "100dvh",
    maxWidth: "720px",
    margin: "0 auto",
    padding: "0 16px",
    width: "100%",
  },
});

const Centered = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
    padding: "24px",
  },
});

/** Fills the rest of the screen, so the add field can sit at its bottom. */
const Dimmed = styled("div", {
  base: {
    flex: "1 0 auto",
    display: "flex",
    flexDirection: "column",
    transition: "opacity 0.15s",
    "&[data-pending]": {
      opacity: 0.6,
      // A quick load swaps without dimming first.
      transitionDelay: "0.2s",
    },
  },
});

const Page = styled("div", {
  base: {
    flex: "1 0 auto",
    display: "flex",
    flexDirection: "column",
    animationDuration: "0.22s",
    animationTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    "&[data-direction='forward']": {animationName: "enterForward"},
    "&[data-direction='back']": {animationName: "enterBack"},
    "&[data-direction='fade']": {animationName: "enterFade"},
  },
});

/** Without breadcrumbs above, the results need room from the header. */
const SearchSpacer = styled("div", {
  base: {height: "12px"},
});
