import api_url from "../../api_url.ts";
import type Event from "../../types/EventType.ts";

export default async function getEventFromId(
  id: number,
  setEventData: (data: Event) => void,
  onError: () => void = () => {},
  onSuccess: () => void = () => {}
) {
  try {
    const response = await fetch(`${api_url}/api/events/${id}`);
    if (!response.ok) {
      onError();
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setEventData(data);
    onSuccess();
  } catch (error) {
    onError();
    console.error("Error fetching upcoming events:", error);
  }
}
