import { useEffect, useState } from "react";

import NavbarSpacer from "../components/NavbarSpacer";

import getEventsUpcoming from "../utils/dbFetch/getEventsUpcoming";
import ListEvents from "../components/ListEvents";
import UserEventCardChildren from "../components/UserEventCardChildren";

function UpcomingEvents() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([
    {
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
    },
  ]);

  useEffect(() => {
    getEventsUpcoming(
      () => setLoading(true),
      () => setLoading(false),
      () => {
        setEvents([]);
      },
      (data) => {
        setEvents(data);
        console.log("Successfully fetched upcoming events");
      }
    );
  }, []);

  return (
    <div className="flex-grow overflow-y-scroll text-3xl font-bold p-4 flex flex-col items-center gap-5">
      <NavbarSpacer />

      <h1> Prochains Evenements </h1>

      <ListEvents
        events={events}
        loading={loading}
        noEventsMessage="Aucun événement à venir"
        EventCardChildren={UserEventCardChildren}
      />
    </div>
  );
}

export default UpcomingEvents;
