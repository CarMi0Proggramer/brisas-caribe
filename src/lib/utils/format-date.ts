export function formatDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const localDate = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "long",
  }).format(localDate);
}
