import React from "react";
import ReactDOM from "react-dom/client"; // Use ReactDOM from react-dom/client
import App from "./App";
import "./index.css";

// Create a root for rendering
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
