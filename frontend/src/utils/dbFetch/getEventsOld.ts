import api_url from "../../api_url";
import type Event from "../../types/EventType";
export default async function getEventsOld(
  onRequestStart: () => void = () => {},
  onRequestEnd: () => void = () => {},
  onError: () => void = () => {},
  onSuccess: (data: Event[]) => void = () => {}
) {
  onRequestStart();
  try {
    const response = await fetch(`${api_url}/api/events/old`);
    onRequestEnd();
    if (!response.ok) {
      onError();
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    onSuccess(data);

    //console.log(" ca va marcher maintenant a la inshalah", data);
  } catch (error) {
    onRequestEnd();
    onError();
    console.error("Error fetching upcoming events:", error);
  }
}
