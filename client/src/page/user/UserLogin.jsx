// UserLogin.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {percent} from "../../assets/js/percent.js";
import {useNavigate, useLocation} from "react-router-dom";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {LoadingNode} from "../../fragments/LoadingNode.jsx";
import {TextField, Card, Box, Typography, Button} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navParam = useNavigate();
  const location = useLocation();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post (`${URL_OBJECT}/login`, {
      user_id: user_id,
      user_pw: user_pw,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      sessionStorage.setItem("user_id", user_id);
      sessionStorage.setItem("dataset", JSON.stringify(res.data.result.user_dataset));
      percent();
      navParam("/calendar/list");
    }
    else {
      alert(res.data.msg);
      sessionStorage.setItem("user_id", "false");
    }
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Grid container spacing={3}>
          <Grid lg={12} md={12} sm={12} xs={12}>
            <Typography component="h1" variant="h5">
              로그인
            </Typography>
          </Grid>
          <Grid lg={12} md={12} sm={12} xs={12}>
            <TextField
              type={"text"}
              id={"user_id"}
              name={"user_id"}
              label={"ID"}
              value={user_id}
              onChange={(e) => (
                setUserId(e.target.value)
              )}
            ></TextField>
          </Grid>
          <Grid lg={12} md={12} sm={12} xs={12}>
            <TextField
              type={"password"}
              id={"user_pw"}
              name={"user_pw"}
              label={"Password"}
              value={user_pw}
              onChange={(e) => (
                setUserPw(e.target.value)
              )}
            ></TextField>
          </Grid>
        </Grid>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"login-wrapper"}>
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 6. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <LoadingNode LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 11. button ----------------------------------------------------------------------------------->
  const buttonNode = () => (
    <ButtonNode DAYPICKER={""} setDAYPICKER={""} DATE={""} setDATE={""}
      SEND={""}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam} part={"user"} plan={""} type={"login"}
    />
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"content-wrapper"}>
        <div className={"card-wrapper"}>
          <Grid container spacing={1}>
            <Grid lg={12} md={12} sm={12} xs={12} className={"d-center"}>
              {LOADING ? loadingNode() : tableNode()}
            </Grid>
          </Grid>
        </div>
      </div>
      <div className={"content-wrapper"}>
        <div className={"card-wrapper"}>
          <Grid container spacing={1}>
            <Grid lg={12} md={12} sm={12} xs={12} className={"d-center"}>
              {buttonNode()}
            </Grid>
          </Grid>
        </div>
      </div>
    </React.Fragment>
  );
};