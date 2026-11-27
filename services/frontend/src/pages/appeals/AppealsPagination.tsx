interface AppealsPaginationProps {
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  page: number;
}

export default function AppealsPagination({
  hasNext,
  hasPrevious,
  onPageChange,
  page, 
}: AppealsPaginationProps) {
  if (!hasPrevious && !hasNext) return null;
  return (
    <nav aria-label="Страницы обращений">
      <button
        disabled={!hasPrevious}
        onClick={() => onPageChange(page - 1)}
        type="button"
      >
        Назад
      </button>
      {" "}Страница {page}{" "}
      <button
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        type="button"
      >
        Далее
      </button>
    </nav>
  );
}
