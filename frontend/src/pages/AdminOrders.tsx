import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import NavbarSpacer from "../components/NavbarSpacer";
import TextDate from "../components/TextDate.tsx";
import StatusEvent from "../components/StatusEvent.tsx";
import OverviewOrder from "../components/OverviewOrder.tsx";
import ListOrders from "../components/ListOrders.tsx";
import PieItems from "../components/PieItems.tsx";

import type Event from "../types/EventType";
import type Item from "../types/ItemType";
import type Order from "../types/OrderType";

import getEventFromId from "../utils/dbFetch/getEventFromId";
import getItemsFromEventId from "../utils/dbFetch/getItemsFromEventId";
import getOrdersFromEventId from "../utils/dbFetch/getOrdersFromEventId";

function AdminOrders() {
  let { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";

  if (!id) {
    id = "0";
  }

  const [eventData, setEventData] = useState<Event | null>(null);
  const [dishes, setDishes] = useState<Item[]>([]);
  const [sides, setSides] = useState<Item[]>([]);
  const [drinks, setDrinks] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [itemsMap, setItemsMap] = useState<Map<number, Item>>(new Map());

  useEffect(() => {
    getEventFromId(Number(id), setEventData);

  }, []);

  useEffect(() => {
    if (eventData) {
      setItemsInMap();
    }
  }, [dishes, sides, drinks]);

  function setItemsInMap() {
    const map = new Map<number, Item>();
    [...dishes, ...sides, ...drinks].forEach((item) => {
      map.set(item.id, item);
    });
    setItemsMap(map);
  }

  useEffect(() => {

    getItemsFromEventId(Number(id), setDishes, setSides, setDrinks);
    console.log(dishes,sides,drinks)
  }, [eventData]);

  useEffect(() => {
    getOrdersFromEventId(Number(id), setOrders);
    console.log("Orders:", orders);
    const interval = setInterval(async () => {
      await getOrdersFromEventId(Number(id), setOrders);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tab: string) => {
    setSearchParams({ tab });
  };

  const ordersCount = orders.length;
  const preparedCount = orders.filter((order) => order.prepared).length;
  const deliveredCount = orders.filter((order) => order.delivered).length;

  return (
    <div className="flex-grow h-full w-full flex flex-col gap-4 pr-4 pl-4 pb-10 overflow-x-hidden  overflow-y-scroll">
      <NavbarSpacer />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-center">
          Les commandes pour l'événement{" "}
          <span className="font-extrabold">{eventData?.title}</span> du{" "}
          {TextDate(eventData?.date, eventData?.time)}
        </h1>
        <StatusEvent event={eventData} />
        <div className="tabs tabs-lift w-[calc(100vw-2rem)] md:w-[calc(100vw-20rem)] ">
          <input
            type="radio"
            name="my_tabs_1"
            className="tab w-1/2"
            aria-label="Résumé"
            checked={currentTab === "overview"}
            onChange={() => handleTabChange("overview")}
          />
          <div className="tab-content bg-base-100 border-base-200 border-t-0  border-1 p-6">
            <OverviewOrder
              event={eventData}
              dishes={dishes}
              sides={sides}
              drinks={drinks}
              orders={orders}
              itemsMap={itemsMap}
            />
          </div>

          <input
            type="radio"
            name="my_tabs_1"
            className="tab w-1/2 "
            aria-label="Commandes"
            checked={currentTab === "orders"}
            onChange={() => handleTabChange("orders")}
          />
          <div className="tab-content bg-base-100 border-base-200 border-t-0  border-1 p-6">
            <div className="flex flex-col w-full h-full">
              <div className="grow-0 flex w-full h-full flex-row flex-wrap  justify-center items-start ">
                <PieItems
                  data={[
                    { name: "Non Préparé", value: ordersCount - preparedCount },
                    {
                      name: "Préparé",
                      value: preparedCount,
                    },
                  ]}
                  labelString="Préparé"
                  colors={["var(--color-error)", "var(--color-success)"]}
                />
                <PieItems
                  data={[
                    { name: "Non Livré", value: ordersCount - deliveredCount },
                    {
                      name: "Livré",
                      value: deliveredCount,
                    },
                  ]}
                  labelString="Livré"
                  colors={["var(--color-error)", "var(--color-success)"]}
                />
              </div>
              <ListOrders
                event={eventData}
                dishes={dishes}
                sides={sides}
                drinks={drinks}
                orders={orders}
                itemsMap={itemsMap}
              />{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
