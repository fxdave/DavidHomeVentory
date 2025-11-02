/* eslint-disable sonarjs/no-duplicate-string */
import {memo, useState} from "react";
import {Scissors, Pencil, Save, QrCode} from "lucide-react";
import {styled} from "styled-system/jsx";
import {SafeDeleteButton} from "./SafeDelete";
import {WarehouseEntryVariant} from "../../../../../back/src/modules/warehouse/models";
import {WarehouseEntryWithPath} from "../../../../../back/src/modules/warehouse";
import {TextField} from "@ui/Input";
import {IconButton} from "@ui/Button";
import {ListItem, ListItemText} from "./List";

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
  const isContainer = props.item.variant === WarehouseEntryVariant.Container;

  return (
    <StyledListItem
      data-isContainer={isContainer}
      onClick={editing ? undefined : () => props.onGoForward()}
      disabled={props.cutting?.item.id == props.item.id}
      data-editing={!!editing}>
      {isContainer && (
        <QrIconWrapper>
          <QrCode size={24} />
        </QrIconWrapper>
      )}
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
        <ListItemText
          primary={`${
            props.isSearch
              ? props.item.path.map(s => s.name).join(" / ") + " / "
              : ""
          } ${props.item.name}`}
          secondary={props.item.id}
        />
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
    </StyledListItem>
  );
}
export const Item = memo(
  ItemRaw,
  (prev, next) =>
    prev.item.id == next.item.id &&
    prev.isSearch == next.isSearch &&
    prev.cutting?.item?.id == next.cutting?.item?.id,
);

const QrIconWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    marginRight: "12px",
    color: "primary",
    flexShrink: 0,
  },
});

const StyledListItem = styled(ListItem, {
  base: {
    "&[data-isContainer='true']": {
      position: "relative",
      marginTop: "16px",
      border: "1px solid token(colors.border)",
      borderLeft: "3px solid token(colors.border)",
      borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "0 0 4px 4px",
      backgroundColor: "rgba(144, 202, 249, 0.04)",
      marginBottom: "7px",
      boxShadow:
        "2px 2px 0 rgba(0, 0, 0, 0.2), inset -1px 0 0 rgba(0, 0, 0, 0.1)",
      "&::before": {
        content: '""',
        position: "absolute",
        top: "-10px",
        left: "-4px",
        right: "-4px",
        height: "14px",
        backgroundColor: "paper",
        border: "1px solid token(colors.border)",
        borderBottom: "none",
        boxShadow:
          "inset 0 1px 0 rgba(255, 255, 255, 0.1), 1px -1px 0 rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s ease-out",
        transformOrigin: "bottom center",
        borderRadius: "4px 4px 0 0",
      },
      "&:hover::before": {
        transform: "translateY(-4px) rotate(0.3deg)",
      },
      "&:focus-within::before": {
        transform: "translateY(-4px) rotate(0.3deg)",
      },
      "&[data-editing='true']::before": {
        transform: "translateY(-4px) rotate(0.3deg)",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: "0",
        left: "0",
        right: "0",
        height: "1px",
        background:
          "linear-gradient(to right, token(colors.border) 0%, transparent 50%, token(colors.border) 100%)",
      },
    },
  },
});

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
  },
});

const EditSaveButton = styled(IconButton, {
  base: {
    borderRadius: "0 4px 4px 0",
    backgroundColor: "paper",
    border: "1px solid token(colors.border)",
    borderLeft: "none",
    minWidth: "48px",
    "&:hover:not(:disabled)": {
      backgroundColor: "hover",
      borderColor: "primary",
    },
  },
});
