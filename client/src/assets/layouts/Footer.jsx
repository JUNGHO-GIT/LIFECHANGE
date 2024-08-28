// Footer.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";
import { Paper, Grid } from "../../imports/ImportMuis.jsx";
import { Buttons } from "./footer/Buttons.jsx";
import { Dummy } from "./footer/Dummy.jsx";
import { ListFilter } from "./footer/ListFilter.jsx";
import { FindListFilter } from "./footer/FindListFilter.jsx";
import { FindSaveFilter } from "./footer/FindSaveFilter.jsx";

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
      setTypeName("findList");
      setStyleClass("layout-wrapper p-sticky bottom-9vh60 h-9vh radius border");
    }
    else if (
      PATH.includes("/food/save")
    ) {
      setTypeName("findSave");
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
    // 1. btn
    const btnSection = () => (
      <Buttons
        state={state}
        setState={setState}
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
        flow={flow}
      />
    );
    // 4. findList
    const findListSection = () => (
      <FindListFilter
        state={state}
        setState={setState}
        flow={flow}
      />
    );
    // 5. findSave
    const findSaveSection = () => (
      <FindSaveFilter
        state={state}
        setState={setState}
        flow={flow}
      />
    );
    // 5. return
    return (
      <Paper className={styleClass}>
        <Grid container columnSpacing={1}>
          <Grid size={12} className={"d-center"}>
            {typeName === "btn" && btnSection()}
            {typeName === "dummy" && dummySection()}
            {typeName === "listFilter" && listFilterSection()}
            {typeName === "findList" && findListSection()}
            {typeName === "findSave" && findSaveSection()}
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