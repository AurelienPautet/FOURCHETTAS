import api_url from "../../api_url";

export default async function deleteOrder(
  id: number,
  onRequestStart: () => void = () => {},
  onRequestEnd: () => void = () => {},
  onError: () => void = () => {},
  onSuccess: () => void = () => {}
) {
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
