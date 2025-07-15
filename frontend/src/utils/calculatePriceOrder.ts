import type Order from "../types/OrderType";
import type Item from "../types/ItemType";

export default function calculatePriceOrder(
  order: Order,
  itemsMap: Map<number, Item>
): number {
  const dish = itemsMap.get(order.dish_id);
  const side = itemsMap.get(order.side_id);
  const drink = itemsMap.get(order.drink_id);

  const dishPrice = dish ? dish.price : 0;
  const sidePrice = side ? side.price : 0;
  const drinkPrice = drink ? drink.price : 0;

  return Number(dishPrice) + Number(sidePrice) + Number(drinkPrice);
}
