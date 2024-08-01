// TopNav.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, numeral} from "../../import/ImportLibs.jsx";
import {log} from "../../import/ImportUtils.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {TextField, Tabs, Tab, tabsClasses, Paper, Grid} from "../../import/ImportMuis.jsx";
import {Card, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {PopUp, Div, Img, Br10, Br20} from "../../import/ImportComponents.jsx";
import {smile1, smile2, smile3, smile4, smile5} from "../../import/ImportImages.jsx";
import {money2, money4} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const TopNav = () => {

  // 1. common -------------------------------------------------------------------------------------
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const percent = JSON.parse(sessionStorage.getItem("percent") || "{}");
  const property = JSON.parse(sessionStorage.getItem("property") || "{}");
  const totalIncome = property?.totalIncome || 0;
  const totalExpense = property?.totalExpense || 0;
  const totalProperty = property?.totalProperty || 0;
  const dateStart = property?.dateStart;
  const dateEnd = property?.dateEnd;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const part = firstStr.charAt(0).toUpperCase() + firstStr.slice(1);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [selectedTab, setSelectedTab] = useState("analyzeTabs");
  const [selectedMenuItem, setSelectedMenuItem] = useState("chartList");
  const [anchorAnalyze, setAnchorAnalyze] = useState(null);
  const [anchorGoal, setAnchorGoal] = useState(null);
  const [anchorReal, setAnchorReal] = useState(null);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 페이지 변경시 초기화
  useEffect(() => {
    // 1. calendar
    if (firstStr === "calendar") {
      if (secondStr === "list") {
        setSelectedTab("listTabs");
      }
      else if (secondStr === "save") {
        setSelectedTab("saveTabs");
      }
    }
    // 2. today
    else if (firstStr === "today") {
      if (secondStr === "chart" && thirdStr === "list") {
        setSelectedTab("analyzeTabs");
        setSelectedMenuItem("chartList");
      }
      else if (secondStr === "diff" && thirdStr === "list") {
        setSelectedTab("analyzeTabs");
        setSelectedMenuItem("diffList");
      }
      else if (secondStr === "goal" && thirdStr === "list") {
        setSelectedTab("goalTabs");
        setSelectedMenuItem("goalList");
      }
      else if (secondStr === "list") {
        setSelectedTab("realTabs");
        setSelectedMenuItem("realList");
      }
    }
    // 3. exercise, food, money, sleep
    else if (
      firstStr === "exercise" ||
      firstStr === "food" ||
      firstStr === "money" ||
      firstStr === "sleep"
    ) {
      if (secondStr === "chart" && thirdStr === "list") {
        setSelectedTab("analyzeTabs");
        setSelectedMenuItem("chartList");
      }
      else if (secondStr === "diff" && thirdStr === "list") {
        setSelectedTab("analyzeTabs");
        setSelectedMenuItem("diffList");
      }
      else if (secondStr === "goal" && thirdStr === "list") {
        setSelectedTab("goalTabs");
        setSelectedMenuItem("goalList");
      }
      else if (secondStr === "goal" && thirdStr === "save") {
        setSelectedTab("goalTabs");
        setSelectedMenuItem("goalSave");
      }
      else if (secondStr === "list") {
        setSelectedTab("realTabs");
        setSelectedMenuItem("realList");
      }
      else if (secondStr === "save") {
        setSelectedTab("realTabs");
        setSelectedMenuItem("realSave");
      }
    }
  }, [firstStr, secondStr, thirdStr]);

  // 4. smileNode ----------------------------------------------------------------------------------
  const smileNode = () => {
    const makeIcon = (part, className, text, popTrigger) => {
      const classType = text === "N" ? "d-none" : "fs-0-7rem fw-600 ms-3vw";
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
              {percent?.[`${part}`]?.average?.score}
            </Div>
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
              {percent?.[`${part}`]?.average?.score}
            </Div>
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
              {percent?.[`${part}`]?.average?.score}
            </Div>
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
              {percent?.[`${part}`]?.average?.score}
            </Div>
          </Div>
        );
      }
      else {
        return (
          <Div className={"d-center pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}>
            <Img src={smile3} className={className} />
            <Div className={classType}>
              {percent?.[`${part}`]?.average?.score}
            </Div>
          </Div>
        );
      }
    };
    return (
      <PopUp
        type={"dropdown"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-column p-10"}>
            <Div className={"d-center"}>
              <Div className={"fs-0-8rem fw-600"}>{moment().format("YYYY-MM-DD (ddd)")}</Div>
            </Div>
            <Br20 />
            <Div className={"d-center"}>
              <Div className={"fs-0-8rem me-3vw"}>
                {translate("total")}
              </Div>
              {makeIcon("total", "w-max5vw h-max5vh")}
            </Div>
            <Br10 />
            <Div className={"d-center"}>
              <Div className={"fs-0-8rem me-3vw"}>
                {translate("exercise")}
              </Div>
              {makeIcon("exercise", "w-max5vw h-max5vh")}
            </Div>
            <Br10 />
            <Div className={"d-center"}>
              <Div className={"fs-0-8rem me-3vw"}>
                {translate("food")}
              </Div>
              {makeIcon("food", "w-max5vw h-max5vh")}
            </Div>
            <Br10 />
            <Div className={"d-center"}>
              <Div className={"fs-0-8rem me-3vw"}>
                {translate("money")}
              </Div>
              {makeIcon("money", "w-max5vw h-max5vh")}
            </Div>
            <Br10 />
            <Div className={"d-center"}>
              <Div className={"fs-0-8rem me-3vw"}>
                {translate("sleep")}
              </Div>
              {makeIcon("sleep", "w-max5vw h-max5vh")}
            </Div>
            <Br20 />
            <Div className={"d-center"}>
              <Div className={"fs-0-6rem fw-500"}>
                {translate("score")}
              </Div>
            </Div>
          </Div>
        )}>
        {(popTrigger={}) => (
          firstStr === "" || firstStr === "calendar" ||
          firstStr === "user" || firstStr === "today" ? (
            makeIcon("total", "w-max25 h-max25  ms-3vw", "N", popTrigger)
          ) : (
            makeIcon(part.toLowerCase(), "w-max25 h-max25 ms-3vw", "N", popTrigger)
          )
        )}
      </PopUp>
    );
  };

  // 5. property -----------------------------------------------------------------------------------
  const propertyNode = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Div className={"w-max75vw h-max65vh border d-column p-20"}>
          <Div className={"d-center"}>
            <Div className={"fs-1-0rem fw-500"}>
              {dateStart}
            </Div>
            <Div className={"fs-0-7rem fw-500 ms-10 me-10"}>
              ~
            </Div>
            <Div className={"fs-1-0rem fw-500"}>
              {dateEnd}
            </Div>
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Img src={money2} className={"w-16 h-16"} />
            <Div className={"fs-1-4rem fw-600"}>
              {numeral(totalProperty).format("0,0")}
            </Div>
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("initProperty")}
              size={"small"}
              variant={"outlined"}
              className={"w-50vw"}
              value={numeral(property?.initProperty).format("0,0")}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Img src={money2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("currency")}
                  </Div>
                )
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("income")}
              size={"small"}
              variant={"outlined"}
              className={"w-50vw"}
              value={numeral(totalIncome).format("0,0")}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Img src={money2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("currency")}
                  </Div>
                )
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("expense")}
              size={"small"}
              variant={"outlined"}
              className={"w-50vw"}
              value={numeral(totalExpense).format("0,0")}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Img src={money2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("currency")}
                  </Div>
                )
              }}
            />
          </Div>
        </Div>
      )}>
      {(popTrigger={}) => (
        <Div className={"d-center pointer"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          <Img src={money4} className={"w-max25 h-max25 ms-3vw"} />
        </Div>
      )}
    </PopUp>
  );

  // 6. tabs ---------------------------------------------------------------------------------------
  const tabsNode = () => (
    (firstStr === "today") ? (
      <>
        <Tabs
          value={selectedTab}
          variant={"scrollable"}
          selectionFollowsFocus={true}
          scrollButtons={false}
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}>
          <Tab
            label={translate("analyzeTabs")}
            value={"analyzeTabs"}
            onClick={(e) => {
              // @ts-ignore
              setAnchorAnalyze(e.currentTarget);
            }}
          />
          <Tab
            label={translate("goalTabs")}
            value={"goalTabs"}
            onClick={(e) => {
              setSelectedTab("goalTabs");
              navigate(`${firstStr}/goal/list`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          />
          <Tab
            label={translate("realTabs")}
            value={"realTabs"}
            onClick={(e) => {
              setSelectedTab("realTabs");
              navigate(`${firstStr}/list`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          />
        </Tabs>
        <Menu
          anchorEl={anchorAnalyze}
          open={Boolean(anchorAnalyze)}
          onClose={() => setAnchorAnalyze(null)}
        >
          <MenuItem
            selected={selectedMenuItem === "chartList"}
            onClick={() => {
              setSelectedTab("analyzeTabs");
              setSelectedMenuItem("chartList");
              setAnchorAnalyze(null);
              navigate(`${firstStr}/chart/list`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          >
            {translate("chartList")}
          </MenuItem>
          <MenuItem
            selected={selectedMenuItem === "diffList"}
            onClick={() => {
              setSelectedTab("analyzeTabs");
              setSelectedMenuItem("diffList");
              setAnchorAnalyze(null);
              navigate(`${firstStr}/diff/list`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          >
            {translate("diffList")}
          </MenuItem>
        </Menu>
      </>
    )
    : (firstStr === "calendar") ? (
      <>
        <Tabs
          value={selectedTab}
          variant={"scrollable"}
          selectionFollowsFocus={true}
          scrollButtons={false}
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
          }}>
          <Tab
            label={translate("listTabs")}
            value={"listTabs"}
            onClick={(e) => {
              setSelectedTab("listTabs");
              navigate(`${firstStr}/list`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          />
          <Tab
            label={translate("saveTabs")}
            value={"saveTabs"}
            onClick={(e) => {
              setSelectedTab("saveTabs");
              navigate(`${firstStr}/save`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          />
        </Tabs>
      </>
    )
    : (
      <>
        <Tabs
          value={selectedTab}
          variant={"scrollable"}
          selectionFollowsFocus={true}
          scrollButtons={false}
          sx={{
            [`& .MuiTabs-scrollButtons`]: {
              "&.Mui-disabled": { opacity: 0.3 },
            },
          }}
        >
          <Tab
            label={translate("analyzeTabs")}
            value={"analyzeTabs"}
            onClick={(e) => {
              // @ts-ignore
              setAnchorAnalyze(e.currentTarget);
            }}
          />
          <Tab
            label={translate("goalTabs")}
            value={"goalTabs"}
            onClick={(e) => {
              // @ts-ignore
              setAnchorGoal(e.currentTarget);
            }}
          />
          <Tab
            label={translate("realTabs")}
            value={"realTabs"}
            onClick={(e) => {
              // @ts-ignore
              setAnchorReal(e.currentTarget);
            }}
          />
        </Tabs>
        <Menu
          anchorEl={anchorAnalyze}
          open={Boolean(anchorAnalyze)}
          onClose={() => setAnchorAnalyze(null)}
        >
          <MenuItem
            selected={selectedMenuItem === "chartList"}
            onClick={() => {
              setSelectedTab("analyzeTabs");
              setSelectedMenuItem("chartList");
              setAnchorAnalyze(null);
              navigate(`${firstStr}/chart/list`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          >
            {translate("chartList")}
          </MenuItem>
          <MenuItem
            selected={selectedMenuItem === "diffList"}
            onClick={() => {
              setSelectedTab("analyzeTabs");
              setSelectedMenuItem("diffList");
              setAnchorAnalyze(null);
              navigate(`${firstStr}/diff/list`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          >
            {translate("diffList")}
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={anchorGoal}
          open={Boolean(anchorGoal)}
          onClose={() => setAnchorGoal(null)}
        >
          <MenuItem
            selected={selectedMenuItem === "goalList"}
            onClick={() => {
              setSelectedTab("goalTabs");
              setSelectedMenuItem("goalList");
              setAnchorGoal(null);
              navigate(`${firstStr}/goal/list`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          >
            {translate("list")}
          </MenuItem>
          <MenuItem
            selected={selectedMenuItem === "goalSave"}
            onClick={() => {
              setSelectedTab("goalTabs");
              setSelectedMenuItem("goalSave");
              setAnchorGoal(null);
              navigate(`${firstStr}/goal/save`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          >
            {translate("save")}
          </MenuItem>
        </Menu>
        <Menu
          anchorEl={anchorReal}
          open={Boolean(anchorReal)}
          onClose={() => setAnchorReal(null)}
        >
          {firstStr === "food" && (
            <MenuItem
              selected={selectedMenuItem === "findList"}
              onClick={() => {
                setSelectedTab("realTabs");
                setSelectedMenuItem("findList");
                setAnchorReal(null);
                navigate(`${firstStr}/find`, {
                  state: {
                    dateType: "day",
                    dateStart: moment().format("YYYY-MM-DD"),
                    dateEnd: moment().format("YYYY-MM-DD"),
                  },
                });
              }}
            >
              {translate("findList")}
            </MenuItem>
          )}
          <MenuItem
            selected={selectedMenuItem === "realList"}
            onClick={() => {
              setSelectedTab("realTabs");
              setSelectedMenuItem("realList");
              setAnchorReal(null);
              navigate(`${firstStr}/list`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          >
            {translate("list")}
          </MenuItem>
          <MenuItem
            selected={selectedMenuItem === "realSave"}
            onClick={() => {
              setSelectedTab("realTabs");
              setSelectedMenuItem("realSave");
              setAnchorReal(null);
              navigate(`${firstStr}/save`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD"),
                },
              });
            }}
          >
            {translate("save")}
          </MenuItem>
        </Menu>
      </>
    )
  );

  // 7. topNav -------------------------------------------------------------------------------------
  const topNavNode = () => (
    <Paper className={"flex-wrapper p-sticky top-8vh radius border shadow-none"}>
      <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
        <Grid container>
          <Grid item xs={1} className={"d-center"}>
            {smileNode()}
          </Grid>
          <Grid item xs={10} className={"d-center"}>
            {tabsNode()}
          </Grid>
          <Grid item xs={1} className={"d-center"}>
            {propertyNode()}
          </Grid>
        </Grid>
      </Card>
    </Paper>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {topNavNode()}
    </>
  );
};