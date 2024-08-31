// Hr.tsx

// -------------------------------------------------------------------------------------------------
export const Hr = ({ px = 1 }) => {
  const style = {
    "width": "100%",
    "background": "rgb(207 207 207)",
    "height": "0.1px",
    "margin": `${px/2}px 0px`,
  };

  return <div style={style} />;
}