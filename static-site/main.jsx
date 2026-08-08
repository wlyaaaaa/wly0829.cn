import React from "react";
import { createRoot } from "react-dom/client";
import Page from "../app/page.jsx";
import "../app/style.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
