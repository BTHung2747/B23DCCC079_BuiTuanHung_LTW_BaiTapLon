import React from "react";
import ReactDOM from "react-dom/client"; // Import the new root API
import App from "./App"; // Your App component
import "./index.css"; // Global styles (if applicable)

const rootElement = document.getElementById("root");


const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
