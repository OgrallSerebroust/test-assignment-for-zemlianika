import { createFileRoute } from "@tanstack/react-router";
import AppealCreate from "@/pages/AppealCreate";

export const Route = createFileRoute("/appeals/new")({
  component: AppealCreate,
});
