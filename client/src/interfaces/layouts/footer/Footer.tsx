// Footer.tsx

import { Paper } from "@importComponents";
import { useCommonValue } from "@importHooks";
import { memo, useEffect, useMemo, useState } from "@importReacts";
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
    const isSchedule = PATH.includes("/schedule/planner/list") || PATH.includes("/schedule/planner/detail");
    const isUser = PATH.includes("/user/category") || PATH.includes("/user/detail");
    const isFood = PATH.includes("/food/find/list") || PATH.includes("/food/favorite/list");
    const isGoalRecord = PATH.includes("/goal/list") || PATH.includes("/record/list");
    const isDetail = PATH.includes("/goal/detail") || PATH.includes("/record/detail");

    isSchedule && (setTypeName(""), setStyleClass(""));
    isUser && (setTypeName("btn"), setStyleClass(`${commonStr} bottom-0vh`));
    isFood && (setTypeName("findFilter"), setStyleClass(`${commonStr} bottom-8vh`));
    isGoalRecord && (setTypeName("listFilter"), setStyleClass(`${commonStr} bottom-8vh`));
    isDetail && (setTypeName("btn"), setStyleClass(`${commonStr} bottom-8vh`));
  }, [PATH]);

	// 9. footer ----------------------------------------------------------------------------------
  const btnSection = useMemo(() => (
    <Buttons
      state={state}
      flow={flow}
    />
  ), [state, flow]);

  const listFilterSection = useMemo(() => (
    <ListFilter
      state={state}
      setState={setState}
    />
  ), [state, setState]);

  const findFilterSection = useMemo(() => (
    <FindFilter
      state={state}
      setState={setState}
      flow={flow}
    />
  ), [state, setState, flow]);

  const footerNode = useMemo(() => (
    <Paper className={`${styleClass} fadeIn`}>
      {typeName === "btn" && btnSection}
      {typeName === "listFilter" && listFilterSection}
      {typeName === "findFilter" && findFilterSection}
    </Paper>
  ), [typeName, btnSection, listFilterSection, findFilterSection, styleClass]);

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {footerNode}
    </>
  );
});