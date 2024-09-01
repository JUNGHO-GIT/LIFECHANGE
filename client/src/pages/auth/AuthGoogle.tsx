// AuthGoogle.tsx
// Node -> Section -> Fragment

import { useEffect } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";
import { axios } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Paper } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const AuthGoogle = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    URL_GOOGLE, navigate, TITLE,
  } = useCommon();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_GOOGLE}/afterCallback`)
    .then((res: any) => {
      if (res.data.status === "success") {
        localStorage.setItem(`${TITLE}_autoLogin`, "true");
        localStorage.setItem(`${TITLE}_autoLoginId`, res.data.googleId);
        localStorage.setItem(`${TITLE}_autoLoginPw`, res.data.googlePw);
        localStorage.setItem(`${TITLE}_isGoogle`, "true");

        sessionStorage.setItem(`${TITLE}_sessionId`, res.data.googleId);
        sessionStorage.setItem(`${TITLE}_category`, JSON.stringify(res.data.result.dataCategory));
        sessionStorage.setItem(`${TITLE}_lang`, "ko");

        if (res.data.admin === "admin") {
          sessionStorage.setItem(`${TITLE}_admin`, "true");
        }
        else {
          sessionStorage.setItem(`${TITLE}_admin`, "false");
        }
        sync();
        navigate("/today/list");
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
  }, []);

  // 7. authGoogle ---------------------------------------------------------------------------------
  const authGoogleNode = () => {
    // 1. empty
    const empty = () => (
      null
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min95vh"}>
        {empty()}
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {authGoogleNode()}
    </>
  );
};