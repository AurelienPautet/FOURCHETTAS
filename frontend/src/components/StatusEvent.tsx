import type Event from "../types/EventType";
import { useEffect, useState } from "react";
import SecondsBetweenNowAndDates from "../utils/SecondsBetweenNowAndDates";
import correctDate from "../utils/DateCorrector";

function StatusEvent({ event }: { event: Event | null }) {
  const [status, setStatus] = useState({
    message: "Statut en chargement",
    color: "primary",
  });

  useEffect(() => {
    if (!event) {
      setStatus({
        message: "Statut en chargement",
        color: "primary",
      });
      return;
    }

    const secondsLeftBeforeClosing = SecondsBetweenNowAndDates(
      new Date(
        correctDate(event.form_closing_date) + "T" + event.form_closing_time
      )
    );
    const secondsLeftBeforeEvent = SecondsBetweenNowAndDates(
      new Date(correctDate(event.date) + "T" + event.time)
    );

    console.log(
      "Seconds left before closing:",
      secondsLeftBeforeClosing,
      "Seconds left before event:",
      secondsLeftBeforeEvent
    );

    if (secondsLeftBeforeClosing > 0) {
      setStatus({
        message: "est ouvert pour les commandes",
        color: "success",
      });
    } else if (secondsLeftBeforeClosing < 0) {
      setStatus({
        message: "est fermé pour les commandes mais n'as pas encore lieu",
        color: "error",
      });
    }
    if (secondsLeftBeforeEvent > -60 * 60 * 24 && secondsLeftBeforeEvent <= 0) {
      setStatus({
        message: "à lieu",
        color: "info",
      });
    } else if (secondsLeftBeforeEvent < -60 * 60 * 24) {
      setStatus({
        message: "est terminé",
        color: "warning",
      });
    }
  }, [event]);

  return (
    <div className={`flex items-center gap-2 text-${status.color}`}>
      <div className="inline-grid *:[grid-area:1/1]">
        <div className={`status  status-${status.color} animate-ping`}></div>
        <div className={`status  status-${status.color}`}></div>
      </div>{" "}
      {event ? (
        `L'évenement ${status.message}`
      ) : (
        <span className="loading loading-dots loading-sm"></span>
      )}
      <div className="hidden status-error text-warning text-neutral text-info status-warning status-success status-neutral status-info"></div>
    </div>
  );
}

export default StatusEvent;
