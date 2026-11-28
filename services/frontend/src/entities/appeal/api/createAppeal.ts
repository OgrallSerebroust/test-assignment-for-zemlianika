import type Appeal from "../model/appeal.types";

type AppealInput = Pick<Appeal, "full_name" | "appeal">;
type AppealErrors = Partial<Record<keyof AppealInput | "non_field_errors", string[]>>;

export class AppealValidationError extends Error {
  constructor(readonly errors: AppealErrors) {
    super("Проверьте данные обращения.");
  }
}

export default async function createAppeal(input: AppealInput): Promise<Appeal> {
  const headers = new Headers({ Accept: "application/json", "Content-Type": "application/json" });
  const csrfCookie = document.cookie.split("; ").find((cookie) => cookie.startsWith("csrftoken="));
  if (csrfCookie) {
    headers.set("X-CSRFToken", csrfCookie.slice("csrftoken=".length));
  }

  const response = await fetch("/api/appeals/", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
  });

  if (response.status === 422) {
    throw new AppealValidationError(await response.json());
  }
  if (!response.ok) {
    throw new Error(`Не удалось создать обращение (${response.status})`);
  }
  return response.json();
}
