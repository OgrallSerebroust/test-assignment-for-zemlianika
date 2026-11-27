import { Link, useNavigate } from "@tanstack/react-router";
import { appealStatusLabels } from "@/entities/appeal/model/appeal-status";
import type { default as Appeal, AppealListParams } from "@/entities/appeal/model/appeal.types";
import AppealDate from "@/entities/appeal/ui/AppealDate";

interface TableProps {
  appeals: readonly Appeal[];
  search: AppealListParams;
};

export default function Table({
  appeals, search,
}: TableProps) {
  const navigate = useNavigate({ from: "/" });

  return (
    <table>
      <caption>
        Список обращений
      </caption>
      <thead>
        <tr>
          <th scope="col">
            №
          </th>
          <th scope="col">
            ФИО
          </th>
          <th scope="col">
            Обращение
          </th>
          <th scope="col">
            Статус
          </th>
          <th scope="col">
            Причина ошибки
          </th>
          <th scope="col">
            Создано
          </th>
          <th scope="col">
            Обновлено
          </th>
        </tr>
      </thead>
      <tbody>
        {appeals.map((appeal) => (
          <tr key={appeal.id} onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a")) return;
            void navigate({ to: "/appeals/$appealId", params: { appealId: String(appeal.id) }, search });
          }}>
            <th scope="row">
              <Link to="/appeals/$appealId" params={{ appealId: String(appeal.id) }} search={search}>
                {appeal.id}
              </Link>
            </th>
            <td>
              {appeal.full_name}
            </td>
            <td>
              {appeal.appeal}
            </td>
            <td>
              {appealStatusLabels[appeal.status]}
            </td>
            <td>
              {appeal.failure_reason || "—"}
            </td>
            <td>
              <AppealDate value={appeal.created_at} />
            </td>
            <td>
              <AppealDate value={appeal.updated_at} />
            </td>
          </tr>
        ))}
        {appeals.length === 0 && (
          <tr>
            <td colSpan={7}>
              Обращений нет
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
