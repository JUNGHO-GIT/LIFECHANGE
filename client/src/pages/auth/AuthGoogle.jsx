// AuthGoogle.jsx
// Node -> Section -> Fragment

import { useEffect } from "../../imports/ImportReacts.jsx";
import { useCommon } from "../../imports/ImportHooks.jsx";
import { axios } from "../../imports/ImportLibs.jsx";
import { sync } from "../../imports/ImportUtils.jsx";
import { Paper } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const AuthGoogle = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_GOOGLE, navigate } = useCommon();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_GOOGLE}/afterCallback`)
    .then((res) => {
      if (res.data.status === "success") {
        localStorage.setItem("autoLogin", "true");
        localStorage.setItem("autoLoginId", res.data.googleId);
        localStorage.setItem("autoLoginPw", res.data.googlePw);
        localStorage.setItem("GOOGLE", "true");
        sessionStorage.setItem("ID_SESSION", res.data.googleId);
        sessionStorage.setItem("CATEGORY", JSON.stringify(res.data.result.dataCategory));
        sessionStorage.setItem("LANG", "ko");

        if (res.data.admin === "admin") {
          sessionStorage.setItem("ADMIN", "true");
        }
        else {
          sessionStorage.setItem("ADMIN", "false");
        }
        sync();
        navigate("/today/list");
      }
    })
    .catch((err) => {
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