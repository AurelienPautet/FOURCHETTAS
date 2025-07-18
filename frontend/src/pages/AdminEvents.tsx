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
              loading={loadingUpcoming}
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
                  className={`w-10 h-10 ${event.deleting ? "opacity-15" : ""}`}
                />
                <DeleteModal
                  id={"delete_item_" + event.id}
                  title="Supprimer l'élément ?"
                  description={`Vous êtes sur le point de supprimer 
                l'evenement ${event.title} du ${correctDate(event.date)} à ${
                    event.time
                  }. Cette action est irréversible.`}
                  onDelete={() => {
                    handleDeleteEvent(event);
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
              loading={loadingOld}
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
                  className={`w-10 h-10 ${event.deleting ? "opacity-15" : ""}`}
                />
                <DeleteModal
                  id={"delete_item_" + event.id}
                  title="Supprimer l'élément ?"
                  description={`Vous êtes sur le point de supprimer 
                l'evenement ${event.title} du ${correctDate(event.date)} à ${
                    event.time
                  }. Cette action est irréversible.`}
                  onDelete={() => {
                    handleDeleteEvent(event);
                  }}
                />
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
