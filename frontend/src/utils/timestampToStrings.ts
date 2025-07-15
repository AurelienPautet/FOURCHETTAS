export default function timestampToStrings(timestamp: string): {
  date: string;
  time: string;
} {
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const dateString = date.toLocaleDateString("fr-FR", options);
  const timeString = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date: dateString, time: timeString };
}
