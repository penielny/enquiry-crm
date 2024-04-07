import React, { createContext, useContext } from "react";
import { APP_PREFIX } from "../config";
import useSecuredLocalStorage from "../hooks/useSecuredStorage";
import { signOut } from "firebase/auth";
import { firebase_auth } from "./../../firebase";
import toast from "react-hot-toast";
// Create the Authentication Context
const AuthContext = createContext();

// AuthProvider component that will wrap your app and provide authentication context
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useSecuredLocalStorage(
    APP_PREFIX + "@authToken",
    null,
  );

  // Define functions for authentication actions (login, logout, check if authenticated, etc.)
  const login = ({ token, userInfo }) => setAuth({ token, userInfo });
  const logout = () => {
    signOut(firebase_auth)
      .then(() => {
        // Sign-out successful.
        setAuth(null);
        toast.success(`you've successfully logged out `);
      })
      .catch((error) => {
        // An error happened.
        console.log(error.message);
      });
  };
  const isAuthenticated = () => !!auth?.token;

  // Expose the context values
  const contextValue = {
    token: auth?.token,
    authInfo: auth,
    updateProfilePhoto: (url) => {
      let auth_ = auth;
      setAuth({
        token: auth_?.token,
        userInfo: { ...auth_?.userInfo, photoURL: url },
      });
    },
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
