import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";

import UserForm from "./pages/UserForm";
import UpcomingEvents from "./pages/UpcomingEvent";
import AdminOrders from "./pages/AdminOrders";
import NotFound404 from "./pages/NotFound404.tsx";
import AdminCreateEvent from "./pages/AdminCreateEvent.tsx";
import AdminEvents from "./pages/AdminEvents.tsx";
import AuthProvider from "./components/AuthContext.tsx";
import AdminLogin from "./components/AdminLogin.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="flex flex-col h-screen  justify-start ">
        <Navbar />
        <div className="absolute top-0 h-[100vh] w-full flex flex-col overflow-hidden  ">
          <Routes>
            <Route path="/" element={<UpcomingEvents />} />
            <Route path="/event/:id/order" element={<UserForm />} />
            <Route path="/admin/login" element={<AdminLogin />} />
              
            <Route path="admin/" element={                
              <ProtectedRoute>
                <AdminEvents />
              </ProtectedRoute>
            } />
            <Route path="/admin/event/:id/orders" element={
              <ProtectedRoute>
                <AdminOrders />
              </ProtectedRoute>
            } />
            <Route path="/admin/event/create" element={
              <ProtectedRoute>
                <AdminCreateEvent />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound404 />} />
          </Routes>
        </div>
      </div>
    </Router>
    </AuthProvider> 
  );
}

export default App;
