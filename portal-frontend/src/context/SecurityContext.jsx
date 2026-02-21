// src/context/SecurityContext.jsx
import React, { createContext, useContext, useState } from "react";

const SecurityContext = createContext();

export const SecurityProvider = ({ children }) => {
  const [isUnderAttack, setIsUnderAttack] = useState(false);

  return (
    <SecurityContext.Provider value={{ isUnderAttack, setUnderAttack: setIsUnderAttack }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => useContext(SecurityContext);