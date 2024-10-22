// BottomNav.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { Img } from "@imports/ImportComponents";
import { BottomNavigation, BottomNavigationAction, Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const BottomNav = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { TITLE, navigate, firstStr } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [selectedTab, setSelectedTab] = useStorageLocal(
    TITLE, "tabs", "bottom", {
      exercise: false,
      food: false,
      today: false,
      calendar: false,
      money: false,
      sleep: false,
    }
  );

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setSelectedTab((prev: any) => ({
      ...Object.keys(prev).reduce((acc: any, key: string) => {
        acc[key] = key === firstStr;
        return acc;
      }, {})
    }));
  }, [firstStr]);

  // 4. handle------------------------------------------------------------------------------------
  const handleClickBottomNav = (value: string) => {

    // value 만 true 로 설정하고 나머지 다 false 로 설정
    setSelectedTab((prev: any) => ({
      ...Object.keys(prev).reduce((acc: any, key: string) => {
        acc[key] = key === value;
        return acc;
      }, {})
    }));

    // top selected 값 가져오기
    const item = localStorage.getItem(TITLE);
    const tabsItem = item ? JSON.parse(item) : {};
    const selectedTop = tabsItem?.tabs?.top?.[value];

    let url = "";
    if (selectedTop === "real" || selectedTop === "schedule") {
      url = `/${value}/list`;
    }
    else {
      url = `/${value}/${selectedTop}/list`;
    }

    navigate(url, {
      state: {
        dateType: "",
        dateStart: getDayFmt(),
        dateEnd: getDayFmt(),
      }
    });
  };

  // 7. bottomNav ----------------------------------------------------------------------------------
  const bottomNavNode = () => {

    // 7-1. tabsSection
    const tabsSection = () => (
      <BottomNavigation
        showLabels={true}
        value={firstStr}
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

    // 7-2. return
    return (
      <Paper className={"layout-wrapper p-sticky bottom-0vh h-8vh border-1 radius-1 shadow-bottom-1"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
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