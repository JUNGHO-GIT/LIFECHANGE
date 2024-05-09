// UserLogin.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {percent} from "../../assets/js/percent";
import {useNavigate, useLocation} from "react-router-dom";
import {Header} from "../architecture/Header";
import {NavBar} from "../architecture/NavBar";
import {Btn, Loading} from "../../import/CustomComponents.jsx";
import {Grid2, Menu, MenuItem, TextField, Typography, InputAdornment, Container, Card, Paper, Box, Badge, Divider, IconButton, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "../../import/CustomMuis";

// ------------------------------------------------------------------------------------------------>
export const UserLogin = () => {

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

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper d-center h-55vh"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
              <Typography component="h1" variant="h5">
                로그인
              </Typography>
            </Grid2>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
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
            </Grid2>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
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
            </Grid2>
          </Grid2>
        </Box>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Paper className={"content-wrapper"} variant={"outlined"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Paper>
      </React.Fragment>
    );
  };

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={""} setDAYPICKER={""} DATE={""} setDATE={""}
      SEND={""}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam} part={"user"} plan={""} type={"login"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
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