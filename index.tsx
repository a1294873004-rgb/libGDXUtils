import { createRoot } from "react-dom/client";
import "./auto-gen-data/svg";
import "./index.less";
import { App } from "./src";
import { MarqueeTags } from "src/MarqueeTags";

// createRoot(document.getElementById("root")!).render(<App />);
createRoot(document.getElementById("root")!).render(<MarqueeTags />);
