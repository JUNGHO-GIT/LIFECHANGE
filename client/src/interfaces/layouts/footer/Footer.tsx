// Footer.tsx

import { Paper } from "@exportComponents";
import { useCommonValue } from "@exportHooks";
import { memo, useEffect, useState } from "@exportReacts";
import { Buttons } from "./Buttons";
import { FindFilter } from "./FindFilter";
import { ListFilter } from "./ListFilter";

// -------------------------------------------------------------------------------------------------
declare type FooterProps = {
  state: any;
  setState: any;
  flow?: any;
}

// -------------------------------------------------------------------------------------------------
export const Footer = memo((
  { state, setState, flow }: FooterProps
) => {

	// 1. common ----------------------------------------------------------------------------------
  const { PATH } = useCommonValue();

	// 2-2. useState -------------------------------------------------------------------------------
  const [typeName, setTypeName] = useState<string>("");
  const [styleClass, setStyleClass] = useState<string>("");

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    const commonStr = "layout-wrapper p-sticky h-8vh radius-2 border-1 shadow-1";
		const isTodayGoal = PATH.includes("/today/goal/list") || PATH.includes("/today/goal/detail");
    const isTodayRecord = PATH.includes("/today/record/list") || PATH.includes("/today/record/detail");
    const isUser = PATH.includes("/user/category") || PATH.includes("/user/detail");
    const isFood = PATH.includes("/food/find/list") || PATH.includes("/food/favorite/list");
    const isGoalRecord = PATH.includes("/goal/list") || PATH.includes("/record/list");
    const isDetail = PATH.includes("/goal/detail") || PATH.includes("/record/detail");

    isTodayGoal && (setTypeName(""), setStyleClass(""));
		isTodayRecord && (setTypeName(""), setStyleClass(""));
    isUser && (setTypeName("btn"), setStyleClass(`${commonStr} bottom-0vh`));
    isFood && (setTypeName("findFilter"), setStyleClass(`${commonStr} bottom-8vh`));
    isGoalRecord && (setTypeName("listFilter"), setStyleClass(`${commonStr} bottom-8vh`));
    isDetail && (setTypeName("btn"), setStyleClass(`${commonStr} bottom-8vh`));
  }, [PATH]);

	// 9. footer ----------------------------------------------------------------------------------
  const footerNode = () => {
    // 1. btn
    const btnSection = () => (
      <Buttons
        state={state}
        flow={flow}
      />
    );
    // 3. listFilter
    const listFilterSection = () => (
      <ListFilter
        state={state}
        setState={setState}
      />
    );
    // 4. findFilter
    const findFilterSection = () => (
      <FindFilter
        state={state}
        setState={setState}
        flow={flow}
      />
    );
    // 5. return
    return (
      <Paper className={`${styleClass} fadeIn`}>
        {typeName === "btn" && btnSection()}
        {typeName === "listFilter" && listFilterSection()}
        {typeName === "findFilter" && findFilterSection()}
      </Paper>
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {footerNode()}
    </>
  );
});