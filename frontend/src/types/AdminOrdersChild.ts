import type Item from "./ItemType.ts";
import type Order from "./OrderType.ts";
import type Event from "./EventType.ts";

export default interface AdminOrdersChildProps {
  event: Event | null;
  dishes: Item[];
  sides: Item[];
  drinks: Item[];
  orders: Order[];
  itemsMap: Map<number, Item>;
}
