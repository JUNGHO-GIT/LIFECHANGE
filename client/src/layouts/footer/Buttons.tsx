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

    // 2. save
    const saveSection = () => (
      <Btn
        color={"primary"}
        onClick={() => {
          flow.flowSave();
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
        onClick={() => {
          flow.flowDeletes();
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
      ) : (
        <Grid container spacing={2}>
          <Grid size={6} className={"d-right"}>
            {saveSection()}
          </Grid>
          <Grid size={6} className={"d-left"}>
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