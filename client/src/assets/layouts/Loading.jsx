// Loading.jsx

import {React, useLocation} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";

// 14. loading -------------------------------------------------------------------------------------
export const Loading = () => {

  // 1. common -------------------------------------------------------------------------------------
  const location = useLocation();
  const PATH = location?.pathname;

  // 6. loading ------------------------------------------------------------------------------------
  const loadingNode = () => (
    PATH.includes("/user/signup") ? (
      <Div className={"loader-wrapper d-center"}>
        <Div className={"loader"} />
      </Div>
    )
    : PATH.includes("/calendar/list") ? (
      <Div className={`h-min60vh d-center`}>
        <Div className={"loader"} />
      </Div>
    )
    : (
      <Div className={`h-min60vh d-center`}>
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