// Footer.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { Paper, Grid } from "@imports/ImportMuis";
import { Buttons } from "./footer/Buttons";
import { Dummy } from "./footer/Dummy";
import { ListFilter } from "./footer/ListFilter";
import { FindListFilter } from "./footer/FindListFilter";
import { FindSaveFilter } from "./footer/FindSaveFilter";

// -------------------------------------------------------------------------------------------------
declare interface FooterProps {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const Footer = (
  { state, setState, flow }: FooterProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    PATH
  } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [typeName, setTypeName] = useState<string>("");
  const [styleClass, setStyleClass] = useState<string>("");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (
      PATH.includes("/calendar/list")
    ) {
      setTypeName("");
      setStyleClass("");
    }
    else if (
      PATH.includes("/goal/list") || PATH.includes("/list")
    ) {
      setTypeName("listFilter");
      setStyleClass("layout-wrapper p-sticky bottom-8vh h-8vh radius border");
    }
    else if (
      PATH.includes("/food/find")
    ) {
      setTypeName("findList");
      setStyleClass("layout-wrapper p-sticky bottom-8vh h-8vh radius border");
    }
    else if (
      PATH.includes("/food/save") || PATH.includes("/food/update")
    ) {
      setTypeName("findSave");
      setStyleClass("layout-wrapper p-sticky bottom-8vh h-8vh radius border");
    }
    else if (
      PATH.includes("/goal/save") || PATH.includes("/save") ||
      PATH.includes("/goal/update") || PATH.includes("/update")
    ) {
      setTypeName("btn");
      setStyleClass("layout-wrapper p-sticky bottom-8vh h-8vh radius border");
    }
    else if (
      PATH.includes("/user/dummy")
    ) {
      setTypeName("dummy");
      setStyleClass("layout-wrapper p-sticky bottom-0 h-8vh radius border");
    }
    else if (
      PATH.includes("/user/category") || PATH.includes("/user/detail")
    ) {
      setTypeName("btn");
      setStyleClass("layout-wrapper p-sticky bottom-0 h-8vh radius border");
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
        <Grid container spacing={2}>
          <Grid size={12} className={"d-center fadeIn"}>
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