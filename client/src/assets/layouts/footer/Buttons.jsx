// Buttons.jsx
// Node -> Section -> Fragment

import { useCommon } from "../../../imports/ImportHooks.jsx";
import { Btn } from "../../../imports/ImportComponents.jsx";
import { Grid } from "../../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Buttons = ({
  state, setState, flow,
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate, PATH} = useCommon();

  // 7. btn ----------------------------------------------------------------------------------------
  const btnNode = () => {
    // 1. goToFind
    const gotoFindSection = () => (
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
            if (key.includes("foodSection") || key.includes("PAGING")) {
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
        {translate("delete")}
      </Btn>
    );

    // 4. return
    return (
      PATH.includes("/user/category") || PATH.includes("/user/detail") ? (
        <Grid container columnSpacing={1}>
          <Grid size={12} className={"d-center"}>
            {saveSection()}
          </Grid>
        </Grid>
      ) : PATH.includes("/food/save") ? (
        <Grid container columnSpacing={1}>
          <Grid size={4} className={"d-right"}>
            {gotoFindSection()}
          </Grid>
          <Grid size={4} className={"d-center"}>
            {saveSection()}
          </Grid>
          <Grid size={4} className={"d-left"}>
            {deletesSection()}
          </Grid>
        </Grid>
      ) : (
        <Grid container columnSpacing={1}>
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