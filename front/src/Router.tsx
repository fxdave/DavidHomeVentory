import {Navigate, Route, Routes} from "react-router-dom";
import React, {ReactElement, Suspense} from "react";
import {useAuth} from "services/useAuth";

export const ROUTES = {
  LOGIN: "/login",
  STICKERS: "/stickers",
  ITEMS: (subPath?: string) => `/items${subPath ? "/" + subPath : ""}`,
  OPEN_ITEM: (itemId: string) => `/open-item/${itemId}`,
};

const Login = React.lazy(() => import("./modules/Auth/LoginPage"));
const Items = React.lazy(() => import("./modules/Items/ItemsPage"));
const StickerPage = React.lazy(() => import("./modules/Sticker/StickerPage"));

const withLoader = (element: ReactElement) => (
  <Suspense fallback={<></>}>{element}</Suspense>
);

export default function Router() {
  const auth = useAuth();
  if (auth.isLoggedIn) {
    return (
      <>
        <Routes>
          <Route path={ROUTES.ITEMS("*")} element={withLoader(<Items />)} />
          <Route
            path={ROUTES.OPEN_ITEM(":id")}
            element={withLoader(<Items />)}
          />
          <Route path={ROUTES.STICKERS} element={withLoader(<StickerPage />)} />
          <Route path="*" element={<Navigate to={ROUTES.ITEMS()} replace />} />
        </Routes>
      </>
    );
  } else {
    return (
      <Routes>
        <Route path={ROUTES.LOGIN} element={withLoader(<Login />)} />
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    );
  }
}
