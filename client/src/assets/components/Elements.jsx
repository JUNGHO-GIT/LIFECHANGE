// Elements.jsx

import {React} from "../../import/ImportReacts.jsx";
import {IconContext} from 'react-icons';
import {InputAdornment} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Div = (props) => {
  return (
    React.createElement("div", props, props.children)
  );
};

// ------------------------------------------------------------------------------------------------>
export const Br5 = (props) => {
  const style = {
    margin: "5px 0px 5px 0px",
  };

  return React.createElement("br", {...props, style});
};
export const Br10 = (props) => {
  const style = {
    margin: "10px 0px 10px 0px",
  };

  return React.createElement("br", {...props, style});
};

// ------------------------------------------------------------------------------------------------>
export const Hr5 = (props) => {
  const style = {
    border: "none",
    borderTop: "0.2px solid rgba(0, 0, 0, 0.2)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    margin: "5px 0px 5px 0px",
  };

  return React.createElement("hr", {...props, style});
};
export const Hr10 = (props) => {
  const style = {
    border: "none",
    borderTop: "0.2px solid rgba(0, 0, 0, 0.2)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    margin: "10px 0px 10px 0px",
  };

  return React.createElement("hr", {...props, style});
};

// ------------------------------------------------------------------------------------------------>
export const Icons = ({
  name = "", children = null, ...props
}) => {

  if (!name) {
    return;
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
    <div className={"d-center"}>
      <IconComponent {...props} />
      {children}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------>
export const Adornment = ({name, className, position, ...props}) => {

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
