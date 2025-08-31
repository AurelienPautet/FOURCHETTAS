import { createContext, useState } from "react";

 
interface AuthContextType {
  isLogged: boolean;
  login: (password: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  login: () => false, 
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);

  const login = (password: string) => {
    if (password === "yourPassword") {
      setIsLogged(true);
      console.log("Logged in successfully",isLogged);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isLogged, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export { AuthContext };
    