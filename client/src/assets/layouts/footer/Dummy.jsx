// Dummy.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Card, Button, TextField, MenuItem} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Dummy = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useTranslate();

  // 2. type ---------------------------------------------------------------------------------------
  const partNode = () => (
    <TextField
      select={true}
      type={"text"}
      size={"small"}
      className={"me-2vw"}
      variant={"outlined"}
      value={objects?.PART}
      defaultValue={"exerciseGoal"}
      InputProps={{
        readOnly: false,
        className: "h-min0 h-30 fs-0-8rem",
      }}
      onChange={(e) => {
        const newPartVal = e.target.value;
        functions?.setPART(newPartVal);
        functions?.setPAGING((prev) => ({
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

  // 3. count --------------------------------------------------------------------------------------
  const countNode = () => (
    <TextField
      select={false}
      type={"text"}
      size={"small"}
      className={"me-2vw"}
      variant={"outlined"}
      value={Math.min(objects?.COUNT?.inputCnt, 100)}
      InputProps={{
        readOnly: false,
        className: "h-min0 h-30 fs-0-8rem",
      }}
      onChange={(e) => {
        const limitedValue = Math.min(Number(e.target.value), 100);
        functions.setCOUNT((prev) => ({
          ...prev,
          inputCnt: limitedValue
        }));
      }}
    />
  );

  // 4. save ---------------------------------------------------------------------------------------
  const saveNode = () => (
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
        handlers.flowDummySave();
      }}
    >
      {translate("save")}
    </Button>
  );

  // 6. delete -------------------------------------------------------------------------------------
  const deleteNode = () => (
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
        handlers.flowDummyDeletes();
      }}
    >
      {translate("deletes")}
    </Button>
  );

  // 7. deleteAll ----------------------------------------------------------------------------------
  const deleteAllNode = () => (
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
        handlers.flowDummyDeletes("all");
      }}
    >
      {translate("deletesAll")}
    </Button>
  );

  // 7. dummy --------------------------------------------------------------------------------------
  const dummyNode = () => (
    <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
      {partNode()}
      {countNode()}
      {saveNode()}
      {deleteNode()}
      {deleteAllNode()}
    </Card>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dummyNode()}
    </>
  );
};