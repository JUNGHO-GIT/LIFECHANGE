// NavBar.jsx

import { React } from "../../import/ImportReacts.jsx";

// ------------------------------------------------------------------------------------------------>
export const Div = (props) => {
  return (
    React.createElement("div", {...props})
  );
};

// ------------------------------------------------------------------------------------------------>
const createBrComponent = (height) => {
  return () => React.createElement("div", {style: {height: `${height}px`}});
}

// ------------------------------------------------------------------------------------------------>
export const Br5 = createBrComponent(5);
export const Br10 = createBrComponent(10);
export const Br15 = createBrComponent(15);
export const Br20 = createBrComponent(20);
export const Br25 = createBrComponent(25);
export const Br30 = createBrComponent(30);
