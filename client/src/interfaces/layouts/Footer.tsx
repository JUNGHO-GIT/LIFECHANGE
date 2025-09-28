// Footer.tsx

import { Paper } from "@importComponents";
import { useCommonValue } from "@importHooks";
import { memo, useEffect, useState } from "@importReacts";
import { Buttons } from "./footer/Buttons";
import { FindFilter } from "./footer/FindFilter";
import { ListFilter } from "./footer/ListFilter";

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

    if (PATH.includes("/schedule/planner/list") || PATH.includes("/schedule/planner/detail")) {
      setTypeName("");
      setStyleClass("");
		}
    else if (PATH.includes("/user/category") || PATH.includes("/user/detail")) {
      setTypeName("btn");
      setStyleClass(`${commonStr} bottom-0vh`);
    }
    else if (PATH.includes("/food/find/list") || PATH.includes("/food/favorite/list")) {
      setTypeName("findFilter");
      setStyleClass(`${commonStr} bottom-8vh`);
    }
    else if (PATH.includes("/goal/list") || PATH.includes("/record/list")) {
      setTypeName("listFilter");
      setStyleClass(`${commonStr} bottom-8vh`);
    }
    else if (PATH.includes("/goal/detail") || PATH.includes("/record/detail")) {
      setTypeName("btn");
      setStyleClass(`${commonStr} bottom-8vh`);
    }
    else {
      setTypeName("");
      setStyleClass("");
    }
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