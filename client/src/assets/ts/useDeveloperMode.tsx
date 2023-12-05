// useDeveloperMode.ts
import React, { createContext, useContext, useState } from 'react';

const defaultDeveloperModeContext = {
  isDeveloperMode: false,
  toggleDeveloperMode: () => {},
  log: (message: string) => {}
};

const DeveloperModeContext = createContext(defaultDeveloperModeContext);

// 1. useDeveloperMode ---------------------------------------------------------------------------->
export const useDeveloperMode = () => useContext(DeveloperModeContext);

// 2. DeveloperModeProvider ----------------------------------------------------------------------->
export const DeveloperModeProvider = (
  {children} : {children: React.ReactNode}
) => {

  // useState
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  // toggleDeveloperMode
  const toggleDeveloperMode = () => {
    setIsDeveloperMode(!isDeveloperMode);
  };

  // log
  const log = (message: string) => {
    if (isDeveloperMode) {
      console.log(message);
    }
  };

  // return
  return (
    <DeveloperModeContext.Provider value={{ isDeveloperMode, toggleDeveloperMode, log }}>
      {children}
    </DeveloperModeContext.Provider>
  );
};
