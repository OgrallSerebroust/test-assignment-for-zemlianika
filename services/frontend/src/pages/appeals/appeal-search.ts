import type { AppealListParams } from "@/entities/appeal/model/appeal.types";

import { isAppealStatus } from "@/entities/appeal/model/appeal-status";

export function validateAppealSearch(search: Record<string, unknown>): AppealListParams {
  const page = typeof search["page"] === "number" ? search["page"] : 1;
  const status = search["status"];

  return {
    page: Number.isSafeInteger(page) && page > 0 ? page : 1,
    ...(isAppealStatus(status) ? { status } : {}),
  };
}
