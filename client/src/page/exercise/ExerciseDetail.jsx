// ExerciseDetail.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {percent} from "../../assets/js/percent.js";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {useDate} from "../../hooks/useDate.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import Grid2 from '@mui/material/Unstable_Grid2';
import {TextField, Typography} from "@mui/material";
import {Container, Card, Box, Paper} from "@mui/material";
import {Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "@mui/material";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/exercise/list",
    toDetail:"/exercise/detail",
    toUpdate:"/exercise/save",
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
    exercise_number: 0,
    exercise_demo: false,
    exercise_startDt: "0000-00-00",
    exercise_endDt: "0000-00-00",
    exercise_total_volume: 0,
    exercise_total_cardio: "00:00",
    exercise_body_weight: 0,
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "전체",
      exercise_title_idx: 0,
      exercise_title_val: "전체",
      exercise_set: 0,
      exercise_rep: 0,
      exercise_kg: 0,
      exercise_rest: 0,
      exercise_cardio: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: user_id,
        _id: location_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const res = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        user_id: user_id,
        _id: id,
        section_id: section_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      if (Object.keys(res.data.result).length > 0) {
        setOBJECT(res.data.result);
      }
      else {
        navParam(SEND.toList);
      }
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Table className={"block-wrapper h-80vh"}>
          <thead>
            <tr>
              <th className={"table-thead"}>날짜</th>
              <th className={"table-thead"}>부위</th>
              <th className={"table-thead"}>종목</th>
              <th className={"table-thead"}>볼륨 or 시간</th>
              <th className={"table-thead"}>x</th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.exercise_section?.map((section, index) => (
              <tr key={index}>
                {index === 0 && (
                  <td rowSpan={OBJECT?.exercise_section?.length}>
                    {OBJECT?.exercise_startDt?.substring(5, 10)}
                  </td>
                )}
                <td>{section.exercise_part_val}</td>
                {(section.exercise_part_val !== "유산소") ? (
                  <React.Fragment>
                    <td>
                      <p>{section.exercise_title_val}</p>
                      <p>{section.exercise_set} x {section.exercise_rep} x {section.exercise_kg} x {section.exercise_rest}</p>
                    </td>
                    <td>{section.exercise_volume}</td>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <td>
                      <p>{section.exercise_title_val}</p>
                    </td>
                    <td>{section.exercise_cardio}</td>
                  </React.Fragment>
                )}
                <td>
                  <p className={"del-btn"} onClick={() => (
                    flowDelete(OBJECT._id, section._id)
                  )}>x</p>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={2}>총 볼륨</td>
              <td colSpan={3}>{`${numeral(OBJECT?.exercise_total_volume).format('0,0')} vol`}</td>
            </tr>
            <tr>
              <td colSpan={2}>총 유산소 시간</td>
              <td colSpan={3}>{`${OBJECT?.exercise_total_cardio}`}</td>
            </tr>
            <tr>
              <td colSpan={2}>체중</td>
              <td colSpan={3}>{`${numeral(OBJECT?.exercise_body_weight).format('0,0')} kg`}</td>
            </tr>
          </tbody>
        </Table>
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
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={""} navParam={navParam}
      part={"exercise"} plan={""} type={"detail"}
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