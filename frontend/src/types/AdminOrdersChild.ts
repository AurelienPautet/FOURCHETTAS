import type Item from "./ItemType.ts";
import type Order from "./OrderType.ts";
import type Event from "./EventType.ts";
import type Type from "./TypeType.ts";
export default interface AdminOrdersChildProps {
  event: Event | null;
  items: Item[];
  orders: Order[];
  types: Type[];
  itemsMap: Map<number, Item>;
}
