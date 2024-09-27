/* eslint-disable sonarjs/no-collapsible-if */
/* eslint-disable prettier/prettier */
import { TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useEffect, useMemo, useRef, useState } from "react";
import SaveIcon from "@mui/icons-material/Save";
import { WarehouseEntryWithPath } from "../../../../back/src/modules/warehouse";
import { Item } from "./components/Item";

export function ItemList(props: {
  list: WarehouseEntryWithPath[];
  onDeleteItem: (item: WarehouseEntryWithPath) => void;
  onUpdateItem: (item: WarehouseEntryWithPath) => void;
  onCreateItem: (item: { name: string }) => void;
  onOpenItem: (item: WarehouseEntryWithPath) => void;
  onStartCutting: (item: WarehouseEntryWithPath) => void;
  cutting: null | { item: WarehouseEntryWithPath };
  isSearch: boolean;
}) {
  const [newItemName, setNewItemName] = useState("");
  const [slicedArray, setSlicedArray] = useState<WarehouseEntryWithPath[]>([]);
  const [refState, setRefState] = useState(false);
  const [isObserving, setIsObserving] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const listLength = props.list.length;
  const currentIndexRef = useRef(20);
  const oldIndexRef = useRef(0);

  useEffect(() => {
    if (slicedArray.length > listLength) {
      setSlicedArray(props.list.slice(0, currentIndexRef.current));
      currentIndexRef.current = Math.min(20, listLength);
      oldIndexRef.current = 0;
      setRefState(false);
    }
    if (refState) {
      if (slicedArray.length < listLength) {
        const currentIndex = currentIndexRef.current;
        const oldIndex = oldIndexRef.current;

        setSlicedArray(prev => [
          ...prev,
          ...props.list.slice(oldIndex, currentIndex),
        ]);

        oldIndexRef.current = currentIndex;
        currentIndexRef.current = Math.min(currentIndex + 10, listLength);

        setRefState(false);
      }
    }
  }, [listLength, refState, props.list, slicedArray]);

  console.log("origi meret: " + props.list.length + " Sliced meret: " + slicedArray.length)
  // eslint-disable-next-line sonarjs/cognitive-complexity

  function handleCreateItem() {
    props.onCreateItem({ name: newItemName });
    setNewItemName("");
  }

  useEffect(() => {
    const options = {
      root: document.querySelector("#root"),
      rootMargin: "0px",
      threshold: 0.7,
    };

    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(entries => {
        const [entry] = entries;
        if (entry.isIntersecting && !isObserving) {
          setIsObserving(true);
          setRefState(true);
        }
      }, options);
    }

    const target = document.querySelector(".endOfList");
    if (target && observerRef.current) {
      observerRef.current.observe(target);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isObserving]);

  useEffect(() => {
    if (refState === false) {
      setIsObserving(false);
    }
  }, [refState]);

  const memoizedList = useMemo(() => {
    return slicedArray.map((item, index) => (
      <Item
        key={`${item.id}-${index}`}
        isSearch={props.isSearch}
        item={item}
        onDelete={() => props.onDeleteItem(item)}
        onGoForward={() => props.onOpenItem(item)}
        onEdit={props.onUpdateItem}
        onCutStart={() => props.onStartCutting(item)}
        cutting={props.cutting}
      />
    ));
  }, [slicedArray, props.list]);

  return (
    <List >
      {memoizedList}
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            onClick={() => handleCreateItem()}
            disabled={!!props.cutting}>
            <SaveIcon />
          </IconButton>
        }>
        <TextField
          disabled={!!props.cutting}
          label="Name of the new Item or Box"
          onChange={e => setNewItemName(e.target.value)}
          onKeyUp={e => {
            if (e.code === "Enter") handleCreateItem();
          }}
          value={newItemName}
        />
        <div className="endOfList"></div>
      </ListItem>
    </List>
  );
}
