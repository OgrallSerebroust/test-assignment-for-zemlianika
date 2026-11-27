import type Appeal from "./appeal.types";

export const appealStatusLabels: Record<Appeal["status"], string> = {
  queued: "В очереди",
  processing: "В обработке",
  done: "Выполнено",
  failed: "Ошибка",
};

export function isAppealStatus(value: unknown): value is Appeal["status"] {
  return typeof value === "string" && Object.hasOwn(appealStatusLabels, value);
}
