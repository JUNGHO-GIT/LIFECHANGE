// ExercisePlanSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {TimePicker} from "react-time-picker";
import {NumericFormat} from "react-number-format";
import {percent} from "../../assets/js/percent.js";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {useDate} from "../../hooks/useDate.jsx";
import {useTime} from "../../hooks/useTime.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {DaySave} from "../../fragments/DaySave.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import Grid2 from '@mui/material/Unstable_Grid2';
import {Menu, MenuItem} from "@mui/material";
import {TextField, Typography, InputAdornment} from '@mui/material';
import {Container, Card, Paper, Box, Badge, Divider, IconButton, Button} from "@mui/material";
import {Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "@mui/material";

// ------------------------------------------------------------------------------------------------>
export const ExercisePlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/exercise/plan/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    exercise_plan_number: 0,
    exercise_plan_demo: false,
    exercise_plan_startDt: "0000-00-00",
    exercise_plan_endDt: "0000-00-00",
    exercise_plan_count: 0,
    exercise_plan_cardio: "00:00",
    exercise_plan_volume: 0,
    exercise_plan_weight: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
      params: {
        user_id: user_id,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/plan/save`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
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
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>목표 총 볼륨</span>
              <NumericFormat
                min={0}
                max={999999}
                minLength={1}
                maxLength={12}
                suffix={" vol"}
                datatype={"number"}
                displayType={"input"}
                id={"exercise_volume"}
                name={"exercise_volume"}
                className={"form-control"}
                allowNegative={false}
                fixedDecimalScale={true}
                thousandSeparator={true}
                allowLeadingZeros={false}
                value={Math.min(999999, OBJECT?.exercise_plan_volume)}
                onValueChange={(values) => {
                  const limitedValue = Math.min(999999, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_plan_volume: limitedValue
                  }));
                }}
              ></NumericFormat>
            </Box>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>목표 유산소 시간</span>
              <TimePicker
                locale={"ko"}
                format={"HH:mm"}
                id={"exercise_cardio"}
                name={"exercise_cardio"}
                className={"form-control"}
                disabled={false}
                clockIcon={null}
                disableClock={false}
                value={OBJECT?.exercise_plan_cardio}
                onChange={(e) => {
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_plan_cardio: e ? e.toString() : ""
                  }));
                }}
              ></TimePicker>
            </Box>
          </Grid2>
        </Grid2>
        <Grid2 container spacing={3}>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>목표 운동 횟수</span>
              <NumericFormat
                min={0}
                max={999}
                minLength={1}
                maxLength={5}
                id={"exercise_count"}
                name={"exercise_count"}
                suffix={" 회"}
                datatype={"number"}
                displayType={"input"}
                className={"form-control"}
                disabled={false}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                value={Math.min(999, OBJECT?.exercise_plan_count)}
                onValueChange={(values) => {
                  const limitedValue = Math.min(999, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_plan_count: limitedValue
                  }));
                }}
              ></NumericFormat>
            </Box>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>목표 체중</span>
              <NumericFormat
                min={0}
                max={999}
                minLength={1}
                maxLength={6}
                suffix={" kg"}
                datatype={"number"}
                displayType={"input"}
                id={"exercise_weight"}
                name={"exercise_weight"}
                className={"form-control"}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                allowLeadingZeros={false}
                value={Math.min(999, OBJECT?.exercise_plan_weight)}
                onValueChange={(values) => {
                  const limitedValue = Math.min(999, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    exercise_plan_weight: limitedValue
                  }));
                }}
              ></NumericFormat>
            </Box>
          </Grid2>
        </Grid2>
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

  // 11. day -------------------------------------------------------------------------------------->
  const daySaveNode = () => (
    <DaySave DATE={DATE} setDATE={setDATE} DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      part={"exercise"} plan={"plan"} type={"save"}
    />
  );

  // 14. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"exercise"} plan={"plan"} type={"save"}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {headerNode()}
      {navBarNode()}
      {daySaveNode()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};
