// CustomIcon.tsx

import React from 'react';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io';
import * as TiIcons from 'react-icons/ti';
import * as GoIcons from 'react-icons/go';
import * as RiIcons from 'react-icons/ri';
import * as BiIcons from 'react-icons/bi';
import * as AiIcons from 'react-icons/ai';

// ------------------------------------------------------------------------------------------------>
export const CustomIcon = ({ name }) => {

  if (!name) {
    return null;
  }

  const IconComponent = FaIcons[name];

  if (!IconComponent) {
    console.error(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconContext.Provider value={{ size: '1em' }}>
      <IconComponent />
    </IconContext.Provider>
  );
}
