// TopNav.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Tabs, Tab, tabsClasses, Paper, Card} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const TopNav = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [value, setValue] = useState("diff/list");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (thirdStr !== "") {
      setValue(`${secondStr}/${thirdStr}`);
    }
    else {
      setValue(secondStr);
    }
  }, [secondStr, thirdStr]);

  // 6. default ----------------------------------------------------------------------------------->
  const defaultNode = () => (
    <Tabs
      value={value}
      variant={"scrollable"}
      selectionFollowsFocus={true}
      scrollButtons={false}
      sx={{
        [`& .${tabsClasses.scrollButtons}`]: {
          '&.Mui-disabled': { opacity: 0.3 },
        },
      }}
      onChange={(event, newValue) => {
        setValue(newValue);
        navigate(`${firstStr}/${newValue}`, {
          state: {
            dateType: "day",
            dateStart: moment().format("YYYY-MM-DD"),
            dateEnd: moment().format("YYYY-MM-DD")
          }
        });
      }}>
      <Tab
        label={translate("topNav-dashList")}
        value={"dash/list"}
        onClick={() => {
          setValue("dash/list");
        }}
      />
      <Tab
        label={translate("topNav-diffList")}
        value={"diff/list"}
        onClick={() => {
          setValue("diff/list");
        }}
      />
      <Tab
        label={translate("topNav-planList")}
        value={"plan/list"}
        onClick={() => {
          setValue("plan/list");
        }}
      />
      <Tab
        label={translate("topNav-planSave")}
        value={"plan/save"}
        onClick={() => {
          setValue("plan/save");
        }}
      />
      <Tab
        label={translate("topNav-list")}
        value={"list"}
        onClick={() => {
          setValue("list");
        }}
      />
      <Tab
        label={translate("topNav-save")}
        value={"save"}
        onClick={() => {
          setValue("save");
        }}
      />
    </Tabs>
  );

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => (
    <Tabs
      value={value}
      variant={"scrollable"}
      selectionFollowsFocus={true}
      scrollButtons={false}
      sx={{
        [`& .${tabsClasses.scrollButtons}`]: {
          '&.Mui-disabled': { opacity: 0.3 },
        },
      }}
      onChange={(event, newValue) => {
        setValue(newValue);
        navigate(`${firstStr}/${newValue}`, {
          state: {
            dateType: "day",
            dateStart: moment().format("YYYY-MM-DD"),
            dateEnd: moment().format("YYYY-MM-DD")
          }
        });
      }}>
      <Tab
        label={translate("topNav-list")}
        value={"list"}
        onClick={() => {
          setValue("list");
        }}
      />
      <Tab
        label={translate("topNav-save")}
        value={"save"}
        onClick={() => {
          setValue("save");
        }}
      />
    </Tabs>
  );

  // 6. food -------------------------------------------------------------------------------------->
  const foodNode = () => (
    <Tabs
      value={value}
      variant={"scrollable"}
      selectionFollowsFocus={true}
      scrollButtons={false}
      sx={{
        [`& .${tabsClasses.scrollButtons}`]: {
          '&.Mui-disabled': { opacity: 0.3 },
        },
      }}
      onChange={(event, newValue) => {
        setValue(newValue);
        navigate(`${firstStr}/${newValue}`, {
          state: {
            dateType: "day",
            dateStart: moment().format("YYYY-MM-DD"),
            dateEnd: moment().format("YYYY-MM-DD")
          }
        });
      }}>
      <Tab
        label={translate("topNav-dashList")}
        value={"dash/list"}
        onClick={() => {
          setValue("dash/list");
        }}
      />
      <Tab
        label={translate("topNav-diffList")}
        value={"diff/list"}
        onClick={() => {
          setValue("diff/list");
        }}
      />
      <Tab
        label={translate("topNav-findList")}
        value={"find/list" || "find/save"}
        onClick={() => {
          setValue("find/list");
        }}
      />
      <Tab
        label={translate("topNav-planList")}
        value={"plan/list"}
        onClick={() => {
          setValue("plan/list");
        }}
      />
      <Tab
        label={translate("topNav-planSave")}
        value={"plan/save"}
        onClick={() => {
          setValue("plan/save");
        }}
      />
      <Tab
        label={translate("topNav-list")}
        value={"list"}
        onClick={() => {
          setValue("list");
        }}
      />
      <Tab
        label={translate("topNav-save")}
        value={"save"}
        onClick={() => {
          setValue("save");
        }}
      />
    </Tabs>
  );

  // 7. topNav ------------------------------------------------------------------------------------>
  const topNavNode = () => (
    <Paper className={"flex-wrapper p-sticky top-7vh border radius"}>
      <Card className={"block-wrapper d-row h-7vh"}>
        {firstStr === "exercise" || firstStr === "money" || firstStr === "sleep" ? (
          defaultNode()
        ) : firstStr === "calendar" ? (
          calendarNode()
        ) : firstStr === "food" ? (
          foodNode()
        ) : (
          null
        )}
      </Card>
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {topNavNode()}
    </>
  );
};