import {styled} from "styled-system/jsx";
import {X, ClipboardPaste} from "lucide-react";
import {WarehouseEntryWithPath} from "../../../../../back/src/modules/warehouse";
import {Button, IconButton} from "@ui/Button";

export function CuttingBar(props: CuttingAppBarProps) {
  return (
    <AppBar role="status">
      <Text>
        Moving <b>{props.item.name}</b>
      </Text>
      <Button onClick={() => props.onPaste()}>
        <ClipboardPaste size={18} /> Move here
      </Button>
      <IconButton onClick={() => props.onCancel()} aria-label="Cancel move">
        <X size={20} />
      </IconButton>
    </AppBar>
  );
}
type CuttingAppBarProps = {
  item: WarehouseEntryWithPath;
  onPaste: () => void;
  onCancel: () => void;
};

const AppBar = styled("div", {
  base: {
    position: "fixed",
    bottom: "12px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "min(688px, calc(100% - 24px))",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 8px 8px 16px",
    backgroundColor: "raised",
    border: "1px solid token(colors.border)",
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
    zIndex: 9,
  },
});

const Text = styled("p", {
  base: {
    flex: 1,
    minWidth: 0,
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
});
