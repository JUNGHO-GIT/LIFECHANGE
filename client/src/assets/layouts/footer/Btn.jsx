// Btn.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {Button, Card} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Btn = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useTranslate();

  // 2. save ---------------------------------------------------------------------------------------
  const btnSave = () => (
    <Button
      size={"small"}
      color={"primary"}
      variant={"contained"}
      style={{
        padding: "4px 10px",
        textTransform: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginRight: "2vw",
        fontSize: "0.8rem"
      }}
      onClick={() => {
        handlers.flowSave();
        Object.keys(sessionStorage).forEach((key) => {
          if (key.includes("foodSection") || key.includes("PAGING")) {
            sessionStorage.removeItem(key);
          }
        });
      }}
    >
      {translate("save")}
    </Button>
  );

  // 3. delete -------------------------------------------------------------------------------------
  const btnDeletes = () => (
    <Button
      size={"small"}
      color={"error"}
      variant={"contained"}
      style={{
        padding: "4px 10px",
        textTransform: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "0.8rem"
      }}
      onClick={() => {
        handlers.flowDeletes();
      }}
    >
      {translate("delete")}
    </Button>
  );
  
    // 3. delete -------------------------------------------------------------------------------------
  const btnGotoFind = () => (
    <Button
      size={"small"}
      color={"success"}
      variant={"contained"}
      style={{
        padding: "4px 10px",
        textTransform: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "0.8rem"
      }}
      onClick={() => {
        handlers.navigate(objects?.SEND.toFind, {
          state: objects?.SEND,
        });
      }}
    >
      {translate("findMore")}
    </Button>
  );

  // 7. btn ---------------------------------------------------------------------------------
  const btnNode = () => {
    if (
      (strings?.second === "data" && strings?.third === "category") ||
      (strings?.second === "data" && strings?.third === "detail")
    ) {
      return (
        <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
          {btnSave()}
        </Card>
      );
    }
    else if (strings?.first === "food" && strings?.second === "save") {
        <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
          {btnSave()}
          {btnDeletes()}
        </Card>
    }
    else {
      return (
        <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
          {btnSave()}
          {btnDeletes()}
        </Card>
      );
    }
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {btnNode()}
    </>
  );
};