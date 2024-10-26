// AuthGoogle.tsx

import { useEffect } from "@imports/ImportReacts";
import { useCommonValue } from "@imports/ImportHooks";
import { axios, sync, setLocal, setSession } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
export const AuthGoogle = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_GOOGLE, navigate } = useCommonValue();

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