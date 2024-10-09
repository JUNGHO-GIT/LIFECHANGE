// Loading.tsx

import { useCommonValue } from "@imports/ImportHooks";
import { Div } from "@imports/ImportComponents";

// 14. loading -------------------------------------------------------------------------------------
export const Loading = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH } = useCommonValue();

  // 7.loading -------------------------------------------------------------------------------------
  const loadingNode = () => {
    const wrapperSection = () => (
      <Div className={"loader-wrapper d-column-center"}>
        <Div className={"loader"} />
      </Div>
    );
    const nonWrapperSection = () => (
      <Div className={"h-min80vh d-column-center"}>
        <Div className={"loader"} />
      </Div>
    );
    return (
      PATH.includes("/user/signup") || PATH.includes("/user/login") ||
      PATH.includes("/user/delete") || PATH.includes("/user/resetPw") ? (
        wrapperSection()
      ) : (
        nonWrapperSection()
      )
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {loadingNode()}
    </>
  );
};