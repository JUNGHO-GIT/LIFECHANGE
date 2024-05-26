// TopNav.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Tabs, Tab, tabsClasses, Paper, Card} from "../../import/ImportMuis.jsx";
import {PopUp, Div, Img, Br10, Br20} from "../../import/ImportComponents.jsx";
import {smile1, smile2, smile3, smile4, smile5} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const TopNav = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const percent = JSON.parse(sessionStorage.getItem("percent") || "{}");
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const part = firstStr.charAt(0).toUpperCase() + firstStr.slice(1);
  const type = secondStr.charAt(0).toUpperCase() + secondStr.slice(1);
  const plan = thirdStr.charAt(0).toUpperCase() + thirdStr.slice(1);

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

  // 3. logic ------------------------------------------------------------------------------------->
  const makeIcon = (part, className, text, popTrigger) => {

    const classType = text === "N" ? "d-none" : "fs-0-7rem ms-5";

    if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 0 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 1
    ) {
      return (
        <Div className={"d-center pointer"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          <Img src={smile1} className={className} />
          <Div className={classType}>
            {percent?.[`${part}`]?.average?.score}
          </Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 1 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 2
    ) {
      return (
        <Div className={"d-center pointer"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          <Img src={smile2} className={className} />
          <Div className={classType}>
          {percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 2 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 3
    ) {
      return (
        <Div className={"d-center pointer"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          <Img src={smile3} className={className} />
          <Div className={classType}>
          {percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 3 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 4
    ) {
      return (
        <Div className={"d-center pointer"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          <Img src={smile4} className={className} />
          <Div className={classType}>
          {percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
    else if (
      parseFloat(percent?.[`${part}`]?.average?.score) > 4 &&
      parseFloat(percent?.[`${part}`]?.average?.score) <= 5
    ) {
      return (
        <Div className={"d-center pointer"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          <Img src={smile5} className={className} />
          <Div className={classType}>
          {percent?.[`${part}`]?.average?.score}</Div>
        </Div>
      );
    }
  };

  // 5. scoreNode --------------------------------------------------------------------------------->
  const scoreNode = () => (
    <PopUp
      type={"dropdown"}
      position={"bottom"}
      direction={"center"}
      contents={({closePopup}) => (
      <Div className={"d-column p-10"}>
        <Div className={"d-center"}>
          <Div className={"fs-0-8rem"}>{moment().format("YYYY-MM-DD (ddd)")}</Div>
        </Div>
        <Br20 />
        <Div className={"d-center"}>
          <Div className={"fs-0-8rem me-5"}>
            {translate("navBar-total")}
          </Div>
          {makeIcon("total", "w-max5vw h-max5vh")}
        </Div>
        <Br10 />
        <Div className={"d-center"}>
          <Div className={"fs-0-8rem me-5"}>
            {translate("navBar-exercise")}
          </Div>
          {makeIcon("exercise", "w-max5vw h-max5vh")}
        </Div>
        <Br10 />
        <Div className={"d-center"}>
          <Div className={"fs-0-8rem me-5"}>
            {translate("navBar-food")}
          </Div>
          {makeIcon("food", "w-max5vw h-max5vh")}
        </Div>
        <Br10 />
        <Div className={"d-center"}>
          <Div className={"fs-0-8rem me-5"}>
            {translate("navBar-money")}
          </Div>
          {makeIcon("money", "w-max5vw h-max5vh")}
        </Div>
        <Br10 />
        <Div className={"d-center"}>
          <Div className={"fs-0-8rem me-5"}>
            {translate("navBar-sleep")}
          </Div>
          {makeIcon("sleep", "w-max5vw h-max5vh")}
        </Div>
        <Br20 />
        <Div className={"d-center"}>
          <Div className={"fs-0-6rem fw-normal"}>
            {translate("navBar-score")}
          </Div>
        </Div>
      </Div>
      )}>
      {(popTrigger={}) => (
        firstStr === "" || firstStr === "calendar" || firstStr === "user" ? (
          makeIcon("total", "w-max25 h-max25", "N", popTrigger)
        ) : (
          makeIcon(part.toLowerCase(), "w-max25 h-max25", "N", popTrigger)
        )
      )}
    </PopUp>
  );

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
      <Card className={"block-wrapper d-row h-7vh w-100p"}>
        {scoreNode()}
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