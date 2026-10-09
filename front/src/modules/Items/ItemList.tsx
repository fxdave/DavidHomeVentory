import {styled} from "styled-system/jsx";
import {memo, useRef, useState} from "react";
import {Plus} from "lucide-react";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {Item} from "./components/Item";
import {useInfinityScroll} from "./useInfinityScroll";
import {TextField} from "@ui/Input";
import {Button} from "@ui/Button";
import {List} from "./components/List";

function ItemListRaw(props: {
  list: WarehouseEntryWithPath[];
  onDeleteItem: (item: WarehouseEntryWithPath) => void;
  onUpdateItem: (item: WarehouseEntryWithPath) => void;
  onCreateItem: (item: {name: string}) => void;
  onOpenItem: (item: WarehouseEntryWithPath) => void;
  onStartCutting: (item: WarehouseEntryWithPath) => void;
  cutting: null | {item: WarehouseEntryWithPath};
  isSearch: boolean;
  /** The open box, where new items are added. */
  parentName: string;
}) {
  const [newItemName, setNewItemName] = useState("");
  const newItemInputRef = useRef<HTMLInputElement>(null);
  const watchedDivRef = useRef<HTMLDivElement>(null);
  const slicedList = useInfinityScroll(props.list, watchedDivRef);

  function handleCreateItem() {
    props.onCreateItem({name: newItemName.trim()});
    setNewItemName("");
    // Stay in the field, so several things can be added in a row.
    newItemInputRef.current?.focus();
  }

  return (
    <>
      <List>
        {slicedList.length === 0 && (
          <EmptyState>
            {props.isSearch
              ? "Nothing matches your search."
              : "Nothing here yet. Add the first thing below."}
          </EmptyState>
        )}
        {slicedList.map(item => (
          <Item
            key={item.id}
            isSearch={props.isSearch}
            item={item}
            onDelete={() => props.onDeleteItem(item)}
            onGoForward={() => props.onOpenItem(item)}
            onEdit={props.onUpdateItem}
            onCutStart={() => props.onStartCutting(item)}
            cutting={props.cutting}
          />
        ))}
      </List>
      <div ref={watchedDivRef} />
      {/* Search results come from every box, so there's no single place to add to. */}
      {!props.isSearch && (
        <AddForm
          onSubmit={e => {
            e.preventDefault();
            if (newItemName.trim()) handleCreateItem();
          }}>
          <TextField
            ref={newItemInputRef}
            aria-label={`Add to ${props.parentName}`}
            placeholder={`Add to ${props.parentName}`}
            enterKeyHint="done"
            disabled={!!props.cutting}
            onChange={e => setNewItemName(e.target.value)}
            value={newItemName}
            startAdornment={<Plus size={18} />}
            endAdornment={
              newItemName.trim() && <AddButton type="submit">Add</AddButton>
            }
          />
          <Hint>Anything you add things into becomes a box.</Hint>
        </AddForm>
      )}
    </>
  );
}

export const ItemList = memo(
  ItemListRaw,
  (prev, next) =>
    prev.list == next.list &&
    prev.isSearch == next.isSearch &&
    prev.parentName == next.parentName &&
    prev.cutting?.item?.id == next.cutting?.item?.id,
);

const EmptyState = styled("li", {
  base: {
    padding: "24px 12px",
    color: "text.secondary",
  },
});

/** Sits at the bottom of the screen, even while scrolling a long box. */
const AddForm = styled("form", {
  base: {
    position: "sticky",
    bottom: 0,
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginTop: "auto",
    padding: "12px 0 calc(16px + env(safe-area-inset-bottom))",
    // Solid, so rows scrolling under it don't show around the field's rounded corners.
    backgroundColor: "background",
  },
});

const AddButton = styled(Button, {
  base: {
    minHeight: "34px",
    margin: "0 4px",
    padding: "0 14px",
  },
});

const Hint = styled("span", {
  base: {
    paddingLeft: "12px",
    fontSize: "13px",
    color: "text.disabled",
  },
});
