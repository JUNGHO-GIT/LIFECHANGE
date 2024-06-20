// NavBar.jsx

import {React} from "../../import/ImportReacts.jsx";

// -------------------------------------------------------------------------------------------------
export const Div = (props) => {
  return (
    <div {...props} />
  );
};

// -------------------------------------------------------------------------------------------------
export const Img = (props) => {

  // src속성 찾기
  const srcProps = props.src;
  if (srcProps) {
    const fileName = srcProps.split("/").pop().split(".")[0];
    return (
      <img style={{margin: "0px 10px 0px 0px"}} loading={"lazy"} alt={fileName} {...props} />
    );
  }
};

// -------------------------------------------------------------------------------------------------
const createBr = (param) => {

  const style = {
    "width": "100%",
    "margin": `${param/2}px 0px`,
  };

  return () => <div style={style} />;
};

// -------------------------------------------------------------------------------------------------
const createHr = (param) => {

  const style = {
    "width": "100%",
    "background": "rgba(0, 0, 0, 0.12)",
    "height": "0.1px",
    "margin": `${param/2}px 0px`,
  };

  return () =>  <div style={style} />;

};

// -------------------------------------------------------------------------------------------------
export const Br5 = createBr(5);
export const Br10 = createBr(10);
export const Br15 = createBr(15);
export const Br20 = createBr(20);
export const Br25 = createBr(25);
export const Br30 = createBr(30);
export const Br35 = createBr(35);
export const Br40 = createBr(40);

// -------------------------------------------------------------------------------------------------
export const Hr5 = createHr(5);
export const Hr10 = createHr(10);
export const Hr15 = createHr(15);
export const Hr20 = createHr(20);
export const Hr25 = createHr(25);
export const Hr30 = createHr(30);
export const Hr35 = createHr(35);
export const Hr40 = createHr(40);