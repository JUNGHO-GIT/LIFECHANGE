// TabBar.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Tabs, Tab, tabsClasses} from "../../import/ImportMuis.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const TabBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [value, setValue] = useState("dash");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (planStr !== "plan") {
      if (typeStr === "dash") {
        setValue("dash");
      }
      else if (typeStr === "diff") {
        setValue("diff");
      }
      else if (typeStr === "list") {
        setValue("list");
      }
      else if (typeStr === "save") {
        setValue("save");
      }
      else if (typeStr === "detail") {
        setValue("detail");
      }
    }
    else {
      if (typeStr === "list") {
        setValue("list/plan");
      }
      else if (typeStr === "save") {
        setValue("save/plan");
      }
    }
  }, [typeStr, planStr]);

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row w-100vw h-7vh"}>
      <Tabs value={value}
        variant={"scrollable"}
        scrollButtons={"auto"}
        allowScrollButtonsMobile={true}
        selectionFollowsFocus={true}
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}>
        <Tab
          label={"통계"}
          value={"dash"}
          onClick={() => {
            setValue("dash");
            navigate(`${partStr}/dash`);
          }}
        />
        <Tab
          label={"비교"}
          value={"diff"}
          onClick={() => {
            setValue("diff");
            navigate(`${partStr}/diff`);
          }}
        />
        <Tab
          label={"리스트"}
          value={"list"}
          onClick={() => {
            setValue("list");
            navigate(`${partStr}/list`);
          }}
        />
        <Tab
          label={"저장"}
          value={"save"}
          onClick={() => {
            setValue("save");
            navigate(`${partStr}/save`);
          }}
        />
        <Tab
          label={"리스트(계획)"}
          value={"list/plan"}
          onClick={() => {
            setValue("list/plan");
            navigate(`${partStr}/list/plan`);
          }}
        />
        <Tab
          label={"저장(계획)"}
          value={"save/plan"}
          onClick={() => {
            setValue("save/plan");
            navigate(`${partStr}/save/plan`);
          }}
        />
      </Tabs>
    </Div>
  );

  // 7. navigation -------------------------------------------------------------------------------->
  const navigationNode = () => (
    <Paper className={"flex-wrapper p-sticky top-14vh border-top border-bottom"}>
      {partStr === "exercise" || partStr === "food" ||
        partStr === "money" || partStr === "sleep" ? (
        defaultNode()
      ) : (
        null
      )}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {navigationNode()}
    </>
  );
};