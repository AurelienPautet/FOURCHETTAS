import type Order from "../types/OrderType";
import type Item from "../types/ItemType";
import type Type from "../types/TypeType";
import type AdminOrdersChildProps from "../types/AdminOrdersChild";
import PieItems from "./PieItems";
import { useState, useEffect } from "react";

import calculateCA from "../utils/calculateCA";

function OverviewOrder({
  items,
  types,
  orders,
  itemsMap,
  event: eventData,
}: AdminOrdersChildProps) {
  const emptyItem = {
    id: 0,
    name: "Rien",
    quantity: 0,
    price: 0,
    description: "Rien n'a été commandé",
    image: "",
    created_at: "",
  };

  console.log("Items Map:", itemsMap);

  function generatePieDataForItems(filteredItems: Item[]) {
    console.log("Generating pie data for items with items", filteredItems);

    // Track which orders have at least one item from filteredItems
    const ordersWithItems = new Set<number>();

    const pieData = filteredItems
      .map((item) => {
        const totalQuantity = orders.reduce((acc, order) => {
          const orderedItem = order.items.find((it) => it.item_id === item.id);
          if (orderedItem) {
            ordersWithItems.add(order.id);
          }
          return acc + (orderedItem?.ordered_quantity ?? 0);
        }, 0);

        return {
          name:
            item.quantity > 1 ? `${item.quantity}x ${item.name}` : item.name,
          value: totalQuantity,
        };
      })
      .filter((item) => item.value > 0);

    // Calculate orders with no items from this type
    const orderWithNoItems = orders.length - ordersWithItems.size;

    if (orderWithNoItems > 0) {
      pieData.push({
        name: emptyItem.name,
        value: orderWithNoItems,
      });
    }

    return pieData;
  }

  function generateDeliveryPieData() {
    const deliveryCount = orders.filter(
      (order) =>
        order.delivery_info !== null && order.delivery_info !== undefined
    ).length;
    const pickupCount = orders.length - deliveryCount;

    return [
      { name: "Livraison", value: deliveryCount },
      { name: "Sur place", value: pickupCount },
    ].filter((item) => item.value > 0);
  }

  const [CA, setCA] = useState<number>(0);
  const [CAreal, setCAreal] = useState<number>(0);
  useEffect(() => {
    calculateCA({ orders, itemsMap, event: eventData, setCA });
    let filteredOrders: Order[];
    filteredOrders = [];
    orders.map((order: Order) => {
      if (order.prepared) {
        filteredOrders.push(order);
      } else {
      }
    });
    calculateCA({
      orders: filteredOrders,
      itemsMap,
      event: eventData,
      setCA: setCAreal,
    });
  }, [orders, itemsMap, eventData]);

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
            <div className="stat-title">Prix moyen commande</div>
            <div className="stat-value">
              {orders.length > 0
                ? (Number(CA) / orders.length).toFixed(2)
                : "0.00"}{" "}
              €
            </div>
            <div className="stat-desc">les rats</div>
          </div>
        </div>
        <div className="stats shadow h-30 w-50 bg-base-200">
          <div className="stat">
            <div className="stat-title">CA estimé</div>
            <div className="stat-value">{Number(CA || 0).toFixed(2)} €</div>
            <div className="stat-desc">la moula</div>
          </div>
        </div>
        <div className="stats shadow h-30 w-50 bg-base-200">
          <div className="stat">
            <div className="stat-title">CA réel</div>
            <div className="stat-value">{Number(CAreal || 0).toFixed(2)} €</div>
            <div className="stat-desc">shallah pareil que le CA</div>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold">Résumé des commandes</h1>
      <div className="flex flex-col gap-4"></div>
      <div className="flex w-full h-full flex-row flex-wrap  justify-center items-start ">
        <PieItems
          data={generateDeliveryPieData()}
          labelString="Mode de retrait"
        />
        {types.map((type: Type) => {
          console.log("Generating pie for type:", type.name);
          const filteredItems = items.filter((item) => item.type === type.name);
          return (
            <PieItems
              key={type.name}
              data={generatePieDataForItems(filteredItems)}
              labelString={type.name}
            />
          );
        })}
      </div>
    </div>
  );
}

export default OverviewOrder;
