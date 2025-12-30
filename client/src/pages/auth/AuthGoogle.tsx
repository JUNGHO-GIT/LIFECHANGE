/**
 * @file AuthGoogle.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useEffect, memo } from "@exportReacts";
import { useCommonValue } from "@exportHooks";
import { axios } from "@exportLibs";
import { useStoreAlert, useStoreLoading, useStoreLanguage } from "@exportStores";
import { setLocal, setSession, sync } from "@exportScripts";

// -------------------------------------------------------------------------------------------------
export const AuthGoogle = memo(() => {
  // 1. common -------------------------------------------------------------------------------------
  const {
    URL_GOOGLE, navigate, toCalendarList,
  } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios
    .get(`${URL_GOOGLE}/afterCallback`)
    .then((res: unknown) => {
      if (res.data.status === `success`) {
        // localStorage
        setLocal(`setting`, `id`, ``, {
          autoLogin: `true`,
          autoLoginId: res.data.googleId,
          autoLoginPw: res.data.googlePw,
          isGoogle: `true`,
        });

        // sessionStorage
        setSession(`setting`, `id`, ``, {
          sessionId: res.data.googleId,
          admin: res.data.admin === `admin` ? `true` : `false`,
        });
        void navigate(toCalendarList);
        void sync();
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg as string),
          severity: `error`,
        });
      }
    })
    .catch((error: unknown) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error as string),
        severity: `error`,
      });
      console.error(error);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, []);

  // 10. return ------------------------------------------------------------------------------------
  return <></>;
});
