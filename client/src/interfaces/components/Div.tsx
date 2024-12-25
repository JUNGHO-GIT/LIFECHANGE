// Div.tsx

// -------------------------------------------------------------------------------------------------
export const Div = (props: any) => {

  let childrenEl = props?.children;

  if (typeof childrenEl === "string" && props?.max) {
    childrenEl = (
      childrenEl.length > props?.max ? childrenEl.slice(0, props?.max) + "..." : childrenEl
    );
  }

  return (
    <div
      {...props}
      style={{
        ...props?.style,
        fontFamily: "Pretendard Variable, Pretendard, Noto Sans KR, Roboto, sans-serif"
      }}
    >
      {childrenEl}
    </div>
  );
};
