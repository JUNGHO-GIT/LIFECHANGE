// Btn.jsx

import {React, useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../../import/ImportHooks.jsx";
import {Button, Card} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Btn = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useTranslate();
  const location = useLocation();
  const PATH = location?.pathname;

  // 2. goto find ----------------------------------------------------------------------------------
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
        marginRight: "2vw",
        fontSize: "0.8rem"
      }}
      onClick={() => {
        Object.assign(objects?.SEND, {
          dateType: objects?.DATE.dateType,
          dateStart: objects?.DATE.dateStart,
          dateEnd: objects?.DATE.dateEnd
        });
        handlers.navigate(objects?.SEND.toFind, {
          state: objects?.SEND,
        });
      }}
    >
      {translate("find")}
    </Button>
  );

  // 3. save ---------------------------------------------------------------------------------------
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

  // 4. delete -------------------------------------------------------------------------------------
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

  // 7. btn ----------------------------------------------------------------------------------------
  const btnNode = () => {
    if (PATH.indexOf("/user/category") > -1 || PATH.indexOf("/user/detail") > -1) {
      return (
        <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
          {btnSave()}
        </Card>
      );
    }
    else if (PATH.indexOf("/food/save") > -1) {
      return (
        <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
          {btnGotoFind()}
          {btnSave()}
          {btnDeletes()}
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
      {btnNode()}
    </>
  );
};