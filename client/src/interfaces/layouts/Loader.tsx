// Loader.tsx

import { useCommonValue } from "@importHooks";
import { Div } from "@importComponents";

// -------------------------------------------------------------------------------------------------
export const Loader = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH } = useCommonValue();
  const { isGoalTodayList, isGoalList, isTodayList, isRealList } = useCommonValue();
  const { isGoalDetail, isCalendarDetail, isRealDetail } = useCommonValue();

  // 7.loader --------------------------------------------------------------------------------------
  const loaderNode = () => {

    const wrapperLoader = () => (
      <Div className={"loader-wrapper d-col-center"}>
        <Div className={"loader"} />
      </Div>
    );

    const listLoader = () => (
      <Div className={"h-min80vh d-col-center"}>
        <Div className={"loader"} />
      </Div>
    );

    const detailLoader = () => (
      <Div className={"h-min45vh d-col-center fadeIn"}>
        <Div className={"loader"} />
      </Div>
    );

    return (
      ["/user/signup", "/user/login", "/user/delete", "/user/resetPw"].some((el) => PATH.includes(el)) ? (
        wrapperLoader()
      )
      : isGoalTodayList || isGoalList || isTodayList || isRealList ? (
        listLoader()
      )
      : isGoalDetail || isCalendarDetail || isRealDetail ? (
        detailLoader()
      )
      : (
        listLoader()
      )
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {loaderNode()}
    </>
  );
};