import {TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import {useState} from "react";
import SaveIcon from "@mui/icons-material/Save";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";
import {Item} from "./components/Item";
import {FixedSizeList as List} from "react-window";

export function ItemList(props: {
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

  function handleCreateItem() {
    props.onCreateItem({name: newItemName});
    setNewItemName("");
  }

  const Row = ({index, style}: {index: number; style: React.CSSProperties}) => {
    const item = props.list[index];
    return (
      <div style={style}>
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
      </div>
    );
  };

  return (
    <div>
      <List
        height={window.innerHeight / 1.85}
        itemCount={props.list.length}
        itemSize={90}
        width={"100%"}
        itemData={props.list}>
        {Row}
      </List>
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
      </ListItem>
    </div>
  );
}
/*
 */
