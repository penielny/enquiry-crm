import React, { createContext, useContext, useState } from "react";

// Create the Authentication Context
const ModalContext = createContext();

// AuthProvider component that will wrap your app and provide authentication context
export const ModalProvider = ({ children }) => {
  const [addCient, setAddClient] = useState(false);
  const [addEnquiry, setAddEnquiry] = useState(false);

  // Expose the context values
  const contextValue = {
    isAddClient: addCient,
    toggleAddClient: (state) => setAddClient(state),
    isAddEnquiry: addEnquiry,
    toggleAddEnquiry: (state) => setAddEnquiry(state),
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within an ModalProvider");
  }
  return context;
};
