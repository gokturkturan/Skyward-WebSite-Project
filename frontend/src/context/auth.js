import React, { useState, createContext, useContext, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
    refreshToken: "",
    isLoggedin: false,
  });

  useEffect(() => {
    const isAuth = localStorage.getItem("auth");
    if (isAuth) {
      const parsedAuth = JSON.parse(isAuth);
      parsedAuth.isLoggedin = true;
      setAuth(parsedAuth);
    }
  }, []);

  axios.defaults.baseURL = BASE_URL;

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
