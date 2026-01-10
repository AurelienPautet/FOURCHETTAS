import api_url from "../../api_url.ts";
import type Item from "../../types/ItemType.ts";
import type resType from "../../types/ResType.ts";

interface orderData {
  event_id: number;
  name: string;
  firstName: string;
  phone: string;
  items: Item[];
  is_delivery?: boolean;
  delivery_address?: string;
  delivery_time?: string;
}

function orderJson({
  event_id,
  name,
  firstName,
  phone,
  items,
  is_delivery,
  delivery_address,
  delivery_time,
}: orderData) {
  const res_json = {
    event_id: event_id,
    name: name,
    firstname: firstName,
    phone: phone,
    items,
    is_delivery,
    delivery_address,
    delivery_time,
  };

  return res_json;
}

interface postOrderProps extends orderData, resType {}

export default async function postOrder({
  event_id,
  name,
  firstName,
  phone,
  items,
  is_delivery,
  delivery_address,
  delivery_time,
  onRequestStart = () => {},
  onRequestEnd = () => {},
  onSuccess = () => {},
  onError = () => {},
}: postOrderProps) {
  onRequestStart();
  fetch(`${api_url}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(
      orderJson({
        event_id,
        name,
        firstName,
        phone,
        items,
        is_delivery,
        delivery_address,
        delivery_time,
      })
    ),
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
      console.log("Order submitted successfully:", data);
      onSuccess();
    })
    .catch((error) => {
      onRequestEnd();
      onError();
      console.error("Error submitting order:", error);
    });
}
