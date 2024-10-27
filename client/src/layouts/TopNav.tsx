// TopNav.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { insertComma } from "@imports/ImportUtils";
import { PopUp, Input } from "@imports/ImportContainers";
import { Div, Img, Hr, Br } from "@imports/ImportComponents";
import { Tabs, Tab, Paper, Grid, Checkbox } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const TopNav = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { firstStr, secondStr, localCurrency, localUnit, navigate } = useCommonValue();
  const { sessionTitle, sessionPercent } = useCommonValue();
  const { sessionScale, sessionNutrition, sessionProperty } = useCommonValue();
  const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [selectedTab, setSelectedTab] = useStorageLocal(
    "tabs", "top", "", {
      exercise: "real",
      food: "real",
      today: "real",
      calendar: "schedule",
      money: "real",
      sleep: "real",
      admin: "dashboard",
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [includingExclusions, setIncludingExclusions] = useState<boolean>(false);
  const [mainSmileImage, setMainSmileImage] = useState<any>("smile3");
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
  const [scale, setScale] = useState<any>({
    initScale: "0",
    minScale: "0",
    maxScale: "0",
    curScale: "0",
    dateStart: "",
    dateEnd: "",
  });
  const [nutrition, setNutrition] = useState<any>({
    initAvgKcalIntake: "0",
    totalKcalIntake: "0",
    totalCarbIntake: "0",
    totalProteinIntake: "0",
    totalFatIntake: "0",
    curAvgKcalIntake: "0",
    curAvgCarbIntake: "0",
    curAvgProteinIntake: "0",
    curAvgFatIntake: "0",
    dateStart: "",
    dateEnd: "",
  });
  const [property, setProperty] = useState<any>({
    initProperty: "0",
    totalIncomeAll: "0",
    totalIncomeExclusion: "0",
    totalExpenseAll: "0",
    totalExpenseExclusion: "0",
    curPropertyAll: "0",
    curPropertyExclusion: "0",
    dateStart: "",
    dateEnd: "",
  });

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
  }, [firstStr, smileImage]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 퍼센트, 자산, 체중 설정
  useEffect(() => {
    if (sessionTitle?.setting?.sync) {
      const { percent, property, nutrition, scale } = sessionTitle.setting.sync;

      // 상태가 실제로 변경될 때만 업데이트
      setPercent((prev: any) => {
        if (JSON.stringify(prev) !== JSON.stringify(percent)) {
          return percent;
        }
        return prev;
      });
      setProperty((prev: any) => {
        if (JSON.stringify(prev) !== JSON.stringify(property)) {
          return property;
        }
        return prev;
      });
      setNutrition((prev: any) => {
        if (JSON.stringify(prev) !== JSON.stringify(nutrition)) {
          return nutrition;
        }
        return prev;
      });
      setScale((prev: any) => {
        if (JSON.stringify(prev) !== JSON.stringify(scale)) {
          return scale;
        }
        return prev;
      });
    }
  }, [sessionTitle]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 페이지 변경시 초기화
  useEffect(() => {
    // 1. calendar
    if (firstStr === "calendar") {
      if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab((prev: any) => ({
          ...prev,
          calendar: "schedule",
        }));
      }
    }
    // 2. today
    else if (firstStr === "today") {
      if (secondStr === "goal") {
        setSelectedTab((prev: any) => ({
          ...prev,
          today: "goal",
        }));
      }
      else if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab((prev: any) => ({
          ...prev,
          today: "real",
        }));
      }
    }
    // 3. food
    else if (firstStr === "food") {
      if (secondStr === "chart") {
        setSelectedTab((prev: any) => ({
          ...prev,
          food: "chart",
        }));
      }
      else if (secondStr === "goal") {
        setSelectedTab((prev: any) => ({
          ...prev,
          food: "goal",
        }));
      }
      else if (secondStr === "find") {
        setSelectedTab((prev: any) => ({
          ...prev,
          food: "find",
        }));
      }
      else if (secondStr === "favorite") {
        setSelectedTab((prev: any) => ({
          ...prev,
          food: "favorite",
        }));
      }
      else if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab((prev: any) => ({
          ...prev,
          food: "real",
        }));
      }
    }
    // 4. exercise, money, sleep
    else if (firstStr === "exercise" || firstStr === "money" || firstStr === "sleep") {
      if (secondStr === "chart") {
        setSelectedTab((prev: any) => ({
          ...prev,
          [firstStr]: "chart",
        }));
      }
      else if (secondStr === "goal") {
        setSelectedTab((prev: any) => ({
          ...prev,
          [firstStr]: "goal",
        }));
      }
      else if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab((prev: any) => ({
          ...prev,
          [firstStr]: "real",
        }));
      }
    }
    // 5. admin
    else if (firstStr === "admin") {
      if (secondStr === "dashboard") {
        setSelectedTab((prev: any) => ({
          ...prev,
          admin: "dashboard",
        }));
      }
    }
  }, [firstStr, secondStr]);

  // 4. handle------------------------------------------------------------------------------------
  const handleClickTobNav = (value: string) => {
    setSelectedTab((prev: any) => ({
      ...prev,
      [firstStr]: value,
    }));

    let url = "";
    if (value === "real" || value === "schedule") {
      url = `/${firstStr}/list`;
    }
    else if (value === "dashboard") {
      url = `/${firstStr}/dashboard`;
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

    // 1. smile ------------------------------------------------------------------------------------
    const smileSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container spacing={2} columns={12}
          className={"w-max60vw h-max70vh border-1 radius-1 p-20"}>
            <Grid size={12} className={"d-col-center"}>
              <Div className={"fs-1-0rem fw-600"}>
                {translate("monthScore")}
              </Div>
              <Br px={10} />
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${getMonthStartFmt()} - ${getMonthEndFmt()}]`}
              </Div>
            </Grid>
            <Hr px={1} />
            <Grid size={4} className={"d-row-right"}>
              <Img
                max={30}
                hover={true}
                shadow={false}
                radius={false}
                src={smileImage.total}
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
            <Hr px={1} />
            <Grid size={4} className={"d-row-right"}>
              <Img
                max={30}
                hover={true}
                shadow={false}
                radius={false}
                src={smileImage.exercise}
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
            <Grid size={4} className={"d-row-right"}>
              <Img
                max={30}
                hover={true}
                shadow={false}
                radius={false}
                src={smileImage.food}
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
            <Grid size={4} className={"d-row-right"}>
              <Img
                max={30}
                hover={true}
                shadow={false}
                radius={false}
                src={smileImage.money}
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
            <Grid size={4} className={"d-row-right"}>
              <Img
                max={30}
                hover={true}
                shadow={false}
                radius={false}
                src={smileImage.sleep}
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
            <Hr px={1} />
            <Grid size={12} className={"d-center"}>
              <Div className={"fs-0-8rem"}>
                {translate("score")}
              </Div>
            </Grid>
          </Grid>
        }
      >
        {(popTrigger: any) => (
          <Img
            max={25}
            hover={true}
            shadow={false}
            radius={false}
            src={mainSmileImage}
            onClick={(e: any) => {
              setPercent(sessionPercent);
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 2. scale ------------------------------------------------------------------------------------
    const scaleSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container spacing={2} columns={12} className={"w-max60vw h-max70vh border-1 radius-1 p-20"}>
            <Grid size={12} className={"d-col-center"}>
              <Div className={"fs-1-3rem fw-600"}>
                {`${translate("cur")} ${translate("scale")}`}
              </Div>
              <Br px={10} />
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${scale?.dateStart} - ${scale?.dateEnd}]`}
              </Div>
            </Grid>
            <Hr px={1} />
            <Grid size={12} className={"d-row-center"}>
              <Img
                max={15}
                hover={true}
                shadow={false}
                radius={false}
                src={"exercise5"}
              />
              <Div className={"fs-1-4rem fw-600 ms-2vw me-2vw"}>
                {insertComma(scale.curScale || "0")}
              </Div>
              <Div className={"fs-0-6rem fw-500 dark"}>
                {localUnit}
              </Div>
            </Grid>
            <Hr px={1} />
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("initScale")}
                value={insertComma(scale.initScale || "0")}
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"exercise5"}
                  />
                }
                endadornment={
                  localUnit
                }
              />
            </Grid>
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("minScale")}
                value={insertComma(scale.minScale || "0")}
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"exercise5"}
                  />
                }
                endadornment={
                  localUnit
                }
              />
            </Grid>
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("maxScale")}
                value={insertComma(scale.maxScale || "0")}
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"exercise5"}
                  />
                }
                endadornment={
                  localUnit
                }
              />
            </Grid>
          </Grid>
        }
      >
        {(popTrigger: any) => (
          <Img
            max={25}
            hover={true}
            shadow={false}
            radius={false}
            src={"exercise6"}
            onClick={(e: any) => {
              setScale(sessionScale);
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 3. nutrition --------------------------------------------------------------------------------
    const nutritionSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container spacing={2} columns={12}
          className={"w-max60vw h-max70vh border-1 radius-1 p-20"}>
            <Grid size={12} className={"d-col-center"}>
              <Div className={"fs-1-3rem fw-600"}>
                {`${translate("avgKcalIntake")}`}
              </Div>
              <Br px={10} />
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${nutrition?.dateStart} - ${nutrition?.dateEnd}]`}
              </Div>
            </Grid>
            <Hr px={1} />
            <Grid size={12} className={"d-row-center"}>
              <Img
                max={15}
                hover={true}
                shadow={false}
                radius={false}
                src={"food2"}
              />
              <Div className={"fs-1-4rem fw-600 ms-2vw me-2vw"}>
                {insertComma(nutrition.curAvgKcalIntake || "0")}
              </Div>
              <Div className={"fs-0-6rem fw-500 dark"}>
                {translate("kc")}
              </Div>
            </Grid>
            <Hr px={1} />
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("initAvgKcalIntake")}
                value={insertComma(nutrition.initAvgKcalIntake || "0")}
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"food2"}
                  />
                }
                endadornment={
                  translate("kc")
                }
              />
            </Grid>
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("totalCarbIntake")}
                value={insertComma(nutrition.totalCarbIntake || "0")}
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"food3"}
                  />
                }
                endadornment={
                  translate("g")
                }
              />
            </Grid>
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("totalProteinIntake")}
                value={insertComma(nutrition.totalProteinIntake || "0")}
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"food4"}
                  />
                }
                endadornment={
                  translate("g")
                }
              />
            </Grid>
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("totalFatIntake")}
                value={insertComma(nutrition.totalFatIntake || "0")}
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"food5"}
                  />
                }
                endadornment={
                  translate("g")
                }
              />
            </Grid>
          </Grid>
        }
      >
        {(popTrigger: any) => (
          <Img
            max={25}
            hover={true}
            shadow={false}
            radius={false}
            src={"food6"}
            onClick={(e: any) => {
              setNutrition(sessionNutrition);
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 4. property ---------------------------------------------------------------------------------
    const propertySection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container spacing={2} columns={12}
          className={"w-max60vw h-max70vh border-1 radius-1 p-20"}>
            <Grid size={12} className={"d-col-center"}>
              <Div className={"fs-1-3rem fw-600"}>
                {`${translate("cur")} ${translate("property")}`}
              </Div>
              <Br px={10} />
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${property?.dateStart} - ${property?.dateEnd}]`}
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
            <Hr px={1} />
            <Grid size={12} className={"d-row-center"}>
              <Img
                max={15}
                hover={true}
                shadow={false}
                radius={false}
                src={"money2"}
              />
              <Div className={"fs-1-4rem fw-600 ms-2vw me-2vw"}>
                {includingExclusions ? (
                  insertComma(property.curPropertyAll || "0")
                ) : (
                  insertComma(property.curPropertyExclusion || "0")
                )}
              </Div>
              <Div className={"fs-0-6rem fw-500 dark"}>
                {localCurrency}
              </Div>
            </Grid>
            <Hr px={1} />
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("initProperty")}
                value={insertComma(property.initProperty || "0")}
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"money2"}
                  />
                }
                endadornment={
                  localCurrency
                }
              />
            </Grid>
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("sumIncome")}
                value={
                  includingExclusions ? (
                    insertComma(property.totalIncomeAll || "0")
                  ) : (
                    insertComma(property.totalIncomeExclusion || "0")
                  )
                }
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"money2"}
                  />
                }
                endadornment={
                  localCurrency
                }
              />
            </Grid>
            <Grid size={12} className={"d-center"}>
              <Input
                readOnly={true}
                label={translate("sumExpense")}
                value={
                  includingExclusions ? (
                    insertComma(property.totalExpenseAll || "0")
                  ) : (
                    insertComma(property.totalExpenseExclusion || "0")
                  )
                }
                startadornment={
                  <Img
                    max={15}
                    hover={true}
                    shadow={false}
                    radius={false}
                    src={"money2"}
                  />
                }
                endadornment={
                  localCurrency
                }
              />
            </Grid>
          </Grid>
        }
      >
        {(popTrigger: any) => (
          <Img
            max={25}
            hover={true}
            shadow={false}
            radius={false}
            src={"money4"}
            onClick={(e: any) => {
              setProperty(sessionProperty);
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 5. tabs -------------------------------------------------------------------------------------
    const tabsSection = () => (

      // 1. calendar
      firstStr === "calendar" ? (
        <Tabs
          value={selectedTab[firstStr]}
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
            label={translate("schedule")}
            value={"schedule"}
            onClick={() => {
              handleClickTobNav("schedule");
            }}
          />
        </Tabs>
      )

      // 2. today
      : firstStr === "today" ? (
        <Tabs
          value={selectedTab[firstStr]}
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
            label={translate("goal")}
            value={"goal"}
            onClick={() => {
              handleClickTobNav("goal");
            }}
          />
          <Tab
            label={translate("real")}
            value={"real"}
            onClick={() => {
              handleClickTobNav("real");
            }}
          />
        </Tabs>
      )

      // 3. food
      : firstStr === "food" ? (
        <Tabs
          value={selectedTab[firstStr]}
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
            onClick={() => {
              handleClickTobNav("chart");
            }}
          />
          <Tab
            label={translate("goal")}
            value={"goal"}
            onClick={() => {
              handleClickTobNav("goal");
            }}
          />
          <Tab
            label={translate("real")}
            value={"real"}
            onClick={() => {
              handleClickTobNav("real");
            }}
          />
          <Tab
            label={translate("find")}
            value={"find"}
            onClick={() => {
              handleClickTobNav("find");
            }}
          />
          <Tab
            label={translate("favorite")}
            value={"favorite"}
            onClick={() => {
              handleClickTobNav("favorite");
            }}
          />
        </Tabs>
      )

      // 4. exercise, money, sleep
      : firstStr === "exercise" || firstStr === "money" || firstStr === "sleep" ? (
        <Tabs
          value={selectedTab[firstStr]}
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
            onClick={() => {
              handleClickTobNav("chart");
            }}
          />
          <Tab
            label={translate("goal")}
            value={"goal"}
            onClick={() => {
              handleClickTobNav("goal");
            }}
          />
          <Tab
            label={translate("real")}
            value={"real"}
            onClick={() => {
              handleClickTobNav("real");
            }}
          />
        </Tabs>
      )

      // 5. admin
      : firstStr === "admin" ? (
        <Tabs
          value={selectedTab[firstStr]}
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
            label={translate("dashboard")}
            value={"dashboard"}
            onClick={() => {
              handleClickTobNav("dashboard");
            }}
          />
        </Tabs>
      ) : null
    );
    // 5. return -----------------------------------------------------------------------------------
    return (
      <Paper className={"layout-wrapper p-sticky top-8vh h-8vh border-1 radius-1 shadow-bottom-3"}>
        <Grid container spacing={2} columns={29}>
          <Grid size={3} className={"d-center ms-5"}>
            {smileSection()}
          </Grid>
          <Grid size={3} className={"d-center"}>
            {scaleSection()}
          </Grid>
          <Grid size={3} className={"d-center"}>
            {nutritionSection()}
          </Grid>
          <Grid size={3} className={"d-center"}>
            {propertySection()}
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