import {createRoot} from "react-dom/client";
import {StrictMode, useEffect} from "react";
import Router, {ROUTES} from "Router";
import {HashRouter, useNavigate} from "react-router-dom";
import {App, URLOpenListenerEvent} from "@capacitor/app";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";
import {CupleProvider} from "@cuple/react";
import {store} from "services/cuple";
import "@fontsource-variable/atkinson-hyperlegible-next";
import SourceCodeProBold from "./assets/SourceCodePro-Bold.ttf?url";
import "./panda.css";

const AppUrlListener = () => {
  const navigate = useNavigate();
  useEffect(() => {
    App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
      const itemId = event.url.split("://").pop();
      if (itemId) {
        navigate(ROUTES.OPEN_ITEM(itemId));
      }
    });
  }, []);

  return null;
};

const element = document.getElementById("root");
if (!element) throw new Error("could not found the root element");
const root = createRoot(element);
root.render(
  <StrictMode>
    <GlobalStyles />
    <CupleProvider
      store={store}
      config={{
        errors: {
          notify: error => toast(error.message, {type: "error"}),
          // A failed write shows as a toast; the page stays.
          onError: "notify",
        },
      }}>
      <HashRouter>
        <AppUrlListener />
        <Router />
      </HashRouter>
    </CupleProvider>
    <ToastContainer theme="dark" position="bottom-center" />
  </StrictMode>,
);

function GlobalStyles() {
  return (
    <style>
      {`
        @font-face {
          font-family: "SourceCodePro";
          src: url("${SourceCodeProBold}");
          font-weight: 700;
        }
      `}
    </style>
  );
}
