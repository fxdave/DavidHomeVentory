import {memo, useState} from "react";
import {Archive, Scissors, Pencil, Inbox, Save} from "lucide-react";
import {styled} from "@macaron-css/react";
import {SafeDeleteButton} from "./SafeDelete";
import {WarehouseEntryVariant} from "../../../../../back/src/modules/warehouse/models";
import {WarehouseEntryWithPath} from "../../../../../back/src/modules/warehouse";
import {TextField, InputContainer} from "@ui/Input";
import {IconButton} from "@ui/Button";
import {colors} from "@ui/theme";
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
    <ListItem
      onClick={editing ? undefined : () => props.onGoForward()}
      disabled={props.cutting?.item.id == props.item.id}>
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
        <EditGroup>
          <EditTextField
            label="Name"
            value={editing.title}
            onChange={e => setEditing({title: e.target.value})}
            onKeyUp={e => {
              if (e.code === "Enter") save();
            }}
          />
          <EditSaveButton
            onClick={e => {
              e.stopPropagation();
              save();
            }}
            aria-label="Save changes">
            <Save size={20} />
          </EditSaveButton>
        </EditGroup>
      ) : (
        <ListItemButton disabled={props.cutting?.item.id == props.item.id}>
          <ListItemText
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
        {!editing && (
          <IconButton
            onClick={e => {
              e.stopPropagation();
              setEditing({title: props.item.name});
            }}
            disabled={!!props.cutting}
            aria-label="Edit item name">
            <Pencil size={20} />
          </IconButton>
        )}
        <IconButton
          disabled={!!props.cutting}
          onClick={e => {
            e.stopPropagation();
            props.onCutStart();
          }}
          aria-label="Cut item to move">
          <Scissors size={20} />
        </IconButton>
        <SafeDeleteButton
          disabled={
            props.item.variant === WarehouseEntryVariant.Container ||
            !!props.cutting
          }
          onClick={e => {
            e.stopPropagation();
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

const EditGroup = styled("div", {
  base: {
    display: "flex",
    flex: 1,
    alignItems: "stretch",
  },
});

const EditTextField = styled(TextField, {
  base: {
    flex: 1,
    [`& ${InputContainer}`]: {
      borderTopRightRadius: "0",
      borderBottomRightRadius: "0",
      borderRight: "none",
    },
  },
});

const EditSaveButton = styled(IconButton, {
  base: {
    borderRadius: "0 4px 4px 0",
    backgroundColor: colors.paper,
    border: `1px solid ${colors.border}`,
    borderLeft: "none",
    minWidth: "48px",
    "&:hover:not(:disabled)": {
      backgroundColor: colors.hover,
      borderColor: colors.primary,
    },
  },
});
