// BottomNav.tsx

import { memo, useEffect } from "@importReacts";
import { useCommonDate, useCommonValue, useStorageLocal } from "@importHooks";
import { fnGetLocal } from "@importScripts";
import { useStoreLanguage } from "@importStores";
import { Img, Paper } from "@importComponents";
import { BottomNavigation, BottomNavigationAction } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const BottomNav = memo(() => {

	// 1. common ----------------------------------------------------------------------------------
  const { navigate, firstStr } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useStoreLanguage();

	// 2-1. useStorageLocal -----------------------------------------------------------------------
 const [selectedTab, setSelectedTab] = useStorageLocal(
    "tabs", "bottom", "", {
      exercise: false,
      food: false,
      schedule: false,
      money: false,
      sleep: false,
    }
  );

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    setSelectedTab((prev: any) => {
      const updatedTabs = Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === firstStr;
        return acc;
      }, {} as any);
      return updatedTabs;
    });
  }, [firstStr]);

	// 4. handle ----------------------------------------------------------------------------------
  const handleClickBottomNav = (value: string) => {

    // top selected 값 가져오기
    const getItem = fnGetLocal("tabs", "top", "");
    const selectedTop = getItem[value];

    let url = "";
    if (value === "schedule") {
      url = `/${value}/planner/list`;
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
        value={Object.keys(selectedTab).find(key => selectedTab[key as keyof typeof selectedTab]) || "schedule"}
        className={"w-100p"}
      >
        <BottomNavigationAction
          label={translate("exercise")}
          value={"exercise"}
          icon={
            <Img
              max={20}
              hover={true}
              shadow={false}
              radius={false}
              src={"exercise1.webp"}
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
              max={20}
              hover={true}
              shadow={false}
              radius={false}
              src={"food1.webp"}
            />
          }
          onClick={() => {
            handleClickBottomNav("food");
          }}
        />
        <BottomNavigationAction
          label={translate("schedule")}
          value={"schedule"}
          icon={
            <Img
              max={20}
              hover={true}
              shadow={false}
              radius={false}
              src={"schedule1.webp"}
            />
          }
          onClick={() => {
            handleClickBottomNav("schedule");
          }}
        />
        <BottomNavigationAction
          label={translate("money")}
          value={"money"}
          icon={
            <Img
              max={20}
              hover={true}
              shadow={false}
              radius={false}
              src={"money1.webp"}
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
              max={20}
              hover={true}
              shadow={false}
              radius={false}
              src={"sleep1.webp"}
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
      <Paper className={"layout-wrapper p-sticky bottom-0vh h-8vh radius-2 border-1 shadow-1"}>
        {tabsSection()}
      </Paper>
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {bottomNavNode()}
    </>
  );
});