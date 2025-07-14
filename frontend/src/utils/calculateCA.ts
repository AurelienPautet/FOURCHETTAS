import type Item from "../types/ItemType";
import type Order from "../types/OrderType";

export default function calculateCA({
  orders,
  itemsMap,
  setCA = () => {},
}: {
  orders: Order[];
  itemsMap: Map<number, Item>;
  setCA?: (value: number) => void;
}) {
  const total = orders.reduce((acc, order) => {
    const dish = itemsMap.get(order.dish_id);
    const side = itemsMap.get(order.side_id);
    const drink = itemsMap.get(order.drink_id);

    const dishPrice = dish ? dish.price : 0;
    const sidePrice = side ? side.price : 0;
    const drinkPrice = drink ? drink.price : 0;

    return acc + Number(dishPrice) + Number(sidePrice) + Number(drinkPrice);
  }, 0);

  setCA(total);
  return total;
}
