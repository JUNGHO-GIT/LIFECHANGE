// useDeveloperMode.jsx

import {React, useState, createContext, useContext} from "../../import/ImportReacts.jsx";
import {log} from "../../import/ImportUtils.jsx";

// -------------------------------------------------------------------------------------------------
const defaultDeveloperModeContext = {
  isDeveloperMode: false,
  toggleDeveloperMode: () => {},
  activeLog: (message) => {},
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
  const activeLog = (message) => {
    if (isDeveloperMode) {
      log("DeveloperModeProvider activated", message);
    }
  };

  // return
  return (
    <DeveloperModeContext.Provider value={{ isDeveloperMode, toggleDeveloperMode, activeLog }}>
      {children}
    </DeveloperModeContext.Provider>
  );
};