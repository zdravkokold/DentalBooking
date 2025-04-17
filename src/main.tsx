
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initServices } from "./services/initServices";

// Initialize services
initServices().catch(console.error);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
