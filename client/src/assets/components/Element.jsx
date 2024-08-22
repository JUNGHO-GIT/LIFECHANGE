// Element.jsx

import { React } from "../../import/ImportReacts.jsx";

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
      <img
        alt={fileName}
        style={{
          margin: "0px 10px 0px 0px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        {...props}
      />
    );
  }
  return null
};

// -------------------------------------------------------------------------------------------------
const createBr = (param) => {

  const style = {
    "width": "100%",
    "background": "none",
    "height": "0.1px",
    "margin": `${param/2}px 0px`,
  };

  return () => <div style={style} />;
};

// -------------------------------------------------------------------------------------------------
const createHr = (param) => {

  const style = {
    "width": "100%",
    "background": "rgb(207 207 207)",
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
export const Br45 = createBr(45);
export const Br50 = createBr(50);
export const Br55 = createBr(55);
export const Br60 = createBr(60);
export const Br65 = createBr(65);
export const Br70 = createBr(70);
export const Br75 = createBr(75);
export const Br80 = createBr(80);
export const Br85 = createBr(85);
export const Br90 = createBr(90);
export const Br95 = createBr(95);
export const Br100 = createBr(100);

// -------------------------------------------------------------------------------------------------
export const Hr5 = createHr(5);
export const Hr10 = createHr(10);
export const Hr15 = createHr(15);
export const Hr20 = createHr(20);
export const Hr25 = createHr(25);
export const Hr30 = createHr(30);
export const Hr35 = createHr(35);
export const Hr40 = createHr(40);
export const Hr45 = createHr(45);
export const Hr50 = createHr(50);
export const Hr55 = createHr(55);
export const Hr60 = createHr(60);
export const Hr65 = createHr(65);
export const Hr70 = createHr(70);
export const Hr75 = createHr(75);
export const Hr80 = createHr(80);
export const Hr85 = createHr(85);
export const Hr90 = createHr(90);
export const Hr95 = createHr(95);
export const Hr100 = createHr(100);