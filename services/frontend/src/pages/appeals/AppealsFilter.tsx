import { appealStatusLabels } from "@/entities/appeal/model/appeal-status";

interface AppealsFilterProps {
  onChange: (status: string) => void;
  status: string;
}

export default function AppealsFilter({
  onChange,
  status,
}: AppealsFilterProps) {
  return (
    <label>
      Статус{" "}
      <select value={status} onChange={(event) => onChange(event.target.value)}>
        <option value="">
          Все статусы
        </option>
        {Object.entries(appealStatusLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
