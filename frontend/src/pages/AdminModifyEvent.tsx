import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import NavbarSpacer from "../components/NavbarSpacer";
import "cally";
import Calendar from "../components/Calendar";
import CardImageGen from "../components/CardImageGen";
import type ModifyItem from "../types/ModifyItemType";
import Logo from "../components/Logo";
import CreateItems from "../components/CreateItems";
import getEventFromId from "../utils/dbFetch/getEventFromId";
import getItemsFromEventId from "../utils/dbFetch/getItemsFromEventId";
import putEventUpdate from "../utils/dbFetch/putEventUpdate";

import type Item from "../types/ItemType";
import type Event from "../types/EventType";
import correctDate from "../utils/DateCorrector";
import type typeType from "../types/TypeType";
import getTypesFromEventId from "../utils/dbFetch/getTypesFromEventId";

function AdminModifyEvent() {
  let { id } = useParams();

  const navigate = useNavigate();
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
  const [deliveryEnabled, setDeliveryEnabled] = useState<boolean>(false);
  const [deliveryPrice, setDeliveryPrice] = useState<number>(0);

  const [removingBackground, setRemovingBackground] = useState<boolean>(false);
  const [activeBgRemovals, setActiveBgRemovals] = useState<number>(0);
  const [eventId, setEventId] = useState<string>("");
  const [itemsList, setItemsList] = useState<ModifyItem[]>([]);
  const [itemsToDelete, setItemsToDelete] = useState<ModifyItem[]>([]);

  const [eventData, setEventData] = useState<Event | null>(null);
  const [types, setTypes] = useState<typeType[]>([]);
  const [typesToDelete, setTypesToDelete] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const checkedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getEventFromId(Number(id), setEventData);
    getTypesFromEventId(Number(id), setTypes);
  }, [id]);

  useEffect(() => {
    console.log("event data changed", eventData);
    setEventName(eventData?.title || "");
    setEventDescription(eventData?.description || "");
    setEventDate(correctDate(eventData?.date || ""));
    setEventTime(eventData?.time?.substring(0, 5) || "");
    setEventOrdersClosingDate(correctDate(eventData?.form_closing_date || ""));
    setEventOrdersClosingTime(
      eventData?.form_closing_time.substring(0, 5) || ""
    );
    setEventImgUrl(eventData?.img_url || "");
    setDeliveryEnabled(eventData?.deliveries_enabled || false);
    setDeliveryPrice(eventData?.deliveries_price || 0);
  }, [eventData]);

  useEffect(() => {
    getItemsFromEventId(Number(id), (items: Item[]) => {
      const modifiedItems: ModifyItem[] = items.map((item) => ({
        ...item,
        new: false,
        modified: false,
      }));
      setItemsList(modifiedItems);
      console.log("items loaded", modifiedItems);
    });
  }, [id]);

  function createPutRequestBody(): object {
    let jsonBody = {
      title: eventName,
      description: eventDescription,
      date: eventDate,
      time: eventTime,
      form_closing_date: eventOrdersClosingDate,
      form_closing_time: eventOrdersClosingTime,
      img_url: eventImgUrl,
      types: types,
      items: itemsList,
      itemsToDelete: itemsToDelete,
      typesToDelete: typesToDelete,
      deliveries_enabled: deliveryEnabled,
      deliveries_price: deliveryPrice,
    };
    return jsonBody;
  }

  function handleUpdateEvent() {
    setLoading(true);
    setRemovingBackground(true);
    setActiveBgRemovals(itemsList.length + 1);
  }

  useEffect(() => {
    if (!removingBackground || !loading || activeBgRemovals !== 0) return;
    console.log("backgrounds removed");
    const putBody = createPutRequestBody();
    setRemovingBackground(false);

    putEventUpdate({
      eventData: putBody,
      id: Number(id),
      onRequestStart: () => {
        console.log("Request started");
      },
      onRequestEnd: () => {
        console.log("Request ended");
        setLoading(false);
        setActiveBgRemovals(0);
      },
      onSuccess: (data: any) => {
        setEventId(data);
        console.log("Event updated successfully");
        setSuccess(true);
      },
      onError: () => {
        setError(true);
      },
    });
  }, [activeBgRemovals]);

  function createEmptyItem(type: string) {
    const newItem: ModifyItem = {
      new: true,
      name: "",
      description: "",
      quantity: 1,
      price: 0,
      type: type,
      img_url: "",
    };
    setItemsList([newItem, ...itemsList]);
  }

  function handleAddType() {
    if (!inputRef.current || inputRef.current.value.trim() === "") return;
    const newTypeName = inputRef.current.value.trim();
    if (types.find((t) => t.name.toLowerCase() === newTypeName.toLowerCase())) {
      inputRef.current.value = "";
      return;
    }
    const newType: typeType = {
      name: newTypeName,
      order_index: types.length + 1,
      is_required: checkedRef.current ? checkedRef.current.checked : false,
    };
    setTypes([...types, newType]);
    inputRef.current.value = "";
  }

  function deleteItemLocally(index: number) {
    if (itemsList[index].id) {
      setItemsToDelete([itemsList[index], ...itemsToDelete]);
    }
    const updatedItems = [...itemsList];
    updatedItems.splice(index, 1);
    setItemsList(updatedItems);
  }

  function deleteType(type: string) {
    const updatedItems = itemsList.filter((item) => item.type !== type);
    setItemsList(updatedItems);
    const updatedTypes = types.filter((t) => t.name !== type);
    setTypes(updatedTypes);
    setTypesToDelete([...typesToDelete, type]);
  }

  function moveType(type: string, direction: "up" | "down") {
    const index = types.findIndex((t) => t.name === type);
    if (index === -1) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= types.length) return;
    const newTypes = [...types];
    [newTypes[index], newTypes[newIndex]] = [
      newTypes[newIndex],
      newTypes[index],
    ];
    setTypes(newTypes);
  }

  function setItemValue(
    index: number,
    field: keyof ModifyItem,
    value: string | number
  ) {
    const updatedItems = [...itemsList];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    if (updatedItems[index].new !== true) {
      updatedItems[index].modified = true;
    }
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
            C'est tout bon !! Evenement modifié
          </h2>
          <Logo className=" h-40 w-40 animate-spin-slow" />
          <h2 className="text-xl">{eventId}</h2>
        </div>
        <div className="hidden animate-spin-slow"></div>
        <p className="text-success mb-auto h-20">
          Votre evenement a été modifié avec succès.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-grow h-full w-full flex flex-col gap-4 pr-4 pl-4 pb-10 overflow-x-hidden  overflow-y-scroll">
      <NavbarSpacer />
      <div className="flex flex-col items-center justify-center gap-2 p-4 ">
        <h1 className="text-2xl font-bold text-center">
          Modification de l'évenement
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Veuillez apporter les modifications souhaitées à l'événement.{" "}
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
            <legend className="fieldset-legend">Livraisons</legend>
            <div className="flex flex-row w-full h-full items-center justify-center gap-4">
              <div className="flex flex-col w-1/2 items-center justify-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={deliveryEnabled}
                    onChange={(e) => setDeliveryEnabled(e.target.checked)}
                  />
                  Activer les livraisons
                </div>
              </div>
              {deliveryEnabled && (
                <div className="flex flex-col w-1/2 items-center justify-center">
                  <legend className="fieldset-legend">
                    Prix de la livraison
                  </legend>
                  <input
                    type="number"
                    className="input"
                    placeholder="Prix de la livraison en €"
                    value={deliveryPrice}
                    onChange={(e) =>
                      setDeliveryPrice(parseFloat(e.target.value))
                    }
                    step={0.1}
                  />
                </div>
              )}
            </div>
          </div>
        </CardImageGen>

        <div className="card bg-base-200 p-3 w-full flex flex-col items-center gap-2">
          <input className="input" ref={inputRef} placeholder="Nouveau type" />
          <div className="flex items-center gap-2">
            <input type="checkbox" ref={checkedRef} className="checkbox" />
            Obligatoire
          </div>

          <button className="btn btn-primary" onClick={handleAddType}>
            Ajouter un type
          </button>
        </div>
        {types
          .filter((typeObj) => typeObj.order_index)
          .map((typeObj, index) => (
            <CreateItems
              key={index}
              title={`Les ${typeObj.name}s`}
              type={typeObj.name}
              required={typeObj.is_required}
              createEmptyItem={createEmptyItem}
              itemsList={itemsList}
              setItemValue={setItemValue}
              rmbg={removingBackground}
              setActiveBgRemovals={setActiveBgRemovals}
              deleteItem={deleteItemLocally}
              deleteType={deleteType}
              moveType={moveType}
            />
          ))}

        <div className="flex flex-col w-full h-full items-center justify-center gap-4">
          <div className="flex  h-full items-center justify-center flex-row">
            <button
              className={`btn btn-error w-1/2 m-5 ${loading && "btn-disabled"}`}
              onClick={() => {
                navigate("/admin");
              }}
            >
              annuler
            </button>
            <button
              className={`btn btn-primary w-1/2 m-5 ${
                loading && "btn-disabled"
              }`}
              onClick={() => {
                handleUpdateEvent();
              }}
            >
              Modifier l'événement
            </button>
          </div>
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

export default AdminModifyEvent;
