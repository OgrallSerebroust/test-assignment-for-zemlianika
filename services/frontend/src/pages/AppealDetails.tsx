import { getRouteApi, Link } from "@tanstack/react-router";
import { appealStatusLabels } from "@/entities/appeal/model/appeal-status";
import useAppeal from "@/entities/appeal/model/useAppeal";
import AppealDate from "@/entities/appeal/ui/AppealDate";
import styles from "./Appeals.module.css";

const route = getRouteApi("/appeals/$appealId");

export default function AppealDetails() {
  const { appealId } = route.useParams();
  const search = route.useSearch();
  const query = useAppeal(appealId);
  const appeal = query.data;

  return (
    <article className={styles.appealsBlock}>
      <Link to="/" search={search}>К списку обращений</Link>
      <h1>Обращение № {appealId}</h1>
      {query.isPending && <p role="status">Загрузка обращения…</p>}
      {query.isError && <p role="alert">Не удалось загрузить обращение.</p>}
      {appeal === null && <p>Обращение не найдено.</p>}
      {appeal && (
        <dl>
          <dt>ФИО</dt><dd>{appeal.full_name}</dd>
          <dt>Текст обращения</dt><dd>{appeal.appeal}</dd>
          <dt>Статус</dt><dd>{appealStatusLabels[appeal.status]}</dd>
          {appeal.failure_reason && (
            <><dt>Причина ошибки</dt><dd>{appeal.failure_reason}</dd></>
          )}
          <dt>Создано</dt><dd><AppealDate value={appeal.created_at} /></dd>
          <dt>Обновлено</dt><dd><AppealDate value={appeal.updated_at} /></dd>
        </dl>
      )}
    </article>
  );
}
