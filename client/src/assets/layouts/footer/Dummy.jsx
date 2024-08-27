// Dummy.jsx
// Node -> Section -> Fragment

import { React } from "../../../import/ImportReacts.jsx";
import { useCommon } from "../../../import/ImportHooks.jsx";
import { Div } from "../../../import/ImportComponents.jsx";
import { Card, Button, TextField, MenuItem } from "../../../import/ImportMuis.jsx";

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
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"me-2vw"}
        variant={"outlined"}
        value={state?.PART}
        defaultValue={"exerciseGoal"}
        InputProps={{
          readOnly: false,
          className: "h-min0 h-30 fs-0-8rem",
        }}
        onChange={(e) => {
          const newPartVal = e.target.value;
          setState?.setPART(newPartVal);
          setState?.setPAGING((prev) => ({
            ...prev,
            page: 1
          }));
        }}
      >
        <MenuItem value={"exerciseGoal"}>
          <Div className={"fs-0-7rem"}>{`${translate("exercise")}(${translate("goal")})`}</Div>
        </MenuItem>
        <MenuItem value={"exercise"}>
          <Div className={"fs-0-7rem"}>{translate("exercise")}</Div>
        </MenuItem>
        <MenuItem value={"foodGoal"}>
          <Div className={"fs-0-7rem"}>{`${translate("food")}(${translate("goal")})`}</Div>
        </MenuItem>
        <MenuItem value={"food"}>
          <Div className={"fs-0-7rem"}>{translate("food")}</Div>
        </MenuItem>
        <MenuItem value={"moneyGoal"}>
          <Div className={"fs-0-7rem"}>{`${translate("money")}(${translate("goal")})`}</Div>
        </MenuItem>
        <MenuItem value={"money"}>
          <Div className={"fs-0-7rem"}>{translate("money")}</Div>
        </MenuItem>
        <MenuItem value={"sleepGoal"}>
          <Div className={"fs-0-7rem"}>{`${translate("sleep")}(${translate("goal")})`}</Div>
        </MenuItem>
        <MenuItem value={"sleep"}>
          <Div className={"fs-0-7rem"}>{translate("sleep")}</Div>
        </MenuItem>
      </TextField>
    );
    // 2. count
    const countSection = () => (
      <TextField
        select={false}
        type={"text"}
        size={"small"}
        className={"me-2vw"}
        variant={"outlined"}
        value={Math.min(state?.COUNT?.inputCnt, 100)}
        InputProps={{
          readOnly: false,
          className: "h-min0 h-30 fs-0-8rem",
        }}
        onChange={(e) => {
          const limitedValue = Math.min(Number(e.target.value), 100);
          setState?.setCOUNT((prev) => ({
            ...prev,
            inputCnt: limitedValue
          }));
        }}
      />
    );
    // 3. save
    const saveSection = () => (
      <Button
        size={"small"}
        color={"primary"}
        variant={"contained"}
        style={{
          lineHeight: "1.4",
          padding: "3px 9px",
          textTransform: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginRight: "2vw",
          fontSize: "0.7rem"
        }}
        onClick={() => {
          flow.flowDummySave();
        }}
      >
        {translate("save")}
      </Button>
    );
    // 4. deletes
    const deletesSection = () => (
      <Button
        size={"small"}
        color={"error"}
        variant={"contained"}
        style={{
          lineHeight: "1.4",
          padding: "3px 9px",
          textTransform: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginRight: "2vw",
          fontSize: "0.7rem"
        }}
        onClick={() => {
          flow.flowDummyDeletes();
        }}
      >
        {translate("deletes")}
      </Button>
    );
    // 5. deletesAll
    const deletesAllSection = () => (
      <Button
        size={"small"}
        color={"warning"}
        variant={"contained"}
        style={{
          lineHeight: "1.4",
          padding: "3px 9px",
          textTransform: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginRight: "2vw",
          fontSize: "0.7rem"
        }}
        onClick={() => {
          flow.flowDummyDeletes("all");
        }}
      >
        {translate("deletesAll")}
      </Button>
    );
    // 6. return
    return (
      <>
        {partSection()}
        {countSection()}
        {saveSection()}
        {deletesSection()}
        {deletesAllSection()}
      </>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dummyNode()}
    </>
  );
};