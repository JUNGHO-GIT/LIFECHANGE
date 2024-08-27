// Btn.jsx
// Node -> Section -> Fragment

import { React } from "../../../import/ImportReacts.jsx";
import { useCommon } from "../../../import/ImportHooks.jsx";
import { Div } from "../../../import/ImportComponents.jsx";
import { Button } from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Btn = ({
  state, setState, flow,
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate, PATH} = useCommon();

  // 7. btn ----------------------------------------------------------------------------------------
  const btnNode = () => {
    // 1. goToFind
    const gotoFindSection = () => (
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
      </Button>
    );

    // 2. save
    const saveSection = () => (
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
          flow.flowSave();
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

    // 3. deletes
    const deletesSection = () => (
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
          flow.flowDeletes();
        }}
      >
        {translate("delete")}
      </Button>
    );

    // 4. return
    return (
      PATH.includes("/user/category") || PATH.includes("/user/detail") ? (
        <>
          {saveSection()}
        </>
      ) : PATH.includes("/food/save") ? (
        <>
          {gotoFindSection()}
          {saveSection()}
          {deletesSection()}
        </>
      ) : (
        <>
          {saveSection()}
          {deletesSection()}
        </>
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