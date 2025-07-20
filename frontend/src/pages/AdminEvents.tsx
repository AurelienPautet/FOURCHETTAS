import { useEffect, useState } from "react";

import NavbarSpacer from "../components/NavbarSpacer";

import getEventsUpcoming from "../utils/dbFetch/getEventsUpcoming";
import getEventsOld from "../utils/dbFetch/getEventsOld";
import deleteEvent from "../utils/dbFetch/deleteEvent";

import type Event from "../types/EventType";
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
    getEventsOld(
      () => setLoadingOld(true),
      () => {
        setLoadingOld(false);
        setOldEvents([]);
      },
      () => {
        setOldEvents([]);
      },
      (data) => {
        setOldEvents(data);
        console.log("Successfully fetched upcoming events");
      }
    );
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
        EventCardChildren={AdminEventCardChildren}
        noEventsMessage="Aucun événement passé"
      />

      <h1> Anciens Evenements </h1>

      <ListEvents
        events={oldEvents}
        loading={loadingOld}
        onDelete={handleDeleteEvent}
        EventCardChildren={AdminEventCardChildren}
        noEventsMessage="Aucun événement passé"
      />
    </div>
  );
}

export default AdminEvents;
