import type Item from "../types/ItemType";
import type Order from "../types/OrderType";
import type Event from "../types/EventType";
import calculatePriceOrder from "./calculatePriceOrder";

export default function calculateCA({
  orders,
  itemsMap,
  event,
  setCA = () => {},
}: {
  orders: Order[];
  itemsMap: Map<number, Item>;
  event?: Event | null;
  setCA?: (value: number) => void;
}) {
  const total = orders.reduce((acc, order) => {
    const orderPrice = calculatePriceOrder(order, itemsMap, event);
    return acc + orderPrice;
  }, 0);
  console.log(total);
  setCA(total);
  return total;
}
