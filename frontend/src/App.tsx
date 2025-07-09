import { useState } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col  justify-center ">
      <Navbar />
      <h1 className="h-screen bg-base-100 text-base-content">Hello</h1>
    </div>
  );
}

export default App;
