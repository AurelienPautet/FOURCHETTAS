import api_url from "../../api_url";
import type resType from "../../types/ResType";

interface deleteOrderProps extends resType{
  id:number
}

export default async function deleteOrder({
  id,
  onRequestStart = () => {},
  onRequestEnd = () => {},
  onError = () => {},
  onSuccess = () => {}
} : deleteOrderProps) {
  onRequestStart();
  try {
    const response = await fetch(`${api_url}/api/orders/${id}`, {
      method: "DELETE",
    });
    onRequestEnd();
    if (!response.ok) {
      onError();
      throw new Error("Network response was not ok");
    }
    onSuccess();
  } catch (error) {
    onRequestEnd();
    onError();
    console.error("Error deleting order:", error);
  }
}
