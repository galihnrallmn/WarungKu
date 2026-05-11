import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { loadDummyData } from "./utils/dummyData";

// Load data dummy untuk presentasi
loadDummyData();

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
