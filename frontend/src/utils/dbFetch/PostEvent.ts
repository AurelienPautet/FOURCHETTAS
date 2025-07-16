import api_url from "../../api_url";

export default async function postEvent({
  eventData,
  onRequestStart = () => {},
  onRequestEnd = () => {},
  onSuccess = () => {},
  onError = () => {},
}: {
  eventData: any;
  onRequestStart?: () => void;
  onRequestEnd?: () => void;
  onSuccess?: (data: any) => void;
  onError?: () => void;
}) {
  onRequestStart();
  console.log("Sending event data:", JSON.stringify(eventData));
  fetch(`${api_url}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  })
    .then((response) => {
      onRequestEnd();
      if (!response.ok) {
        onError();
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((error) => {
      onRequestEnd();
      onError();
    });
}
