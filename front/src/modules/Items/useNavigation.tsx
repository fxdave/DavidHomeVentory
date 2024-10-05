import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "Router";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";

export const DEFAULT_PATH = [
  {
    name: "*",
    id: null,
  },
  {
    name: "root",
    id: "ROOT",
  },
];

export function useNavigation() {
  const navigate = useNavigate();
  const [path, setPath] =
    useState<{name: string; id: string | null}[]>(DEFAULT_PATH);
  const [keyword, setKeyword] = useState<string>("");

  function rebuildPath(path: {name: string; id: string | null}[]) {
    const newPath = path
      .map(segment =>
        segment.name.replace(/\*/, "_").replace(/[^a-zA-Z0-9\-_]/g, ""),
      )
      .join("/");

    navigate(ROUTES.ITEMS(newPath));
  }

  function goForward(id: string | null, name: string) {
    const newPath = [...path, {id, name}];
    setPath(newPath);
    rebuildPath(newPath);
  }

  function goBack(id: string | null) {
    const idx = path.findIndex(segment => segment.id === id);
    const newPath = path.slice(0, idx + 1);
    setPath(newPath);
    rebuildPath(newPath);
  }

  function reset() {
    setPath(DEFAULT_PATH);
    rebuildPath(DEFAULT_PATH);
    setKeyword("");
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
        name: entry.name,
      },
    ];
    setPath(newPath);
    rebuildPath(newPath);
  }

  const parent = path[path.length - 1];

  return {
    parent,
    path,
    initFromParent,
    goForward,
    goBack,
    reset,
    isDirty: path.length !== DEFAULT_PATH.length || keyword,
    keyword,
    setKeyword,
  };
}

export type Navigation = ReturnType<typeof useNavigation>;
