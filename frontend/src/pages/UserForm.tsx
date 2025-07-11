import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import TransitionDiv from "../components/TransitionDiv";
import CardMeal from "../components/CardMeal";
import { useState, useRef } from "react";

function UserForm() {
  const maxTabs = 4;
  const [currentTab, setCurrentTab] = useState(0);

  const [transitionState, setTransitionState] = useState({
    0: "idle",
    1: "idle",
    2: "idle",
    3: "idle",
  });

  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [dishID, setDishID] = useState(0);

  const mainDivRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const firstNameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  function nextTab() {
    let isValid = true;
    if (!nameInputRef.current?.reportValidity()) {
      console.log("Name input is invalid.");
      nameInputRef.current?.setCustomValidity("Dois être de 3 à 30 caractères");
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
    if (!isValid) {
      console.log("Form is invalid, cannot proceed to next tab.");
      //return;
    }

    if (currentTab < maxTabs) {
      let nextTab = currentTab + 1;
      setTransitionState((prev) => ({ ...prev, [currentTab]: "exiting" }));
      //setCurrentTab(-1);
      setTimeout(() => {
        setTransitionState((prev) => ({ ...prev, [currentTab]: "idle" }));
        setTransitionState((prev) => ({ ...prev, [nextTab]: "entering" }));
        setCurrentTab(nextTab);
        mainDivRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          setTransitionState((prev) => ({ ...prev, [nextTab]: "idle" }));
        }, 100);
      }, 100);
    }
  }

  function previousTab() {
    if (currentTab > 0) {
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

  console.log("Name:", name);
  console.log("First Name:", firstName);
  console.log("Dish ID:", dishID);

  return (
    <div
      ref={mainDivRef}
      className="flex-grow h-full w-full flex flex-col gap-4 p-4 justify-between"
    >
      <TransitionDiv
        state={transitionState[0]}
        show={currentTab === 0}
        classes="flex-grow flex flex-col gap-6 h-full w-full items-center justify-center"
      >
        <h1 className="mb-1 w-full text-center text-3xl font-bold">
          Qui es-tu ?
        </h1>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 flex flex-col items-stretch justify-center">
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
          <fieldset className="fieldset">
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
            <p className="validator-hint">Dois être de 10 chiffres</p>
          </fieldset>
        </fieldset>
      </TransitionDiv>
      <TransitionDiv
        state={transitionState[1]}
        show={currentTab === 1}
        classes={`flex-grow  flex flex-col gap-6  h-full w-full items-center justify-center`}
      >
        <h1 className="mb-3 w-full text-center text-3xl font-bold">
          Que souhaites-tu commander ?
        </h1>
        <div className="flex flex-row md:flex-row gap-4 flex-wrap justify-center">
          <CardMeal
            title="Poulet Crispy"
            description="Du bon poulet croustillant, servi avec des sauces maisons au choix."
            price={5.5}
            quantity={3}
            imgSrc="https://www.seekpng.com/png/full/75-757824_emoji-chicken-leg-png-fried-chicken-emoji-png.png"
            selected={true}
          />
          <CardMeal
            title="Burger Classique"
            description="Un burger juteux avec du fromage, de la laitue et une sauce spéciale."
            price={8.0}
            quantity={1}
            imgSrc="https://www.seekpng.com/png/full/75-757824_emoji-chicken-leg-png-fried-chicken-emoji-png.png"
            selected={false}
          />
          <CardMeal
            title="Salade César"
            description="Une salade fraîche avec du poulet grillé, des croûtons et une sauce César."
            price={6.0}
            quantity={1}
            imgSrc="https://www.seekpng.com/png/full/75-757824_emoji-chicken-leg-png-fried-chicken-emoji-png.png"
            selected={false}
          />
        </div>
      </TransitionDiv>

      <TransitionDiv
        state={transitionState[2]}
        show={currentTab === 2}
        classes={`flex-grow flex flex-col gap-6 h-full w-full items-center justify-center`}
      >
        <h1 className="mb-3 w-full text-center text-3xl font-bold">
          Un accompagnement ?
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <CardMeal
            title="Non merci"
            description="J'ai un petit appétit aujourd'hui, pas de frites pour moi."
            price={0}
            quantity={0}
            imgSrc="https://cdn.pixabay.com/photo/2013/07/13/12/32/cross-159808_960_720.png"
            selected={true}
          />
          <CardMeal
            title="Frites"
            description="Des frites croustillantes, parfaites pour accompagner ton repas."
            price={0.5}
            quantity={1}
            imgSrc="https://images.emojiterra.com/google/android-12l/512px/1f35f.png"
            selected={false}
          />
        </div>
      </TransitionDiv>

      {currentTab === 4 && (
        <button className="btn btn-accent btn-outline font-bold">
          Commander !!!
        </button>
      )}
      <div className="flex flex-col items-center gap-4 w-full z-20">
        <div className="flex gap-4">
          <button
            className={`btn ${currentTab === 0 ? "btn-disabled" : ""}`}
            onClick={previousTab}
          >
            Precedent
          </button>
          <button className="btn btn-accent" onClick={nextTab}>
            Suivant
          </button>
        </div>

        <ul className="steps">
          <li className={`step ${currentTab >= 0 && "step-accent"}`}>
            C qui ?
          </li>
          <li className={`step ${currentTab >= 1 && "step-accent"}`}>Plats</li>
          <li className={`step ${currentTab >= 2 && "step-accent"}`}>Extras</li>
          <li className={`step ${currentTab >= 3 && "step-accent"}`}>
            Boissons
          </li>
          <li className={`step ${currentTab >= 4 && "step-accent"}`}>Résumé</li>
        </ul>
      </div>
    </div>
  );
}

export default UserForm;
