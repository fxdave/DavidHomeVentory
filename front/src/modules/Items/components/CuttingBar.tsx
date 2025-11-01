import {styled} from "@macaron-css/react";
import {X, ClipboardPaste} from "lucide-react";
import {WarehouseEntryWithPath} from "../../../../../back/src/modules/warehouse";
import {IconButton} from "@ui/Button";

export function CuttingBar(props: CuttingAppBarProps) {
  return (
    <AppBar>
      <Toolbar>
        <Text>
          You cut <b>{props.item.name}</b>
        </Text>
        <Spacer />
        <IconButton onClick={() => props.onPaste()}>
          <ClipboardPaste size={20} />
        </IconButton>
        <IconButton onClick={() => props.onCancel()}>
          <X size={20} />
        </IconButton>
      </Toolbar>
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
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1e1e1e",
    borderTop: "1px solid #333",
  },
});

const Toolbar = styled("div", {
  base: {
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
});

const Text = styled("p", {
  base: {
    margin: 0,
    color: "#fff",
  },
});

const Spacer = styled("div", {
  base: {
    flexGrow: 1,
  },
});
