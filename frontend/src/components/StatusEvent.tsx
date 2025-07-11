import type Event from "../types/EventType";
import { useState } from "react";
import SecondsBetweenNowAndDates from "../utils/SecondsBetweenNowAndDates";
import correctDate from "../utils/DateCorrector";

function StatusEvent({ event }: { event: Event }) {
  const [status, setStatus] = useState({
    message: "",
    color: "error",
  });

  const secondsLeftBeforeClosing = SecondsBetweenNowAndDates(
    new Date(
      correctDate(event.form_closing_date) + "T" + event.form_closing_time
    )
  );
  const secondsLeftBeforeEvent = SecondsBetweenNowAndDates(
    new Date(correctDate(event.date) + "T" + event.time)
  );

  if (secondsLeftBeforeClosing > 0) {
    setStatus({
      message: "est ouvert pour les commandes",
      color: "success",
    });
  } else if (secondsLeftBeforeEvent > 0) {
    setStatus({
      message: "est fermé pour les commandes",
      color: "error",
    });
  } else if (secondsLeftBeforeEvent < -60 * 60 * 24) {
    setStatus({
      message: "a eu lieu",
      color: "neutral",
    });
  } else {
    setStatus({
      message: "est terminé",
      color: "warning",
    });
  }

  return (
    <>
      <div className="inline-grid *:[grid-area:1/1]">
        <div className={`status status-${status.color} animate-ping`}></div>
        <div className={`status status-${status.color}`}></div>
      </div>{" "}
      L'évenement {status.message}
    </>
  );
}

export default StatusEvent;
