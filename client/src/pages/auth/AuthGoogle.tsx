// AuthGoogle.tsx

import { useEffect, memo } from "@importReacts";
import { useCommonValue } from "@importHooks";
import { axios } from "@importLibs";
import { useStoreAlert, useStoreLoading, useStoreLanguage } from "@importStores";
import { setLocal, fnSetSession, fnSync } from "@importScripts";

// -------------------------------------------------------------------------------------------------
export const AuthGoogle = memo(() => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_GOOGLE, navigate } = useCommonValue();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_GOOGLE}/afterCallback`)
    .then((res: any) => {
      if (res.data.status === "success") {

        // localStorage
        setLocal("setting", "id", "", {
          autoLogin: "true",
          autoLoginId: res.data.googleId,
          autoLoginPw: res.data.googlePw,
          isGoogle: "true",
        });

        // sessionStorage
        setSession("setting", "id", "", {
          sessionId: res.data.googleId,
          admin: res.data.admin === "admin" ? "true" : "false",
        });

        navigate("/today/list");
        sync();
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, []);

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
    </>
  );
});