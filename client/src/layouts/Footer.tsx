// Footer.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { Paper, Grid } from "@imports/ImportMuis";
import { Buttons } from "./footer/Buttons";
import { Dummy } from "./footer/Dummy";
import { ListFilter } from "./footer/ListFilter";
import { FindFilter } from "./footer/FindFilter";

// -------------------------------------------------------------------------------------------------
declare type FooterProps = {
  state: any;
  setState: any;
  flow?: any;
}

// -------------------------------------------------------------------------------------------------
export const Footer = (
  { state, setState, flow }: FooterProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [typeName, setTypeName] = useState<string>("");
  const [styleClass, setStyleClass] = useState<string>("");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {

    const commonStr = "layout-wrapper p-sticky h-8vh border-1 radius-1 shadow-top-3";

    if (PATH.includes("/calendar/list")) {
      setTypeName("");
      setStyleClass("");
    }
    else if (PATH.includes("/user/category") || PATH.includes("/user/detail")) {
      setTypeName("btn");
      setStyleClass(`${commonStr} bottom-0vh`);
    }
    else if (PATH.includes("/user/dummy")) {
      setTypeName("dummy");
      setStyleClass(`${commonStr} bottom-0vh`);
    }
    else if (PATH.includes("/food/find/list") || PATH.includes("/favorite/list")) {
      setTypeName("findFilter");
      setStyleClass(`${commonStr} bottom-8vh`);
    }
    else if (PATH.includes("/goal/list") || PATH.includes("/list")) {
      setTypeName("listFilter");
      setStyleClass(`${commonStr} bottom-8vh`);
    }
    else if (PATH.includes("/goal/detail") || PATH.includes("/detail")) {
      setTypeName("btn");
      setStyleClass(`${commonStr} bottom-8vh`);
    }
    else {
      setTypeName("");
      setStyleClass("");
    }
  }, [PATH]);

  // 7. footer -------------------------------------------------------------------------------------
  const footerNode = () => {
    // 1. btn
    const btnSection = () => (
      <Buttons
        state={state}
        flow={flow}
      />
    );
    // 2. dummy
    const dummySection = () => (
      <Dummy
        state={state}
        setState={setState}
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
      <Paper className={styleClass}>
        <Grid container spacing={2} columns={12}>
          <Grid size={12} className={"d-center fadeIn"}>
            {typeName === "btn" && btnSection()}
            {typeName === "dummy" && dummySection()}
            {typeName === "listFilter" && listFilterSection()}
            {typeName === "findFilter" && findFilterSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {footerNode()}
    </>
  );
};