// TopNav.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, numeral} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {TextField, Tabs, Tab, tabsClasses, Paper, Grid, Card} from "../../import/ImportMuis.jsx";
import {PopUp, Div, Img, Hr40, Br20} from "../../import/ImportComponents.jsx";
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

  // 2-2. useState ---------------------------------------------------------------------------------
  const [selectedTab, setSelectedTab] = useState("analyze");
  const [smileScore, setSmileScore] = useState({
    total: 0,
    exercise: 0,
    food: 0,
    money: 0,
    sleep: 0,
  });
  const [smileImage, setSmileImage] = useState({
    total: smile3,
    exercise: smile3,
    food: smile3,
    money: smile3,
    sleep: smile3,
  });
  const [mainSmileImage, setMainSmileImage] = useState(smile3);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 스마일 지수 계산
  useEffect(() => {
    if (!percent) {
      return;
    }

    const newSmileScore = {
      total: percent?.total?.average?.score || 0,
      exercise: percent?.exercise?.average?.score || 0,
      food: percent?.food?.average?.score || 0,
      money: percent?.money?.average?.score || 0,
      sleep: percent?.sleep?.average?.score || 0,
    };

    const getImage = (score) => {
      if (score > 0 && score <= 1) {
        return smile1;
      }
      else if (score > 1 && score <= 2) {
        return smile2;
      }
      else if (score > 2 && score <= 3) {
        return smile3;
      }
      else if (score > 3 && score <= 4) {
        return smile4;
      }
      else if (score > 4 && score <= 5) {
        return smile5;
      }
      else {
        return smile3;
      }
    };

    setSmileScore(newSmileScore);
    setSmileImage({
      total: getImage(newSmileScore.total),
      exercise: getImage(newSmileScore.exercise),
      food: getImage(newSmileScore.food),
      money: getImage(newSmileScore.money),
      sleep: getImage(newSmileScore.sleep),
    });

  }, [
    percent?.total?.average?.score,
    percent?.exercise?.average?.score,
    percent?.food?.average?.score,
    percent?.money?.average?.score,
    percent?.sleep?.average?.score
  ]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 메인 스마일 이미지
  useEffect(() => {
    if (firstStr === "calendar") {
      setMainSmileImage(smileImage.total);
    }
    else if (firstStr === "today") {
      setMainSmileImage(smileImage.total);
    }
    else if (firstStr === "exercise") {
      setMainSmileImage(smileImage.exercise);
    }
    else if (firstStr === "food") {
      setMainSmileImage(smileImage.food);
    }
    else if (firstStr === "money") {
      setMainSmileImage(smileImage.money);
    }
    else if (firstStr === "sleep") {
      setMainSmileImage(smileImage.sleep);
    }
    else {
      setMainSmileImage(smileImage.total);
    }
  }, [firstStr]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 페이지 변경시 초기화
  useEffect(() => {
    // 1. calendar
    if (firstStr === "calendar") {
      if (secondStr === "list" || secondStr === "save") {
        setSelectedTab("schedule");
      }
    }
    // 2. today
    else if (firstStr === "today") {
      if (secondStr === "chart") {
        setSelectedTab("analyze");
      }
      else if (secondStr === "diff") {
        setSelectedTab("diff");
      }
      else if (secondStr === "goal") {
        setSelectedTab("goal");
      }
      else if (secondStr === "list") {
        setSelectedTab("real");
      }
    }
    // 3. exercise, food, money, sleep
    else if (
      firstStr === "exercise" || firstStr === "food" ||
      firstStr === "money" || firstStr === "sleep"
    ) {
      if (secondStr === "chart") {
        setSelectedTab("analyze");
      }
      else if (secondStr === "diff") {
        setSelectedTab("diff");
      }
      else if (secondStr === "goal") {
        setSelectedTab("goal");
      }
      else if (secondStr === "list" || secondStr === "save") {
        setSelectedTab("real");
      }
    }
  }, [firstStr, secondStr, thirdStr]);

  // 4. smileNode ----------------------------------------------------------------------------------
  const smileNode = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"w-max65vw h-max65vh border radius shadow-none p-20"} key={`smile`}>
          <Grid container>
            <Grid item xs={12} className={"d-center"}>
              <Div className={"fs-1-2rem fw-500"}>
                {moment().format("YYYY-MM-DD (ddd)")}
              </Div>
            </Grid>
            <Hr40 />
            <Grid item xs={12} className={"d-center"}>
              <Div className={"d-center"}>
                <Img src={smileImage.total} className={"w-max25 h-max25"} />
              </Div>
              <Div className={"fs-1-1rem me-3vw"}>
                {translate("total")}
              </Div>
              <Div className={"fs-0-8rem"}>
                {smileScore.total}
              </Div>
            </Grid>
          </Grid>
          <Br20 />
          <Grid item xs={12} className={"d-center"}>
            <Div className={"d-center"}>
              <Img src={smileImage.exercise} className={"w-max25 h-max25"} />
            </Div>
            <Div className={"fs-1-1rem me-3vw"}>
              {translate("exercise")}
            </Div>
            <Div className={"fs-0-8rem"}>
              {smileScore.exercise}
            </Div>
          </Grid>
          <Br20 />
          <Grid item xs={12} className={"d-center"}>
            <Div className={"d-center"}>
              <Img src={smileImage.food} className={"w-max25 h-max25"} />
            </Div>
            <Div className={"fs-1-1rem me-3vw"}>
              {translate("food")}
            </Div>
            <Div className={"fs-0-8rem"}>
              {smileScore.food}
            </Div>
          </Grid>
          <Br20 />
          <Grid item xs={12} className={"d-center"}>
            <Div className={"d-center"}>
              <Img src={smileImage.money} className={"w-max25 h-max25"} />
            </Div>
            <Div className={"fs-1-1rem me-3vw"}>
              {translate("money")}
            </Div>
            <Div className={"fs-0-8rem"}>
              {smileScore.money}
            </Div>
          </Grid>
          <Br20 />
          <Grid item xs={12} className={"d-center"}>
            <Div className={"d-center"}>
              <Img src={smileImage.sleep} className={"w-max25 h-max25"} />
            </Div>
            <Div className={"fs-1-1rem me-3vw"}>
              {translate("sleep")}
            </Div>
            <Div className={"fs-0-8rem"}>
              {smileScore.sleep}
            </Div>
          </Grid>
          <Hr40 />
          <Grid item xs={12} className={"d-center"}>
            <Div className={"fs-0-8rem"}>
              {translate("score")}
            </Div>
          </Grid>
        </Card>
      )}>
      {(popTrigger={}) => (
        <Div className={"d-center pointer"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          <Img src={mainSmileImage} className={"w-max25 h-max25"} />
        </Div>
      )}
    </PopUp>
  );

  // 5. property -----------------------------------------------------------------------------------
  const propertyNode = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"w-max65vw h-max65vh border radius shadow-none p-20"} key={`smile`}>
          <Grid container>
            <Grid item xs={12} className={"d-center"}>
              <Div className={"fs-1-0rem fw-500 me-2vw"}>
                {dateStart}
              </Div>
              <Div className={"fs-0-7rem fw-500"}>
                ~
              </Div>
              <Div className={"fs-1-0rem fw-500 ms-2vw"}>
                {dateEnd}
              </Div>
            </Grid>
            <Hr40 />
            <Grid item xs={12} className={"d-center"}>
              <Div className={"d-center"}>
                <Img src={money2} className={"w-16 h-16"} />
                <Div className={"fs-1-4rem fw-600"}>
                  {numeral(totalProperty).format("0,0")}
                </Div>
              </Div>
            </Grid>
            <Hr40 />
            <Grid item xs={12} className={"d-center"}>
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
            </Grid>
            <Br20 />
            <Grid item xs={12} className={"d-center"}>
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
            </Grid>
            <Br20 />
            <Grid item xs={12} className={"d-center"}>
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
            </Grid>
          </Grid>
        </Card>
      )}>
      {(popTrigger={}) => (
        <Div className={"d-center pointer"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          <Img src={money4} className={"w-max25 h-max25"} />
        </Div>
      )}
    </PopUp>
  );

  // 6. tabs ---------------------------------------------------------------------------------------
  const tabsNode = () => (
    (firstStr === "today") ? (
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
          label={translate("analyze")}
          value={"analyze"}
          onClick={(e) => {
            setSelectedTab("analyze");
            navigate(`${firstStr}/chart/list`, {
              state: {
                dateType: "day",
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD"),
              },
            });
          }}
        />
        <Tab
          label={translate("diff")}
          value={"diff"}
          onClick={(e) => {
            setSelectedTab("diff");
            navigate(`${firstStr}/diff/list`, {
              state: {
                dateType: "day",
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD"),
              },
            });
          }}
        />
        <Tab
          label={translate("goal")}
          value={"goal"}
          onClick={(e) => {
            setSelectedTab("goal");
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
          label={translate("real")}
          value={"real"}
          onClick={(e) => {
            setSelectedTab("real");
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
    ) : (firstStr === "calendar") ? (
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
          label={translate("schedule")}
          value={"schedule"}
          onClick={(e) => {
            setSelectedTab("schedule");
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
    ) : (
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
          label={translate("analyze")}
          value={"analyze"}
          onClick={(e) => {
            setSelectedTab("analyze");
            navigate(`${firstStr}/chart/list`, {
              state: {
                dateType: "day",
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD"),
              },
            });
          }}
        />
        <Tab
          label={translate("diff")}
          value={"diff"}
          onClick={(e) => {
            setSelectedTab("diff");
            navigate(`${firstStr}/diff/list`, {
              state: {
                dateType: "day",
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD"),
              },
            });
          }}
        />
        <Tab
          label={translate("goal")}
          value={"goal"}
          onClick={(e) => {
            setSelectedTab("goal");
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
          label={translate("real")}
          value={"real"}
          onClick={(e) => {
            setSelectedTab("real");
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
    )
  );

  // 7. topNav -------------------------------------------------------------------------------------
  const topNavNode = () => (
    <Paper className={"flex-wrapper p-sticky top-8vh radius border shadow-none"}>
      <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
        <Grid container>
          <Grid item xs={2} className={"d-center"}>
            {smileNode()}
          </Grid>
          <Grid item xs={2} className={"d-center"}>
            {propertyNode()}
          </Grid>
          <Grid item xs={8} className={"d-center"}>
            {tabsNode()}
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