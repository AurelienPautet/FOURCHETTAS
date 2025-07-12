import api_url from "../../api_url.ts";

interface orderData {
  event_id: number;
  name: string;
  firstName: string;
  phone: string;
  dish_id: number;
  side_id: number;
  drink_id: number;
}

function orderJson({
  event_id,
  name,
  firstName,
  phone,
  dish_id,
  side_id,
  drink_id,
}: orderData) {
  let res_json = {
    event_id: event_id,
    name: name,
    firstname: firstName,
    phone: phone,
    dish_id: dish_id,
    side_id: side_id > 0 ? side_id : null,
    drink_id: drink_id > 0 ? drink_id : null,
  };

  return res_json;
}

interface postOrderProps extends orderData {
  onRequestStart?: () => void;
  onRequestEnd?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}

export default async function postOrder({
  event_id,
  name,
  firstName,
  phone,
  dish_id,
  side_id,
  drink_id,
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
        dish_id,
        side_id,
        drink_id,
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
