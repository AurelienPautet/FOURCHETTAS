import { useEffect, useState } from "react";
import NavbarSpacer from "../components/NavbarSpacer";
import "cally";
import Calendar from "../components/Calendar";
import CardImageGen from "../components/CardImageGen";
import type CreateItem from "../types/CreateItemType";
import Logo from "../components/Logo";
import postEvent from "../utils/dbFetch/PostEvent";
import CreateItems from "../components/CreateItems";

function AdminCreateEvent() {
  const [eventName, setEventName] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventOrdersClosingDate, setEventOrdersClosingDate] =
    useState<string>("");
  const [eventTime, setEventTime] = useState<string>("");
  const [eventOrdersClosingTime, setEventOrdersClosingTime] =
    useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  if (error) {
  }
  const [success, setSuccess] = useState<boolean>(false);

  const [eventImgUrl, setEventImgUrl] = useState<string>("");

  const [removingBackground, setRemovingBackground] = useState<boolean>(false);
  const [activeBgRemovals, setActiveBgRemovals] = useState<number>(0);
  const [eventId, setEventId] = useState<string>("");
  const [itemsList, setItemsList] = useState<CreateItem[]>([]);
  function createPostRequestBody(): object {
    let jsonBody = {
      title: eventName,
      description: eventDescription,
      date: eventDate,
      time: eventTime,
      form_closing_date: eventOrdersClosingDate,
      form_closing_time: eventOrdersClosingTime,
      img_url: eventImgUrl,
      items: itemsList,
    };
    return jsonBody;
  }

  function handleCreateOrder() {
    setLoading(true);
    setRemovingBackground(true);
    setActiveBgRemovals(itemsList.length + 1);
  }

  useEffect(() => {
    if (!removingBackground || !loading || activeBgRemovals !== 0) return;
    console.log("backgrounds removed");
    const postBody = createPostRequestBody();
    setRemovingBackground(false);
    postEvent({
      eventData: postBody,
      onRequestStart: () => {
        console.log("Request started");
      },
      onRequestEnd: () => {
        console.log("Request ended");
        setLoading(false);
        setActiveBgRemovals(0);
      },
      onSuccess: (data) => {
        setEventId(data);
        console.log("Event created successfully");
        setSuccess(true);
      },
      onError: () => {
        setError(true);
      },
    });
  }, [activeBgRemovals]);

  function createEmptyItem(type: string) {
    const newItem: CreateItem = {
      name: "",
      description: "",
      quantity: 1,
      price: 0,
      type: type,
      img_url: "",
    };
    setItemsList([newItem, ...itemsList]);
  }

  function deleteItem(index: number) {
    const updatedItems = itemsList.filter((_, i) => i !== index);
    setItemsList(updatedItems);
  }

  function setItemValue(
    index: number,
    field: keyof CreateItem,
    value: string | number
  ) {
    const updatedItems = [...itemsList];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItemsList(updatedItems);
  }

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

  if (success) {
    return (
      <div className="flex-grow h-full w-full flex flex-col gap-4 p-4 justify-center items-center">
        <div className="h-1/3"></div>

        <div className="flex flex-col items-center gap-4 h-full w-full">
          <h2 className="text-2xl font-bold">
            C'est tout bon !! Evenement créé
          </h2>
          <Logo className=" h-40 w-40 animate-spin-slow" />
          <h2 className="text-xl">{eventId}</h2>
        </div>
        <div className="hidden animate-spin-slow"></div>
        <p className="text-success mb-auto h-20">
          Votre evenement a été créé avec succès.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow h-full w-full flex flex-col gap-4 pr-4 pl-4 pb-10 overflow-x-hidden  overflow-y-scroll">
      <NavbarSpacer />
      <div className="flex flex-col items-center justify-center gap-2 p-4 ">
        <h1 className="text-2xl font-bold text-center">
          Creation d'un nouvel événement
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Veuillez remplir les informations nécessaires pour créer un nouvel
          événement.
        </p>

        <h1 className=" text-2xl">Information Générales sur l'événement</h1>

        <CardImageGen
          ImgUrl={eventImgUrl}
          setImgUrl={setEventImgUrl}
          rmBg={removingBackground}
          onBgRemovalStart={() => {}}
          onBgRemovalEnd={() => {
            setActiveBgRemovals((prev) => prev - 1);
          }}
        >
          <div className="divider divider-horizontal"></div>
          <div className="divider "></div>

          <div className="flex flex-col w-full h-full items-center justify-center ">
            <legend className="fieldset-legend">Nom de l'événement</legend>
            <input
              type="text"
              className="input"
              placeholder="Nom de l'événement"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <legend className="fieldset-legend">
              Description de l'événement
            </legend>
            <textarea
              className="textarea h-24"
              placeholder="Description de l'événement"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            ></textarea>
            <legend className="fieldset-legend">Début de l'événement</legend>
            <div className="flex w-full h-full items-center justify-center flex-row gap-4">
              <div className="flex flex-col items-center justify-center w-1/3">
                <legend className="fieldset-legend">Date :</legend>

                <button
                  popoverTarget="cally-popover1"
                  className="input input-border  overflow-x-hidden"
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
              </div>
              <div className="flex flex-col w-full h-full items-center justify-center">
                <legend className="fieldset-legend">Heure :</legend>
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
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                  />{" "}
                  <span className="badge hidden badge-neutral badge-xs">
                    Optional
                  </span>
                </label>
                <p className="validator-hint h-0 p-0 mt-1">
                  Doit être au format HH:MM
                </p>
              </div>
            </div>
            <legend className="fieldset-legend">Cloture des commandes</legend>
            <div className=" flex w-full h-full items-center justify-center flex-row gap-4">
              <div className="flex flex-col w-1/3 items-center justify-center">
                <legend className="fieldset-legend">Date :</legend>
                <button
                  popoverTarget="cally-popover2"
                  className="input input-border overflow-x-hidden"
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
              </div>
              <div className=" flex flex-col w-full h-full items-center justify-center">
                <legend className="fieldset-legend">Heure :</legend>
                <label className="input validator">
                  Cloture:
                  <input
                    type="text"
                    required
                    placeholder="HH:MM"
                    pattern="([0-2][0-3]|[0-1][0-9]):[0-5][0-9]"
                    minLength={5}
                    maxLength={5}
                    title="Only letters, numbers or dash"
                    value={eventOrdersClosingTime}
                    onChange={(e) => setEventOrdersClosingTime(e.target.value)}
                  />{" "}
                  <span className="badge hidden badge-neutral badge-xs">
                    Optional
                  </span>
                </label>
                <p className="validator-hint h-0 p-0 m-0 mt-1">
                  Doit être au format HH:MM
                </p>
              </div>
            </div>
          </div>
        </CardImageGen>

        <CreateItems
          title="Les Plats"
          type="dish"
          createEmptyItem={createEmptyItem}
          itemsList={itemsList}
          setItemValue={setItemValue}
          rmbg={removingBackground}
          setActiveBgRemovals={setActiveBgRemovals}
          deleteItem={deleteItem}
        />

        <CreateItems
          title="Les Extras"
          type="side"
          createEmptyItem={createEmptyItem}
          itemsList={itemsList}
          setItemValue={setItemValue}
          rmbg={removingBackground}
          setActiveBgRemovals={setActiveBgRemovals}
          deleteItem={deleteItem}
        />

        <CreateItems
          title="Les Boissons"
          type="drink"
          createEmptyItem={createEmptyItem}
          itemsList={itemsList}
          setItemValue={setItemValue}
          rmbg={removingBackground}
          setActiveBgRemovals={setActiveBgRemovals}
          deleteItem={deleteItem}
        />

        <div className="flex flex-col w-full h-full items-center justify-center gap-4">
          <button
            className={`btn btn-primary w-1/2 m-5 ${loading && "btn-disabled"}`}
            onClick={() => {
              handleCreateOrder();
            }}
          >
            Créer l'événement
          </button>
          <div
            className={`flex flex-col md:flex-row w-full items-center justify-center gap-2 ${
              removingBackground ? "" : "invisible"
            }`}
          >
            <p className="text-center">
              Suppresion des arrières plans en cours (cela peut prendre
              plusieurs minutes) La page ne se rafraichira pas pendant ce
              processus.
            </p>
            <span className="loading loading-dots loading-sm"></span>
          </div>
          <div
            className={`loading loading-spinner loading-md ${
              !loading && "invisible"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default AdminCreateEvent;
