import type Appeal from "../model/appeal.types";

export default async function getAppeal(id: string, signal?: AbortSignal): Promise<Appeal | null> {
  const response = await fetch(`/api/appeals/${encodeURIComponent(id)}/`, {
    headers: { Accept: "application/json" },
    signal,
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Не удалось загрузить обращение (${response.status})`);
  return response.json();
}
