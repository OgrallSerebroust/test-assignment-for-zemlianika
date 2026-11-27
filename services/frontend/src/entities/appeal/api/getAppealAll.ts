import type { default as Appeal, AppealListParams } from "../model/appeal.types";

interface AppealPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: Appeal[];
}

export default async function getAppealAll(
  { page, status }: AppealListParams,
  signal?: AbortSignal,
): Promise<AppealPage> {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set("status", status);
  const response = await fetch(`/api/appeals/?${params}`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error(`Не удалось загрузить обращения (${response.status})`);
  return response.json();
}
