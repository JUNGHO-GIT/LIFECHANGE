// AuthPage.jsx

import {React, useState, useEffect, useNavigate} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Loading} from "../../import/ImportLayouts.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {percent, log} from "../../import/ImportUtils.jsx";
import {Div, Hr40} from "../../import/ImportComponents.jsx";
import {Paper, Card, TextField} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const AuthPage = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX_GOOGLE = process.env.REACT_APP_GOOGLE || "";
  const URL_GOOGLE = URL + SUBFIX_GOOGLE;
  const navigate = useNavigate();
  const {translate} = useTranslate();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [googleId, setGoogleId] = useState("");
  const [LOADING, setLOADING] = useState(false);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    await axios.get(`${URL_GOOGLE}/afterCallback`)
    .then((res) => {
      if (res.data.status === "success") {
        setGoogleId(res.data.googleId);
        sessionStorage.setItem("sessionId", googleId);
        sessionStorage.setItem("dataCategory", JSON.stringify(res.data.result.dataCategory));
        sessionStorage.setItem("lang", "ko");
        if (res.data.admin === "admin") {
          sessionStorage.setItem("isAdmin", "true");
        }
        else {
          sessionStorage.setItem("isAdmin", "false");
        }
        percent();
        navigate("/calendar/list");
      }
    })
    .catch((err) => {
      console.error(err);
    })
  })()}, []);

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Div className={"d-center fs-2-0rem"}>
        {translate("login")}
      </Div>
    );
    // 7-2. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Div className={"d-column"} key={i}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("id")}
            className={"w-86vw"}
            InputProps={{
              readOnly: false
            }}
          />
        </Div>
      );
      return (
        tableFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper d-column"}>
          {titleSection()}
          <Hr40 />
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