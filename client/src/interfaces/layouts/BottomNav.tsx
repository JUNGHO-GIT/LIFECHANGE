/**
 * @file BottomNav.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { memo, useCallback } from "@exportReacts";
import { useCommonDate } from "@hooks/common/useCommonDate";
import { useCommonValue } from "@hooks/common/useCommonValue";
import { getLocal } from "@exportScripts";
import { useStoreLanguage } from "@exportStores";
import { Icons, Paper } from "@exportComponents";
import { BottomNavigation, BottomNavigationAction } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const BottomNav = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { navigate, firstStr, PATH } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useStoreLanguage();

  // 4. handle ----------------------------------------------------------------------------------
  const handleClickBottomNav = useCallback((value: string) => {

    // top selected 값 가져오기
    const getItem: any = getLocal(`tabs`, `top`, ``);
    const selectedTop: any = getItem?.[value] ?? `record`;
    const url: string = value === `calendar` ? `/${value}/list` : `/${value}/${selectedTop}/list`;
    if (PATH === url) {
      return;
    }
    void navigate(url, {
      state: {
        dateType: ``,
        dateStart: getDayFmt(),
        dateEnd: getDayFmt(),
      },
    });
  }, [ PATH, getDayFmt, navigate ]);

  // 7. bottomNav ----------------------------------------------------------------------------------
  const bottomNavNode = () => {

    // 7-1. tabsSection
    const tabsSection = () => (
      <BottomNavigation
        showLabels={true}
        value={firstStr}
        className={`w-100p`}
      >
        <BottomNavigationAction
          label={translate(`exercise`)}
          value={`exercise`}
          icon={(
            <Icons
              key={`exercise1`}
              name={`exercise1`}
              isIconButton={false}
              className={`w-30px h-30px hover`}
            />
          )}
          onClick={() => {
            handleClickBottomNav(`exercise`);
          }}
        />
        <BottomNavigationAction
          label={translate(`food`)}
          value={`food`}
          icon={(
            <Icons
              key={`food1`}
              name={`food1`}
              isIconButton={false}
              className={`w-30px h-30px hover`}
            />
          )}
          onClick={() => {
            handleClickBottomNav(`food`);
          }}
        />
        <BottomNavigationAction
          label={translate(`calendar`)}
          value={`calendar`}
          icon={(
            <Icons
              key={`calendar1`}
              name={`calendar1`}
              isIconButton={false}
              className={`w-30px h-30px hover`}
            />
          )}
          onClick={() => {
            handleClickBottomNav(`calendar`);
          }}
        />
        <BottomNavigationAction
          label={translate(`money`)}
          value={`money`}
          icon={(
            <Icons
              key={`money1`}
              name={`money1`}
              isIconButton={false}
              className={`w-30px h-30px hover`}
            />
          )}
          onClick={() => {
            handleClickBottomNav(`money`);
          }}
        />
        <BottomNavigationAction
          label={translate(`sleep`)}
          value={`sleep`}
          icon={(
            <Icons
              key={`sleep1`}
              name={`sleep1`}
              isIconButton={false}
              className={`w-30px h-30px hover`}
            />
          )}
          onClick={() => {
            handleClickBottomNav(`sleep`);
          }}
        />
      </BottomNavigation>
    );

    // 7-2. return
    return (
      <Paper className={`layout-wrapper p-sticky bottom-0vh h-8vh radius-2 border-1 shadow-1`}>
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
