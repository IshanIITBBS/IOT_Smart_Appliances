// src/GlobalContext.js
import React, { createContext, useContext, useState } from 'react';

// Create context
const GlobalContext = createContext();

// Create provider component
export const GlobalProvider = ({ children }) => {
  // Define your global variable here
  const [globalVariable, setGlobalVariable] = useState("https://n9qrkhsl-5000.inc1.devtunnels.ms");

  return (
    <GlobalContext.Provider value={{ globalVariable, setGlobalVariable }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the GlobalContext
export const useGlobalContext = () => useContext(GlobalContext);
