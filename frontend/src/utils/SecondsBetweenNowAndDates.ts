export default function SecondsBetweenNowAndDates(date: Date): number {
  const now = new Date();
  const totalSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  return totalSeconds;
}
