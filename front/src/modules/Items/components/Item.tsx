/* eslint-disable sonarjs/no-duplicate-string */
import {memo, useEffect, useRef, useState} from "react";
import {Scissors, Pencil, Check, QrCode} from "lucide-react";
import {styled} from "styled-system/jsx";
import {SafeDeleteButton} from "./SafeDelete";
import {WarehouseEntryVariant} from "../../../../../back/src/modules/warehouse/models";
import {WarehouseEntryWithPath} from "../../../../../back/src/modules/warehouse";
import {TextField} from "@ui/Input";
import {IconButton} from "@ui/Button";
import {ListItem, ListItemText} from "./List";
import {boxTagColor} from "utils/boxHue";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Where a search hit lives, or the sticker name when the box was renamed. */
function secondaryLine(item: WarehouseEntryWithPath, isSearch: boolean) {
  if (isSearch)
    return item.path
      .filter(segment => segment.id !== "ROOT")
      .map(segment => segment.name)
      .join(" › ");
  if (item.id !== item.name && !UUID.test(item.id))
    return `Sticker: ${item.id}`;
  return undefined;
}

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
  const isEditing = editing !== null;
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) editInputRef.current?.focus();
  }, [isEditing]);

  function save() {
    if (editing)
      props.onEdit({
        ...props.item,
        name: editing.title,
      });
    setEditing(null);
  }
  const isContainer = props.item.variant === WarehouseEntryVariant.Container;

  return (
    <StyledListItem
      data-container={isContainer}
      style={isContainer ? boxTagColor(props.item.id) : {}}
      onClick={editing ? undefined : () => props.onGoForward()}
      disabled={props.cutting?.item.id == props.item.id}
      data-editing={isEditing}>
      {isContainer && (
        <BoxIcon>
          <QrCode size={18} />
        </BoxIcon>
      )}
      {editing ? (
        <EditGroup onClick={e => e.stopPropagation()}>
          <TextField
            ref={editInputRef}
            aria-label="Name"
            value={editing.title}
            onChange={e => setEditing({title: e.target.value})}
            onKeyUp={e => {
              if (e.code === "Enter") save();
              if (e.code === "Escape") setEditing(null);
            }}
            endAdornment={
              <IconButton
                onClick={e => {
                  e.stopPropagation();
                  save();
                }}
                aria-label="Save changes">
                <Check size={20} />
              </IconButton>
            }
          />
        </EditGroup>
      ) : (
        <ListItemText
          primary={
            isContainer ? <BoxName>{props.item.name}</BoxName> : props.item.name
          }
          secondary={secondaryLine(props.item, props.isSearch)}
        />
      )}
      {!editing && (
        <>
          <IconButton
            onClick={e => {
              e.stopPropagation();
              setEditing({title: props.item.name});
            }}
            disabled={!!props.cutting}
            aria-label="Rename">
            <Pencil size={18} />
          </IconButton>
          <IconButton
            disabled={!!props.cutting}
            onClick={e => {
              e.stopPropagation();
              props.onCutStart();
            }}
            aria-label="Move">
            <Scissors size={18} />
          </IconButton>
          <SafeDeleteButton
            disabled={isContainer || !!props.cutting}
            onClick={e => {
              e.stopPropagation();
              props.onDelete();
            }}
          />
        </>
      )}
    </StyledListItem>
  );
}
export const Item = memo(
  ItemRaw,
  // The cache keeps an unchanged item's object, so a new object means a change.
  (prev, next) =>
    prev.item === next.item &&
    prev.isSearch == next.isSearch &&
    prev.cutting?.item?.id == next.cutting?.item?.id,
);

/** A box's icon, tinted with the box's own color. */
const BoxIcon = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    marginRight: "12px",
    borderRadius: "8px",
    backgroundColor: "var(--tag-bg)",
    color: "var(--tag-fg)",
    flexShrink: 0,
  },
});

/** A box is a card, so it stands out from the loose items. */
const StyledListItem = styled(ListItem, {
  base: {
    "&[data-container='true']": {
      margin: "6px 0",
      // One less than a plain row, to make up for the border.
      paddingRight: "7px",
      border: "1px solid token(colors.border)",
      borderRadius: "10px",
      backgroundColor: "paper",
    },
  },
});

const BoxName = styled("span", {
  base: {
    fontWeight: 600,
  },
});

const EditGroup = styled("div", {
  base: {
    display: "flex",
    flex: 1,
    minWidth: 0,
  },
});
