import type { SubmitEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import createAppeal, { AppealValidationError } from "@/entities/appeal/api/createAppeal";
import { appealQueryKeys } from "@/entities/appeal/model/appeal.keys";
import styles from "./AppealCreate.module.css";

export default function AppealCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createAppeal,
    onSuccess: (appeal) => {
      void queryClient.invalidateQueries({ queryKey: appealQueryKeys.lists });
      return navigate({
        to: "/appeals/$appealId",
        params: { appealId: String(appeal.id) },
        search: { page: 1 },
      });
    },
  });
  const errors = mutation.error instanceof AppealValidationError ? mutation.error.errors : {};

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mutation.isPending) return;

    const form = new FormData(event.currentTarget);
    mutation.mutate({
      full_name: String(form.get("full_name") ?? "").trim(),
      appeal: String(form.get("appeal") ?? "").trim(),
    });
  }

  return (
    <section className={styles.page}>
      <Link to="/" search={{ page: 1 }}>К списку обращений</Link>
      <h1>Создать обращение</h1>
      <form className={styles.form} onSubmit={handleSubmit} aria-busy={mutation.isPending}>
        <label htmlFor="full_name">ФИО</label>
        <input
          id="full_name"
          name="full_name"
          required
          maxLength={255}
          autoComplete="name"
          aria-invalid={Boolean(errors.full_name)}
          aria-describedby={errors.full_name ? "full-name-error" : undefined}
        />
        {errors.full_name && <p id="full-name-error" role="alert">{errors.full_name.join(" ")}</p>}
        <label htmlFor="appeal">Текст обращения</label>
        <textarea
          id="appeal"
          name="appeal"
          required
          rows={6}
          aria-invalid={Boolean(errors.appeal)}
          aria-describedby={errors.appeal ? "appeal-error" : undefined}
        />
        {errors.appeal && <p id="appeal-error" role="alert">{errors.appeal.join(" ")}</p>}
        {mutation.isError && (errors.non_field_errors || (!errors.full_name && !errors.appeal)) && (
          <p role="alert">
            {errors.non_field_errors?.join(" ") ?? "Не удалось создать обращение. Попробуйте ещё раз."}
          </p>
        )}
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Отправка…" : "Создать обращение"}
        </button>
      </form>
    </section>
  );
}
