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
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [value, setValue] = useState("dash");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (thirdStr !== "plan") {
      if (typeStr === "dash") {
        setValue("dash");
      }
      else if (typeStr === "diff") {
        setValue("diff");
      }
      else if (typeStr === "find" && thirdStr === "list") {
        setValue("find/list");
      }
      else if (typeStr === "find" && thirdStr === "save") {
        setValue("find/list");
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
    else if (thirdStr === "plan") {
      if (typeStr === "list") {
        setValue("list/plan");
      }
      else if (typeStr === "save") {
        setValue("save/plan");
      }
    }
  }, [typeStr, thirdStr]);

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Div className={"block-wrapper d-row w-100vw h-7vh"}>
      <Tabs
        value={value}
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
          navigate(`${partStr}/${newValue}`);
        }}>
        <Tab
          label={"통계"}
          value={"dash"}
          onClick={() => {
            setValue("dash");
          }}
        />
        <Tab
          label={"비교"}
          value={"diff"}
          onClick={() => {
            setValue("diff");
          }}
        />
        <Tab
          label={"리스트"}
          value={"list"}
          onClick={() => {
            setValue("list");
          }}
        />
        <Tab
          label={"저장"}
          value={"save"}
          onClick={() => {
            setValue("save");
          }}
        />
        <Tab
          label={"리스트(계획)"}
          value={"list/plan"}
          onClick={() => {
            setValue("list/plan");
          }}
        />
        <Tab
          label={"저장(계획)"}
          value={"save/plan"}
          onClick={() => {
            setValue("save/plan");
          }}
        />
      </Tabs>
    </Div>
  );

  // 6. food -------------------------------------------------------------------------------------->
  const foodNode = () => (
    <Div className={"block-wrapper d-row w-100vw h-7vh"}>
      <Tabs
        value={value}
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
          navigate(`${partStr}/${newValue}`);
        }}>
        <Tab
          label={"통계"}
          value={"dash"}
          onClick={() => {
            setValue("dash");
          }}
        />
        <Tab
          label={"비교"}
          value={"diff"}
          onClick={() => {
            setValue("diff");
          }}
        />
        <Tab
          label={"검색"}
          value={"find/list"}
          onClick={() => {
            setValue("find/list");
          }}
        />
        <Tab
          label={"리스트"}
          value={"list"}
          onClick={() => {
            setValue("list");
          }}
        />
        <Tab
          label={"저장"}
          value={"save"}
          onClick={() => {
            setValue("save");
          }}
        />
        <Tab
          label={"리스트(계획)"}
          value={"list/plan"}
          onClick={() => {
            setValue("list/plan");
          }}
        />
        <Tab
          label={"저장(계획)"}
          value={"save/plan"}
          onClick={() => {
            setValue("save/plan");
          }}
        />
      </Tabs>
    </Div>
  );

  // 7. tabBar ------------------------------------------------------------------------------------>
  const tabBarNode = () => (
    <Paper className={"flex-wrapper p-sticky top-14vh border-top border-bottom"}>
      {partStr === "exercise" || partStr === "money" || partStr === "sleep" ? (
        defaultNode()
      ) : partStr === "food" ? (
        foodNode()
      ) : (
        null
      )}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tabBarNode()}
    </>
  );
};