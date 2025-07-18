import CardEvent from "./CardEvent";
import SecondsBetweenNowAndDates from "../utils/SecondsBetweenNowAndDates";
import correctDate from "../utils/DateCorrector";

import type Event from "../types/EventType";
import type { ReactNode } from "react";
import type { JSX } from "react";
import type EventCardChildren from "../types/EventCardChildren";
interface ListEventsProps {
  events: Event[];
  loading: boolean;
  onDelete?: (event: Event) => void;
  EventCardChildren: (card: EventCardChildren) => JSX.Element;
  noEventsMessage: string;
}

function ListEvents({
  events,
  loading,
  onDelete,
  EventCardChildren,
  noEventsMessage,
}: ListEventsProps) {
  return (
    <>
      {events.length > 0 ? (
        events.map((event) => {
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
              <EventCardChildren
                event={event}
                onDelete={onDelete}
                secondsLeft={secondsLeft}
              />
            </CardEvent>
          );
        })
      ) : (
        <p>{noEventsMessage}</p>
      )}
    </>
  );
}

export default ListEvents;
