import { createRoot } from "react-dom/client";
import { router } from "@/app/router/router";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
