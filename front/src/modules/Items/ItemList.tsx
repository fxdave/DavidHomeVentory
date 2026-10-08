import {styled} from "styled-system/jsx";
import {memo, useRef, useState} from "react";
import {Plus} from "lucide-react";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {Item} from "./components/Item";
import {useInfinityScroll} from "./useInfinityScroll";
import {TextField} from "@ui/Input";
import {IconButton} from "@ui/Button";
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
}) {
  const [newItemName, setNewItemName] = useState("");
  const watchedDivRef = useRef<HTMLDivElement>(null);
  const slicedList = useInfinityScroll(props.list, watchedDivRef);

  function handleCreateItem() {
    props.onCreateItem({name: newItemName});
    setNewItemName("");
  }

  return (
    <>
      <List>
        {slicedList.length === 0 && (
          <EmptyState>
            {props.isSearch
              ? "Nothing matches your search."
              : "Nothing here yet. Add the first item below."}
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
      <AddForm
        onSubmit={e => {
          e.preventDefault();
          if (newItemName.trim()) handleCreateItem();
        }}>
        <TextField
          aria-label="New item or box"
          placeholder="Add an item or box"
          disabled={!!props.cutting}
          onChange={e => setNewItemName(e.target.value)}
          value={newItemName}
          startAdornment={<Plus size={18} />}
          endAdornment={
            newItemName.trim() && (
              <IconButton type="submit" aria-label="Add">
                <Plus size={20} />
              </IconButton>
            )
          }
        />
      </AddForm>
    </>
  );
}

export const ItemList = memo(
  ItemListRaw,
  (prev, next) =>
    prev.list == next.list && prev.cutting?.item?.id == next.cutting?.item?.id,
);

const EmptyState = styled("li", {
  base: {
    padding: "24px 12px",
    color: "text.secondary",
    borderBottom: "1px solid token(colors.border)",
  },
});

const AddForm = styled("form", {
  base: {
    marginTop: "12px",
  },
});
