import api_url from "../../api_url.tsx";
import type Item from "../../types/ItemType.tsx";

export default async function getItemsFromEventId(
  id: string,
  setDishes: (items: Item[]) => void,
  setSides: (items: Item[]) => void,
  setDrinks: (items: Item[]) => void
) {
  try {
    const response = await fetch(`${api_url}/api/events/${id}/items`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    setDishes(data.filter((item: Item) => item.type === "dish"));
    setSides(data.filter((item: Item) => item.type === "side"));
    setDrinks(data.filter((item: Item) => item.type === "drink"));
    //console.log(" ca va marcher maintenant a la inshalah", data);
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
  }
}
