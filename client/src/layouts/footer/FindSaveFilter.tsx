// FindSaveFilter.tsx
// Node -> Section -> Fragment

import { useCommon } from "@imports/ImportHooks";
import { Btn } from "@imports/ImportComponents";
import { Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
interface FindSaveFilterProps {
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
  } = useCommon();

  // 7. find ---------------------------------------------------------------------------------------
  const findFilterNode = () => {
    // 1. save
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
    // 2. more
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
    return (
      <Grid container spacing={2}>
        <Grid size={6} className={"d-right"}>
          {moreSection()}
        </Grid>
        <Grid size={6} className={"d-left"}>
          {saveSection()}
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