import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import InputField from "../components/InputField";
import TransitionDiv from "../components/TransitionDiv";
import ReciepeEvent from "../components/ReciepeEvent";
import CardItem from "../components/CardItem";
import NavbarSpacer from "../components/NavbarSpacer";
import TextDate from "../components/TextDate";

import type Item from "../types/ItemType";
import type Event from "../types/EventType";
import type Type from "../types/TypeType";

import getEventFromId from "../utils/dbFetch/getEventFromId";
import getItemsFromEventId from "../utils/dbFetch/getItemsFromEventId";
import postOrder from "../utils/dbFetch/postOrder";
import Logo from "../components/Logo";
import correctDate from "../utils/DateCorrector";
import getTypesFromEventId from "../utils/dbFetch/getTypesFromEventId";

function UserForm() {
  let maxTabs = 4;
  let { id } = useParams();
  let event_id = parseInt(id || "0");
  const [currentTab, setCurrentTab] = useState(0);

  const [transitionState, setTransitionState] = useState<{
    [key: number]: string;
  }>({
    0: "idle",
    1: "idle",
    2: "idle",
    3: "idle",
    4: "idle",
    5: "idle",
    6: "idle",
    7: "idle",
    8: "idle",
    9: "idle",
    10: "idle",
  });

  const [ErrorIndicator, setErrorIndicator] = useState({
    has: false,
    message: "",
  });

  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [name, setName] = useState(() => {
    const storedName = localStorage.getItem("name");
    return storedName ? storedName : "";
  });
  const [firstName, setFirstName] = useState(() => {
    const storedFirstName = localStorage.getItem("firstName");
    return storedFirstName ? storedFirstName : "";
  });
  const [phone, setPhone] = useState(() => {
    const storedPhone = localStorage.getItem("phone");
    return storedPhone ? storedPhone : "";
  });
  const [items, setItems] = useState<Item[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  const [orderedItems, setOrderedItems] = useState<Item[]>([]);

  const [eventData, setEventData] = useState<Event>();

  const [isDelivery, setIsDelivery] = useState<boolean | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState(() => {
    const storedAddress = localStorage.getItem("deliveryAddress");
    return storedAddress ? storedAddress : "";
  });
  const [deliveryTime, setDeliveryTime] = useState("");

  const mainDivRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("name", name);
  }, [name]);
  useEffect(() => {
    localStorage.setItem("firstName", firstName);
  }, [firstName]);
  useEffect(() => {
    localStorage.setItem("phone", phone);
  }, [phone]);
  useEffect(() => {
    localStorage.setItem("deliveryAddress", deliveryAddress);
  }, [deliveryAddress]);

  useEffect(() => {
    getEventFromId(event_id, setEventData);
  }, []);

  useEffect(() => {
    getTypesFromEventId(event_id, setTypes);
    getItemsFromEventId(event_id, setItems);
  }, []);

  maxTabs = 1 + types.length + (eventData?.deliveries_enabled ? 1 : 0);

  function densePostOrder() {
    postOrder({
      event_id: event_id,
      name: name,
      firstName: firstName,
      phone: phone,
      items: orderedItems,
      is_delivery: eventData?.deliveries_enabled ? isDelivery || false : false,
      delivery_address: isDelivery === true ? deliveryAddress : undefined,
      delivery_time: isDelivery === true ? deliveryTime : undefined,
      onRequestStart: () => {
        setOrdering(true);
        setErrorIndicator({
          has: false,
          message: "",
        });
      },
      onRequestEnd: () => {
        setOrdering(false);
      },
      onSuccess: () => {
        setOrderSuccess(true);
        setErrorIndicator({
          has: false,
          message: "",
        });
      },
      onError: () => {
        setErrorIndicator({
          has: true,
          message:
            "Une erreur réseau est survenue lors de la soumission de la commande.",
        });
      },
    });
  }

  function nextTab() {
    if (currentTab < maxTabs) {
      setErrorIndicator({
        has: false,
        message: "",
      });

      let isValid = true;
      if (currentTab === 0) {
        if (!nameInputRef.current?.reportValidity()) {
          console.log("Name input is invalid.");
          nameInputRef.current?.setCustomValidity(
            "Dois être de 3 à 30 caractères",
          );
          isValid = false;
        }

        if (!firstNameInputRef.current?.reportValidity()) {
          console.log("First name input is invalid.");
          firstNameInputRef.current?.setCustomValidity(
            "Dois être de 3 à 30 caractères",
          );
          isValid = false;
        }

        if (!phoneInputRef.current?.reportValidity()) {
          phoneInputRef.current?.setCustomValidity("Dois être de 10 chiffres");
          isValid = false;
        }
      } else if (currentTab > 0 && currentTab < 1 + types.length) {
        isValid = true;
        if (types[currentTab - 1].is_required) {
          isValid =
            orderedItems.filter(
              (item) => item.type === types[currentTab - 1].name,
            ).length > 0;
        }
        if (!isValid) {
          setErrorIndicator({
            has: true,
            message: "Veuillez sélectionner un plat.",
          });
        }
      } else if (
        currentTab === 1 + types.length &&
        eventData?.deliveries_enabled
      ) {
        // Validate delivery tab
        if (isDelivery === null) {
          isValid = false;
          setErrorIndicator({
            has: true,
            message: "Veuillez choisir un mode de retrait.",
          });
        } else if (isDelivery === true) {
          // Validate delivery details
          if (!deliveryAddress.trim()) {
            isValid = false;
            setErrorIndicator({
              has: true,
              message: "Veuillez saisir votre adresse de livraison.",
            });
          } else if (!deliveryTime) {
            isValid = false;
            setErrorIndicator({
              has: true,
              message: "Veuillez saisir une heure de livraison.",
            });
          } else {
            const minTime =
              eventData?.deliveries_start_time?.substring(0, 5) ||
              eventData?.time;
            const maxTime = eventData?.deliveries_end_time?.substring(0, 5);
            if (minTime && deliveryTime < minTime) {
              isValid = false;
              setErrorIndicator({
                has: true,
                message: `L'heure de livraison doit être après ${minTime}.`,
              });
            } else if (maxTime && deliveryTime > maxTime) {
              isValid = false;
              setErrorIndicator({
                has: true,
                message: `L'heure de livraison doit être avant ${maxTime}.`,
              });
            }
          }
        }
      }

      if (!isValid) {
        console.log("Form is invalid, cannot proceed to next tab.");
        return;
      }

      let nextTab = currentTab + 1;
      setTransitionState((prev) => ({ ...prev, [currentTab]: "exiting" }));
      //setCurrentTab(-1);
      setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, [currentTab]: "idle" }));
        setTransitionState((prev) => ({ ...prev, [nextTab]: "entering" }));
        setCurrentTab(nextTab);
        setTimeout(() => {
          mainDivRef.current?.scrollTo({ top: 0, behavior: "instant" });

          setTransitionState((prev) => ({ ...prev, [nextTab]: "idle" }));
        }, 100);
      }, 100);
    }
  }

  function previousTab() {
    if (currentTab > 0) {
      setErrorIndicator({
        has: false,
        message: "",
      });
      let nextTab = currentTab - 1;
      setTransitionState((prev) => ({ ...prev, [currentTab]: "entering" }));
      //setCurrentTab(-1);
      setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, [currentTab]: "idle" }));
        setTransitionState((prev) => ({ ...prev, [nextTab]: "exiting" }));
        setCurrentTab(nextTab);
        mainDivRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          setTransitionState((prev) => ({ ...prev, [nextTab]: "idle" }));
        }, 100);
      }, 100);
    }
  }

  /*   console.log("Name:", name);
  console.log("First Name:", firstName);
  console.log("Dish ID:", dishID); */

  const resumeIndex =
    1 + types.length + (eventData?.deliveries_enabled ? 1 : 0);

  if (
    eventData?.form_closing_date &&
    eventData?.time &&
    new Date(`${correctDate(eventData.form_closing_date)}T${eventData.time}`) <
      new Date()
  ) {
    return (
      <div className="flex-grow h-full w-full flex flex-col gap-4 p-4 justify-center items-center">
        <div className="h-1/3"></div>
        <Logo className=" h-40 w-40 animate-spin-slow" alive={false} />
        <p className="text-error">Les commandes sont fermées :( </p>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="flex-grow h-full w-full flex flex-col gap-4 p-4 justify-center items-center">
        <div className="h-1/3"></div>

        <div className="flex flex-col items-center gap-4 h-full w-full">
          <h2 className="text-2xl font-bold">Merci pour ta commande !</h2>
          <p>On se revoit le {TextDate(eventData?.date, eventData?.time)}</p>
          <Logo className=" h-40 w-40 animate-spin-slow" />
        </div>
        <div className="hidden animate-spin-slow"></div>
        <p className="text-success mb-auto h-20">
          Votre commande a été passée avec succès.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={mainDivRef}
        className="flex-grow h-full w-full flex flex-col gap-4 pr-4 pl-4 pb-4 justify-between overflow-x-hidden  overflow-y-scroll"
      >
        <NavbarSpacer />
        <TransitionDiv
          state={transitionState[0]}
          show={currentTab === 0}
          classes="flex-grow flex flex-col gap-3 w-full items-center justify-center"
        >
          <h1 className="mb-1 w-full text-center text-3xl font-bold">
            Qui es-tu ?
          </h1>
          <fieldset className="fieldset md:gap-0 bg-base-200 border-base-300 rounded-box w-xs border p-4 md:pt-2 md:pb-2 flex flex-col items-start justify-center">
            <InputField
              key="name-input"
              ref={nameInputRef}
              legend="Nom :"
              placeholder="Ton nom"
              value={name}
              set={setName}
            />
            <InputField
              key="first-name-input"
              ref={firstNameInputRef}
              legend="Prénom :"
              placeholder="Ton prénom"
              value={firstName}
              set={setFirstName}
            />
            <fieldset className="fieldset md:gap-0">
              <legend className="fieldset-legend text-xl">
                Numero de téléphone :
              </legend>
              <input
                ref={phoneInputRef}
                type="tel"
                className="input  tabular-nums text-2xl"
                required
                placeholder="0612345678"
                minLength={1}
                maxLength={100}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  phoneInputRef.current?.setCustomValidity("");
                }}
              />
            </fieldset>
          </fieldset>
        </TransitionDiv>
        {types.map((type, index) => (
          <TransitionDiv
            state={transitionState[1 + index]}
            show={currentTab === 1 + index}
            classes={`flex-grow  flex flex-col gap-3  w-full items-center justify-center`}
          >
            <h1 className="mb-3 w-full text-center text-3xl font-bold">
              Tu veux quoi ?
            </h1>
            <div className="flex flex-row flex-wrap justify-center gap-2">
              {items
                .filter((item) => item.type === type.name)
                .map((dish: Item) => (
                  <CardItem
                    key={dish.id}
                    title={dish.name}
                    description={dish.description}
                    price={dish.price}
                    quantity={dish.quantity}
                    img_url={dish.img_url}
                    ordered_quantity={
                      orderedItems.find((item) => item.id === dish.id)
                        ?.ordered_quantity || 0
                    }
                    onChangeOrderedQuantity={(toAdd: number) => {
                      console.log("Changing quantity for:", dish.id);
                      setOrderedItems((prev) => {
                        return prev
                          .map((item) => {
                            if (item.id === dish.id) {
                              let newQuantity =
                                (item.ordered_quantity || 0) + toAdd;
                              if (newQuantity <= 0) {
                                newQuantity = 0;
                                return null;
                              }
                              return { ...item, ordered_quantity: newQuantity };
                            }
                            return item;
                          })
                          .filter((item): item is Item => item !== null);
                      });
                    }}
                    onclick={() => {
                      setOrderedItems((prev) => {
                        let exists = prev.find((item) => item.id === dish.id);
                        if (exists) {
                          return prev.filter((item) => item.id !== dish.id);
                        } else {
                          return [...prev, { ...dish, ordered_quantity: 1 }];
                        }
                      });
                      console.log(orderedItems);

                      setErrorIndicator({
                        has: false,
                        message: "",
                      });
                    }}
                    selected={orderedItems.some(
                      (orderedItem) => orderedItem.id === dish.id,
                    )}
                  />
                ))}
            </div>
          </TransitionDiv>
        ))}

        {eventData?.deliveries_enabled && (
          <TransitionDiv
            state={transitionState[1 + types.length]}
            show={currentTab === 1 + types.length}
            classes={`flex-grow flex flex-col gap-3 w-full items-center justify-center`}
          >
            <h1 className="mb-3 w-full text-center text-3xl font-bold">
              Mode de retrait
            </h1>
            <p className="text-center mb-2">
              La livraison est disponible pour cet événement au prix de{" "}
              <span className="font-bold">{eventData?.deliveries_price}€</span>.
            </p>
            {eventData?.deliveries_start_time &&
              eventData?.deliveries_end_time && (
                <p className="text-center mb-2">
                  Créneau de livraison :{" "}
                  <span className="font-bold">
                    {eventData.deliveries_start_time.substring(0, 5)} -{" "}
                    {eventData.deliveries_end_time.substring(0, 5)}
                  </span>
                </p>
              )}
            {eventData?.deliveries_info && (
              <p className="text-center mb-2 text-sm opacity-70">
                {eventData.deliveries_info}
              </p>
            )}

            <div className="flex flex-row flex-wrap justify-center gap-4">
              {/* Delivery Card */}
              <div
                className={`card bg-base-200 ${
                  isDelivery === true ? "border-accent border-2" : ""
                } w-80 shadow-sm cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => {
                  setIsDelivery(true);
                  setErrorIndicator({ has: false, message: "" });
                }}
              >
                <figure className="px-10 pt-10 h-40 w-full flex justify-center items-center">
                  <div className="text-6xl">🚗</div>
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title font-bold">Livraison</h2>
                  <p className="text-lg font-bold">
                    +{eventData?.deliveries_price}€
                  </p>
                  <p>Je veux être livré(e)</p>
                </div>
              </div>

              {/* Pickup Card */}
              <div
                className={`card bg-base-200 ${
                  isDelivery === false ? "border-accent border-2" : ""
                } w-80 shadow-sm cursor-pointer hover:scale-105 transition-transform`}
                onClick={() => {
                  setIsDelivery(false);
                  setErrorIndicator({ has: false, message: "" });
                }}
              >
                <figure className="px-10 pt-10 h-40 w-full flex justify-center items-center">
                  <div className="text-6xl">🏪</div>
                </figure>
                <div className="card-body items-center text-center">
                  <h2 className="card-title font-bold">Sur place</h2>
                  <p className="text-lg font-bold">Gratuit</p>
                  <p>Je viendrai chercher</p>
                </div>
              </div>
            </div>

            {/* Delivery Details Section */}
            {isDelivery === true && (
              <div className="mt-6 w-full max-w-md">
                <fieldset className="fieldset md:gap-0 bg-base-200 border-base-300 rounded-box border p-4 flex flex-col items-start justify-center gap-4">
                  <legend className="text-xl font-bold">
                    Détails de livraison
                  </legend>

                  {eventData?.deliveries_info && (
                    <p className="text-sm w-full text-center">
                      Info supplémentaire : {eventData.deliveries_info}
                    </p>
                  )}

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text font-semibold">
                        Adresse de livraison
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Votre adresse complète"
                      className="input input-bordered w-full"
                      value={deliveryAddress}
                      onChange={(e) => {
                        setDeliveryAddress(e.target.value);
                        if (e.target.value.trim().length >= 5) {
                          setErrorIndicator({ has: false, message: "" });
                        }
                      }}
                      required={isDelivery === true}
                      minLength={5}
                    />
                  </label>

                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text font-semibold">
                        Heure de livraison souhaitée
                      </span>
                      {eventData?.deliveries_start_time &&
                        eventData?.deliveries_end_time && (
                          <span className="label-text-alt">
                            entre{" "}
                            {eventData.deliveries_start_time.substring(0, 5)} et{" "}
                            {eventData.deliveries_end_time.substring(0, 5)}
                          </span>
                        )}
                    </div>
                    <input
                      type="time"
                      className="input input-bordered w-full"
                      value={deliveryTime}
                      onChange={(e) => {
                        setDeliveryTime(e.target.value);
                        const minTime =
                          eventData?.deliveries_start_time?.substring(0, 5) ||
                          eventData?.time;
                        const maxTime =
                          eventData?.deliveries_end_time?.substring(0, 5);
                        if (
                          e.target.value &&
                          (!minTime || e.target.value >= minTime) &&
                          (!maxTime || e.target.value <= maxTime)
                        ) {
                          setErrorIndicator({ has: false, message: "" });
                        }
                      }}
                      required={isDelivery === true}
                      min={
                        eventData?.deliveries_start_time?.substring(0, 5) ||
                        eventData?.time ||
                        "00:00"
                      }
                      max={
                        eventData?.deliveries_end_time?.substring(0, 5) ||
                        "23:59"
                      }
                    />
                  </label>
                </fieldset>
              </div>
            )}
          </TransitionDiv>
        )}

        <TransitionDiv
          state={transitionState[resumeIndex]}
          show={currentTab === resumeIndex}
          classes={`flex-grow flex flex-col gap-3 w-full items-center justify-center`}
        >
          {eventData ? (
            <ReciepeEvent
              event={eventData}
              name={name}
              firstName={firstName}
              phone={phone}
              types={types}
              orderedItems={orderedItems}
              onClick={() => densePostOrder()}
              ordering={ordering}
              isDelivery={isDelivery === true}
              deliveryAddress={deliveryAddress}
              deliveryTime={deliveryTime}
            />
          ) : (
            <span className="loading loading-spinner loading-lg"></span>
          )}
        </TransitionDiv>
        <div className="h-24  w-full shrink-0"></div>
      </div>
      <div className="fixed bottom-0 left-0 w-full h-32 flex flex-col items-center justify-center gap-2 backdrop-blur-lg z-30">
        <p
          key={"error-indicator"}
          className={`text-error invisible ${
            ErrorIndicator.has && "visible"
          } w-full text-center`}
        >
          {ErrorIndicator.message}
        </p>

        <div className="flex flex-col items-center  w-full z-20">
          <div className="flex gap-4">
            <button
              className={`btn ${currentTab === 0 ? "btn-disabled" : ""}`}
              onClick={previousTab}
            >
              Precedent
            </button>
            <button
              className={`btn mr-4 btn-accent ${
                currentTab === maxTabs ? "btn-disabled" : ""
              }`}
              onClick={nextTab}
            >
              Suivant
            </button>
          </div>

          <ul className="steps">
            <li className={`step ${currentTab >= 0 ? "step-accent" : ""}`}>
              C qui ?
            </li>
            {types.map((type, index) => (
              <li
                key={"step-indicator-" + index}
                className={`step ${
                  currentTab >= 1 + index ? "step-accent" : ""
                }`}
              >
                {type.name}s
              </li>
            ))}
            {eventData?.deliveries_enabled && (
              <li
                className={`step ${
                  currentTab >= 1 + types.length ? "step-accent" : ""
                }`}
              >
                Livraison
              </li>
            )}

            <li
              className={`step ${
                currentTab >= resumeIndex ? "step-accent" : ""
              }`}
            >
              Résumé
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default UserForm;
