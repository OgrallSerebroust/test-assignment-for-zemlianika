import { createFileRoute } from "@tanstack/react-router";
import { validateAppealSearch } from "@/pages/appeals/appeal-search";
import Appeals from "@/pages/Appeals";

export const Route = createFileRoute("/")({
  validateSearch: validateAppealSearch,
  component: Appeals,
});
