export default function correctDate(date: string): string {
  let dateBis = date.split("T")[0] + date.split("Z")[1];
  let datejs = new Date(dateBis);
  datejs.setDate(datejs.getDate());
  datejs.setMonth(datejs.getMonth() + 1);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const formattedDate = `${datejs.getFullYear()}-${pad(
    datejs.getMonth()
  )}-${pad(datejs.getDate())}`;
  return formattedDate;
}
