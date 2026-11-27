import type { AppealListParams } from "./appeal.types";

export const appealQueryKeys = {
  list: (params: AppealListParams) => ["appeals", "list", params] as const,
  detail: (id: string) => ["appeals", "detail", id] as const,
}
