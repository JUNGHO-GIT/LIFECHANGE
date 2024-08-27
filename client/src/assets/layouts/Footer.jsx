// Footer.jsx
// Node -> Section -> Fragment

import { React, useState, useEffect } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { Paper, Grid } from "../../import/ImportMuis.jsx";
import { Dummy } from "./footer/Dummy.jsx";
import { FindFilter } from "./footer/FindFilter.jsx";
import { Btn } from "./footer/Btn.jsx";
import { ListFilter } from "./footer/ListFilter.jsx";

// -------------------------------------------------------------------------------------------------
export const Footer = ({
  state, setState, flow,
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {PATH} = useCommon();
  const [typeName, setTypeName] = useState("");
  const [styleClass, setStyleClass] = useState("");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (
      PATH.includes("/calendar/list")
    ) {
      setTypeName("");
      setStyleClass("");
    }
    else if (
      PATH.includes("/goal/list") ||
      PATH.includes("/list")
    ) {
      setTypeName("listFilter");
      setStyleClass("layout-wrapper p-sticky bottom-9vh60 h-9vh radius border");
    }
    else if (
      PATH.includes("/user/dummy")
    ) {
      setTypeName("dummy");
      setStyleClass("layout-wrapper p-sticky bottom-60 h-9vh radius border");
    }
    else if (
      PATH.includes("/food/find")
    ) {
      setTypeName("findFood");
      setStyleClass("layout-wrapper p-sticky bottom-9vh60 h-9vh radius border");
    }
    else if (
      PATH.includes("/goal/save") ||
      PATH.includes("/save")
    ) {
      setTypeName("btn");
      setStyleClass("layout-wrapper p-sticky bottom-9vh60 h-9vh radius border");
    }
    else if (
      PATH.includes("/user/category") ||
      PATH.includes("/user/detail")
    ) {
      setTypeName("btn");
      setStyleClass("layout-wrapper p-sticky bottom-60 h-9vh radius border");
    }
    else {
      setTypeName("");
      setStyleClass("");
    }
  }, [PATH]);

  // 7. footer -------------------------------------------------------------------------------------
  const footerNode = () => {
    // 1. listFilter
    const listFilterSection = () => (
      <ListFilter
        state={state}
        setState={setState}
        flow={flow}
      />
    );
    // 2. btn
    const btnSection = () => (
      <Btn
        state={state}
        setState={setState}
        flow={flow}
      />
    );
    // 3. findFood
    const findFoodSection = () => (
      <FindFilter
        state={state}
        setState={setState}
        flow={flow}
      />
    );
    // 4. dummy
    const dummySection = () => (
      <Dummy
        state={state}
        setState={setState}
        flow={flow}
      />
    );
    // 5. return
    return (
      <Paper className={styleClass}>
        <Grid container className={"w-100p"}>
          <Grid size={12} className={"d-center"}>
            {typeName === "listFilter" && listFilterSection()}
            {typeName === "btn" && btnSection()}
            {typeName === "findFood" && findFoodSection()}
            {typeName === "dummy" && dummySection()}
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