import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./estilo.css";
import App from "./App.jsx";
import { iniciarNuvem } from "./nucleo/nuvem.js";
createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);
iniciarNuvem();
if ("serviceWorker" in navigator && location.protocol === "https:") addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
