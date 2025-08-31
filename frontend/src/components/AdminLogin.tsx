import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";

function AdminLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = () => {
    const password = prompt("Enter password:");
    if (password && login(password)) {
      alert("Login successful!");
      navigate(from, { replace: true });
    } else {
      alert("Login failed.");
    }
  };

  return (
    <div>
      <h2 className="mt-36">Admin Login</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AdminLogin;