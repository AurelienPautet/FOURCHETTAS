import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NavbarSpacer from "../components/NavbarSpacer";
import TextDate from "../components/TextDate.tsx";
import StatusEvent from "../components/StatusEvent.tsx";

import type Event from "../types/EventType.ts";
import type Item from "../types/ItemType.ts";
import type Order from "../types/OrderType.ts";

import getEventFromId from "../utils/dbFetch/getEventFromId";
import getItemsFromEventId from "../utils/dbFetch/getItemsFromEventId.ts";
import getOrdersFromEventId from "../utils/dbFetch/getOrdersFromEventId.ts";

function AdminOrders() {
  let { id } = useParams();
  if (!id) {
    id = "0";
  }

  const [eventData, setEventData] = useState<Event | null>(null);

  const [dishes, setDishes] = useState<Item[]>([]);
  const [sides, setSides] = useState<Item[]>([]);
  const [drinks, setDrinks] = useState<Item[]>([]);

  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getEventFromId(Number(id), setEventData);
  }, []);

  useEffect(() => {
    getItemsFromEventId(Number(id), setDishes, setSides, setDrinks);
  }, []);

  useEffect(() => {
    getOrdersFromEventId(Number(id), setOrders);
  }, []);

  return (
    <div className="flex-grow h-full w-full flex flex-col gap-4 pr-4 pl-4 pb-4  overflow-x-hidden  overflow-y-scroll">
      <NavbarSpacer />
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">
          Les commandes pour l'événement{" "}
          <span className="font-extrabold">{eventData?.title}</span> du{" "}
          {TextDate(eventData?.date, eventData?.time)}
        </h1>
        <StatusEvent event={eventData} />
      </div>
    </div>
  );
}

export default AdminOrders;
