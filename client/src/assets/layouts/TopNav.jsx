// TopNav.jsx
// Node -> Section -> Fragment

import { React, useState, useEffect } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { moment, numeral } from "../../import/ImportLibs.jsx";
import {  Tabs, Tab, tabsClasses, Paper, Grid, Card } from "../../import/ImportMuis.jsx";
import { PopUp, Div, Img, Hr40, Br20, Br10, Input } from "../../import/ImportComponents.jsx";
import { smile1, smile2, smile3, smile4, smile5 } from "../../import/ImportImages.jsx";
import { money2, money4 } from "../../import/ImportImages.jsx";
import { exercise5, exercise6 } from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const TopNav = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location, translate, firstStr, secondStr, thirdStr, koreanDate } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [percent, setPercent] = useState({
    total : {},
    exercise : {},
    food : {},
    money : {},
    sleep : {},
  });
  const [smileScore, setSmileScore] = useState({
    total: "0",
    exercise: "0",
    food: "0",
    money: "0",
    sleep: "0",
  });
  const [smileImage, setSmileImage] = useState({
    total: smile3,
    exercise: smile3,
    food: smile3,
    money: smile3,
    sleep: smile3,
  });
  const [property, setProperty] = useState({
    dateStart: "",
    dateEnd: "",
    initProperty: "0",
    curProperty: "0",
    totalIncome: "0",
    totalExpense: "0",
  });
  const [scale, setScale] = useState({
    dateStart: "",
    dateEnd: "",
    initScale: "0",
    curScale: "0",
    minScale: "0",
    maxScale: "0",
  });
  const [mainSmileImage, setMainSmileImage] = useState(smile3);
  const [selectedTab, setSelectedTab] = useState("chart");

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 스마일 지수 계산
  useEffect(() => {
    if (!percent) {
      return;
    }

    const newSmileScore = {
      total: percent?.total?.average?.score || "0",
      exercise: percent?.exercise?.average?.score || "0",
      food: percent?.food?.average?.score || "0",
      money: percent?.money?.average?.score || "0",
      sleep: percent?.sleep?.average?.score || "0",
    };

    const getImage = (score) => {
      const parsScore = parseFloat(score);
      if (parsScore > 0 && parsScore <= 1) {
        return smile1;
      }
      else if (parsScore > 1 && parsScore <= 2) {
        return smile2;
      }
      else if (parsScore > 2 && parsScore <= 3) {
        return smile3;
      }
      else if (parsScore > 3 && parsScore <= 4) {
        return smile4;
      }
      else if (parsScore > 4 && parsScore <= 5) {
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

  }, [percent]);

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
  }, [location, selectedTab]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 퍼센트, 자산, 체중 설정
  useEffect(() => {
    const handleStorageChange = (e) => {
      const storedPercent = sessionStorage.getItem("PERCENT");
      const storedProperty = sessionStorage.getItem("PROPERTY");
      const storedScale = sessionStorage.getItem("SCALE");

      if (storedPercent) {
        setPercent(JSON.parse(storedPercent));
      }
      if (storedProperty) {
        setProperty(JSON.parse(storedProperty));
      }
      if (storedScale) {
        setScale(JSON.parse(storedScale));
      }
    };

    window.addEventListener('storageChange', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storageChange', handleStorageChange);
    };
  }, []);

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
        setSelectedTab("chart");
      }
      else if (secondStr === "goal") {
        setSelectedTab("goal");
      }
      else if (secondStr === "list" || secondStr === "save") {
        setSelectedTab("real");
      }
    }
    // 3. food
    else if (firstStr === "food") {
      if (secondStr === "chart") {
        setSelectedTab("chart");
      }
      else if (secondStr === "goal") {
        setSelectedTab("goal");
      }
      else if (secondStr === "list" || secondStr === "save") {
        setSelectedTab("real");
      }
      else if (secondStr === "find") {
        setSelectedTab("find");
      }
    }
    // 3. exercise, money, sleep
    else if (
      firstStr === "exercise" || firstStr === "money" || firstStr === "sleep"
    ) {
      if (secondStr === "chart") {
        setSelectedTab("chart");
      }
      else if (secondStr === "goal") {
        setSelectedTab("goal");
      }
      else if (secondStr === "list" || secondStr === "save") {
        setSelectedTab("real");
      }
    }
  }, [firstStr, secondStr, thirdStr]);

  // 4. handler ------------------------------------------------------------------------------------
  const handleClickTobNav = (value) => {
    setSelectedTab(value);

    // ex. selectedTab(food), selectedTab(exercise) 형식으로 저장
    sessionStorage.setItem(`TABS(${firstStr})`, JSON.stringify(value));

    let url = "";
    if (value === "real" || value === "schedule") {
      url = `${firstStr}/list`;
    }
    else if (value === "find") {
      url = `${firstStr}/find`;
    }
    else {
      url = `${firstStr}/${value}/list`;
    }

    navigate(url, {
      state: {
        dateType: "",
        dateStart: koreanDate,
        dateEnd: koreanDate
      }
    });
  };

  // 7. topNav -------------------------------------------------------------------------------------
  const topNavNode = () => {
    // 1. smile
    const smileSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}) => (
          <Card className={"w-max60vw h-max65vh border radius p-20"} key={`smile`}>
            <Grid container columnSpacing={1}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {moment().tz("Asia/Seoul").format("YYYY-MM-DD (ddd)")}
                </Div>
              </Grid>
              <Hr40 />
              <Grid size={12} className={"d-center"}>
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
            <Grid size={12} className={"d-center"}>
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
            <Grid size={12} className={"d-center"}>
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
            <Grid size={12} className={"d-center"}>
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
            <Grid size={12} className={"d-center"}>
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
            <Grid size={12} className={"d-center"}>
              <Div className={"fs-0-8rem"}>
                {translate("score")}
              </Div>
            </Grid>
          </Card>
        )}>
        {(popTrigger={}) => (
          <Div className={"d-center pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
            const event = new Event('storageChange');
            window.dispatchEvent(event);
          }}>
            <Img src={mainSmileImage} className={"w-max25 h-max25"} />
          </Div>
        )}
      </PopUp>
    );
    // 2. property
    const propertySection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}) => (
          <Card className={"w-max60vw h-max65vh border radius p-20"} key={`property`}>
            <Grid container columnSpacing={1}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-3rem fw-600"}>
                  {translate("property")}
                </Div>
              </Grid>
              <Br10 />
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-0-9rem fw-500 dark"}>
                  {`(${property?.dateStart} ~ ${property?.dateEnd})`}
                </Div>
              </Grid>
              <Hr40 />
              <Grid size={12} className={"d-center"}>
                <Div className={"d-center"}>
                  <Img src={money2} className={"w-16 h-16"} />
                  <Div className={"fs-1-4rem fw-600"}>
                    {numeral(property.curProperty).format("0,0")}
                  </Div>
                </Div>
              </Grid>
              <Hr40 />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("initProperty")}
                  value={numeral(property.initProperty).format("0,0")}
                  readOnly={true}
                  startAdornment={
                    <Img src={money2} className={"w-16 h-16"} />
                  }
                  endAdornment={
                    translate("currency")
                  }
                />
              </Grid>
              <Br20 />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("sumIncome")}
                  value={numeral(property.totalIncome).format("0,0")}
                  readOnly={true}
                  startAdornment={
                    <Img src={money2} className={"w-16 h-16"} />
                  }
                  endAdornment={
                    translate("currency")
                  }
                />
              </Grid>
              <Br20 />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("sumExpense")}
                  value={numeral(property.totalExpense).format("0,0")}
                  readOnly={true}
                  startAdornment={
                    <Img src={money2} className={"w-16 h-16"} />
                  }
                  endAdornment={
                    translate("currency")
                  }
                />
              </Grid>
            </Grid>
          </Card>
        )}>
        {(popTrigger={}) => (
          <Div className={"d-center pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
            const event = new Event('storageChange');
            window.dispatchEvent(event);
          }}>
            <Img src={money4} className={"w-max25 h-max25"} />
          </Div>
        )}
      </PopUp>
    );
    // 3. scale
    const scaleSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}) => (
          <Card className={"w-max60vw h-max65vh border radius p-20"} key={`scale`}>
            <Grid container columnSpacing={1}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-3rem fw-600"}>
                  {translate("weight")}
                </Div>
              </Grid>
              <Br10 />
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-0-9rem fw-500 dark"}>
                  {`(${scale?.dateStart} ~ ${scale?.dateEnd})`}
                </Div>
              </Grid>
              <Hr40 />
              <Grid size={12} className={"d-center"}>
                <Div className={"d-center"}>
                  <Img src={exercise5} className={"w-16 h-16"} />
                  <Div className={"fs-1-4rem fw-600"}>
                    {scale.curScale}
                  </Div>
                </Div>
              </Grid>
              <Hr40 />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("initScale")}
                  value={scale.initScale}
                  readOnly={true}
                  startAdornment={
                    <Img src={exercise5} className={"w-16 h-16"} />
                  }
                  endAdornment={
                    translate("k")
                  }
                />
              </Grid>
              <Br20 />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("minScale")}
                  value={scale.minScale}
                  readOnly={true}
                  startAdornment={
                    <Img src={exercise5} className={"w-16 h-16"} />
                  }
                  endAdornment={
                    translate("k")
                  }
                />
              </Grid>
              <Br20 />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("maxScale")}
                  value={scale.maxScale}
                  readOnly={true}
                  startAdornment={
                    <Img src={exercise5} className={"w-16 h-16"} />
                  }
                  endAdornment={
                    translate("k")
                  }
                />
              </Grid>
            </Grid>
          </Card>
        )}>
        {(popTrigger={}) => (
          <Div className={"d-center pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
            const event = new Event('storageChange');
            window.dispatchEvent(event);
          }}>
            <Img src={exercise6} className={"w-max25 h-max25"} />
          </Div>
        )}
      </PopUp>
    );
    // 4. tabs
    const tabsSection = () => (
      (firstStr === "calendar") ? (
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
            onClick={() => handleClickTobNav("schedule")}
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
            label={translate("chart")}
            value={"chart"}
            onClick={() => handleClickTobNav("chart")}
          />
          <Tab
            label={translate("goal")}
            value={"goal"}
            onClick={() => handleClickTobNav("goal")}
          />
          <Tab
            label={translate("real")}
            value={"real"}
            onClick={() => handleClickTobNav("real")}
          />
          {firstStr === "food" && (
            <Tab
              label={translate("find")}
              value={"find"}
              onClick={() => handleClickTobNav("find")}
            />
          )}
        </Tabs>
      )
    );
    // 5. return
    return (
      <Paper className={"layout-wrapper p-sticky top-9vh h-9vh radius border"}>
        <Grid container columnSpacing={1}>
          <Grid size={4} className={"d-center"}>
            {smileSection()}
            {propertySection()}
            {scaleSection()}
          </Grid>
          <Grid size={8} className={"d-center"}>
            {tabsSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {topNavNode()}
    </>
  );
};