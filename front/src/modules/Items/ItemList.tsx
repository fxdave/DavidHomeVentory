import {memo, useRef, useState} from "react";
import {Save} from "lucide-react";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {Item} from "./components/Item";
import {useInfinityScroll} from "./useInfinityScroll";
import {TextField} from "@ui/Input";
import {IconButton} from "@ui/Button";
import {List, ListItem} from "./components/List";

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
          disabled={!!props.cutting}>
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
