import {memo, useState} from "react";
import {Archive, Scissors, Pencil, Inbox, Save} from "lucide-react";
import {SafeDeleteButton} from "./SafeDelete";
import {WarehouseEntryVariant} from "../../../../../back/src/modules/warehouse/models";
import {WarehouseEntryWithPath} from "../../../../../back/src/modules/warehouse";
import {TextField} from "@ui/Input";
import {IconButton} from "@ui/Button";
import {
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "./List";

type ItemProps = {
  isSearch: boolean;
  item: WarehouseEntryWithPath;
  onDelete: () => void;
  onGoForward: () => void;
  onCutStart: () => void;
  onEdit: (entry: WarehouseEntryWithPath) => void;
  cutting: null | {item: WarehouseEntryWithPath};
};
function ItemRaw(props: ItemProps) {
  const [editing, setEditing] = useState<null | {
    title: string;
  }>(null);

  function save() {
    if (editing)
      props.onEdit({
        ...props.item,
        name: editing.title,
      });
    setEditing(null);
  }
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          {props.item.variant === WarehouseEntryVariant.Container ? (
            <Archive size={20} />
          ) : (
            <Inbox size={20} />
          )}
        </Avatar>
      </ListItemAvatar>
      {editing ? (
        <TextField
          label="Name"
          value={editing.title}
          onChange={e => setEditing({title: e.target.value})}
          onKeyUp={e => {
            if (e.code === "Enter") save();
          }}
        />
      ) : (
        <ListItemButton disabled={props.cutting?.item.id == props.item.id}>
          <ListItemText
            onClick={() => props.onGoForward()}
            primary={`${
              props.isSearch
                ? props.item.path.map(s => s.name).join(" / ") + " / "
                : ""
            } ${props.item.name}`}
            secondary={props.item.id}
          />
        </ListItemButton>
      )}
      <>
        {editing && (
          <IconButton onClick={() => save()}>
            <Save size={20} />
          </IconButton>
        )}
        {!editing && (
          <IconButton
            onClick={() => setEditing({title: props.item.name})}
            disabled={!!props.cutting}>
            <Pencil size={20} />
          </IconButton>
        )}
        <IconButton
          disabled={!!props.cutting}
          onClick={() => {
            props.onCutStart();
          }}>
          <Scissors size={20} />
        </IconButton>
        <SafeDeleteButton
          disabled={
            props.item.variant === WarehouseEntryVariant.Container ||
            !!props.cutting
          }
          onClick={() => {
            props.onDelete();
          }}
        />
      </>
    </ListItem>
  );
}
export const Item = memo(
  ItemRaw,
  (prev, next) =>
    prev.item.id == next.item.id &&
    prev.isSearch == next.isSearch &&
    prev.cutting?.item?.id == next.cutting?.item?.id,
);
