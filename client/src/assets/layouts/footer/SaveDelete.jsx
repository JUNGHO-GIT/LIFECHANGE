// SaveDelete.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {Button, Card} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const SaveDelete = ({
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
      className={"me-3vw"}
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
      className={"me-3vw"}
      onClick={() => {
        handlers.flowDeletes();
      }}
    >
      {translate("delete")}
    </Button>
  );

  // 7. saveDelete ---------------------------------------------------------------------------------
  const saveDeleteNode = () => {
    if (strings?.second === "data" && strings?.third === "category") {
      return (
        <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
          {btnSave()}
        </Card>
      );
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
      {saveDeleteNode()}
    </>
  );
};