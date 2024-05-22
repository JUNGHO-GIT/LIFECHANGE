// NavBar.jsx

import {React} from "../../import/ImportReacts.jsx";

// ------------------------------------------------------------------------------------------------>
export const Div = (props) => {
  return (
    React.createElement("div", {...props})
  );
};

// ------------------------------------------------------------------------------------------------>
export const Img = (props) => {

  // src속성 찾기
  const src = props.src;
  const fileName = src.split("/").pop().split(".")[0];

  return (
    React.createElement("img", {
      style: {
        margin: "0px 10px 0px 0px",
      },
      alt: fileName,
      ...props
    })
  );
}

// ------------------------------------------------------------------------------------------------>
const createBrComponent = (height) => {
  return () => React.createElement("div", {
    style: {
      height: `${height}px`
    }
  });
}
export const Br5 = createBrComponent(5);
export const Br10 = createBrComponent(10);
export const Br15 = createBrComponent(15);
export const Br20 = createBrComponent(20);
export const Br25 = createBrComponent(25);
export const Br30 = createBrComponent(30);

// ------------------------------------------------------------------------------------------------>
