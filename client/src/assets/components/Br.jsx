// Br.jsx

// -------------------------------------------------------------------------------------------------
export const Br = ({ px }) => {
  const style = {
    "width": "100%",
    "background": "none",
    "height": "0.1px",
    "margin": `${px/2}px 0px`,
  };

  return <div style={style} />;
}