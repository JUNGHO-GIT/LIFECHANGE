// BottomNav.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { getLocal } from "@imports/ImportUtils";
import { Img } from "@imports/ImportComponents";
import { BottomNavigation, BottomNavigationAction, Paper, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const BottomNav = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, firstStr } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
 const [selectedTab, setSelectedTab] = useStorageLocal(
    "tabs", "bottom", "", {
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
    const getItem = getLocal("tabs", "top", "");
    const selectedTop = getItem[value];

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
        value={Object.keys(selectedTab).find((key: string) => selectedTab[key])}
        className={"w-100p"}
      >
        <BottomNavigationAction
          label={translate("exercise")}
          value={"exercise"}
          icon={
            <Img
              max={15}
              hover={true}
              shadow={false}
              radius={false}
              src={"exercise1"}
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
              max={15}
              hover={true}
              shadow={false}
              radius={false}
              src={"food1"}
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
              max={15}
              hover={true}
              shadow={false}
              radius={false}
              src={"today1"}
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
              max={15}
              hover={true}
              shadow={false}
              radius={false}
              src={"calendar1"}
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
              max={15}
              hover={true}
              shadow={false}
              radius={false}
              src={"money1"}
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
              max={15}
              hover={true}
              shadow={false}
              radius={false}
              src={"sleep1"}
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
        <Grid container={true} spacing={0}>
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