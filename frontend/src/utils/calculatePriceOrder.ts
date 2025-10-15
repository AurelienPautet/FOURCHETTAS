import type Order from "../types/OrderType";
import type Item from "../types/ItemType";

export default function calculatePriceOrder(
  order: Order,
  itemsMap: Map<number, Item>
): number {
  let price = 0;
  for (const it of order.items) {
    const item = itemsMap.get(it.item_id);
    if (item) {
      price += item.price * it.ordered_quantity;
    }
  }

  return price;
}
