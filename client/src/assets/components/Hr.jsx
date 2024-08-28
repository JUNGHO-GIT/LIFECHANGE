// Hr.jsx

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