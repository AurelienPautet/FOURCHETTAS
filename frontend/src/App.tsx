import { useState } from "react";
import Navbar from "./components/Navbar";
import InputField from "./components/InputField";
import InputSelect from "./components/InputSelect";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col  justify-center ">
      <Navbar />
      <InputField legend="Nom :" placeholder="Ton nom" />
      <InputField legend="Prénom :" placeholder="Ton prénom" />
      <InputSelect
        legend="Navigateur :"
        placeholder="Choisis ton navigateur"
        options={["3 tenders", "4 tenders", "6 tenders"]}
      />
    </div>
  );
}

export default App;
