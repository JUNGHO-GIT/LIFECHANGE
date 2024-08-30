// Dummy.jsx
// Node -> Section -> Fragment

import { useCommon } from "../../../imports/ImportHooks.jsx";
import { numeral } from "../../../imports/ImportLibs.jsx";
import { Input, Select, Btn } from "../../../imports/ImportComponents.jsx";
import { MenuItem, Grid } from "../../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Dummy = ({
  state, setState, flow,
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useCommon();

  // 7. dummy --------------------------------------------------------------------------------------
  const dummyNode = () => {
    // 1. part
    const partSection = () => (
      <Select
        value={state?.PART}
        defaultValue={"exerciseGoal"}
        inputclass={"h-min0 h-30 fs-0-7rem"}
        onChange={(e) => {
          const newPartVal = e.target.value;
          setState?.setPART(newPartVal);
          setState?.setPAGING((prev) => ({
            ...prev,
            page: 1
          }));
        }}
      >
        <MenuItem value={"exerciseGoal"} className={"fs-0-7rem"}>
          {`${translate("exercise")}(${translate("goal")})`}
        </MenuItem>
        <MenuItem value={"exercise"} className={"fs-0-7rem"}>
          {translate("exercise")}
        </MenuItem>
        <MenuItem value={"foodGoal"} className={"fs-0-7rem"}>
          {`${translate("food")}(${translate("goal")})`}
        </MenuItem>
        <MenuItem value={"food"} className={"fs-0-7rem"}>
          {translate("food")}
        </MenuItem>
        <MenuItem value={"moneyGoal"} className={"fs-0-7rem"}>
          {`${translate("money")}(${translate("goal")})`}
        </MenuItem>
        <MenuItem value={"money"} className={"fs-0-7rem"}>
          {translate("money")}
        </MenuItem>
        <MenuItem value={"sleepGoal"} className={"fs-0-7rem"}>
          {`${translate("sleep")}(${translate("goal")})`}
        </MenuItem>
        <MenuItem value={"sleep"} className={"fs-0-7rem"}>
          {translate("sleep")}
        </MenuItem>
      </Select>
    );
    // 2. count
    const countSection = () => (
      <Input
        value={numeral(state?.COUNT?.inputCnt).format("0")}
        inputclass={"h-min0 h-30 fs-0-8rem"}
        onChange={(e) => {
          const value = e.target.value.replace(/,/g, '');
          if (/^\d*$/.test(value) || value === "") {
            const newValue = Number(value);
            if (value === "") {
              setState?.setCOUNT((prev) => ({
                ...prev,
                inputCnt: "0",
              }));
            }
            else if (!isNaN(newValue) && newValue <= 999) {
              setState?.setCOUNT((prev) => ({
                ...prev,
                inputCnt: value,
              }));
            }
          }
        }}
      />
    );
    // 3. save
    const saveSection = () => (
      <Btn
        color={"primary"}
        className={"pt-3 pb-3 ps-9 pe-9 fs-0-7rem"}
        onClick={() => {
          flow.flowDummySave();
        }}
      >
        {translate("save")}
      </Btn>
    );
    // 4. deletes
    const deletesSection = () => (
      <Btn
        color={"error"}
        className={"pt-3 pb-3 ps-9 pe-9 fs-0-7rem"}
        onClick={() => {
          flow.flowDummyDeletes();
        }}
      >
        {translate("deletes")}
      </Btn>
    );
    // 5. deletesAll
    const deletesAllSection = () => (
      <Btn
        color={"warning"}
        className={"pt-3 pb-3 ps-9 pe-9 fs-0-7rem"}
        onClick={() => {
          flow.flowDummyDeletes("all");
        }}
      >
        {translate("deletesAll")}
      </Btn>
    );
    // 6. return
    return (
      <Grid container spacing={2}>
        <Grid size={3} className={"d-center"}>
          {partSection()}
        </Grid>
        <Grid size={3} className={"d-center"}>
          {countSection()}
        </Grid>
        <Grid size={2} className={"d-right"}>
          {saveSection()}
        </Grid>
        <Grid size={2} className={"d-center"}>
          {deletesSection()}
        </Grid>
        <Grid size={2} className={"d-left"}>
          {deletesAllSection()}
        </Grid>
      </Grid>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dummyNode()}
    </>
  );
};