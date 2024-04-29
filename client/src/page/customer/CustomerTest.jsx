// CustomerTest.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {CalendarNode} from "../../fragments/CalendarNode.jsx";
import {ButtonNode} from "../../fragments/ButtonNode.jsx";
import {Container, Table, Row, Col, Card, Button} from "react-bootstrap";
import { DataGrid, GridToolbarContainer, GridPagination } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

// ------------------------------------------------------------------------------------------------>
export const CustomerTest = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
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
      toDetail: "/exercise/detail",
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt,
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      type: "day",
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
        duration: `${DATE.startDt} ~ ${DATE.endDt}`
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [customer_id, DATE.startDt, DATE.endDt, FILTER.type]);

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

    function selectNode () {
      return (
        <Select value={FILTER.type} defaultValue={"day"}
        displayEmpty
        renderValue={(value) => `View: ${value}`}
        onChange={(e) => {
          setFILTER((prev) => ({
            ...prev,
            type: e.target.value
          }));
        }}>
          {["day", "week", "month", "year", "select"].map((item) => (
            <MenuItem key={item} value={item}>{item}</MenuItem>
          ))}
        </Select>
      );
    };

    function calendarNode () {
      return (
        <Button size={"sm"} className={"secondary-btn"} type={"button"} onClick={() => {
          setCALENDAR((prev) => ({
            ...prev,
            calOpen: !prev.calOpen,
          }));
        }}>
          달력
        </Button>
      );
    };

    function customFooter() {
      return (
        <React.Fragment>
          <GridToolbarContainer>
            <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
              {selectNode()}
              {calendarNode()}
              <GridPagination />
            </div>
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
            checkboxSelection
            slots={{
              footer: customFooter,
            }}
          ></DataGrid>
        </div>
      </React.Fragment>
    );
  };

  // 6. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    return (
      <CalendarNode FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
        CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
      />
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode DATE={DATE} setDATE={setDATE}
        SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} flowSave={""}
        navParam={navParam} part={"sleep"} plan={"plan"} type={"list"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"}>
          <Container>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-20"}>
                {calendarNode()}
                {tableNode()}
              </Col>
              <Col lg={12} md={12} sm={12} xs={12} className={"text-center mb-20"}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
