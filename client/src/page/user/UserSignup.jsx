// UserSignup.jsx

import {React, useState, useNavigate} from "../../import/ImportReacts";
import {axios, InputMask} from "../../import/ImportLibs";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";

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
    // 7-1. title
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          회원가입
        </Typography>
      </React.Fragment>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <React.Fragment>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            id={"user_id"}
            name={"user_id"}
            label={"ID"}
            value={user_id}
            onChange={(e) => (
              setUserId(e.target.value)
            )}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"password"}
            size={"small"}
            id={"user_pw"}
            name={"user_pw"}
            label={"Password"}
            value={user_pw}
            onChange={(e) => (
              setUserPw(e.target.value)
            )}
          />
        </Box>
      </React.Fragment>
    );
    // 7-7. table
    const tableSection = (i) => (
      <React.Fragment key={i}>
        <Box className={"block-wrapper h-74vh"}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
          }}
        >
          <Box className={"d-center p-10"}>
            {titleSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"} />
          <Box className={"d-column"}>
            {tableFragment(0)}
          </Box>
        </Box>
      </React.Fragment>
    );
    // 7-8. return
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

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={""} setDAYPICKER={""} DATE={""} setDATE={""}
      SEND={""}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"user"} plan={""} type={"signup"}
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
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};