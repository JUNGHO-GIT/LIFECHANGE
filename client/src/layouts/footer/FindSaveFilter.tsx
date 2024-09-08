// FindSaveFilter.tsx
// Node -> Section -> Fragment

import { useTranslate } from "@imports/ImportHooks";
import { Btn } from "@imports/ImportComponents";
import { Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface FindSaveFilterProps {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const FindSaveFilter = (
  { state, setState, flow }: FindSaveFilterProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useTranslate();

  // 7. find ---------------------------------------------------------------------------------------
  const findFilterNode = () => {
    // 1. more
    const moreSection = () => (
      <Btn
        color={"success"}
        onClick={() => {
          Object.assign(state?.SEND, {
            dateType: state?.DATE.dateType,
            dateStart: state?.DATE.dateStart,
            dateEnd: state?.DATE.dateEnd
          });
          flow.navigate(state?.SEND.toFind, {
            state: state?.SEND,
          });
        }}
      >
        {translate("find")}
      </Btn>
    );
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

    return (
      <Grid container spacing={0} columns={12}>
        <Grid size={5} className={"d-right"}>
          {moreSection()}
        </Grid>
        <Grid size={2} className={"d-center"}>
          {saveSection()}
        </Grid>
        <Grid size={5} className={"d-left"}>
          {deletesSection()}
        </Grid>
      </Grid>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {findFilterNode()}
    </>
  );
};