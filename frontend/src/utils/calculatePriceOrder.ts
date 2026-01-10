import type Order from "../types/OrderType";
import type Item from "../types/ItemType";
import type Event from "../types/EventType";

export default function calculatePriceOrder(
  order: Order,
  itemsMap: Map<number, Item>,
  event?: Event | null
): number {
  let price = 0;
  for (const it of order.items) {
    const item = itemsMap.get(it.item_id);
    if (item) {
      price += Number(item.price) * it.ordered_quantity;
    }
  }

  // Add delivery price if order has delivery info and event has delivery price
  if (order.delivery_info && event?.deliveries_price) {
    price += Number(event.deliveries_price);
  }

  return price;
}
