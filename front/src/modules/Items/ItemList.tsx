import {styled} from "@macaron-css/react";
import {memo, useRef, useState} from "react";
import {Save, Inbox} from "lucide-react";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {Item} from "./components/Item";
import {useInfinityScroll} from "./useInfinityScroll";
import {TextField} from "@ui/Input";
import {IconButton} from "@ui/Button";
import {List, ListItem} from "./components/List";
import {colors} from "@ui/theme";

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
    <List>
      {slicedList.length === 0 && (
        <EmptyState>
          <EmptyIcon>
            <Inbox size={48} />
          </EmptyIcon>
          <EmptyTitle>No items yet</EmptyTitle>
          <EmptyText>
            {props.isSearch
              ? "No items match your search. Try different keywords."
              : "Get started by creating your first item or box below."}
          </EmptyText>
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
      <ListItem>
        <TextField
          disabled={!!props.cutting}
          label="Name of the new Item or Box"
          onChange={e => setNewItemName(e.target.value)}
          onKeyUp={e => {
            if (e.code === "Enter") handleCreateItem();
          }}
          value={newItemName}
        />
        <IconButton
          onClick={() => handleCreateItem()}
          disabled={!!props.cutting}
          aria-label="Create new item">
          <Save size={20} />
        </IconButton>
        <div ref={watchedDivRef} />
      </ListItem>
    </List>
  );
}

export const ItemList = memo(
  ItemListRaw,
  (prev, next) =>
    prev.list == next.list && prev.cutting?.item?.id == next.cutting?.item?.id,
);

const EmptyState = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    textAlign: "center",
  },
});

const EmptyIcon = styled("div", {
  base: {
    color: colors.text.disabled,
    marginBottom: "16px",
  },
});

const EmptyTitle = styled("h3", {
  base: {
    fontSize: "1.25rem",
    fontWeight: 500,
    margin: "0 0 8px 0",
    color: colors.text.primary,
  },
});

const EmptyText = styled("p", {
  base: {
    fontSize: "0.875rem",
    margin: 0,
    color: colors.text.secondary,
    maxWidth: "400px",
  },
});
