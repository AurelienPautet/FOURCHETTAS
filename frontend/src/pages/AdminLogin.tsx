import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import NavbarSpacer from "../components/NavbarSpacer";
import Logo from "../components/Logo";

function AdminLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = async () => {
    if (password) {
      const success = await login(password);
      if (success) navigate(from, { replace: true });
      else {
        setError(true);
      }
    }
  };

  return (
    <div>
      <NavbarSpacer />
      <form
        className="flex-grow h-full w-full flex flex-col items-center justify-center gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Logo />
        <input
          className={`input text-2xl rounded-md ${error && "input-error"}`}
          type="password"
          key="admin-password"
          ref={null}
          placeholder="Mot de passe admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="text-error">Mot de passe incorrect, réessayez.</div>
        )}
        <button className="btn mr-4 btn-accent" type="submit">
          Se connecter
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
