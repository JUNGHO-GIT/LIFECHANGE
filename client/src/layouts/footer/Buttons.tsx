// Buttons.tsx
// Node -> Section -> Fragment

import { useState } from "@imports/ImportReacts";
import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { Btn } from "@imports/ImportComponents";
import { Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface ButtonsProps {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const Buttons = (
  { state, setState, flow }: ButtonsProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    PATH, toFind, toSave, navigate
  } = useCommonValue();

  // 7. btn ----------------------------------------------------------------------------------------
  const btnNode = () => {

    // 1. find
    const toFindSection = () => (
      <Btn
        color={"warning"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          Object.assign(state?.SEND, {
            url: PATH,
            dateType: state?.DATE.dateType,
            dateStart: state?.DATE.dateStart,
            dateEnd: state?.DATE.dateEnd
          });
          navigate(toFind, {
            state: state?.SEND,
          });
        }}
      >
        {translate("find")}
      </Btn>
    );

    // 2. new
    const newNode = () => (
      <Btn
        color={"success"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          flow?.flowNew();
        }}
      >
        {translate("new")}
      </Btn>
    );

    // 3. toUpdate
    const toUpdateSection = () => (
      <Btn
        color={"primary"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          Object.assign(state?.SEND, {
            dateType: state?.DATE.dateType,
            dateStart: state?.DATE.dateStart,
            dateEnd: state?.DATE.dateEnd
          });
          navigate(toSave, {
            state: state?.SEND,
          });
        }}
      >
        {translate("update")}
      </Btn>
    );

    // 3. save
    const saveSection = () => (
      <Btn
        color={"primary"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          flow?.flowSave();
          Object.keys(sessionStorage).forEach((key) => {
            if (key.includes("foodSection") || key.includes("paging")) {
              sessionStorage.removeItem(key);
            }
          });
        }}
      >
        {translate("save")}
      </Btn>
    );

    // 4. delete
    const deleteSection = () => (
      <Btn
        color={"error"}
        className={"ms-1vw me-1vw"}
        onClick={() => {
          flow?.flowDelete();
        }}
      >
        {translate("delete")}
      </Btn>
    );

    // 10. return
    return (
      PATH.includes("/user/category") || PATH.includes("/user/detail") ? (
        <Grid container spacing={2}>
          <Grid size={10} className={"d-center"}>
            {saveSection()}
          </Grid>
        </Grid>
      )
      : PATH.includes("/save") ? (
        <Grid container spacing={2}>
          <Grid size={10} className={"d-center"}>
            {PATH.includes("/food") ? toFindSection() : null}
            {saveSection()}
            {deleteSection()}
          </Grid>
        </Grid>
      )
      : null
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {btnNode()}
    </>
  );
};