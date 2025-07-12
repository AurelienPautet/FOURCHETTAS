import api_url from "../../api_url";
import type Order from "../../types/OrderType.ts";

export default async function getOrdersFromEventId(
  id: string,
  setOrders: (orders: Order[]) => void,
  onRequestStart: () => void = () => {},
  onRequestEnd: () => void = () => {},
  onError: () => void = () => {},
  onSuccess: () => void = () => {}
) {
  onRequestStart();
  try {
    const response = await fetch(`${api_url}/api/events/${id}/orders`);
    onRequestEnd();
    if (!response.ok) {
      onError();
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setOrders(data);
    onSuccess();
  } catch (error) {
    onRequestEnd();
    onError();
    console.error("Error fetching orders:", error);
  }
}
