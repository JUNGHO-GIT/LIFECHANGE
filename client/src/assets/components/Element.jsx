// Elements.jsx

import {React} from "../../import/ImportReacts.jsx";

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
