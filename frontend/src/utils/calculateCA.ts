import type Item from "../types/ItemType";
import type Order from "../types/OrderType";
import calculatePriceOrder from "./calculatePriceOrder";

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
    const orderPrice = calculatePriceOrder(order, itemsMap);
    return acc + orderPrice;
  }, 0);
  console.log(total)
  setCA(total);
  return total;
}
