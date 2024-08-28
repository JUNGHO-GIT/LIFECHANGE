// Br.jsx

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