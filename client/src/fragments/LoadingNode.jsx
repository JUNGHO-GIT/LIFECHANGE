// LoadingNode.jsx

import React from "react";

// 6. loading ------------------------------------------------------------------------------------->
export const LoadingNode = ({
  LOADING, setLOADING
}) => {

  if (!LOADING) {
    return null;
  }

  return (
    <React.Fragment>
      <div className={"loading-wrapper"}>
        <i className={"bx bx-loader-alt bx-spin"}></i>
      </div>
    </React.Fragment>
  );
}