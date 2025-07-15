import api_url from "../../api_url.ts";

interface putOrderUpdateFromIdProps {
  orderId: number;
  prepared?: boolean | null;
  delivered?: boolean | null;
  onRequestStart?: () => void;
  onRequestEnd?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export default async function putOrderUpdateFromId({
  orderId,
  prepared = null,
  delivered = null,
  onRequestStart = () => {},
  onRequestEnd = () => {},
  onSuccess = () => {},
  onError = () => {},
}: putOrderUpdateFromIdProps) {
  onRequestStart();
  fetch(`${api_url}/api/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prepared,
      delivered,
    }),
  })
    .then((response) => {
      onRequestEnd();
      if (!response.ok) {
        onError();
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Order updated successfully:", data);
      onSuccess();
    })
    .catch((error) => {
      onRequestEnd();
      onError();
      console.error("Error updating order:", error);
    });
}
