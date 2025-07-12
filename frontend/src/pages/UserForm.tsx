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

import getEventFromId from "../utils/dbFetch/getEventFromId";
import getItemsFromEventId from "../utils/dbFetch/getItemsFromEventId";
import postOrder from "../utils/dbFetch/postOrder";

function UserForm() {
  const maxTabs = 4;
  let { id } = useParams();
  let eventId = parseInt(id || "0");
  const [currentTab, setCurrentTab] = useState(0);

  const [transitionState, setTransitionState] = useState({
    0: "idle",
    1: "idle",
    2: "idle",
    3: "idle",
    4: "idle",
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
  const [dishID, setDishID] = useState(0);
  const [sideID, setSideID] = useState(0);
  const [drinkID, setDrinkID] = useState(0);

  const [dishes, setDishes] = useState<Item[]>([]);
  const [sides, setSides] = useState<Item[]>([]);
  const [drinks, setDrinks] = useState<Item[]>([]);

  const [eventData, setEventData] = useState<Event>();

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
    getEventFromId(eventId, setEventData);
  }, []);

  useEffect(() => {
    getItemsFromEventId(eventId, setDishes, setSides, setDrinks);
  }, []);

  function densePostOrder() {
    postOrder({
      eventId: eventId,
      name: name,
      firstName: firstName,
      phone: phone,
      dishId: dishID,
      sideId: sideID,
      drinkId: drinkID,
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
            "Dois être de 3 à 30 caractères"
          );
          isValid = false;
        }

        if (!firstNameInputRef.current?.reportValidity()) {
          console.log("First name input is invalid.");
          firstNameInputRef.current?.setCustomValidity(
            "Dois être de 3 à 30 caractères"
          );
          isValid = false;
        }

        if (!phoneInputRef.current?.reportValidity()) {
          phoneInputRef.current?.setCustomValidity("Dois être de 10 chiffres");
          isValid = false;
        }
      } else if (currentTab === 1) {
        isValid = dishID > 0;
        if (!isValid) {
          setErrorIndicator({
            has: true,
            message: "Veuillez sélectionner un plat.",
          });
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

  if (orderSuccess) {
    return (
      <div className="flex-grow h-full w-full flex flex-col gap-4 p-4 justify-center items-center">
        <div className="h-1/3"></div>

        <div className="flex flex-col items-center gap-4 h-full w-full">
          <h2 className="text-2xl font-bold">Merci pour ta commande !</h2>
          <p>On se revoit le {TextDate(eventData?.date, eventData?.time)}</p>
        </div>
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
                className="input validator tabular-nums text-2xl"
                required
                placeholder="0612345678"
                pattern="^0[1-9][0-9]{8}$"
                minLength={10}
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  phoneInputRef.current?.setCustomValidity("");
                }}
              />
              <p className="validator-hint mt-[2px]">
                Dois être de 10 chiffres
              </p>
            </fieldset>
          </fieldset>
        </TransitionDiv>
        <TransitionDiv
          state={transitionState[1]}
          show={currentTab === 1}
          classes={`flex-grow  flex flex-col gap-3  w-full items-center justify-center`}
        >
          <h1 className="mb-3 w-full text-center text-3xl font-bold">
            Tu veux quoi ?
          </h1>
          <div className="flex flex-row flex-wrap justify-center gap-2">
            {dishes.map((dish: Item) => (
              <CardItem
                key={dish.id}
                title={dish.name}
                description={dish.description}
                price={dish.price}
                quantity={dish.quantity}
                img_url={dish.img_url}
                onclick={() => {
                  setDishID(dish.id);
                  setErrorIndicator({
                    has: false,
                    message: "",
                  });
                }}
                selected={dishID === dish.id}
              />
            ))}
          </div>
        </TransitionDiv>

        <TransitionDiv
          state={transitionState[2]}
          show={currentTab === 2}
          classes={`flex-grow flex flex-col gap-3  w-full items-center justify-center`}
        >
          <h1 className="mb-3 w-full text-center text-3xl font-bold">
            Un accompagnement ?
          </h1>
          <div className="flex flex-row flex-wrap justify-center gap-2">
            <CardItem
              title="Non merci"
              description="J'ai un petit appétit aujourd'hui, rien pour moi."
              price={0}
              quantity={0}
              img_url="https://cdn.pixabay.com/photo/2013/07/13/12/32/cross-159808_960_720.png"
              onclick={() => setSideID(0)}
              selected={sideID === 0}
            />
            {sides.map((side: Item) => (
              <CardItem
                key={side.id}
                title={side.name}
                description={side.description}
                price={side.price}
                quantity={side.quantity}
                img_url={side.img_url}
                onclick={() => setSideID(side.id)}
                selected={sideID === side.id}
              />
            ))}
          </div>
        </TransitionDiv>

        <TransitionDiv
          state={transitionState[3]}
          show={currentTab === 3}
          classes={` flex-grow flex flex-col gap-3 w-full items-center justify-center`}
        >
          <h1 className="mb-3 w-full text-center text-3xl font-bold">
            Une boisson ?
          </h1>
          <div className="flex flex-row flex-wrap justify-center gap-2">
            <CardItem
              title="Non merci"
              description="Je préfère boire de l'eau."
              price={0}
              quantity={0}
              img_url="https://cdn.pixabay.com/photo/2013/07/13/12/32/cross-159808_960_720.png"
              onclick={() => setDrinkID(0)}
              selected={drinkID === 0}
            />
            {drinks.map((drink: Item) => (
              <CardItem
                key={drink.id}
                title={drink.name}
                description={drink.description}
                price={drink.price}
                quantity={drink.quantity}
                img_url={drink.img_url}
                onclick={() => setDrinkID(drink.id)}
                selected={drinkID === drink.id}
              />
            ))}
          </div>
        </TransitionDiv>

        <TransitionDiv
          state={transitionState[4]}
          show={currentTab === 4}
          classes={`flex-grow flex flex-col gap-3 w-full items-center justify-center`}
        >
          {eventData ? (
            <ReciepeEvent
              event={eventData}
              name={name}
              firstName={firstName}
              phone={phone}
              dish={dishes.find((d) => d.id === dishID) || null}
              side={sides.find((s) => s.id === sideID) || null}
              drink={drinks.find((d) => d.id === drinkID) || null}
              onClick={() => densePostOrder()}
              ordering={ordering}
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

        <div className="flex flex-col items-center gap-4 w-full z-20">
          <div className="flex gap-4">
            <button
              className={`btn ${currentTab === 0 ? "btn-disabled" : ""}`}
              onClick={previousTab}
            >
              Precedent
            </button>
            <button
              className={`btn btn-accent ${
                currentTab === maxTabs ? "btn-disabled" : ""
              }`}
              onClick={nextTab}
            >
              Suivant
            </button>
          </div>

          <ul className="steps">
            <li className={`step ${currentTab >= 0 && "step-accent"}`}>
              C qui ?
            </li>
            <li className={`step ${currentTab >= 1 && "step-accent"}`}>
              Plats
            </li>
            <li className={`step ${currentTab >= 2 && "step-accent"}`}>
              Extras
            </li>
            <li className={`step ${currentTab >= 3 && "step-accent"}`}>
              Boissons
            </li>
            <li className={`step ${currentTab >= 4 && "step-accent"}`}>
              Résumé
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default UserForm;
