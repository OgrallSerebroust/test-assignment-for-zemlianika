import { createFileRoute } from "@tanstack/react-router";
import { validateAppealSearch } from "@/pages/appeals/appeal-search";
import AppealDetails from "@/pages/AppealDetails";

export const Route = createFileRoute("/appeals/$appealId")({
  validateSearch: validateAppealSearch,
  component: AppealDetails,
});
