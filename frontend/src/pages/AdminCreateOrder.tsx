import { useRef, useState } from "react";
import NavbarSpacer from "../components/NavbarSpacer";
import "cally";
import { CalendarDate } from "cally";

function AdminCreateOrder() {
  const [eventName, setEventName] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [eventOrdersClosingDate, setEventOrdersClosingDate] = useState<string>(
    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]
  );

  function isOrderClosingDateValid(date: Date): boolean {
    const eventDateformat = new Date(eventDate);
    return date <= eventDateformat;
  }

  const CalendarEventDateRef = useRef(null);
  return (
    <div className="flex flex-col items-center">
      <NavbarSpacer />
      <div className="flex flex-col items-center justify-center w-full h-full p-4">
        <h1 className="text-2xl font-bold">Creation d'un nouvel événement</h1>
        <p className="mt-2 text-gray-600">
          Veuillez remplir les informations nécessaires pour créer un nouvel
          événement.
        </p>
        <div>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Nom de l'événement</legend>
            <input
              type="text"
              className="input"
              placeholder="Nom de l'événement"
            />
          </fieldset>
          <button
            popoverTarget="cally-popover1"
            className="input input-border"
            id="cally1"
            style={{ anchorName: "--cally1" } as any}
          >
            {eventDate}
          </button>
          <div
            popover="auto"
            id="cally-popover1"
            className="dropdown bg-base-100 rounded-box shadow-lg"
            style={{ positionAnchor: "--cally1" } as any}
          >
            <calendar-date
              value={eventDate}
              className="cally"
              isDateDisallowed={(date: Date) => !isOrderClosingDateValid(date)}
              onchange={(event) =>
                setEventDate((event.target as HTMLInputElement).value)
              }
            >
              <svg
                aria-label="Previous"
                className="fill-current size-4"
                slot="previous"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                {...({} as any)}
              >
                <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
              </svg>
              <svg
                aria-label="Next"
                className="fill-current size-4"
                slot="next"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                {...({} as any)}
              >
                <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
              </svg>
              <calendar-month></calendar-month>
            </calendar-date>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateOrder;
