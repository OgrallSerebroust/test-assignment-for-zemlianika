import { createRoot } from "react-dom/client";
import { router } from "@/app/router/router";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import QueryProvider from "./app/providers/QueryProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  </StrictMode>
)
