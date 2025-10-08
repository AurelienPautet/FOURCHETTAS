import api_url from "../../api_url";
import type ModifyItem from "../../types/ModifyItemType";
import type resType from "../../types/ResType";

interface deleteItemProps extends resType {
  Items: ModifyItem[];
}

export default async function deleteItem({
  Items,
  onRequestStart = () => {},
  onRequestEnd = () => {},
  onSuccess = () => {},
  onError = () => {},
}: deleteItemProps) {
  onRequestStart();
  const ItemIds = Items.map((item) => item.id);
  fetch(`${api_url}/api/items`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ItemIds),
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
