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
import {boxLidColors} from "utils/boxHue";

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
      style={isContainer ? boxLidColors(props.item.id) : {}}
      onClick={editing ? undefined : () => props.onGoForward()}
      disabled={props.cutting?.item.id == props.item.id}
      data-editing={isEditing}>
      {isContainer && (
        <Sticker>
          <QrCode size={18} />
        </Sticker>
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

/** The QR icon sits on a little white sticker, like the label in the logo. */
const Sticker = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    marginRight: "10px",
    borderRadius: "4px",
    backgroundColor: "#f4f4f1",
    color: "#15171c",
    flexShrink: 0,
    boxShadow: "0 1px 0 rgba(0, 0, 0, 0.3)",
  },
});

/** A box is drawn as a shoe box: a cardboard body with a lid that lifts on hover. */
const StyledListItem = styled(ListItem, {
  base: {
    "&[data-container='true']": {
      marginTop: "16px",
      marginBottom: "7px",
      border: "1px solid token(colors.cardboardEdge)",
      borderLeft: "3px solid token(colors.cardboardEdge)",
      borderRadius: "0 0 6px 6px",
      backgroundColor: "cardboard",
      boxShadow: "2px 2px 0 rgba(0, 0, 0, 0.25)",
    },
    "&[data-container='true']::before": {
      content: '""',
      position: "absolute",
      top: "-11px",
      left: "-5px",
      right: "-5px",
      height: "15px",
      backgroundColor: "var(--lid)",
      border: "1px solid var(--lid-edge)",
      borderBottomWidth: "3px",
      borderRadius: "5px 5px 2px 2px",
      boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.18)",
      transition: "transform 0.2s ease-out",
      transformOrigin: "bottom center",
    },
    "&[data-container='true']:hover::before, &[data-container='true']:focus-within::before, &[data-container='true'][data-editing='true']::before":
      {
        transform: "translateY(-4px) rotate(0.3deg)",
      },
  },
});

const BoxName = styled("span", {
  base: {
    fontFamily: "label",
    fontWeight: 700,
  },
});

const EditGroup = styled("div", {
  base: {
    display: "flex",
    flex: 1,
    minWidth: 0,
  },
});
