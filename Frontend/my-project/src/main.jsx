import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import "./index.css";
/*need to add sorting for admin manage pages
also turn -1 into open speed
also show M AND D data limit
check why coverage/locations is not working */
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <HashRouter>
    <App />
  </HashRouter>
  // </React.StrictMode>
);
