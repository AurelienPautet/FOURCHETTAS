import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CardEvent from "../components/CardEvent";
import NavbarSpacer from "../components/NavbarSpacer";

import correctDate from "../utils/DateCorrector";
import SecondsBetweenNowAndDates from "../utils/SecondsBetweenNowAndDates";

import getEventsUpcoming from "../utils/dbFetch/getEventsUpcoming";
import getEventsOld from "../utils/dbFetch/getEventsOld";
import deleteEvent from "../utils/dbFetch/deleteEvent";

import type Event from "../types/EventType";
import BinWithModal from "../components/BinWithModal";
import DeleteModal from "../components/DeleteModal";

function AdminEvents() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([
    {
      id: 0,
      title: "",
      description: "",
      date: "2025-02-09T22:00:00.000Z",
      time: "",
      form_closing_date: "",
      form_closing_time: "",
      img_url: "",
    },
  ]);
  const [oldEvents, setOldEvents] = useState<Event[]>([]);

  function handleDeleteEvent(id: number) {
    deleteEvent(
      id,
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
      () => setLoading(true),
      () => setLoading(false),
      () => {
        setUpcomingEvents([]);
      },
      (data) => {
        setUpcomingEvents(data);
        console.log("Successfully fetched upcoming events");
      }
    );
    getEventsOld(
      () => setLoading(true),
      () => setLoading(false),
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

      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event) => {
          let secondsLeft = SecondsBetweenNowAndDates(
            new Date(
              correctDate(event.form_closing_date) +
                "T" +
                event.form_closing_time
            )
          );
          return (
            <CardEvent
              key={event.id}
              title={event.title}
              description={event.description}
              date={correctDate(event.date)}
              time={event.time}
              form_closing_date={correctDate(event.form_closing_date)}
              form_closing_time={event.form_closing_time}
              loading={loading}
              img_url={event.img_url}
            >
              <div>
                <button
                  className={`btn btn-accent md:ml-auto `}
                  onClick={() =>
                    navigate("/admin/event/" + event.id + "/orders")
                  }
                >
                  Statistique
                </button>
                <button
                  className={`btn btn-accent md:ml-auto `}
                  onClick={() =>
                    navigate("/admin/event/" + event.id + "/modify")
                  }
                >
                  Modifier
                </button>
                <BinWithModal
                  id={"delete_item_" + event.id}
                  className="w-10 h-10"
                />
                <DeleteModal
                  id={"delete_item_" + event.id}
                  title="Supprimer l'élément ?"
                  description={`Vous êtes sur le point de supprimer 
                l'evenement ${event.title} du ${event.date}. Cette action est irréversible.`}
                  onDelete={() => {
                    handleDeleteEvent(event.id);
                  }}
                />
              </div>
            </CardEvent>
          );
        })
      ) : (
        <p>Aucun événement à venir</p>
      )}

      <h1> Anciens Evenements </h1>

      {oldEvents.length > 0 ? (
        oldEvents.map((event) => {
          let secondsLeft = SecondsBetweenNowAndDates(
            new Date(
              correctDate(event.form_closing_date) +
                "T" +
                event.form_closing_time
            )
          );
          return (
            <CardEvent
              key={event.id}
              title={event.title}
              description={event.description}
              date={correctDate(event.date)}
              time={event.time}
              form_closing_date={correctDate(event.form_closing_date)}
              form_closing_time={event.form_closing_time}
              loading={loading}
              img_url={event.img_url}
            >
              <div>
                <button
                  className={`btn btn-accent md:ml-auto `}
                  onClick={() =>
                    navigate("/admin/event/" + event.id + "/orders")
                  }
                >
                  Statistique
                </button>
              </div>
            </CardEvent>
          );
        })
      ) : (
        <p>Aucun événement passé</p>
      )}
    </div>
  );
}

export default AdminEvents;
