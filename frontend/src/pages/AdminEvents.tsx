import { useEffect, useState } from "react";

import NavbarSpacer from "../components/NavbarSpacer";

import getEventsUpcoming from "../utils/dbFetch/getEventsUpcoming";
import getEventsOld from "../utils/dbFetch/getEventsOld";
import deleteEvent from "../utils/dbFetch/deleteEvent";
import getItemsFromEventId from "../utils/dbFetch/getItemsFromEventId";
import getTypesFromEventId from "../utils/dbFetch/getTypesFromEventId";

import type Event from "../types/EventType";
import type Item from "../types/ItemType";
import type Type from "../types/TypeType";
import ListEvents from "../components/ListEvents";
import AdminEventCardChildren from "../components/AdminEventCardChildren";
import PlusCard from "../components/PlusCard";
import { useNavigate } from "react-router-dom";

const EmptyEvent = {
  id: 0,
  title: "",
  description: "",
  date: "2025-02-09T22:00:00.000Z",
  time: "",
  form_closing_date: "",
  form_closing_time: "",
  img_url: "",
  deliveries_enabled: false,
  deliveries_price: 0,
};

function AdminEvents() {
  const navigate = useNavigate();

  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingOld, setLoadingOld] = useState(true);

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([EmptyEvent]);
  const [oldEvents, setOldEvents] = useState<Event[]>([EmptyEvent, EmptyEvent]);

  function handleDeleteEvent(event: Event) {
    event.deleting = true;
    deleteEvent(
      event.id,
      () => {},
      () => {},
      () => {
        console.log("error deleting event");
      },
      () => {
        fetchNeededData();
      }
    );
  }

  async function handleCopyEvent(event: Event) {
    try {
      // Fetch event details, items, and types
      const items: Item[] = await new Promise((resolve, reject) => {
        getItemsFromEventId(
          event.id,
          resolve,
          () => reject(new Error("Failed to fetch items")),
          () => {}
        );
      });

      const types: Type[] = await new Promise((resolve, reject) => {
        getTypesFromEventId(
          event.id,
          resolve,
          () => reject(new Error("Failed to fetch types")),
          () => {}
        );
      });

      // Navigate to create page with state
      navigate("/admin/event/create", {
        state: {
          copiedEvent: event,
          copiedItems: items,
          copiedTypes: types,
        },
      });
    } catch (error) {
      console.error("Error copying event:", error);
    }
  }

  function fetchNeededData() {
    getEventsUpcoming(
      () => setLoadingUpcoming(true),
      () => {
        setLoadingUpcoming(false);
        setUpcomingEvents([]);
      },
      () => {
        setUpcomingEvents([]);
      },
      (data) => {
        setUpcomingEvents([]);
        setUpcomingEvents(data);
        console.log("Successfully fetched upcoming events");
      }
    );
    getEventsOld({
      onRequestStart: () => setLoadingOld(true),
      onRequestEnd: () => {
        setLoadingOld(false);
        setOldEvents([]);
      },
      onError: () => {
        setOldEvents([]);
      },
      onSuccess: (data: Event[]) => {
        setOldEvents(data);
        console.log("Successfully fetched upcoming events");
      },
    });
  }

  useEffect(() => {
    fetchNeededData();
  }, []);

  return (
    <div className="flex-grow overflow-y-scroll text-3xl font-bold p-4 flex flex-col items-center gap-5">
      <NavbarSpacer />

      <h1> Prochains Evenements </h1>

      <PlusCard
        onClick={() => navigate("/admin/event/create")}
        legend={`Créer un nouvel événement !`}
      />

      <ListEvents
        events={upcomingEvents}
        loading={loadingUpcoming}
        onDelete={handleDeleteEvent}
        onCopy={handleCopyEvent}
        EventCardChildren={AdminEventCardChildren}
        noEventsMessage="Aucun événement passé"
      />

      <h1> Anciens Evenements </h1>

      <ListEvents
        events={oldEvents}
        loading={loadingOld}
        onDelete={handleDeleteEvent}
        onCopy={handleCopyEvent}
        EventCardChildren={AdminEventCardChildren}
        noEventsMessage="Aucun événement passé"
      />
    </div>
  );
}

export default AdminEvents;
