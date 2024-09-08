// Hr.tsx

// -------------------------------------------------------------------------------------------------
export const Hr = (props : any) => {
  return (
    <div
      className={props?.className}
      style={{
        "width": "100%",
        "background": "rgb(207 207 207)",
        "height": `${props?.h/10 || 0.1}px`,
        "margin": `${props?.px/2}px 0px`,
      }}
    />
  );
}