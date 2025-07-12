import api_url from "../../api_url";
import type Order from "../../types/OrderType.ts";

export default async function getOrdersFromEventId(
  id: string,
  setOrders: (orders: any[]) => void,
  onError: () => void = () => {},
  onSuccess: () => void = () => {}
) {
  try {
    const response = await fetch(`${api_url}/api/events/${id}/orders`);
    if (!response.ok) {
      onError();
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setOrders(data);
    onSuccess();
  } catch (error) {
    onError();
    console.error("Error fetching orders:", error);
  }
}
