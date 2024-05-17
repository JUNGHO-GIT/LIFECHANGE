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
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [value, setValue] = useState("diff/list");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // ex. /food/diff/list
    // ex. /food/diff/save
    // ex. /food/plan/list
    // ex. /food/plan/save
    // ex. /food/list
    // ex. /food/save

    if (thirdStr !== "") {
      setValue(`${secondStr}/${thirdStr}`);
    }
    else {
      setValue(secondStr);
    }

  }, [secondStr, thirdStr]);

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
          navigate(`${firstStr}/${newValue}`);
        }}>
        <Tab
          label={"통계"}
          value={"dash/list"}
          onClick={() => {
            setValue("dash/list");
          }}
        />
        <Tab
          label={"비교"}
          value={"diff/list"}
          onClick={() => {
            setValue("diff/list");
          }}
        />
        <Tab
          label={"리스트(계획)"}
          value={"plan/list"}
          onClick={() => {
            setValue("plan/list");
          }}
        />
        <Tab
          label={"저장(계획)"}
          value={"plan/save"}
          onClick={() => {
            setValue("plan/save");
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
          navigate(`${firstStr}/${newValue}`);
        }}>
        <Tab
          label={"통계"}
          value={"dash/list"}
          onClick={() => {
            setValue("dash/list");
          }}
        />
        <Tab
          label={"비교"}
          value={"diff/list"}
          onClick={() => {
            setValue("diff/list");
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
          label={"리스트(계획)"}
          value={"plan/list"}
          onClick={() => {
            setValue("plan/list");
          }}
        />
        <Tab
          label={"저장(계획)"}
          value={"plan/save"}
          onClick={() => {
            setValue("plan/save");
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
      </Tabs>
    </Div>
  );

  // 7. tabBar ------------------------------------------------------------------------------------>
  const tabBarNode = () => (
    <Paper className={"flex-wrapper p-sticky top-14vh border-top border-bottom"}>
      {firstStr === "exercise" || firstStr === "money" || firstStr === "sleep" ? (
        defaultNode()
      ) : firstStr === "food" ? (
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