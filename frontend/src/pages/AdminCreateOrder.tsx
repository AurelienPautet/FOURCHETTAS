import { useRef, useState } from "react";
import NavbarSpacer from "../components/NavbarSpacer";
import "cally";
import { CalendarDate } from "cally";
import Calendar from "../components/Calendar";

function AdminCreateOrder() {
  const [eventName, setEventName] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");

  const [eventOrdersClosingDate, setEventOrdersClosingDate] =
    useState<string>("");

  function isOrderClosingDateValid(date: Date): boolean {
    const eventDateformat = new Date(eventDate);
    return date <= eventDateformat;
  }

  function CorrectDateFormat(date: string): string {
    const dateParts = date.split("-");
    if (dateParts.length === 3) {
      return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }
    if (date === "") {
      return "Sélectionnez une date";
    }
    return date;
  }

  const CalendarEventDateRef = useRef(null);
  return (
    <div className="flex-grow h-full w-full flex flex-col gap-4 pr-4 pl-4 pb-10 overflow-x-hidden  overflow-y-scroll">
      <NavbarSpacer />
      <div className="flex flex-col items-center justify-center  p-4 ">
        <h1 className="text-2xl font-bold">Creation d'un nouvel événement</h1>
        <p className="mt-2 text-gray-600">
          Veuillez remplir les informations nécessaires pour créer un nouvel
          événement.
        </p>
        <div className="flex flex-col w-full flex-grow items-center">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Nom de l'événement</legend>
            <input
              type="text"
              className="input"
              placeholder="Nom de l'événement"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Description de l'événement
            </legend>
            <textarea
              className="textarea h-24"
              placeholder="Description de l'événement"
            ></textarea>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Date de l'événement</legend>

            <button
              popoverTarget="cally-popover1"
              className="input input-border"
              id="cally1"
              style={{ anchorName: "--cally1" } as any}
            >
              {CorrectDateFormat(eventDate)}
            </button>
            <div
              popover="auto"
              id="cally-popover1"
              className="dropdown bg-base-100 rounded-box shadow-lg"
              style={{ positionAnchor: "--cally1" } as any}
            >
              <Calendar
                eventDate={eventDate}
                setEventDate={setEventDate}
                isOrderClosingDateValid={() => true}
              />
            </div>
          </fieldset>
          <input
            type="text"
            className="input validator"
            required
            placeholder="HH:MM"
            pattern="([0-2][0-3]|[0-1][0-9]):[0-5][0-9]"
            minLength={5}
            maxLength={5}
            title="Only letters, numbers or dash"
          />
          <p className="validator-hint">
            Must be 5 characters
            <br />
            with format HH:MM
          </p>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              Date de clôture des commandes
            </legend>

            <button
              popoverTarget="cally-popover2"
              className="input input-border"
              id="cally2"
              style={{ anchorName: "--cally2" } as any}
            >
              {CorrectDateFormat(eventOrdersClosingDate)}
            </button>
            <div
              popover="auto"
              id="cally-popover2"
              className="dropdown bg-base-100 rounded-box shadow-lg"
              style={{ positionAnchor: "--cally2" } as any}
            >
              <Calendar
                eventDate={eventOrdersClosingDate}
                setEventDate={setEventOrdersClosingDate}
                isOrderClosingDateValid={isOrderClosingDateValid}
              />
            </div>
          </fieldset>
          <div className="h-screen w-full shrink-0 flex-grow bg-red-200">
            caca
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateOrder;
