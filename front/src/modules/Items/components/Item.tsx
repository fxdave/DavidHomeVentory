import {ListItemButton, TextField} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import {useState} from "react";
import {AllInbox, ContentCut, Edit, Inbox, Save} from "@mui/icons-material";
import {SafeDeleteButton} from "./SafeDelete";
import {WarehouseEntryVariant} from "../../../../../back/src/modules/warehouse/models";
import {ItemProps} from "../ItemsPage";

export function Item(props: ItemProps) {
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
            <AllInbox />
          ) : (
            <Inbox />
          )}
        </Avatar>
      </ListItemAvatar>
      {editing ? (
        <ListItemText>
          <TextField
            fullWidth
            label="Name"
            value={editing.title}
            onChange={e => setEditing({title: e.target.value})}
            onKeyUp={e => {
              if (e.code === "Enter") save();
            }}
          />
        </ListItemText>
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
          <IconButton edge="end" onClick={() => save()}>
            <Save />
          </IconButton>
        )}
        {!editing && (
          <IconButton
            edge="end"
            onClick={() => setEditing({title: props.item.name})}
            disabled={!!props.cutting}>
            <Edit />
          </IconButton>
        )}
        <IconButton
          edge="end"
          disabled={!!props.cutting}
          onClick={() => {
            props.onCutStart();
          }}>
          <ContentCut />
        </IconButton>
        <SafeDeleteButton
          edge="end"
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
