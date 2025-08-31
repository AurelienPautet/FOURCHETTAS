import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import NavbarSpacer from "../components/NavbarSpacer";
import Logo from "../components/Logo";

function AdminLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin';

  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (password && await login(password)) {
      navigate(from, { replace: true });
    } else {
    }
  };

  return (
    <div>
      <NavbarSpacer />
      <div className="flex-grow h-full w-full flex flex-col items-center justify-center gap-4">
        <Logo />
      <input
          className="input text-2xl rounded-md"
          type="password"
              key="admin-password"
              ref={null}
              placeholder="Mot de passe admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
      <button className="btn mr-4 btn-accent" onClick={handleLogin}>Se connecter</button>
      </div>
    </div>
  );
}

export default AdminLogin;