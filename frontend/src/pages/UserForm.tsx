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

  console.log("Name:", name);
  console.log("First Name:", firstName);
  console.log("Dish ID:", dishID);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 ">
      <div className="flex flex-col items-stretch justify-center">
        <InputField legend="Nom :" placeholder="Ton nom" set={setName} />
        <InputField
          legend="Prénom :"
          placeholder="Ton prénom"
          set={setFirstName}
        />
        <InputSelect
          legend="Ton Plat :"
          placeholder="Choisis ton plat"
          options={[
            { id: 1, name: "3 tenders" },
            { id: 2, name: "4 tenders" },
            { id: 3, name: "6 tenders" },
          ]}
          set={setDishID}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <CardMeal />
          <CardMeal />
          <CardMeal />
        </div>
      </div>
      <button className="btn btn-accent btn-outline font-bold">
        Commander !!!
      </button>
    </div>
  );
}

export default UserForm;
