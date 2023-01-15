import { AppBar, Box, Breadcrumbs, Button, Divider, Grid, InputAdornment, ListItemButton, TextField, Toolbar, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { useApi } from "services/useApi";
import { WarehouseEntry, WarehouseEntryInserted, WarehouseEntryInsertedWithPath } from "../../../../back/ts-warehouse-api/types";
import SaveIcon from '@mui/icons-material/Save'
import { useInvalidate } from "utils/useInvalidate";
import { AllInbox, Close, ContentCut, ContentPaste, DragIndicator, Edit, Inbox, Save, Search } from "@mui/icons-material";
import { Container } from "@mui/system";
import { SafeDeleteButton } from "./SafeDelete";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "Router";
import { useLoggedInAuth } from "services/useAuth";

const DEFAULT_PATH = [
  {
    name: '*',
    id: null
  },
  {
    name: 'root',
    id: 'ROOT'
  }];

function useNavigation() {
  const navigate = useNavigate()
  const [path, setPath] = useState<{ name: string, id: string | null }[]>(DEFAULT_PATH)

  function rebuildPath(path: { name: string, id: string | null }[]) {
    let newPath = path.map(segment => segment.name.replace(/[^a-zA-Z0-9\-\_]/g, '')).join('/')
    navigate(ROUTES.ITEMS(newPath))
  }

  function goForward(id: string | null, name: string) {
    const newPath = [...path, { id, name }];
    setPath(newPath)
    rebuildPath(newPath)
  }

  function goBack(id: string | null) {
    let idx = path.findIndex(segment => segment.id === id)
    let newPath = path.slice(0, idx + 1);
    setPath(newPath)
    rebuildPath(newPath)
  }

  function reset() {
    setPath(DEFAULT_PATH)
  }

  const parent = path[path.length - 1]

  return {
    parent,
    path,
    goForward,
    goBack,
    reset,
    isDirty: path.length !== DEFAULT_PATH.length
  }
}

export default function ItemsScreen() {
  const auth = useLoggedInAuth();
  const { api } = useApi();
  const [keyword, setKeyword] = useState<string>("");
  const nav = useNavigation();
  const [list, setList] = useState<WarehouseEntryInsertedWithPath[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [cutting, setCutting] = useState<null | { item: WarehouseEntryInserted }>(null)
  const listInvalidate = useInvalidate();

  useEffect(() => {
    if (!api) throw new Error("API is not set");

    api.WarehouseRawClient.list(
      keyword ? keyword : null,
      nav.parent.id,
      auth.token
    )
      .then((res) => {
        if (res.type === 'Success') {
          setList(res.list)
        }
      })
      .catch(console.error);
  }, [keyword, parent, listInvalidate.id, nav.path]);

  function createItem() {
    api?.WarehouseRawClient.create({
      name: newItemName,
      parent_id: nav.parent.id
    },
      auth.token).then(() => {
        listInvalidate.invalidate()
        setNewItemName("")
      })
  }

  function paste() {
    if (cutting && nav.parent.id)
      api?.WarehouseRawClient.put(cutting.item.id, {
        ...cutting.item.entry,
        parent_id: nav.parent.id
      },
        auth.token).then(() => {
          setCutting(null);
          listInvalidate.invalidate()
        })
  }

  return (
    <Container style={{ overflow: 'auto', height: '100vh' }}>
      <h1>Items</h1>
      {cutting && <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Typography>You cut <b>{cutting.item.entry.name}</b></Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton edge="end" onClick={() => paste()}>
            <ContentPaste />
          </IconButton>
          <IconButton edge="end" onClick={() => setCutting(null)}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>}

      <TextField
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        fullWidth
        label="Find something"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <div style={{ display: 'flex' }}>
        <Breadcrumbs style={{ flex: 1 }}>
          {nav.path.map(segment => <Button key={segment.id} onClick={() => {
            nav.goBack(segment.id)
          }}>{segment.name}</Button>)}
        </Breadcrumbs>
        {nav.isDirty && <Button style={{ flex: 0 }} onClick={() => { nav.reset() }}>RESET</Button>}
      </div>


      <List>
        {list.map((item) => (
          <Item
            key={item.id}
            isSearch={!!keyword}
            item={item}
            onDelete={() => {
              api?.WarehouseRawClient.delete(item.id, auth.token).then(() => {
                listInvalidate.invalidate()
              })
            }}
            onGoForward={() => {
              nav.goForward(item.id, item.entry.name)
            }}
            onEdit={(newEntry) => {
              api?.WarehouseRawClient.put(item.id, newEntry, auth.token).then(() => {
                listInvalidate.invalidate()
              })
            }}
            onCutStart={() => {
              setCutting({ item })
            }}
            cutting={cutting}
          />
        ))}
        <ListItem
          secondaryAction={
            <IconButton edge="end" onClick={createItem} disabled={!!cutting}>
              <SaveIcon />
            </IconButton>
          }
        >
          <TextField
            disabled={!!cutting}
            label="Name of the new Item or Box"
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyUp={(e) => {
              if (e.code === 'Enter') createItem()
            }}
            value={newItemName}
          />
        </ListItem>
      </List>
      <Divider>HomeVentory</Divider>
      <Button onClick={() => { auth.logout() }} fullWidth>Logout</Button>
    </ Container >
  );
}


type ItemProps = {
  isSearch: boolean,
  item: WarehouseEntryInsertedWithPath,
  onDelete: () => void
  onGoForward: () => void,
  onCutStart: () => void,
  onEdit: (entry: WarehouseEntry) => void,
  cutting: null | { item: WarehouseEntryInserted }
}

function Item(props: ItemProps) {
  const [editing, setEditing] = useState<null | {
    title: string
  }>(null)

  function save() {
    if (editing)
      props.onEdit({
        ...props.item.entry,
        name: editing.title
      });
    setEditing(null)
  }

  return <ListItem>
    <ListItemAvatar>
      <Avatar>
        {props.item.entry.variant === 'Container' ? <AllInbox /> : <Inbox />}
      </Avatar>
    </ListItemAvatar>
    {editing
      ?
      <ListItemText>
        <TextField
          fullWidth
          label="Name"
          value={editing.title}
          onChange={(e) => setEditing({ title: e.target.value })}
          onKeyUp={(e) => { if (e.code === 'Enter') save() }}
        />
      </ListItemText>
      :
      <ListItemButton disabled={props.cutting?.item.id == props.item.id}>
        <ListItemText
          onClick={() => props.onGoForward()}
          primary={`${props.isSearch ? props.item.path.join(' / ') + " / " : ""} ${props.item.entry.name}`}
          secondary={props.item.id}
        />
      </ListItemButton>
    }
    <>
      {editing && <IconButton edge="end" onClick={() => save()}>
        <Save />
      </IconButton>}
      {!editing && <IconButton edge="end" onClick={() => setEditing({ title: props.item.entry.name })} disabled={!!props.cutting}>
        <Edit />
      </IconButton>}
      <IconButton edge="end" disabled={!!props.cutting} onClick={() => {
        props.onCutStart()
      }}>
        <ContentCut />
      </IconButton>
      <SafeDeleteButton edge="end" disabled={props.item.entry.variant === "Container" || !!props.cutting} onClick={() => {
        props.onDelete()
      }} />
    </>
  </ListItem>
}