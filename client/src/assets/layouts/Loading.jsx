// Loading.jsx

import {React, useState, useEffect, useLocation} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";

// 14. loading -------------------------------------------------------------------------------------
export const Loading = () => {

  // 1. common -------------------------------------------------------------------------------------
  const location = useLocation();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";

  // 6. loading ------------------------------------------------------------------------------------
  const loadingNode = () => (
    firstStr === "user" ? (
      <Div className={"loader-wrapper d-center"}>
        <Div className={"loader"} />
      </Div>
    ) : (
      <Div className={`h-min50vh d-center`}>
        <Div className={"loader"} />
      </Div>
    )
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {loadingNode()}
    </>
  );
};