import React, { createContext, useState, useEffect } from 'react';
import { getToken, setToken, clearToken, fetchAccessToken } from '../utils/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken());

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      fetchAccessToken(code) // set the token in local storage
        .then((token) =>  {
          console.log("Access token fetched:", token);
          setTokenState(token);
          // read the token from local storage to confirm it was set
          console.log("token from local storage:", getToken());
        })
        .catch((error) => console.error("Error fetching access token:", error));
    }
  }, []);

  const logout = () => {
    clearToken();
    setTokenState(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ token, setToken: setTokenState, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
