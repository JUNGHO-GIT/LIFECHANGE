// useDeveloperMode.jsx

import {React, useState, createContext, useContext} from "../../import/ImportReacts.jsx";

// -------------------------------------------------------------------------------------------------
const defaultDeveloperModeContext = {
  isDeveloperMode: false,
  toggleDeveloperMode: () => {},
  log: (message) => {}
};

// 1. useDeveloperMode -----------------------------------------------------------------------------
const DeveloperModeContext = createContext(defaultDeveloperModeContext);
export const useDeveloperMode = () => useContext(DeveloperModeContext);

// 2. DeveloperModeProvider ------------------------------------------------------------------------
export const DeveloperModeProvider = (
  {children}
) => {

  // useState
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  // toggleDeveloperMode
  const toggleDeveloperMode = () => {
    setIsDeveloperMode(!isDeveloperMode);
  };

  // 1-6. log
  const log = (message) => {
    if (isDeveloperMode) {
      console.log(JSON.stringify(message, null, 2));
    }
  };

  // return
  return (
    <DeveloperModeContext.Provider value={{ isDeveloperMode, toggleDeveloperMode, log }}>
      {children}
    </DeveloperModeContext.Provider>
  );
};