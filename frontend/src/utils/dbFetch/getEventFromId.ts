import api_url from "../../api_url.tsx";

export default async function getEventFromId(
  id: number,
  setEventData: (data: any) => void
) {
  try {
    const response = await fetch(`${api_url}/api/events/${id}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setEventData(data);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
  }
}
