import { useState } from "react";
import Navbar from "./components/Navbar";
import UserForm from "./pages/UserForm";
import UpcomingEvents from "./pages/UpcomingEvent";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="flex flex-col  justify-center h-screen justify-start ">
        <Navbar />

        <Routes>
          <Route path="/" element={<UpcomingEvents />} />
          <Route path="/event/:id/order" element={<UserForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
