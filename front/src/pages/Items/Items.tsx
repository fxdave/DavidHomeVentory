import { AppBar, Box, Breadcrumbs, Button, Divider, InputAdornment, ListItemButton, TextField, Toolbar, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { useApi } from "services/useApi";
import SaveIcon from '@mui/icons-material/Save'
import { useInvalidate } from "utils/useInvalidate";
import { AllInbox, Close, ContentCut, ContentPaste, Edit, Inbox, Save, Search } from "@mui/icons-material";
import { Container } from "@mui/system";
import { SafeDeleteButton } from "./SafeDelete";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "Router";
import { useLoggedInAuth } from "services/useAuth";
import { WarehouseEntryWithPath } from "../../../../new-back/src/modules/warehouse";
import { WarehouseEntryVariant } from "../../../../new-back/src/modules/warehouse/models";

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
    let newPath = path.map(segment => segment.name.replace(/\*/, '_').replace(/[^a-zA-Z0-9\-\_]/g, '')).join('/')
    console.log(path);

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
    rebuildPath(DEFAULT_PATH)
  }

  function initFromParent(entry: WarehouseEntryWithPath) {
    const newPath = [
      // asterix
      DEFAULT_PATH[0],
      // parents
      ...entry.path,
      // the container
      {
        id: entry.id,
        name: entry.name
      }
    ];
    setPath(newPath)
    rebuildPath(newPath)
  }

  const parent = path[path.length - 1]

  return {
    parent,
    path,
    initFromParent,
    goForward,
    goBack,
    reset,
    isDirty: path.length !== DEFAULT_PATH.length
  }
}

export default function ItemsScreen() {
  const auth = useLoggedInAuth();
  const { authedApi } = useApi();
  const [keyword, setKeyword] = useState<string>("");
  const nav = useNavigation();
  const [list, setList] = useState<WarehouseEntryWithPath[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [cutting, setCutting] = useState<null | { item: WarehouseEntryWithPath }>(null)
  const listInvalidate = useInvalidate();
  const query = useParams()

  useEffect(() => {
    const initialItemId = query['id']
    if (initialItemId) {
      authedApi().warehouse.getOrCreate.post({
        query: {
          id: initialItemId
        }
      }).then((response) => {
        if (response.result === 'success') {
          nav.initFromParent(response.entry)
        }
      })
    }
  }, [query])

  useEffect(() => {
    authedApi().warehouse.list.get({
      query: {
        keyword: keyword,
        parentId: nav.parent.id,
      }
    }
    )
      .then((res) => {
        if (res.result === 'success') {
          setList(res.list)
        }
      })
      .catch(console.error);
  }, [keyword, parent, listInvalidate.id, nav.path]);

  function createItem() {
    authedApi().warehouse.create.post({
      body: {
        name: newItemName,
        parentId: nav.parent.id,
        id: null
      }
    }).then(() => {
      listInvalidate.invalidate()
      setNewItemName("")
    })
  }

  function paste() {
    if (cutting && nav.parent.id)
      authedApi().warehouse.update.put({
        body: {
          id: cutting.item.id,
          name: cutting.item.name,
          variant: cutting.item.variant,
          parentId: nav.parent.id
        }
      }).then(() => {
        setCutting(null);
        listInvalidate.invalidate()
      })
  }

  return (
    <Container style={{ overflow: 'auto', height: '100vh' }}>
      <h1>Items</h1>
      {cutting && <AppBar position="fixed" sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Typography>You cut <b>{cutting.item.name}</b></Typography>
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
              authedApi().warehouse.delete.delete({ query: { id: item.id } }).then(() => {
                listInvalidate.invalidate()
              })
            }}
            onGoForward={() => {
              nav.goForward(item.id, item.name)
            }}
            onEdit={(newEntry) => {
              authedApi().warehouse.update.put({ body: newEntry }).then(() => {
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
  item: WarehouseEntryWithPath,
  onDelete: () => void
  onGoForward: () => void,
  onCutStart: () => void,
  onEdit: (entry: WarehouseEntryWithPath) => void,
  cutting: null | { item: WarehouseEntryWithPath }
}

function Item(props: ItemProps) {
  const [editing, setEditing] = useState<null | {
    title: string
  }>(null)

  function save() {
    if (editing)
      props.onEdit({
        ...props.item,
        name: editing.title
      });
    setEditing(null)
  }

  return <ListItem>
    <ListItemAvatar>
      <Avatar>
        {props.item.variant === WarehouseEntryVariant.Container ? <AllInbox /> : <Inbox />}
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
          primary={`${props.isSearch
            ? props.item.path.map(s => s.name).join(' / ') + " / "
            : ""
            } ${props.item.name}`}
          secondary={props.item.id}
        />
      </ListItemButton>
    }
    <>
      {editing && <IconButton edge="end" onClick={() => save()}>
        <Save />
      </IconButton>}
      {!editing && <IconButton edge="end" onClick={() => setEditing({ title: props.item.name })} disabled={!!props.cutting}>
        <Edit />
      </IconButton>}
      <IconButton edge="end" disabled={!!props.cutting} onClick={() => {
        props.onCutStart()
      }}>
        <ContentCut />
      </IconButton>
      <SafeDeleteButton edge="end" disabled={props.item.variant === WarehouseEntryVariant.Container || !!props.cutting} onClick={() => {
        props.onDelete()
      }} />
    </>
  </ListItem>
}