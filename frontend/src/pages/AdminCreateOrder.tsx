import { useRef, useState } from "react";
import NavbarSpacer from "../components/NavbarSpacer";
import "cally";
import { CalendarDate } from "cally";
import Calendar from "../components/Calendar";
import CardImageGen from "../components/CardImageGen";

function AdminCreateOrder() {
  const [eventName, setEventName] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventImgUrl, setEventImgUrl] = useState<string>(
    "https://storage.imagerouter.io/b920e2a2-b8c0-4220-933b-042c7f9ea7f2.png"
  );
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
        <h1 className="text-2xl font-bold text-center">
          Creation d'un nouvel événement
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Veuillez remplir les informations nécessaires pour créer un nouvel
          événement.
        </p>
        <div className="collapse  collapse-arrow  bg-base-100 border-base-300 border">
          <input type="radio" name="my-accordion-1" />
          <div className="collapse-title font-semibold">
            Informations de l'événement
          </div>
          <div className="collapse-content text-sm">
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
              <CardImageGen ImgUrl={eventImgUrl} setImgUrl={setEventImgUrl}>
                <div className="divider divider-horizontal"></div>
                <div className="divider "></div>

                <div className="flex flex-col w-full items-center justify-center ">
                  <legend className="fieldset-legend">Nom de l'article</legend>
                  <input type="text" className="input" placeholder="Tenders" />
                  <legend className="fieldset-legend">
                    Description de l'article
                  </legend>

                  <input
                    type="text"
                    className="input"
                    placeholder="Description de l'article"
                  />
                  <legend className="fieldset-legend">Quantité</legend>
                  <input
                    type="number"
                    className="input"
                    placeholder="Quantité"
                    value={1}
                    min={1}
                    max={100}
                  />
                  <legend className="fieldset-legend">Prix de l'article</legend>
                  <input
                    type="number"
                    className="input"
                    placeholder="Prix de l'article"
                  />
                </div>
              </CardImageGen>
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
              <div>
                <label className="input validator">
                  Début:
                  <input
                    type="text"
                    required
                    placeholder="HH:MM"
                    pattern="([0-2][0-3]|[0-1][0-9]):[0-5][0-9]"
                    minLength={5}
                    maxLength={5}
                    title="Only letters, numbers or dash"
                  />{" "}
                  <span className="badge badge-neutral badge-xs">Optional</span>
                </label>
                <p className="validator-hint">
                  Must be 5 characters with format HH:MM
                </p>
              </div>
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
            </div>
          </div>
        </div>
        <div className="collapse  collapse-arrow  bg-base-100 border-base-300 border">
          <input type="radio" name="my-accordion-1" />
          <div className="collapse-title font-semibold">Plats</div>
          <div className="collapse-content text-sm flex flex-col items-center">
            <CardImageGen ImgUrl={eventImgUrl} setImgUrl={setEventImgUrl}>
              <div className="divider divider-horizontal"></div>
              <div className="divider "></div>

              <div className="flex flex-col w-full items-center justify-center ">
                <legend className="fieldset-legend">Nom de l'article</legend>
                <input type="text" className="input" placeholder="Tenders" />
                <legend className="fieldset-legend">
                  Description de l'article
                </legend>

                <input
                  type="text"
                  className="input"
                  placeholder="Description de l'article"
                />
                <legend className="fieldset-legend">Quantité</legend>
                <input
                  type="number"
                  className="input"
                  placeholder="Quantité"
                  value={1}
                  min={1}
                  max={100}
                />
                <legend className="fieldset-legend">Prix de l'article</legend>
                <input
                  type="number"
                  className="input"
                  placeholder="Prix de l'article"
                />
              </div>
            </CardImageGen>
          </div>
        </div>
        <div className="collapse  collapse-arrow  bg-base-100 border-base-300 border">
          <input type="radio" name="my-accordion-1" />
          <div className="collapse-title font-semibold">Accompagnements</div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>
        <div className="collapse  collapse-arrow  bg-base-100 border-base-300 border">
          <input type="radio" name="my-accordion-1" />
          <div className="collapse-title font-semibold">Boissons</div>
          <div className="collapse-content text-sm">
            Click the "Sign Up" button in the top right corner and follow the
            registration process.
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateOrder;
