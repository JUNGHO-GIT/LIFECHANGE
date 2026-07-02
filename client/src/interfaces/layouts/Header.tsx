/**
 * @file Header.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div, Icons, Img, Paper } from "@exportComponents";
import { useCommonDate } from "@hooks/common/useCommonDate";
import { useCommonValue } from "@hooks/common/useCommonValue";
import { memo, useCallback } from "@exportReacts";

// -------------------------------------------------------------------------------------------------
export const Header = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { navigate, firstStr, PATH } = useCommonValue();
  const { getDayFmt } = useCommonDate();

  const handleClickCalendar = useCallback(() => {
    const url = `/calendar/list`;
    if (PATH === url) {
      return;
    }
    void navigate(url, {
      state: {
        dateType: `day`,
        dateStart: getDayFmt(),
        dateEnd: getDayFmt(),
      },
    });
  }, [ PATH, getDayFmt, navigate ]);

  const handleClickSetting = useCallback(() => {
    const url = `/user/appSetting`;
    if (PATH === url) {
      return;
    }
    void navigate(url);
  }, [ PATH, navigate ]);

  // 7. header -------------------------------------------------------------------------------------
  const headerNode = () => {
    const iconSection = () => (
      <Div
        className={`d-center pointer ml-5px`}
        onClick={handleClickCalendar}
      >
        <Img
          hover={true}
          shadow={false}
          radius={false}
          src={`logo2.webp`}
          loading={`eager`}
          className={`h-max-30px mr-2vw`}
        />
        <Img
          hover={true}
          shadow={false}
          radius={false}
          src={`logo3.webp`}
          loading={`eager`}
          className={`h-max-30px`}
        />
      </Div>
    );
    const btnSection = () => (
			firstStr !== `user` ? (
				<Icons
				  key={`Settings`}
				  name={`Settings`}
				  className={`w-25px h-25px`}
				  onClick={handleClickSetting}
				/>
			) : (
				<Icons
				  key={`ArrowRight`}
				  name={`ArrowRight`}
				  className={`w-25px h-25px`}
				  onClick={() => {
				    void navigate(-1);
				  }}
				/>
			)
    );
    return (
      <Paper className={`layout-wrapper d-row-between p-sticky top-0vh radius-2 border-light-1 shadow-1`}>
        {iconSection()}
        {btnSection()}
      </Paper>
    );
  };

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {headerNode()}
    </>
  );
});
