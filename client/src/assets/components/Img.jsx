// Img.jsx

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