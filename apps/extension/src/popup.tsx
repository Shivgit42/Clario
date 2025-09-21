import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import PopupApp from "./components/PopupApp";

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <PopupApp />
    </StrictMode>
  );
}
