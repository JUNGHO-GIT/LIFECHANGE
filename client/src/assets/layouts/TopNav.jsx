// TopNav.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, numeral} from "../../import/ImportLibs.jsx";
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
  const part = firstStr.charAt(0).toUpperCase() + firstStr.slice(1);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [value, setValue] = useState("analyzeTabs");
  const [selectedTab, setSelectedTab] = useState(value);
  const [selectedMenuItem, setSelectedMenuItem] = useState("chartList");
  const [anchorAnalyze, setAnchorAnalyze] = useState(null);
  const [anchorGoal, setAnchorGoal] = useState(null);
  const [anchorReal, setAnchorReal] = useState(null);
  const [smileIcon, setSmileIcon] = useState("");

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 페이지 변경시 초기화
  useEffect(() => {
    if (firstStr === "calendar") {
      setValue("list");
    }
    else {
      setValue("analyzeTabs");
      setSelectedTab("analyzeTabs");
      setSelectedMenuItem("chartList");
      setAnchorAnalyze(null);
      setAnchorGoal(null);
      setAnchorReal(null);
    }
  }, [firstStr]);

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
            if (newValue === "analyzeTabs") {
              setSelectedTab(newValue);
            }
            else {
              setValue(newValue);
              navigate(`${firstStr}/${newValue}`, {
                state: {
                  dateType: "day",
                  dateStart: moment().format("YYYY-MM-DD"),
                  dateEnd: moment().format("YYYY-MM-DD")
                }
              });
            }
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
            label={translate("goal")}
            value={"goal/list"}
            onClick={() => {
              setValue("goal/list");
            }}
          />
          <Tab
            label={translate("real")}
            value={"list"}
            onClick={() => {
              setValue("list");
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
              setAnchorAnalyze(null);
              setSelectedTab("analyzeTabs");
              setSelectedMenuItem("chartList");
              setValue("analyzeTabs");
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
              setAnchorAnalyze(null);
              setSelectedTab("analyzeTabs");
              setSelectedMenuItem("diffList");
              setValue("analyzeTabs");
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
    ) : (firstStr === "calendar") ? (
      <>
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
            label={translate("list")}
            value={"list"}
            onClick={() => {
              setValue("list");
            }}
          />
          <Tab
            label={translate("save")}
            value={"save"}
            onClick={() => {
              setValue("save");
            }}
          />
        </Tabs>
      </>
    ) : (
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
          onChange={(event, newValue) => {
            // setSelectedTab(newValue);
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
              setAnchorAnalyze(null);
              setSelectedTab("analyzeTabs");
              setSelectedMenuItem("chartList");
              setValue("analyzeTabs");
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
              setAnchorAnalyze(null);
              setSelectedTab("analyzeTabs");
              setSelectedMenuItem("diffList");
              setValue("analyzeTabs");
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
              setAnchorGoal(null);
              setSelectedTab("goalTabs");
              setSelectedMenuItem("goalList");
              setValue("goalTabs");
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
              setAnchorGoal(null);
              setSelectedTab("goalTabs");
              setSelectedMenuItem("goalSave");
              setValue("goalTabs");
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
                setAnchorReal(null);
                setSelectedTab("realTabs");
                setSelectedMenuItem("findList");
                setValue("realTabs");
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
              setAnchorReal(null);
              setSelectedTab("realTabs");
              setSelectedMenuItem("realList");
              setValue("realTabs");
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
              setAnchorReal(null);
              setSelectedTab("realTabs");
              setSelectedMenuItem("realSave");
              setValue("realTabs");
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