// Buttons.tsx
// Node -> Section -> Fragment

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
    PATH,
  } = useCommonValue();

  // 7. btn ----------------------------------------------------------------------------------------
  const btnNode = () => {

    // 1. new
    const newNode = () => (
      <Btn
        color={"success"}
        className={"ms-2vw me-2vw"}
        onClick={() => {
          flow?.flowNew();
        }}
      >
        {translate("new")}
      </Btn>
    );

    // 2. save
    const saveSection = () => (
      <Btn
        color={"primary"}
        className={"ms-2vw me-2vw"}
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

    // 3. deletes
    const deletesSection = () => (
      <Btn
        color={"error"}
        className={"ms-2vw me-2vw"}
        onClick={() => {
          flow?.flowDeletes();
        }}
      >
        {translate("deletes")}
      </Btn>
    );

    // 4. return
    return (
      PATH.includes("/user/category") || PATH.includes("/user/detail") ? (
        <Grid container spacing={2}>
          <Grid size={12} className={"d-center"}>
            {saveSection()}
          </Grid>
        </Grid>
      )
      : PATH.includes("/update") ? (
        <Grid container spacing={2}>
          <Grid size={10} className={"d-center"}>
            {newNode()}
            {saveSection()}
            {deletesSection()}
          </Grid>
        </Grid>
      )
      : (
        <Grid container spacing={2}>
          <Grid size={12} className={"d-center"}>
            {saveSection()}
            {deletesSection()}
          </Grid>
        </Grid>
      )
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {btnNode()}
    </>
  );
};