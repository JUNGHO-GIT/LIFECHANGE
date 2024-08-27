// Loading.jsx
// Node -> Section -> Fragment

import { React } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { Div } from "../../import/ImportComponents.jsx";

// 14. loading -------------------------------------------------------------------------------------
export const Loading = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {PATH} = useCommon();

  // 5. needWrapper --------------------------------------------------------------------------------
  const needWrapper = () => {
    if (
      PATH.includes("/user/signup") ||
      PATH.includes("/user/login") ||
      PATH.includes("/user/deletes") ||
      PATH.includes("/user/resetPw")
    ) {
      return true;
    };
    return false;
  };

  // 6. loading ------------------------------------------------------------------------------------
  const loadingNode = () => (
    needWrapper() ? (
      <Div className={"loader-wrapper d-center"}>
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