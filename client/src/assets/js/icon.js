// icon.js

import React, {useState, useEffect} from "react";

// ------------------------------------------------------------------------------------------------>
export const IconsMui = ({ name }) => {

  const [icon, setIcon] = useState(null);

  useEffect(() => {

    alert(name);

    if (!name) {
      return;
    }

    /* const loadIcon = async () => {
      try {
        const module = await import(`@mui/icons-material/${name}`);
        setIcon(module.default);
      } catch (error) {
        console.error("Icon load error:", error);
      }
    };

    loadIcon(); */
  }, [name]);

  return (
    <React.Fragment>
      {icon && React.createElement(icon)}
    </React.Fragment>
  );
};
