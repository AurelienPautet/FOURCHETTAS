import InputField from "../components/InputField";
import InputSelect from "../components/InputSelect";
import CardMeal from "../components/CardMeal";
import { useState } from "react";

function UserForm() {
  const maxTabs = 4;
  const [currentTab, setCurrentTab] = useState(0);

  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [dishID, setDishID] = useState(0);

  function nextTab() {
    if (currentTab < maxTabs) {
      setCurrentTab(currentTab + 1);
    }
  }
  function previousTab() {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  }

  console.log("Name:", name);
  console.log("First Name:", firstName);
  console.log("Dish ID:", dishID);

  return (
    <div className="flex flex-col items-center justify-between gap-4 p-4 h-full">
      {currentTab === 0 && (
        <div className="flex flex-col items-stretch justify-center">
          <InputField
            key="name-input"
            legend="Nom :"
            placeholder="Ton nom"
            value={name}
            set={setName}
          />
          <InputField
            key="first-name-input"
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
              type="tel"
              className="input validator tabular-nums text-2xl"
              required
              placeholder="0612345678"
              pattern="[0-9]*"
              minLength={10}
              maxLength={10}
            />
            <p className="validator-hint">Dois être de 10 chiffres</p>
          </fieldset>
        </div>
      )}

      {currentTab === 1 && (
        <div className="flex flex-col md:flex-row gap-4">
          <CardMeal />
          <CardMeal />
          <CardMeal />
        </div>
      )}
      {currentTab === 4 && (
        <button className="btn btn-accent btn-outline font-bold">
          Commander !!!
        </button>
      )}
      <div className="flex flex-col items-center gap-4 w-full">
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
          <li className={`step ${currentTab >= 1 && "step-accent"}`}>Plat</li>
          <li className={`step ${currentTab >= 2 && "step-accent"}`}>Frite</li>
          <li className={`step ${currentTab >= 3 && "step-accent"}`}>
            Boisson
          </li>
          <li className={`step ${currentTab >= 4 && "step-accent"}`}>Résumé</li>
        </ul>
      </div>
    </div>
  );
}

export default UserForm;
