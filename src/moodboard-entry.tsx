import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import MoodboardPage from "./pages/MoodboardPage";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MoodboardPage />
  </StrictMode>,
);
