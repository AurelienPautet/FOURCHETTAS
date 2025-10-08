import api_url from "../../api_url";
import type ModifyItem from "../../types/ModifyItemType";
import type resType from "../../types/ResType";

interface postItemProps extends resType {
  Items: ModifyItem[];
  eventid: number;
}

export default async function postItem({
  Items,
  eventid,
  onRequestStart = () => {},
  onRequestEnd = () => {},
  onSuccess = () => {},
  onError = () => {},
}: postItemProps) {
  onRequestStart();
  fetch(`${api_url}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items: Items, eventid: eventid }),
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
      console.log("Item modified successfully", data);
      onSuccess();
    });
}
