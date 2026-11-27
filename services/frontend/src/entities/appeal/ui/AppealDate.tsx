const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function AppealDate({ value }: { value: string }) {
  return <time dateTime={value}>{dateFormatter.format(new Date(value))}</time>;
}
