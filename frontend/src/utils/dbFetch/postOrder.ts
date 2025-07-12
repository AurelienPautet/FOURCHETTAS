import api_url from "../../api_url.ts";

interface orderData {
  eventId: number;
  name: string;
  firstName: string;
  phone: string;
  dishId: number;
  sideId: number;
  drinkId: number;
}

function orderJson({
  eventId,
  name,
  firstName,
  phone,
  dishId,
  sideId,
  drinkId,
}: orderData) {
  let res_json = {
    event_id: eventId,
    name: name,
    firstname: firstName,
    phone: phone,
    dish_id: dishId,
    side_id: sideId > 0 ? sideId : null,
    drink_id: drinkId > 0 ? drinkId : null,
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
  eventId,
  name,
  firstName,
  phone,
  dishId,
  sideId,
  drinkId,
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
      orderJson({ eventId, name, firstName, phone, dishId, sideId, drinkId })
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
