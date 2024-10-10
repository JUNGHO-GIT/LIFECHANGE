// TopNav.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { numeral } from "@imports/ImportUtils";
import { PopUp, Input } from "@imports/ImportContainers";
import { Div, Img, Hr, Br } from "@imports/ImportComponents";
import { Tabs, Tab, Paper, Grid, Card, Checkbox } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const TopNav = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, TITLE, firstStr, secondStr, localCurrency } = useCommonValue();
  const { navigate, sessionPercent, sessionProperty, sessionScale } = useCommonValue();
  const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

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
    total: "smile3",
    exercise: "smile3",
    food: "smile3",
    money: "smile3",
    sleep: "smile3",
  });
  const [property, setProperty] = useState<any>({
    totalIncomeAll: "0",
    totalExpenseAll: "0",
    totalIncome: "0",
    totalExpense: "0",
    initProperty: "0",
    curPropertyAll: "0",
    curProperty: "0",
    dateStart: "",
    dateEnd: "",
  });
  const [scale, setScale] = useState<any>({
    minScale: "0",
    maxScale: "0",
    initScale: "0",
    curScale: "0",
    dateStart: "",
    dateEnd: "",
  });
  const [includingExclusions, setIncludingExclusions] = useState<boolean>(false);
  const [mainSmileImage, setMainSmileImage] = useState<any>("smile3");
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
        return "smile1";
      }
      else if (parsScore > 1 && parsScore <= 2) {
        return "smile2";
      }
      else if (parsScore > 2 && parsScore <= 3) {
        return "smile3";
      }
      else if (parsScore > 3 && parsScore <= 4) {
        return "smile4";
      }
      else if (parsScore > 4 && parsScore <= 5) {
        return "smile5";
      }
      else {
        return "smile3";
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
      if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab("schedule");
      }
    }
    // 2. today
    else if (firstStr === "today") {
      if (secondStr === "goal") {
        setSelectedTab("goal");
      }
      else if (secondStr === "list" || secondStr === "detail") {
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
      else if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab("real");
      }
      else if (secondStr === "find" || secondStr === "favorite") {
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
      else if (secondStr === "list" || secondStr === "detail") {
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
      url = `/${firstStr}/list`;
    }
    else if (value === "find") {
      url = `/${firstStr}/find/list`;
    }
    else {
      url = `/${firstStr}/${value}/list`;
    }

    navigate(url, {
      state: {
        dateType: "",
        dateStart: getDayFmt(),
        dateEnd: getDayFmt(),
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
        contents={
          <Card className={"w-max60vw h-max70vh border-1 radius-1 p-20"}>
            <Grid container spacing={1} columns={12}>
              <Grid size={12} className={"d-column-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("monthScore")}
                </Div>
                <Br px={10} />
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`(${getMonthStartFmt()} ~ ${getMonthEndFmt()})`}
                </Div>
              </Grid>
              <Hr px={10} />
              <Grid size={4} className={"d-row-right"}>
                <Img
                  key={smileImage.total}
                  src={smileImage.total}
                  className={"w-max30 h-max30"}
                />
              </Grid>
              <Grid size={4} className={"d-row-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("total")}
                </Div>
              </Grid>
              <Grid size={4} className={"d-row-left"}>
                <Div className={"fs-1-0rem fw-600"}>
                  {smileScore.total}
                </Div>
              </Grid>
              <Hr px={10} />
              <Grid size={4} className={"d-row-right"}>
                <Img
                  key={smileImage.exercise}
                  src={smileImage.exercise}
                  className={"w-max25 h-max25"}
                />
              </Grid>
              <Grid size={4} className={"d-row-center"}>
                <Div className={"fs-1-1rem"}>
                  {translate("exercise")}
                </Div>
              </Grid>
              <Grid size={4} className={"d-row-left"}>
                <Div className={"fs-0-8rem"}>
                  {smileScore.exercise}
                </Div>
              </Grid>
              <Br px={1} />
              <Grid size={4} className={"d-row-right"}>
                <Img
                  key={smileImage.food}
                  src={smileImage.food}
                  className={"w-max25 h-max25"}
                />
              </Grid>
              <Grid size={4} className={"d-row-center"}>
                <Div className={"fs-1-1rem"}>
                  {translate("food")}
                </Div>
              </Grid>
              <Grid size={4} className={"d-row-left"}>
                <Div className={"fs-0-8rem"}>
                  {smileScore.food}
                </Div>
              </Grid>
              <Br px={1} />
              <Grid size={4} className={"d-row-right"}>
                <Img
                  key={smileImage.money}
                  src={smileImage.money}
                  className={"w-max25 h-max25"}
                />
              </Grid>
              <Grid size={4} className={"d-row-center"}>
                <Div className={"fs-1-1rem"}>
                  {translate("money")}
                </Div>
              </Grid>
              <Grid size={4} className={"d-row-left"}>
                <Div className={"fs-0-8rem"}>
                  {smileScore.money}
                </Div>
              </Grid>
              <Br px={1} />
              <Grid size={4} className={"d-row-right"}>
                <Img
                  key={smileImage.sleep}
                  src={smileImage.sleep}
                  className={"w-max25 h-max25"}
                />
              </Grid>
              <Grid size={4} className={"d-row-center"}>
                <Div className={"fs-1-1rem"}>
                  {translate("sleep")}
                </Div>
              </Grid>
              <Grid size={4} className={"d-row-left"}>
                <Div className={"fs-0-8rem"}>
                  {smileScore.sleep}
                </Div>
              </Grid>
              <Hr px={10} />
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-0-8rem"}>
                  {translate("score")}
                </Div>
              </Grid>
            </Grid>
          </Card>
        }
      >
        {(popTrigger: any) => (
          <Div className={"d-center pointer"} onClick={(e: any) => {
            popTrigger.openPopup(e.currentTarget)
            const event = new Event('storage');
            window.dispatchEvent(event);
          }}>
            <Img
              key={mainSmileImage}
            	src={mainSmileImage}
            	className={"w-max25 h-max25"}
            />
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
        contents={
          <Card className={"w-max60vw h-max70vh border-1 radius-1 p-20"}>
            <Grid container spacing={1} columns={12}>
              <Grid size={12} className={"d-column-center"}>
                <Div className={"fs-1-3rem fw-600"}>
                  {translate("property")}
                </Div>
                <Br px={10} />
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`(${property?.dateStart} ~ ${property?.dateEnd})`}
                </Div>
                <Br px={10} />
                <Div className={"fs-0-7rem fw-500 dark ms-10"}>
                  {translate("includingExclusions")}
                <Checkbox
                  size={"small"}
                  className={"p-0 ms-5"}
                  checked={includingExclusions}
                  onChange={(e: any) => {
                    setIncludingExclusions(e.target.checked);
                  }}
                />
                </Div>
              </Grid>
              <Hr px={10} />
              <Grid size={12} className={"d-row-center"}>
                <Img
                  key={"money2"}
                  src={"money2"}
                	className={"w-16 h-16"}
                />
                <Div className={"fs-1-4rem fw-600 ms-2vw me-2vw"}>
                  {includingExclusions ? (
                    numeral(property.curPropertyAll).format("0,0")
                  ) : (
                    numeral(property.curProperty).format("0,0")
                  )}
                </Div>
                <Div className={"fs-0-6rem fw-500 dark"}>
                  {localCurrency}
                </Div>
              </Grid>
              <Hr px={10} />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("initProperty")}
                  value={numeral(property.initProperty).format("0,0")}
                  readOnly={true}
                  startadornment={
                    <Img
                      key={"money2"}
                      src={"money2"}
                    	className={"w-16 h-16"}
                    />
                  }
                  endadornment={
                    localCurrency
                  }
                />
              </Grid>
              <Br px={1} />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("sumIncome")}
                  readOnly={true}
                  value={
                    includingExclusions ? (
                      numeral(property.totalIncomeAll).format("0,0")
                    ) : (
                      numeral(property.totalIncome).format("0,0")
                    )
                  }
                  startadornment={
                    <Img
                      key={"money2"}
                      src={"money2"}
                    	className={"w-16 h-16"}
                    />
                  }
                  endadornment={
                    localCurrency
                  }
                />
              </Grid>
              <Br px={1} />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("sumExpense")}
                  readOnly={true}
                  value={
                    includingExclusions ? (
                      numeral(property.totalExpenseAll).format("0,0")
                    ) : (
                      numeral(property.totalExpense).format("0,0")
                    )
                  }
                  startadornment={
                    <Img
                      key={"money2"}
                      src={"money2"}
                    	className={"w-16 h-16"}
                    />
                  }
                  endadornment={
                    localCurrency
                  }
                />
              </Grid>
            </Grid>
          </Card>
        }
      >
        {(popTrigger: any) => (
          <Div className={"d-center pointer"} onClick={(e: any) => {
            popTrigger.openPopup(e.currentTarget)
            const event = new Event('storage');
            window.dispatchEvent(event);
          }}>
            <Img
              key={"money4"}
            	src={"money4"}
            	className={"w-max25 h-max25"}
            />
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
        contents={
          <Card className={"w-max60vw h-max70vh border-1 radius-1 p-20"}>
            <Grid container spacing={1} columns={12}>
              <Grid size={12} className={"d-column-center"}>
                <Div className={"fs-1-3rem fw-600"}>
                  {translate("weight")}
                </Div>
                <Br px={10} />
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`(${scale?.dateStart} ~ ${scale?.dateEnd})`}
                </Div>
              </Grid>
              <Hr px={10} />
              <Grid size={12} className={"d-row-center"}>
                <Img
                  key={"exercise5"}
                  src={"exercise5"}
                	className={"w-16 h-16"}
                />
                <Div className={"fs-1-4rem fw-600 ms-2vw me-2vw"}>
                  {scale.curScale}
                </Div>
                <Div className={"fs-0-6rem fw-500 dark"}>
                  {translate("k")}
                </Div>
              </Grid>
              <Hr px={10} />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("initScale")}
                  value={scale.initScale}
                  readOnly={true}
                  startadornment={
                    <Img
                      key={"exercise5"}
                      src={"exercise5"}
                    	className={"w-16 h-16"}
                    />
                  }
                  endadornment={
                    translate("k")
                  }
                />
              </Grid>
              <Br px={1} />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("minScale")}
                  value={scale.minScale}
                  readOnly={true}
                  startadornment={
                    <Img
                      key={"exercise5"}
                      src={"exercise5"}
                    	className={"w-16 h-16"}
                    />
                  }
                  endadornment={
                    translate("k")
                  }
                />
              </Grid>
              <Br px={1} />
              <Grid size={12} className={"d-center"}>
                <Input
                  label={translate("maxScale")}
                  value={scale.maxScale}
                  readOnly={true}
                  startadornment={
                    <Img
                      key={"exercise5"}
                      src={"exercise5"}
                    	className={"w-16 h-16"}
                    />
                  }
                  endadornment={
                    translate("k")
                  }
                />
              </Grid>
            </Grid>
          </Card>
        }
      >
        {(popTrigger: any) => (
          <Div className={"d-center pointer"} onClick={(e: any) => {
            popTrigger.openPopup(e.currentTarget)
            const event = new Event('storage');
            window.dispatchEvent(event);
          }}>
            <Img
              key={"exercise6"}
            	src={"exercise6"}
            	className={"w-max25 h-max25"}
            />
          </Div>
        )}
      </PopUp>
    );
    // 4. tabs
    const tabsSection = () => (
      <Tabs
        value={selectedTab || false}
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
          className={(firstStr === "calendar" || firstStr === "today") ? "d-none" : ""}
          onClick={() => handleClickTobNav("chart")}
        />
        <Tab
          label={translate("goal")}
          value={"goal"}
          className={firstStr === "calendar" ? "d-none" : ""}
          onClick={() => handleClickTobNav("goal")}
        />
        <Tab
          label={translate("real")}
          value={"real"}
          className={firstStr === "calendar" ? "d-none" : ""}
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
      <Paper className={"layout-wrapper p-sticky top-8vh h-8vh border-1 radius-1 shadow-1"}>
        <Grid container spacing={1} columns={25}>
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