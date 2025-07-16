import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";

import UserForm from "./pages/UserForm";
import UpcomingEvents from "./pages/UpcomingEvent";
import AdminOrders from "./pages/AdminOrders";
import NotFound404 from "./pages/NotFound404.tsx";
import AdminCreateEvent from "./pages/AdminCreateEvent.tsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen  justify-start ">
        <Navbar />
        <div className="absolute top-0 h-[100vh] w-full flex flex-col overflow-hidden  ">
          <Routes>
            <Route path="/" element={<UpcomingEvents />} />
            <Route path="/event/:id/order" element={<UserForm />} />
            <Route path="/admin/event/:id/orders" element={<AdminOrders />} />
            <Route path="/admin/event/create" element={<AdminCreateEvent />} />

            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
