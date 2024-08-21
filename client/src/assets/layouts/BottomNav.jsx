// BottomNav.jsx

import { React, useState, useEffect } from "../../import/ImportReacts.jsx";
import { useCommon } from "../../import/ImportHooks.jsx";
import { Img } from "../../import/ImportComponents.jsx";
import { BottomNavigation, BottomNavigationAction, Paper, Card } from "../../import/ImportMuis.jsx";
import { calendar1, today1, exercise1, food1, money1, sleep1 } from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const BottomNav = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, translate, firstStr, koreanDate,
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [selectedTab, setSelectedTab] = useState("today");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (firstStr === "calendar") {
      setSelectedTab("calendar");
    }
    else if (firstStr === "today") {
      setSelectedTab("today");
    }
    else if (firstStr === "exercise") {
      setSelectedTab("exercise");
    }
    else if (firstStr === "food") {
      setSelectedTab("food");
    }
    else if (firstStr === "money") {
      setSelectedTab("money");
    }
    else if (firstStr === "sleep") {
      setSelectedTab("sleep");
    }
  }, [firstStr]);

  // 4. handler ------------------------------------------------------------------------------------
  const handleClickBottomNav = (value) => {
    setSelectedTab(value);

    // ex. TABS(food), TABS(exercise) ...
    let sessionStorageData = null;
    const pattern = new RegExp(`^TABS\\(${value}\\)$`);

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i) || "";

      // 값이 있는 경우
      if (pattern.test(key)) {
        sessionStorageData = sessionStorage.getItem(key);
        // 큰따옴표 제거
        if (sessionStorageData) {
          sessionStorageData = sessionStorageData.replace(/"/g, "");
        }
        break;
      }

      // 값이 없는 경우
      else {
        sessionStorageData = "";
      }
    }

    let url = "";
    if (sessionStorageData) {
      if (sessionStorageData === "real" || sessionStorageData === "schedule") {
        url = `${value}/list`;
      }
      else if (sessionStorageData === "find") {
        url = `${value}/find`;
      }
      else {
        url = `${value}/${sessionStorageData}/list`;
      }
    }
    else {
      url = `${value}/list`;
    }

    navigate(url, {
      state: {
        dateType: "",
        dateStart: koreanDate,
        dateEnd: koreanDate
      }
    });
  };

  // 6. default ------------------------------------------------------------------------------------
  const defaultNode = () => (
    <BottomNavigation
      showLabels={true}
      value={selectedTab}
    >
      <BottomNavigationAction
        label={translate("exercise")}
        value={"exercise"}
        icon={<Img src={exercise1} className={"w-16 h-16 m-0"} />}
        onClick={() => handleClickBottomNav("exercise")}
      />
      <BottomNavigationAction
        label={translate("food")}
        value={"food"}
        icon={<Img src={food1} className={"w-16 h-16 m-0"} />}
        onClick={() => handleClickBottomNav("food")}
      />
      <BottomNavigationAction
        label={translate("today")}
        value={"today"}
        icon={<Img src={today1} className={"w-16 h-16 m-0"} />}
        onClick={() => handleClickBottomNav("today")}
      />
      <BottomNavigationAction
        label={translate("calendar")}
        value={"calendar"}
        icon={<Img src={calendar1} className={"w-16 h-16 m-0"} />}
        onClick={() => handleClickBottomNav("calendar")}
      />
      <BottomNavigationAction
        label={translate("money")}
        value={"money"}
        icon={<Img src={money1} className={"w-16 h-16 m-0"} />}
        onClick={() => handleClickBottomNav("money")}
      />
      <BottomNavigationAction
        label={translate("sleep")}
        value={"sleep"}
        icon={<Img src={sleep1} className={"w-16 h-16 m-0"} />}
        onClick={() => handleClickBottomNav("sleep")}
      />
    </BottomNavigation>
  );

  // 7. navigation ---------------------------------------------------------------------------------
  const navigationNode = () => (
    <Paper className={"flex-wrapper p-sticky bottom-60 radius border shadow-none"}>
      <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
        {defaultNode()}
      </Card>
    </Paper>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {navigationNode()}
    </>
  );
};