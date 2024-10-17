// Dummy.tsx

import { useLanguageStore } from "@imports/ImportStores";
import { numeral } from "@imports/ImportUtils";
import { Input, Select } from "@imports/ImportContainers";
import { Btn } from "@imports/ImportComponents";
import { MenuItem, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare type DummyProps = {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const Dummy = (
  { state, setState, flow }: DummyProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { translate } = useLanguageStore();

  // 7. dummy --------------------------------------------------------------------------------------
  const dummyNode = () => {
    // 1. part
    const partSection = () => (
      <Select
        value={state?.PART}
        defaultValue={"exerciseGoal"}
        inputclass={"h-min0 h-30 fs-0-7rem"}
        onChange={(e: any) => {
          const newPartVal = e.target.value;
          setState?.setPART(newPartVal);
          setState?.setPAGING((prev: any) => ({
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
        onChange={(e: any) => {
          const value = e.target.value.replace(/,/g, '');
          const newValue = value === "" ? 0 : Number(value);
          if (value === "") {
            setState?.setCOUNT((prev: any) => ({
              ...prev,
              inputCnt: "0",
            }));
          }
          else if (!isNaN(newValue) && newValue <= 999) {
            setState?.setCOUNT((prev: any) => ({
              ...prev,
              inputCnt: String(newValue),
            }));
          }
        }}
      />
    );
    // 3. btn
    const btnSection = () => {
      const saveFragment = () => (
        <Btn
          color={"primary"}
          className={"pt-3 pb-3 ps-9 pe-9 fs-0-7rem me-10"}
          onClick={() => {
            flow.flowDummyDetail();
          }}
        >
          {translate("save")}
        </Btn>
      );
      const deleteFragment = () => (
        <Btn
          color={"error"}
          className={"pt-3 pb-3 ps-9 pe-9 fs-0-7rem me-10"}
          onClick={() => {
            flow.flowDummyDelete();
          }}
        >
          {translate("delete")}
        </Btn>
      );
      const deleteAllFragment = () => (
        <Btn
          color={"warning"}
          className={"pt-3 pb-3 ps-9 pe-9 fs-0-7rem"}
          onClick={() => {
            flow.flowDummyDelete("all");
          }}
        >
          {translate("deleteAll")}
        </Btn>
      );
      return (
        <>
          {saveFragment()}
          {deleteFragment()}
          {deleteAllFragment()}
        </>
      );
    }
    // 6. return
    return (
      <Grid container spacing={1} columns={12}>
        <Grid size={3} className={"d-center"}>
          {partSection()}
        </Grid>
        <Grid size={3} className={"d-col-center"}>
          {countSection()}
        </Grid>
        <Grid size={6} className={"d-row-center"}>
          {btnSection()}
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