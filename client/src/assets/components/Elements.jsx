// Elements.jsx

import React from "react";

// ------------------------------------------------------------------------------------------------>
export const Div = (props) => {
  return (
    React.createElement("div", props, props.children)
  );
};

// ------------------------------------------------------------------------------------------------>
export const Hr = (props) => {
  const style = {
    border: "none",
    borderTop: "0.2px solid rgba(0, 0, 0, 0.2)",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
    margin: "10px 0px 10px 0px",
  };

  return React.createElement("hr", {...props, style});
};

// ------------------------------------------------------------------------------------------------>
export const Br = (props) => {
  const style = {
    margin: "10px 0px 10px 0px",
  };

  return React.createElement("br", {...props, style});
};