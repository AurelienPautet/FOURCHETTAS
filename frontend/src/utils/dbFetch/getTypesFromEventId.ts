import api_url from "../../api_url.ts";
import type Type from "../../types/TypeType.ts";

export default async function getTypesFromEventId(
  id: number,
  setTypes: (types: Type[]) => void,
  onError: () => void = () => {},
  onSuccess: () => void = () => {}
) {
  try {
    const response = await fetch(
      `${api_url}/api/events/${id.toString()}/types`
    );
    if (!response.ok) {
      onError();

      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setTypes(data);
    onSuccess();
  } catch (error) {
    onError();
    console.error("Error fetching types from event ID:", error);
  }
}
