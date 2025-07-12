import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type Order from "../types/OrderType";
import type Item from "../types/ItemType";
import type Event from "../types/EventType";
import PieItems from "./PieItems";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

interface OverviewOrderProps {
  event: Event | null;
  dishes: Item[];
  sides: Item[];
  drinks: Item[];
  orders: Order[];
  itemsMap: Map<number, Item>;
}

function OverviewOrder({
  event,
  dishes,
  sides,
  drinks,
  orders,
  itemsMap,
}: OverviewOrderProps) {
  const emptyItem = {
    id: 0,
    name: "Rien",
    quantity: 0,
    price: 0,
    description: "Rien n'a été commandé",
    image: "",
    event_id: 0,
    createdAt: "",
  };

  console.log("Items Map:", itemsMap);

  function generatePieDataForItems(
    items: Item[],
    idName: "dish_id" | "side_id" | "drink_id"
  ) {
    let pieData = [...items, emptyItem].map((item) => ({
      name: (item.quantity > 1 ? item.quantity + "x " : "") + item.name,
      value: orders.reduce((acc, order) => {
        if (order[idName] === item.id) {
          return acc + 1;
        }
        if (order[idName] === null && item.id === 0) {
          return acc + 1;
        }
        return acc;
      }, 0),
    }));
    pieData = pieData.filter((item) => item.value > 0);

    return pieData;
  }

  return (
    <>
      <div className="flex flex-col gap-4"></div>
      <div className="flex w-full h-full flex-row flex-wrap  justify-center items-start ">
        <PieItems
          data={generatePieDataForItems(dishes, "dish_id")}
          labelString="Plats"
        />
        <PieItems
          data={generatePieDataForItems(sides, "side_id")}
          labelString="Extras"
        />
        <PieItems
          data={generatePieDataForItems(drinks, "drink_id")}
          labelString="Boissons"
        />
      </div>
    </>
  );
}

export default OverviewOrder;
