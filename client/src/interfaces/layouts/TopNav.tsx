// TopNav.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage } from "@importStores";
import { insertComma } from "@importScripts";
import { PopUp, Input } from "@importContainers";
import { Div, Img, Hr, Br, Paper, Grid } from "@importComponents";
import { Tabs, Tab, Checkbox, MenuItem, Menu } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const TopNav = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { firstStr, secondStr, localCurrency, localUnit, navigate } = useCommonValue();
  const { sessionTitle, sessionPercent } = useCommonValue();
  const { sessionScale, sessionNutrition, sessionProperty } = useCommonValue();
  const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();

	// 2-1. useStorageLocal -----------------------------------------------------------------------
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
  const [selectedAnchorEl, setSelectedAnchorEl] = useState<Record<string, HTMLElement | null>>({});

	// 2-2. useState -------------------------------------------------------------------------------
  const [mainSmileImage, setMainSmileImage] = useState("smile3");
  const [includingExclusions, setIncludingExclusions] = useState<boolean>(false);
  const [nutritionType, setNutritionType] = useState("avg");

	// 2-2. useState -------------------------------------------------------------------------------
  const [percent, setPercent] = useState({
    total: { average: { score: "0" } },
    exercise: { average: { score: "0" } },
    food: { average: { score: "0" } },
    money: { average: { score: "0" } },
    sleep: { average: { score: "0" } },
  });
  const [smileScore, setSmileScore] = useState({
    total: "0",
    exercise: "0",
    food: "0",
    money: "0",
    sleep: "0",
  });
  const [smileImage, setSmileImage] = useState({
    total: "smile3",
    exercise: "smile3",
    food: "smile3",
    money: "smile3",
    sleep: "smile3",
  });
  const [scale, setScale] = useState({
    initScale: "0",
    minScale: "0",
    maxScale: "0",
    curScale: "0",
    dateStart: "",
    dateEnd: "",
  });
  const [nutrition, setNutrition] = useState({
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
  const [property, setProperty] = useState({
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
  const [dataArray, setDataArray] = useState({
    calendar: ["schedule"],
    today: ["goal", "real"],
    food: ["chart", "goal", "real", "find", "favorite"],
    exercise: ["chart", "goal", "real"],
    money: ["chart", "goal", "real"],
    sleep: ["chart", "goal", "real"],
    admin: ["dashboard"]
  });

	// 2-3. useEffect -----------------------------------------------------------------------------
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

	// 2-3. useEffect -----------------------------------------------------------------------------
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

	// 2-3. useEffect -----------------------------------------------------------------------------
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

	// 2-3. useEffect -----------------------------------------------------------------------------
  // 페이지 변경시 초기화
  useEffect(() => {
    // 1. calendar
    if (firstStr === "calendar") {
      if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab((prev) => ({
          ...prev,
          calendar: "schedule",
        }));
      }
    }
    // 2. today
    else if (firstStr === "today") {
      if (secondStr === "goal") {
        setSelectedTab((prev) => ({
          ...prev,
          today: "goal",
        }));
      }
      else if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab((prev) => ({
          ...prev,
          today: "real",
        }));
      }
    }
    // 3. food
    else if (firstStr === "food") {
      if (secondStr === "chart") {
        setSelectedTab((prev) => ({
          ...prev,
          food: "chart",
        }));
      }
      else if (secondStr === "goal") {
        setSelectedTab((prev) => ({
          ...prev,
          food: "goal",
        }));
      }
      else if (secondStr === "find") {
        setSelectedTab((prev) => ({
          ...prev,
          food: "find",
        }));
      }
      else if (secondStr === "favorite") {
        setSelectedTab((prev) => ({
          ...prev,
          food: "favorite",
        }));
      }
      else if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab((prev) => ({
          ...prev,
          food: "real",
        }));
      }
    }
    // 4. exercise, money, sleep
    else if (firstStr === "exercise" || firstStr === "money" || firstStr === "sleep") {
      if (secondStr === "chart") {
        setSelectedTab((prev) => ({
          ...prev,
          [firstStr]: "chart",
        }));
      }
      else if (secondStr === "goal") {
        setSelectedTab((prev) => ({
          ...prev,
          [firstStr]: "goal",
        }));
      }
      else if (secondStr === "list" || secondStr === "detail") {
        setSelectedTab((prev) => ({
          ...prev,
          [firstStr]: "real",
        }));
      }
    }
    // 5. admin
    else if (firstStr === "admin") {
      if (secondStr === "dashboard") {
        setSelectedTab((prev) => ({
          ...prev,
          admin: "dashboard",
        }));
      }
    }
  }, [firstStr, secondStr]);

	// 4. handle ----------------------------------------------------------------------------------
  const handleClickTobNav = (value: string) => {
    if (value === "find" || value === "favorite") {
      navigate(`/${firstStr}/${value}/list`, {
        state: {
          dateType: "",
          dateStart: "",
          dateEnd: "",
        }
      });
    }
    else if (value === "real" || value === "schedule") {
      navigate(`/${firstStr}/list`, {
        state: {
          dateType: "",
          dateStart: getDayFmt(),
          dateEnd: getDayFmt(),
        }
      });
    }
    else if (value === "dashboard") {
      navigate(`/${firstStr}/dashboard`, {
        state: {
          dateType: "",
          dateStart: getDayFmt(),
          dateEnd: getDayFmt(),
        }
      });
    }
    else {
      navigate(`/${firstStr}/${value}/list`, {
        state: {
          dateType: "",
          dateStart: getDayFmt(),
          dateEnd: getDayFmt(),
        }
      });
    }
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
          <Div className={"w-70vw h-max-70vh border-1 radius-2 shadow-0 px-10px py-20px"}>
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-col-center"}>
                <Div className={"fs-1-0rem fw-600"}>
                  {translate("monthScore")}
                </Div>
                <Br m={10} />
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`[${getMonthStartFmt()} - ${getMonthEndFmt()}]`}
                </Div>
              </Grid>
            </Grid>
            <Hr m={30} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={6} className={"d-row-center"}>
                <Img
                  max={30}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={`${smileImage.total}.webp`}
                  className={"mr-5px"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-1-3rem fw-500 dark"}>
                  {`${translate("total")} : `}
                </Div>
              </Grid>
              <Grid size={6} className={"d-row-left"}>
                <Div className={"fs-1-2rem fw-600 black"}>
                  {smileScore.total}
                </Div>
              </Grid>
            </Grid>
            <Hr m={30} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={6} className={"d-row-center"}>
                <Img
                  max={25}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={`${smileImage.exercise}.webp`}
                  className={"mr-5px"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-1-1rem fw-500 dark"}>
                  {`${translate("exercise")} : `}
                </Div>
              </Grid>
              <Grid size={6} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-600 black"}>
                  {smileScore.exercise}
                </Div>
              </Grid>
            </Grid>
            <Br m={10} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={6} className={"d-row-center"}>
                <Img
                  max={25}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={`${smileImage.food}.webp`}
                  className={"mr-5px"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-1-1rem fw-500 dark"}>
                  {`${translate("food")} : `}
                </Div>
              </Grid>
              <Grid size={6} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-600 black"}>
                  {smileScore.food}
                </Div>
              </Grid>
            </Grid>
            <Br m={10} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={6} className={"d-row-center"}>
                <Img
                  max={25}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={`${smileImage.money}.webp`}
                  className={"mr-5px"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-1-1rem fw-500 dark"}>
                  {`${translate("money")} : `}
                </Div>
              </Grid>
              <Grid size={6} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-600 black"}>
                  {smileScore.money}
                </Div>
              </Grid>
            </Grid>
            <Br m={10} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={6} className={"d-row-center"}>
                <Img
                  max={25}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={`${smileImage.sleep}.webp`}
                  className={"mr-5px"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-1-1rem fw-500 dark"}>
                  {`${translate("sleep")} : `}
                </Div>
              </Grid>
              <Grid size={6} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-600 black"}>
                  {smileScore.sleep}
                </Div>
              </Grid>
            </Grid>
            <Hr m={30} />
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-0-8rem"}>
                  {translate("score")}
                </Div>
              </Grid>
            </Grid>
          </Div>
        }
        children={(popTrigger: any) => (
          <Div className={"mx-auto d-center"}>
            <Img
              max={27}
              hover={true}
              shadow={false}
              radius={false}
              src={`${mainSmileImage}.webp`}
              onClick={(e: any) => {
                setPercent(sessionPercent);
                popTrigger.openPopup(e.currentTarget)
              }}
            />
          </Div>
        )}
      />
    );

    // 2. scale ------------------------------------------------------------------------------------
    const scaleSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Div className={"w-max-70vw h-max-70vh border-1 radius-2 shadow-0 px-10px py-20px"}>
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-col-center"}>
                <Div className={"fs-1-3rem fw-600"}>
                  {`${translate("scale")}`}
                </Div>
                <Br m={10} />
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`[${scale?.dateStart} - ${scale?.dateEnd}]`}
                </Div>
              </Grid>
            </Grid>
            <Hr m={30} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={3} className={"d-row-center"}>
                <Img
                  max={14}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"exercise5.webp"}
                  className={"mr-5px"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`${translate("initValue")} : `}
                </Div>
              </Grid>
              <Grid size={7} className={"d-row-right"}>
                <Div className={"fs-1-1rem fw-600 black mr-5px"}>
                  {insertComma(scale.initScale || "0")}
                </Div>
              </Grid>
              <Grid size={2} className={"d-row-center"}>
                <Div className={"fs-0-6rem fw-500 dark"}>
                  {localUnit}
                </Div>
              </Grid>
            </Grid>
            <Br m={10} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={3} className={"d-row-center"}>
                <Img
                  max={14}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"exercise5.webp"}
                  className={"mr-5px"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`${translate("curValue")} : `}
                </Div>
              </Grid>
              <Grid size={7} className={"d-row-right"}>
                <Div className={"fs-1-1rem fw-600 black mr-5px"}>
                  {insertComma(scale.curScale || "0")}
                </Div>
              </Grid>
              <Grid size={2} className={"d-row-center"}>
                <Div className={"fs-0-6rem fw-500 dark"}>
                  {localUnit}
                </Div>
              </Grid>
            </Grid>
            <Hr m={30} />
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-center"}>
                <Input
                  readOnly={true}
                  label={translate("minScale")}
                  value={insertComma(scale.minScale || "0")}
                  startadornment={
                    <Img
                      max={14}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"exercise5.webp"}
                    />
                  }
                  endadornment={
                    localUnit
                  }
                />
              </Grid>
            </Grid>
            <Br m={20} />
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-center"}>
                <Input
                  readOnly={true}
                  label={translate("maxScale")}
                  value={insertComma(scale.maxScale || "0")}
                  startadornment={
                    <Img
                      max={14}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"exercise5.webp"}
                    />
                  }
                  endadornment={
                    localUnit
                  }
                />
              </Grid>
            </Grid>
          </Div>
        }
        children={(popTrigger: any) => (
          <Div className={"mr-auto d-center"}>
            <Img
              max={27}
              hover={true}
              shadow={false}
              radius={false}
              src={"exercise6.webp"}
              onClick={(e: any) => {
                setScale(sessionScale);
                popTrigger.openPopup(e.currentTarget)
              }}
            />
          </Div>
        )}
      />
    );

    // 3. nutrition --------------------------------------------------------------------------------
    const nutritionSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Div className={"w-max-70vw h-max-70vh border-1 radius-2 shadow-0 px-10px py-20px"}>
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-col-center"}>
                <Div className={"fs-1-3rem fw-600"}>
                  {`${translate("intakeNutrition")}`}
                </Div>
                <Br m={10} />
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`[${nutrition?.dateStart} - ${nutrition?.dateEnd}]`}
                </Div>
                <Br m={10} />
                <Div className={"d-row-center"}>
                  <Div className={"fs-0-7rem fw-500 dark"}>
                    {translate("avgValue")}
                  </Div>
                  <Checkbox
                    size={"small"}
                    checked={nutritionType === "avg"}
                    onChange={(e: any) => {
                      setNutritionType(e.target.checked ? "avg" : "total");
                    }}
                  />
                  <Div className={"fs-0-7rem fw-500 dark ml-10px"}>
                    {translate("totalValue")}
                  </Div>
                  <Checkbox
                    size={"small"}
                    checked={nutritionType === "total"}
                    onChange={(e: any) => {
                      setNutritionType(e.target.checked ? "total" : "avg");
                    }}
                  />
                </Div>
              </Grid>
            </Grid>
            <Hr m={30} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={3} className={"d-row-center"}>
                <Img
                  max={14}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"food2.webp"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`${translate("initAvg")} : `}
                </Div>
              </Grid>
              <Grid size={7} className={"d-row-right"}>
                <Div className={"fs-1-1rem fw-600 black mr-5px"}>
                  {insertComma(nutrition.initAvgKcalIntake || "0")}
                </Div>
              </Grid>
              <Grid size={2} className={"d-row-center"}>
                <Div className={"fs-0-6rem fw-500 dark"}>
                  {translate("kc")}
                </Div>
              </Grid>
            </Grid>
            <Br m={10} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={3} className={"d-row-center"}>
                <Img
                  max={14}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"food2.webp"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {nutritionType === "avg" ? (
                    (`${translate("curAvg")} : `)
                  ) : (
                    (`${translate("curTotal")} : `)
                  )}
                </Div>
              </Grid>
              <Grid size={7} className={"d-row-right"}>
                <Div className={"fs-1-1rem fw-600 black mr-5px"}>
                  {nutritionType === "avg" ? (
                    insertComma(nutrition.curAvgKcalIntake || "0")
                  ) : (
                    insertComma(nutrition.totalKcalIntake || "0")
                  )}
                </Div>
              </Grid>
              <Grid size={2} className={"d-row-center"}>
                <Div className={"fs-0-6rem fw-500 dark"}>
                  {translate("kc")}
                </Div>
              </Grid>
            </Grid>
            <Hr m={30} />
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-row-center"}>
                <Input
                  readOnly={true}
                  label={
                    nutritionType === "avg" ? (
                      translate("avgCarbIntake")
                    ) : (
                      translate("totalCarbIntake")
                    )
                  }
                  value={
                    nutritionType === "avg" ? (
                      insertComma(nutrition.curAvgCarbIntake || "0")
                    ) : (
                      insertComma(nutrition.totalCarbIntake || "0")
                    )
                  }
                  startadornment={
                    <Img
                      max={14}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"food3.webp"}
                    />
                  }
                  endadornment={
                    translate("g")
                  }
                />
              </Grid>
            </Grid>
            <Br m={20} />
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-row-center"}>
                <Input
                  readOnly={true}
                  label={
                    nutritionType === "avg" ? (
                      translate("avgProteinIntake")
                    ) : (
                      translate("totalProteinIntake")
                    )
                  }
                  value={
                    nutritionType === "avg" ? (
                      insertComma(nutrition.curAvgProteinIntake || "0")
                    ) : (
                      insertComma(nutrition.totalProteinIntake || "0")
                    )
                  }
                  startadornment={
                    <Img
                      max={14}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"food4.webp"}
                    />
                  }
                  endadornment={
                    translate("g")
                  }
                />
              </Grid>
            </Grid>
            <Br m={20} />
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-row-center"}>
                <Input
                  readOnly={true}
                  label={
                    nutritionType === "avg" ? (
                      translate("avgFatIntake")
                    ) : (
                      translate("totalFatIntake")
                    )
                  }
                  value={
                    nutritionType === "avg" ? (
                      insertComma(nutrition.curAvgFatIntake || "0")
                    ) : (
                      insertComma(nutrition.totalFatIntake || "0")
                    )
                  }
                  startadornment={
                    <Img
                      max={14}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"food5.webp"}
                    />
                  }
                  endadornment={
                    translate("g")
                  }
                />
              </Grid>
            </Grid>
          </Div>
        }
        children={(popTrigger: any) => (
          <Div className={"mr-auto d-center"}>
            <Img
              max={27}
              hover={true}
              shadow={false}
              radius={false}
              src={"food6.webp"}
              onClick={(e: any) => {
                setNutrition(sessionNutrition);
                popTrigger.openPopup(e.currentTarget)
              }}
            />
          </Div>
        )}
      />
    );

    // 4. property ---------------------------------------------------------------------------------
    const propertySection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Div className={"w-max-70vw h-max-70vh border-1 radius-2 shadow-0 px-10px py-20px"}>
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-col-center"}>
                <Div className={"fs-1-3rem fw-600"}>
                  {`${translate("property")}`}
                </Div>
                <Br m={10} />
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`[${property?.dateStart} - ${property?.dateEnd}]`}
                </Div>
                <Br m={10} />
                <Div className={"d-row-center"}>
                  <Div className={"fs-0-7rem fw-500 dark"}>
                    {translate("includingExclusions")}
                  </Div>
                  <Checkbox
                    size={"small"}
                    checked={includingExclusions}
                    onChange={(e: any) => {
                      setIncludingExclusions(e.target.checked);
                    }}
                  />
                </Div>
              </Grid>
            </Grid>
            <Hr m={30} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={3} className={"d-row-center"}>
                <Img
                  max={14}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"money2.webp"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`${translate("initValue")} : `}
                </Div>
              </Grid>
              <Grid size={7} className={"d-row-right"}>
                <Div className={"fs-1-1rem fw-600 black mr-5px"}>
                  {insertComma(property.initProperty || "0")}
                </Div>
              </Grid>
              <Grid size={2} className={"d-row-center"}>
                <Div className={"fs-0-6rem fw-500 dark"}>
                  {localCurrency}
                </Div>
              </Grid>
            </Grid>
            <Br m={10} />
            <Grid container={true} spacing={0} columns={20}>
              <Grid size={3} className={"d-row-center"}>
                <Img
                  max={14}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"money2.webp"}
                />
              </Grid>
              <Grid size={8} className={"d-row-left"}>
                <Div className={"fs-0-8rem fw-500 dark"}>
                  {`${translate("curValue")} : `}
                </Div>
              </Grid>
              <Grid size={7} className={"d-row-right"}>
                <Div className={"fs-1-1rem fw-600 black mr-5px"}>
                  {includingExclusions ? (
                    insertComma(property.curPropertyAll || "0")
                  ) : (
                    insertComma(property.curPropertyExclusion || "0")
                  )}
                </Div>
              </Grid>
              <Grid size={2} className={"d-row-center"}>
                <Div className={"fs-0-6rem fw-500 dark"}>
                  {localCurrency}
                </Div>
              </Grid>
            </Grid>
            <Hr m={30} />
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-row-center"}>
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
                      max={14}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"money2.webp"}
                    />
                  }
                  endadornment={
                    localCurrency
                  }
                />
              </Grid>
            </Grid>
            <Br m={20} />
            <Grid container={true} spacing={0}>
              <Grid size={12} className={"d-row-center"}>
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
                      max={14}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"money2.webp"}
                    />
                  }
                  endadornment={
                    localCurrency
                  }
                />
              </Grid>
            </Grid>
          </Div>
        }
        children={(popTrigger: any) => (
          <Div className={"mr-auto d-center"}>
            <Img
              max={27}
              hover={true}
              shadow={false}
              radius={false}
              src={"money4.webp"}
              onClick={(e: any) => {
                setProperty(sessionProperty);
                popTrigger.openPopup(e.currentTarget)
              }}
            />
          </Div>
        )}
      />
    );

    // TODO: 탭 드롭다운으로 변경
    // 5. tabs -------------------------------------------------------------------------------------
    const tabsSection = () => {
      return (
        <>
          <Tabs
            value={selectedTab[firstStr as keyof typeof selectedTab]}
            variant={"fullWidth"}
            component={"div"}
            scrollButtons={false}
            allowScrollButtonsMobile={false}
            selectionFollowsFocus={true}
            sx={{
              [`& .MuiTabs-indicator`]: {
                "display": "none",
              }
            }}
          >
            <Tab
              label={translate(selectedTab[firstStr as keyof typeof selectedTab])}
              value={selectedTab[firstStr as keyof typeof selectedTab]}
              onClick={(e) => {
                setSelectedAnchorEl((prev) => ({
                  ...prev,
                  [firstStr]: e.currentTarget
                }))
              }}
              className={"fs-1-2rem fw-700"}
            />
          </Tabs>
          <Menu
            anchorEl={selectedAnchorEl[firstStr]}
            open={Boolean(selectedAnchorEl[firstStr])}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            slotProps={{
              paper: {
                className: "py-0px px-10px",
              }
            }}
            onClose={() => {
              setSelectedAnchorEl((prev) => ({
                ...prev,
                [firstStr]: null
              }))
            }}
          >
            {dataArray?.[firstStr as keyof typeof dataArray]?.map((tabName: string) => (
              <MenuItem
                key={tabName}
                selected={selectedTab[firstStr as keyof typeof selectedTab] === tabName}
                className={"text-center"}
                onClick={() => {
                  handleClickTobNav(tabName);
                  setSelectedAnchorEl((prev) => ({
                    ...prev,
                    [firstStr]: null
                  }));
                }}
              >
                {translate(tabName)}
              </MenuItem>
            ))}
          </Menu>
        </>
      );
    };

    // 5. return -----------------------------------------------------------------------------------
    return (
      <Paper className={"layout-wrapper p-sticky top-8vh h-8vh radius-2 border-1 shadow-1 p-0px"}>
        <Grid container spacing={0}>
          <Grid size={8} className={"d-row-center"}>
            {smileSection()}
            {scaleSection()}
            {nutritionSection()}
            {propertySection()}
          </Grid>
          <Grid size={4} className={"d-row-center border-left-2"}>
            {tabsSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {topNavNode()}
    </>
  );
};