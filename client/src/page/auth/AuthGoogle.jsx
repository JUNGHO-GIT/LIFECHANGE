// AuthGoogle.jsx

import {React, useEffect, useNavigate} from "../../import/ImportReacts.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {percent} from "../../import/ImportUtils.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const AuthGoogle = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX_GOOGLE = process.env.REACT_APP_GOOGLE || "";
  const URL_GOOGLE = URL + SUBFIX_GOOGLE;
  const navigate = useNavigate();

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    await axios.get(`${URL_GOOGLE}/afterCallback`)
    .then((res) => {
      if (res.data.status === "success") {
        localStorage.setItem("localId", res.data.googleId);
        localStorage.setItem("isGoogle", "true");
        sessionStorage.setItem("sessionId", res.data.googleId);
        sessionStorage.setItem("dataCategory", JSON.stringify(res.data.result.dataCategory));
        sessionStorage.setItem("lang", "ko");
        sessionStorage.setItem("isLogin", "true");
        if (res.data.admin === "admin") {
          sessionStorage.setItem("isAdmin", "true");
        }
        else {
          sessionStorage.setItem("isAdmin", "false");
        }
        percent();
        navigate("/today/diff/list");
      }
    })
    .catch((err) => {
      console.error(err);
    })
  })()}, []);

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-2. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Div className={"d-column"} key={i}>
        </Div>
      );
      return (
        tableFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper d-column h-min85vh"}>
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
    </>
  );
};