// SleepPlanList.jsx

import "moment/locale/ko";
import moment from "moment-timezone";
import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {DayList} from "../../fragments/DayList.jsx";
import {Paging} from "../../fragments/Paging.jsx";
import {Filter} from "../../fragments/Filter.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import Grid2 from '@mui/material/Unstable_Grid2';
import {Container, Card, Paper, Box, Badge, Divider, IconButton, Button} from "@mui/material";
import {Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "@mui/material";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
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
    toDetail:"/sleep/plan/detail"
  });
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 5
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
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    sleep_startDt: "0000-00-00",
    sleep_endDt: "0000-00-00",
    sleep_night: "00:00",
    sleep_morning: "00:00",
    sleep_time: "00:00",
    sleep_plan_startDt: "0000-00-00",
    sleep_plan_endDt: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
    sleep_diff_night: "00:00",
    sleep_diff_morning: "00:00",
    sleep_diff_time: "00:00",
    sleep_diff_night_color: "",
    sleep_diff_morning_color: "",
    sleep_diff_time_color: ""
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/list`, {
      params: {
        user_id: user_id,
        FILTER: FILTER,
        PAGING: PAGING,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [
    user_id,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit,
    DATE.startDt, DATE.endDt
  ]);

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
            <Table className={"border"}>
              <TableHead>
                <TableRow className={"table-thead-tr"}>
                  <TableCell>날짜</TableCell>
                  <TableCell>분류</TableCell>
                  <TableCell>목표</TableCell>
                  <TableCell>실제</TableCell>
                  <TableCell>비교</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody-tr"}>
                {OBJECT?.map((item) => (
                  <React.Fragment key={item._id}>
                    <TableRow className={"table-tbody-tr"}>
                      <TableCell rowSpan={3} className={"pointer"} onClick={() => {
                        SEND.id = item._id;
                        SEND.startDt = item.sleep_plan_startDt;
                        SEND.endDt = item.sleep_plan_endDt;
                        navParam(SEND.toDetail, {
                          state: SEND
                        });
                      }}>
                        {item.sleep_plan_startDt}
                      </TableCell>
                      <TableCell>취침</TableCell>
                      <TableCell>{item.sleep_plan_night}</TableCell>
                      <TableCell>{item.sleep_night}</TableCell>
                      <TableCell className={item.sleep_diff_night_color}>{item.sleep_diff_night}</TableCell>
                    </TableRow>
                    <TableRow className={"table-tbody-tr"}>
                      <TableCell>기상</TableCell>
                      <TableCell>{item.sleep_plan_morning}</TableCell>
                      <TableCell>{item.sleep_morning}</TableCell>
                      <TableCell className={item.sleep_diff_morning_color}>{item.sleep_diff_morning}</TableCell>
                    </TableRow>
                    <TableRow className={"table-tbody-tr"}>
                      <TableCell>수면</TableCell>
                      <TableCell>{item.sleep_plan_time}</TableCell>
                      <TableCell>{item.sleep_time}</TableCell>
                      <TableCell className={item.sleep_diff_time_color}>{item.sleep_diff_time}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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

  // 11. day -------------------------------------------------------------------------------------->
  const dayListNode = () => (
    <DayList FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
      DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
    />
  );

  // 12. paging ----------------------------------------------------------------------------------->
  const pagingNode = () => (
    <Paging PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"sleep"} plan={"plan"} type={"list"}
    />
  );

  // 13. filter ----------------------------------------------------------------------------------->
  const filterNode = () => (
    <Filter FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      part={"sleep"} plan={"plan"} type={"list"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      flowSave={""} navParam={navParam}
      part={"sleep"} plan={"plan"} type={"list"}
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
      {dayListNode()}
      {LOADING ? loadingNode() : tableNode()}
      {pagingNode()}
      {filterNode()}
      {btnNode()}
    </React.Fragment>
  );
};