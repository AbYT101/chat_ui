// src/auth/AuthContext.tsx
import { createContext, useContext, useState } from "react";
import { getToken, setToken, clearToken } from "../utils/token";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setAuth] = useState(!!getToken());

  const login = (token: string) => {
    setToken(token);
    setAuth(true);
  };

  const logout = () => {
    clearToken();
    setAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
