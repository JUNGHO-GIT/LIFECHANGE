// BottomNav.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { Img } from "@imports/ImportComponents";
import { BottomNavigation, BottomNavigationAction } from "@imports/ImportMuis";
import { Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const BottomNav = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    navigate, firstStr, TITLE,
  } = useCommonValue();
  const {
    dayFmt
  } = useCommonDate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [selectedTab, setSelectedTab] = useState<string>("today");

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
  const handleClickBottomNav = (value: string) => {
    setSelectedTab(value);

    // ex. TITLE_tabs_(food), TITLE_tabs_(exercise) ..
    let sessionStorageData = null;
    const pattern = new RegExp(`^${TITLE}_tabs_\\(${value}\\)$`);

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
        url = `${value}/find/list`;
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
        dateStart: dayFmt,
        dateEnd: dayFmt,
      }
    });
  };

  // 7. bottomNav ----------------------------------------------------------------------------------
  const bottomNavNode = () => {

    // 1. tabsSection
    const tabsSection = () => (
      <BottomNavigation
        showLabels={true}
        value={selectedTab}
        className={"w-100p"}
      >
        <BottomNavigationAction
          label={translate("exercise")}
          value={"exercise"}
          icon={
            <Img
              key={"exercise1"}
              src={"exercise1"}
              className={"w-16 h-16 m-0"}
            />
          }
          onClick={() => {
            handleClickBottomNav("exercise");
          }}
        />
        <BottomNavigationAction
          label={translate("food")}
          value={"food"}
          icon={
            <Img
              key={"food1"}
              src={"food1"}
              className={"w-16 h-16 m-0"}
            />
          }
          onClick={() => {
            handleClickBottomNav("food");
          }}
        />
        <BottomNavigationAction
          label={translate("today")}
          value={"today"}
          icon={
            <Img
              key={"today1"}
              src={"today1"}
              className={"w-16 h-16 m-0"}
            />
          }
          onClick={() => {
            handleClickBottomNav("today");
          }}
        />
        <BottomNavigationAction
          label={translate("calendar")}
          value={"calendar"}
          icon={
            <Img
              key={"calendar1"}
              src={"calendar1"}
              className={"w-16 h-16 m-0"}
            />
          }
          onClick={() => {
            handleClickBottomNav("calendar");
          }}
        />
        <BottomNavigationAction
          label={translate("money")}
          value={"money"}
          icon={
            <Img
              key={"money1"}
              src={"money1"}
              className={"w-16 h-16 m-0"}
            />
          }
          onClick={() => {
            handleClickBottomNav("money");
          }}
        />
        <BottomNavigationAction
          label={translate("sleep")}
          value={"sleep"}
          icon={
            <Img
              key={"sleep1"}
              src={"sleep1"}
              className={"w-16 h-16 m-0"}
            />
          }
          onClick={() => {
            handleClickBottomNav("sleep");
          }}
        />
      </BottomNavigation>
    );

    // 2. return
    return (
      <Paper className={"layout-wrapper p-sticky bottom-0 h-8vh radius border"}>
        <Grid container spacing={2}>
          <Grid size={12} className={"d-center"}>
            {tabsSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {bottomNavNode()}
    </>
  );
};