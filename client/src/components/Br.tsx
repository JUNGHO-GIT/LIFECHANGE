// Br.tsx

// -------------------------------------------------------------------------------------------------
export const Br = (props: any) => {
  return (
    <div
      style={{
        "width": "100%",
        "background": "none",
        "height": "0.1px",
        "margin": `${props?.px/2}px 0px`,
      }}
      className={props?.className || ""}
    />
  );
};