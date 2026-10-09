import {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {ROUTES} from "Router";
import {WarehouseEntryWithPath} from "../../../../back/src/modules/warehouse";

export type PathSegment = {name: string; id: string};

export const DEFAULT_PATH: PathSegment[] = [
  {
    name: "root",
    id: "ROOT",
  },
];

/** History entries saved before the root became the top still start with an "everything" segment. */
function withoutEverything(path: {name: string; id: string | null}[]) {
  const segments = path.filter(
    (segment): segment is PathSegment => segment.id !== null,
  );
  return segments.length > 0 ? segments : DEFAULT_PATH;
}

export function useNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [path, setPath] = useState<PathSegment[]>(
    location.state?.path
      ? withoutEverything(location.state.path)
      : DEFAULT_PATH,
  );
  const [keyword, setKeyword] = useState<string>("");

  // Sync state when location changes (browser back/forward)
  useEffect(() => {
    const savedPath = location.state?.path;
    if (savedPath) {
      setPath(withoutEverything(savedPath));
    } else if (
      location.pathname === "/items" ||
      location.pathname === "/items/"
    ) {
      setPath(DEFAULT_PATH);
    }
  }, [location.key, location.pathname]);

  function rebuildPath(path: PathSegment[]) {
    const newPath = path
      .map(segment =>
        segment.name.replace(/\*/, "_").replace(/[^a-zA-Z0-9\-_]/g, ""),
      )
      .join("/");

    navigate(ROUTES.ITEMS(newPath), {state: {path}});
  }

  function goForward(id: string, name: string) {
    const newPath = [...path, {id, name}];
    setPath(newPath);
    rebuildPath(newPath);
    setKeyword("");
  }

  function goBack(id: string) {
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
      // parents, starting with the root
      ...entry.path,
      // the container
      {
        id: entry.id,
        name: entry.name,
      },
    ];
    setPath(newPath);
    rebuildPath(newPath);
    setKeyword("");
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
