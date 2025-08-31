import { createContext, useState } from "react";
import api_url from "../api_url";

 
interface AuthContextType {
  isLogged: boolean;
  login: (password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  login: () => Promise.resolve(false),
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);

  const login = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${api_url}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (response.ok) {
        setIsLogged(true);
        localStorage.setItem('adminAuth', 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isLogged, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

export { AuthContext };
    