import {AppBar, Box, Toolbar, Typography} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Close, ContentPaste} from "@mui/icons-material";
import {WarehouseEntryWithPath} from "../../../../../back/src/modules/warehouse";

export function CuttingBar(props: CuttingAppBarProps) {
  return (
    <AppBar position="fixed" sx={{top: "auto", bottom: 0}}>
      <Toolbar>
        <Typography>
          You cut <b>{props.item.name}</b>
        </Typography>
        <Box sx={{flexGrow: 1}} />
        <IconButton edge="end" onClick={() => props.onPaste()}>
          <ContentPaste />
        </IconButton>
        <IconButton edge="end" onClick={() => props.onCancel()}>
          <Close />
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
