import { getRouteApi } from "@tanstack/react-router";
import { isAppealStatus } from "@/entities/appeal/model/appeal-status";
import AppealsFilter from "./appeals/AppealsFilter";
import AppealsPagination from "./appeals/AppealsPagination";
import styles from "./Appeals.module.css";
import Table from "./appeals/Table";
import useAppealAll from "@/entities/appeal/model/useAppealAll";

const route = getRouteApi("/");

export default function Appeals() {
  const params = route.useSearch();
  const navigate = route.useNavigate();
  const query = useAppealAll(params);
  return (
    <div className={styles.appealsBlock}>
      <AppealsFilter
        status={params.status ?? ""}
        onChange={(value) => void navigate({
          search: { page: 1, ...(isAppealStatus(value) ? { status: value } : {}) },
        })}
      />
      {query.isPending && <p role="status">Загрузка обращений…</p>}
      {query.isError && <p role="alert">Не удалось загрузить обращения.</p>}
      {query.data && (
        <>
          <Table appeals={query.data.results} search={params} />
          <AppealsPagination
            hasNext={query.data.next !== null}
            hasPrevious={query.data.previous !== null}
            onPageChange={(page) => void navigate({ search: { ...params, page } })}
            page={params.page}
          />
        </>
      )}
    </div>
  );
}
