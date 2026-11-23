import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { TarotProvider } from "./context/TarotContext";

import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/manage.css";
import "./styles/motion-overrides.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TarotProvider>
        <App />
      </TarotProvider>
    </BrowserRouter>
  </React.StrictMode>
);
