// LoadingNode.jsx

import React from "react";

// 7. loading ------------------------------------------------------------------------------------->
export const LoadingNode = ({
  LOADING, setLOADING
}) => {

  if (!LOADING) {
    return null;
  }

  return (
    <React.Fragment>
      <div className={"table-wrapper"}>
        <div className={"loading"}>Loading...</div>
      </div>
    </React.Fragment>
  );
}