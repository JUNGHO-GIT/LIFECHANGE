// Test.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../assets/hooks/useStorage.jsx";
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { DataGrid, GridToolbarContainer, GridPagination } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {CalendarNode} from "../fragments/CalendarNode.jsx";
import {ButtonNode} from "../fragments/ButtonNode.jsx";
import {PagingNode} from "../fragments/PagingNode.jsx";
import {FilterNode} from "../fragments/FilterNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const Test = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_TEST || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toDetail: "/exercise/detail"
    }
  );
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
      limit: 5,
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
      page: 1,
      limit: 5
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [{
    _id: "",
    exercise_number: 0,
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
      exercise_volume: 0,
      exercise_cardio: "00:00",
    }],
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        customer_id: customer_id,
        FILTER: FILTER,
        PAGING: PAGING,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [customer_id, FILTER, PAGING, DATE.startDt, DATE.endDt]);

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    return (
      <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
        CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      />
    );
  };

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {
    return (
      <PagingNode PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
        part={"exercise"} plan={""} type={"list"}
      />
    );
  };

  // 8. filter ------------------------------------------------------------------------------------>
  const filterNode = () => {
    return (
      <FilterNode FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        part={"exercise"} plan={""} type={"list"}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
        flowSave={""} navParam={navParam} part={"exercise"} plan={"plan"} type={"list"}
      />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {

    const columns = [
      {field: 'exercise_startDt', headerName: '시작일', flex: 1.5 },
      {field: 'exercise_endDt', headerName: '종료일', flex: 1.5 },
      {field: 'exercise_part_val', headerName: '부위', flex: 1.5 },
      {field: 'exercise_title_val', headerName: '운동', flex: 2 },
      {field: 'exercise_set', headerName: '세트', flex: 1 },
      {field: 'exercise_rep', headerName: '횟수', flex: 1 },
      {field: 'exercise_kg', headerName: '중량', flex: 1 },
      {field: 'exercise_rest', headerName: '휴식', flex: 1 },
      {field: 'exercise_volume', headerName: '볼륨', flex: 1 },
      {field: 'exercise_cardio', headerName: '유산소', flex: 1 },
      {field: 'exercise_total_volume', headerName: '총 볼륨', flex: 1 },
      {field: 'exercise_total_cardio', headerName: '총 유산소', flex: 1 },
      {field: 'exercise_body_weight', headerName: '체중', flex: 1 },
    ];

    const rows = OBJECT?.map((item, idx) => (
      item?.exercise_section?.map((item2, idx2) => ({
        id: `${idx}-${idx2}`,
        exercise_startDt: item?.exercise_startDt,
        exercise_endDt: item?.exercise_endDt,
        exercise_part_val: item2?.exercise_part_val,
        exercise_title_val: item2?.exercise_title_val,
        exercise_set: item2?.exercise_set,
        exercise_rep: item2?.exercise_rep,
        exercise_kg: item2?.exercise_kg,
        exercise_rest: item2?.exercise_rest,
        exercise_volume: item2?.exercise_volume,
        exercise_cardio: item2?.exercise_cardio,
        exercise_total_volume: item?.exercise_total_volume,
        exercise_total_cardio: item?.exercise_total_cardio,
        exercise_body_weight: item?.exercise_body_weight,
      }))
    )).flat();

    function customFooter() {
      return (
        <React.Fragment>
          <GridToolbarContainer>
            <Container>
              <Grid container spacing={2} className={"d-center"}>
                <Grid lg={4} md={4} sm={4} xs={4}>
                  {buttonNode()}
                </Grid>
                <Grid lg={2} md={2} sm={2} xs={2}>
                  {pagingNode()}
                </Grid>
                <Grid lg={6} md={6} sm={6} xs={6}>
                  {filterNode()}
                </Grid>
              </Grid>
            </Container>
          </GridToolbarContainer>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div style={{width:"100%", height:700}}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            pagination={true}
            checkboxSelection={true}
            scrollbarSize={10}
            slots={{
              footer: customFooter,
            }}
          ></DataGrid>
        </div>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"}>
          <Container>
            <Grid container spacing={2}>
              <Grid lg={12} md={12} sm={12} xs={12} className={"mb-20"}>
                {calendarNode()}
                {tableNode()}
              </Grid>
            </Grid>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};