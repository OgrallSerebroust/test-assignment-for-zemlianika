import type { AppealListParams } from "./appeal.types";

const lists = ["appeals", "list"] as const;

export const appealQueryKeys = {
  lists,
  list: (params: AppealListParams) => [...lists, params] as const,
  detail: (id: string) => ["appeals", "detail", id] as const,
}
