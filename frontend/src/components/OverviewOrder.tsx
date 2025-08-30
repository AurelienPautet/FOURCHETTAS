import type Order from "../types/OrderType";
import type Item from "../types/ItemType";
import type AdminOrdersChildProps from "../types/AdminOrdersChild";
import PieItems from "./PieItems";
import { useState, useEffect } from "react";

import calculateCA from "../utils/calculateCA";

function OverviewOrder({
  dishes,
  sides,
  drinks,
  orders,
  itemsMap,
}: AdminOrdersChildProps) {
  const emptyItem = {
    id: 0,
    name: "Rien",
    quantity: 0,
    price: 0,
    description: "Rien n'a été commandé",
    image: "",
    event_id: 0,
    created_at: "",
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
  const [CA, setCA] = useState<number>(0);
  const [CAreal, setCAreal] = useState<number>(0);
  useEffect(() => {
    calculateCA({ orders, itemsMap, setCA });
    let filteredOrders: Order[];
    filteredOrders = [];
    orders.map((order: Order) => {
      if (order.prepared) {
        filteredOrders.push(order);
      } else {
      }
    });
    calculateCA({ orders: filteredOrders, itemsMap, setCA: setCAreal });
  }, [orders, itemsMap]);

  console.log(orders);

  return (
    <div className="flex flex-col gap-0 w-full h-full justify-center items-center">
      <h1 className="text-2xl font-bold">Les statistiques</h1>
      <div className="flex flex-col md:flex-row gap-4 flex-wrap">
        <div className="stats shadow h-30 w-50 bg-base-200 ">
          <div className="stat">
            <div className="stat-title">Nombre de commandes</div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-desc">c'est pas mal</div>
          </div>
        </div>
        <div className="stats shadow h-30 w-50 bg-base-200">
          <div className="stat">
            <div className="stat-title">CA estimé</div>
            <div className="stat-value">{CA.toFixed(2)} €</div>
            <div className="stat-desc">la moula</div>
          </div>
        </div>
        <div className="stats shadow h-30 w-50 bg-base-200">
          <div className="stat">
            <div className="stat-title">CA réel</div>
            <div className="stat-value">{CAreal.toFixed(2)} €</div>
            <div className="stat-desc">shallah pareil que le CA</div>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Résumé des commandes</h1>
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
    </div>
  );
}

export default OverviewOrder;
