import {createRoot} from "react-dom/client";
import {StrictMode, useEffect} from "react";
import Router, {ROUTES} from "Router";
import {HashRouter, useNavigate} from "react-router-dom";
import {App, URLOpenListenerEvent} from "@capacitor/app";
import "react-toastify/dist/ReactToastify.css";
import {ToastContainer} from "react-toastify";

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
    <HashRouter>
      <AppUrlListener />
      <Router />
    </HashRouter>
    <ToastContainer />
  </StrictMode>,
);

function GlobalStyles() {
  return (
    <style>
      {`
        body {
          margin: 0;
          background-color: #121212;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}
    </style>
  );
}
