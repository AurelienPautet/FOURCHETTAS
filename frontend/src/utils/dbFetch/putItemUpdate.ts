import api_url from "../../api_url";
import type ModifyItem from "../../types/ModifyItemType";
import type resType from "../../types/ResType";

interface putItemUpdateProps extends resType {
  Items: ModifyItem[];
}

export default async function putItemUpdate({
  Items,
  onRequestStart = () => {},
  onRequestEnd = () => {},
  onSuccess = () => {},
  onError = () => {},
}: putItemUpdateProps) {
  onRequestStart();
  fetch(`${api_url}/api/items`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Items),
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
