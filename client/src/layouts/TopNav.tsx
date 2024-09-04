// TopNav.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";
import { moment, numeral } from "@imports/ImportLibs";
import { Tabs, Tab, Paper, Grid, Card } from "@imports/ImportMuis";
import { Div, Img, Hr, Input } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { smile1, smile2, smile3, smile4, smile5 } from "@imports/ImportImages";
import { money2, money4 } from "@imports/ImportImages";
import { exercise5, exercise6 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const TopNav = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, location, translate, firstStr, secondStr, koreanDate, TITLE,
    sessionPercent, sessionProperty, sessionScale, PATH,
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [percent, setPercent] = useState<any>({
    total: {},
    exercise : {},
    food : {},
    money : {},
    sleep : {},
  });
  const [smileScore, setSmileScore] = useState<any>({
    total: "0",
    exercise: "0",
    food: "0",
    money: "0",
    sleep: "0",
  });
  const [smileImage, setSmileImage] = useState<any>({
    total: smile3,
    exercise: smile3,
    food: smile3,
    money: smile3,
    sleep: smile3,
  });
  const [property, setProperty] = useState<any>({
    dateStart: "",
    dateEnd: "",
    initProperty: "0",
    curProperty: "0",
    totalIncome: "0",
    totalExpense: "0",
  });
  const [scale, setScale] = useState<any>({
    dateStart: "",
    dateEnd: "",
    initScale: "0",
    curScale: "0",
    minScale: "0",
    maxScale: "0",
  });
  const [mainSmileImage, setMainSmileImage] = useState<any>(smile3);
  const [selectedTab, setSelectedTab] = useState<string>("chart");

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 스마일 지수 계산
  useEffect(() => {
    if (!percent) {
      return;
    }

    const newSmileScore: any = {
      total: percent?.total?.average?.score || "0",
      exercise: percent?.exercise?.average?.score || "0",
      food: percent?.food?.average?.score || "0",
      money: percent?.money?.average?.score || "0",
      sleep: percent?.sleep?.average?.score || "0",
    };

    const getImage = (score: string) => {
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
  }, [sessionPercent, sessionProperty, sessionScale, PATH, selectedTab]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 퍼센트, 자산, 체중 설정
  useEffect(() => {
    const handleStorageChange = () => {
      if (sessionPercent) {
        setPercent(JSON.parse(sessionPercent));
      }
      if (sessionProperty) {
        setProperty(JSON.parse(sessionProperty));
      }
      if (sessionScale) {
        setScale(JSON.parse(sessionScale));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [sessionPercent, sessionProperty, sessionScale]);

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
    else if (firstStr === "exercise" || firstStr === "money" || firstStr === "sleep") {
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
  }, [PATH]);

  // 4. handler ------------------------------------------------------------------------------------
  const handleClickTobNav = (value: string) => {
    setSelectedTab(value);

    // ex. title_tabs_calendar
    sessionStorage.setItem(`${TITLE}_tabs_(${firstStr})`, JSON.stringify(value));

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
        contents={({closePopup}: any) => (
          <Card className={"w-max60vw h-max65vh border radius p-20"} key={`smile`}>
            <Grid container spacing={2}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {moment().tz("Asia/Seoul").format("YYYY-MM-DD (ddd)")}
                </Div>
              </Grid>
              <Hr px={20} />
              <Grid size={12} className={"d-center"}>
                <Div className={"d-center me-2vw"}>
                  <Img src={smileImage.total} className={"w-max25 h-max25"} />
                </Div>
                <Div className={"fs-1-1rem me-2vw"}>
                  {translate("total")}
                </Div>
                <Div className={"fs-0-8rem"}>
                  {smileScore.total}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Div className={"d-center me-2vw"}>
                  <Img src={smileImage.exercise} className={"w-max25 h-max25"} />
                </Div>
                <Div className={"fs-1-1rem me-2vw"}>
                  {translate("exercise")}
                </Div>
                <Div className={"fs-0-8rem"}>
                  {smileScore.exercise}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Div className={"d-center me-2vw"}>
                  <Img src={smileImage.food} className={"w-max25 h-max25"} />
                </Div>
                <Div className={"fs-1-1rem me-2vw"}>
                  {translate("food")}
                </Div>
                <Div className={"fs-0-8rem"}>
                  {smileScore.food}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Div className={"d-center me-2vw"}>
                  <Img src={smileImage.money} className={"w-max25 h-max25"} />
                </Div>
                <Div className={"fs-1-1rem me-2vw"}>
                  {translate("money")}
                </Div>
                <Div className={"fs-0-8rem"}>
                  {smileScore.money}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Div className={"d-center me-2vw"}>
                  <Img src={smileImage.sleep} className={"w-max25 h-max25"} />
                </Div>
                <Div className={"fs-1-1rem me-2vw"}>
                  {translate("sleep")}
                </Div>
                <Div className={"fs-0-8rem"}>
                  {smileScore.sleep}
                </Div>
              </Grid>
              <Hr px={20} />
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-0-8rem"}>
                  {translate("score")}
                </Div>
              </Grid>
            </Grid>
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Div className={"d-center pointer"} onClick={(e: any) => {
            popTrigger.openPopup(e.currentTarget)
            const event = new Event('storage');
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
        contents={({closePopup}: any) => (
          <Card className={"w-max60vw h-max65vh border radius p-20"} key={`property`}>
            <Grid container spacing={2}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-3rem fw-600"}>
                  {translate("property")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-0-9rem fw-500 dark"}>
                  {`(${property?.dateStart} ~ ${property?.dateEnd})`}
                </Div>
              </Grid>
              <Hr px={20} />
              <Grid size={12} className={"d-center"}>
                <Img src={money2} className={"w-16 h-16"} />
                <Div className={"fs-1-4rem fw-600 ms-2vw"}>
                  {numeral(property.curProperty).format("0,0")}
                </Div>
              </Grid>
              <Hr px={20} />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("initProperty")}
                  value={numeral(property.initProperty).format("0,0")}
                  readOnly={true}
                  startadornment={
                    <Img src={money2} className={"w-16 h-16"} />
                  }
                  endadornment={
                    translate("currency")
                  }
                />
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("sumIncome")}
                  value={numeral(property.totalIncome).format("0,0")}
                  readOnly={true}
                  startadornment={
                    <Img src={money2} className={"w-16 h-16"} />
                  }
                  endadornment={
                    translate("currency")
                  }
                />
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("sumExpense")}
                  value={numeral(property.totalExpense).format("0,0")}
                  readOnly={true}
                  startadornment={
                    <Img src={money2} className={"w-16 h-16"} />
                  }
                  endadornment={
                    translate("currency")
                  }
                />
              </Grid>
            </Grid>
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Div className={"d-center pointer"} onClick={(e: any) => {
            popTrigger.openPopup(e.currentTarget)
            const event = new Event('storage');
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
        contents={({closePopup}: any) => (
          <Card className={"w-max60vw h-max65vh border radius p-20"} key={`scale`}>
            <Grid container spacing={2}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-3rem fw-600"}>
                  {translate("weight")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-0-9rem fw-500 dark"}>
                  {`(${scale?.dateStart} ~ ${scale?.dateEnd})`}
                </Div>
              </Grid>
              <Hr px={20} />
              <Grid size={12} className={"d-center"}>
                <Img src={exercise5} className={"w-16 h-16"} />
                <Div className={"fs-1-4rem fw-600 ms-2vw"}>
                  {scale.curScale}
                </Div>
              </Grid>
              <Hr px={20} />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("initScale")}
                  value={scale.initScale}
                  readOnly={true}
                  startadornment={
                    <Img src={exercise5} className={"w-16 h-16"} />
                  }
                  endadornment={
                    translate("k")
                  }
                />
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("minScale")}
                  value={scale.minScale}
                  readOnly={true}
                  startadornment={
                    <Img src={exercise5} className={"w-16 h-16"} />
                  }
                  endadornment={
                    translate("k")
                  }
                />
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("maxScale")}
                  value={scale.maxScale}
                  readOnly={true}
                  startadornment={
                    <Img src={exercise5} className={"w-16 h-16"} />
                  }
                  endadornment={
                    translate("k")
                  }
                />
              </Grid>
            </Grid>
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Div className={"d-center pointer"} onClick={(e: any) => {
            popTrigger.openPopup(e.currentTarget)
            const event = new Event('storage');
            window.dispatchEvent(event);
          }}>
            <Img src={exercise6} className={"w-max25 h-max25"} />
          </Div>
        )}
      </PopUp>
    );
    // 4. tabs
    const tabsSection = () => (
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
          className={firstStr !== "calendar" ? "" : "d-none"}
          onClick={() => handleClickTobNav("chart")}
        />
        <Tab
          label={translate("goal")}
          value={"goal"}
          className={firstStr !== "calendar" ? "" : "d-none"}
          onClick={() => handleClickTobNav("goal")}
        />
        <Tab
          label={translate("real")}
          value={"real"}
          className={firstStr !== "calendar" ? "" : "d-none"}
          onClick={() => handleClickTobNav("real")}
        />
        <Tab
          label={translate("schedule")}
          value={"schedule"}
          className={firstStr === "calendar" ? "" : "d-none"}
          onClick={() => handleClickTobNav("schedule")}
        />
        <Tab
          label={translate("find")}
          value={"find"}
          className={firstStr === "food" ? "" : "d-none"}
          onClick={() => handleClickTobNav("find")}
        />
      </Tabs>
    );
    // 5. return
    return (
      <Paper className={"layout-wrapper p-sticky top-8vh h-8vh radius border"}>
        <Grid container spacing={2} columns={25}>
          <Grid size={3}>
            {smileSection()}
          </Grid>
          <Grid size={3}>
            {propertySection()}
          </Grid>
          <Grid size={3}>
            {scaleSection()}
          </Grid>
          <Grid size={16} className={"d-center"}>
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