// UserSignup.jsx

import axios from "axios";
import React, {useState} from "react";
import InputMask from "react-input-mask";
import {useNavigate} from "react-router-dom";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import Grid2 from '@mui/material/Unstable_Grid2';
import {TextField, Typography} from "@mui/material";
import {Container, Card, Box, Paper} from "@mui/material";
import {Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "@mui/material";

// ------------------------------------------------------------------------------------------------>
export const UserSignup = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navParam = useNavigate();

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [user_id, setUserId] = useState("");
  const [user_pw, setUserPw] = useState("");

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    if (user_id === "" || user_pw === "") {
      alert("Please enter both Id and Pw");
      return;
    }
    const res = await axios.post (`${URL_OBJECT}/signup`, {
      user_id: user_id,
      user_pw: user_pw,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      navParam("/user/login");
    }
    else if (res.data.status === "duplicated") {
      alert(res.data.msg);
      setUserId("");
      setUserPw("");
    }
    else if (res.data.status === "fail") {
      alert(res.data.msg);
      setUserId("");
      setUserPw("");
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Grid2 container spacing={3}>
          <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
            <h2>Sing Up</h2>
          </Grid2>
          <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>ID</span>
              <InputMask
                mask={""}
                type={"text"}
                className={"form-control"}
                placeholder={"ID"}
                value={user_id}
                onChange={(e) => (
                  setUserId(e.target.value)
                )}
              ></InputMask>
            </div>
          </Grid2>
          <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>PW</span>
              <InputMask
                mask={""}
                type={"password"}
                className={"form-control"}
                placeholder={"PW"}
                value={user_pw}
                onChange={(e) => (
                  setUserPw(e.target.value)
                )}
              ></InputMask>
            </div>
          </Grid2>
        </Grid2>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Card>
      </React.Fragment>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 14. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={""} setDAYPICKER={""} DATE={""} setDATE={""}
      SEND={""}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"user"} plan={""} type={"signup"}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {headerNode()}
      {navBarNode()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};