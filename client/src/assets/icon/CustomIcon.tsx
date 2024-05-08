// CustomIcon.tsx

import React from 'react';
import { IconContext } from 'react-icons';

// ------------------------------------------------------------------------------------------------>
export const CustomIcon = ({type, name}) => {

  if (!type || !name) {
    return null;
  }

  let importCode = null;
  let importIcon = null;
  let IconComponent = React.Fragment;

  try {
    importCode = require(`react-icons/${type}/index`);
    importIcon = importCode[name];
  }
  catch (error) {
    console.error(error);
  }

  if (importIcon) {
    IconComponent = importCode[name];
  }

  return (
    <IconContext.Provider value={{ size: '1em' }}>
      <IconComponent />
    </IconContext.Provider>
  );
}
