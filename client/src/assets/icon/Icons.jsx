// Icons.jsx

import React, { useState, useEffect } from 'react';

// ------------------------------------------------------------------------------------------------>
export const MuiIcons = ({ name }) => {
  const [Icon, setIcon] = useState(null);

  useEffect(() => {
    if (!name) {
      return;
    }

    const loadIcon = async () => {
      try {
        const module = await import(`@mui/icons-material/${name}`);
        setIcon(() => module.default);
      } catch (error) {
        console.error("Icon load error:", error);
      }
    };

    loadIcon();
  }, [name]);

  if (!Icon) {
    return null;
  }

  return <Icon />;
};

// ------------------------------------------------------------------------------------------------>
/* export const SvgIcons = ({ name }) => {

  const iconPath = {
    home: (
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    ),
    add: (
      <path d="M14 10H3v2h11zm0-4H3v2h11zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2zM3 16h7v-2H3z" />
    ),
    delete: (
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm3-10H9v2h6v-2z" />
    ),
    edit: (
      <path d="M14.7 5.71l-4.41 4.41 1.41 1.41 4.41-4.41-1.41-1.41zm-1.42 1.42L9.88 12.3 5.7 8.11l3.18-3.18 1.4 1.4z" />
    ),
    done: (
      <path d="M16.59 5.58L7 15.17 3.41 11.59 2 13l5 5 11-11z" />
    ),
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      {iconPath[name]}
    </svg>
  );
}; */