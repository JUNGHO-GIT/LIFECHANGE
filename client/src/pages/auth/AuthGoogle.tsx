// AuthGoogle.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { axios, sync } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const AuthGoogle = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_GOOGLE, TITLE, navigate, localTitle } = useCommonValue();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_GOOGLE}/afterCallback`)
    .then((res: any) => {
      if (res.data.status === "success") {

        // localStorage
        localStorage.setItem(TITLE, JSON.stringify({
          ...localTitle,
          setting: {
            ...localTitle?.setting,
            autoLogin: "true",
            autoLoginId: res.data.googleId,
            autoLoginPw: res.data.googlePw,
            isGoogle: "true",
          },
        }));

        // sessionStorage
        sessionStorage.setItem(TITLE, JSON.stringify({
          ...localTitle,
          setting: {
            ...localTitle?.setting,
            sessionId: res.data.googleId,
            admin: res.data.admin === "admin" ? "true" : "false",
          },
        }));

        sync();
        navigate("/today/list");
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
  }, []);

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
    </>
  );
};