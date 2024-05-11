// ImportIcons.jsx

import React from 'react';
import {IconContext} from 'react-icons';
import {InputAdornment} from "./ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const CustomIcons = ({name, className, ...props}) => {

  if (!name) {
    return null;
  }

  // ex. 'FaHome' => (preStr = fa)
  const preStr = name.slice(0, 2).toLowerCase();

  let importCode = null;
  let importIcon = null;
  let IconComponent = React.Fragment;

  try {
    importCode = require(`react-icons/${preStr}/index`);
    importIcon = importCode[name];
  }
  catch (error) {
    console.error(error);
  }

  if (importIcon) {
    IconComponent = importCode[name];
  }

  return (
    <IconContext.Provider value={{ className: className }}>
      <IconComponent {...props} />
    </IconContext.Provider>
  );
};

// ------------------------------------------------------------------------------------------------>
export const CustomAdornment = ({name, className, position, ...props}) => {

  if (!name) {
    return null;
  }

  // ex. 'FaHome' => (preStr = fa)
  let preStr = name.slice(0, 2).toLowerCase();
  if (preStr === "li") {
    preStr = "lia";
  }

  let importCode = null;
  let importIcon = null;
  let IconComponent = React.Fragment;

  try {
    importCode = require(`react-icons/${preStr}/index`);
    importIcon = importCode[name];
  }
  catch (error) {
    console.error(error);
  }

  if (importIcon) {
    IconComponent = importCode[name];
  }

  return (
    <IconContext.Provider value={{ className: className }}>
      <InputAdornment position={position}>
        <IconComponent {...props} />
      </InputAdornment>
    </IconContext.Provider>
  );
};
