// Hr.tsx

// -------------------------------------------------------------------------------------------------
export const Hr = (props : any) => (
  <div
    className={props?.className}
    style={{
      "background": "#dbdbdb",
      "width": `${props?.w || 100}%`,
      "height": `${props?.h || 1}px`,
      "margin": `${props?.px/2}px 0px`,
    }}
  />
);