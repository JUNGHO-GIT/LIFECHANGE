// CalendarDetail.jsx

import "moment/locale/ko";
import moment from "moment-timezone";
import React, {useState, useEffect} from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import {NumericFormat} from "react-number-format";
import {useDate} from "../../hooks/useDate.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {DaySave} from "../../fragments/DaySave.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import Grid2 from '@mui/material/Unstable_Grid2';
import {Menu, MenuItem} from "@mui/material";
import {TextField, Typography, InputAdornment} from '@mui/material';
import {Container, Card, Paper, Box, Badge, Divider, IconButton, Button} from "@mui/material";
import {Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "@mui/material";

// ------------------------------------------------------------------------------------------------>
export const CalendarDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const location_category = location?.state?.category?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList: "/calendar/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false
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
    user_id: user_id,
    calendar_number: 0,
    calendar_startDt: "0000-00-00",
    calendar_endDt: "0000-00-00",
    calendar_section: [{
      calendar_part_idx: 1,
      calendar_part_val: "일정",
      calendar_title : "",
      calendar_color: "#000000",
      calendar_detail: ""
    }]
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2.3 useEffect -------------------------------------------------------------------------------->
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
  })()}, [location_id, user_id, location_category, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    if (res.data.status === "success") {
      alert(res.data.msg);
      navParam(SEND?.toList);
    }
    else {
      alert(res.data.msg);
      navParam(SEND?.toList);
    }
  };

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const res = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        user_id: user_id,
        _id: id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (res.data.status === "success") {
      if (Object.keys(res.data.result).length > 0) {
        alert(res.data.msg);
        setOBJECT(res.data.result);
        navParam(SEND?.toList);
      }
      else {
        alert(res.data.msg);
        navParam(SEND?.toList);
      }
    }
    else {
      alert(res.data.msg);
      navParam(SEND?.toList);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const colors = [
      "red", "orange", "yellow", "green", "blue", "navy", "purple", "black", "gray"
    ];
    const handlerCount = (e) => {
      let newCount = parseInt(e, 10);
      let defaultSection = {
        calendar_part_idx: 1,
        calendar_part_val: "일정",
        calendar_title : "",
        calendar_color: "#000000",
        calendar_detail: ""
      };
      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount
      }));
      if (newCount > 0) {
        let updatedSection = Array(newCount).fill(null).map((_, idx) => (
          idx < OBJECT.calendar_section.length ? OBJECT.calendar_section[idx] : {...defaultSection}
        ));
        setOBJECT((prev) => ({
          ...prev,
          calendar_section: updatedSection
        }));
      }
      else {
        setOBJECT((prev) => ({
          ...prev,
          calendar_section: []
        }));
      }
    };
    const countNode = () => (
      <React.Fragment>
        <Box className={"input-group"}>
          <span className={"input-group-text"}>섹션 갯수</span>
          <NumericFormat
            min={0}
            max={10}
            minLength={1}
            maxLength={2}
            datatype={"number"}
            displayType={"input"}
            id={"sectionCnt"}
            name={"sectionCnt"}
            className={"form-control"}
            disabled={false}
            thousandSeparator={false}
            fixedDecimalScale={true}
            value={Math.min(10, COUNT?.sectionCnt)}
            onValueChange={(values) => {
              const limitedValue = Math.min(10, parseInt(values?.value));
              handlerCount(limitedValue.toString());
            }}
          ></NumericFormat>
        </Box>
      </React.Fragment>
    );
    const tableFragment = (i) => (
      <React.Fragment key={i}>
        <Grid2 container spacing={3}>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>파트</span>
              <select
                id={`calendar_part_idx-${i}`}
                name={`calendar_part_idx-${i}`}
                className={"form-select"}
                value={OBJECT?.calendar_section[i]?.calendar_part_idx}
                onChange={(e) => {
                  const newIndex = Number(e.target.value);
                  setOBJECT((prev) => ({
                    ...prev,
                    calendar_section: prev.calendar_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        calendar_part_idx: newIndex,
                        calendar_part_val: calendarArray[newIndex]?.calendar_part
                      } : item
                    ))
                  }));
                }}
              >
                {calendarArray?.map((item, idx) => (
                  <option key={idx} value={idx}>
                    {item.calendar_part}
                  </option>
                ))}
              </select>
            </Box>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>색상</span>
              <select
                id={`calendar_color-${i}`}
                name={`calendar_color-${i}`}
                className={"form-select"}
                value={OBJECT?.calendar_section[i]?.calendar_color}
                style={{color: OBJECT?.calendar_section[i]?.calendar_color}}
                onChange={(e) => {
                  const newColor = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    calendar_section: prev.calendar_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        calendar_color: newColor
                      } : item
                    ))
                  }));
                }}
              >
                {colors.map((color, index) => (
                  <option key={index} value={color} style={{color: color}}>
                    ● {color}
                  </option>
                ))}
              </select>
            </Box>
          </Grid2>
        </Grid2>
        <Grid2 container spacing={3}>
          <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>제목</span>
              <InputMask
                mask={""}
                placeholder={"제목"}
                id={`calendar_title-${i}`}
                name={`calendar_title-${i}`}
                className={"form-control"}
                maskChar={null}
                value={OBJECT?.calendar_section[i]?.calendar_title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    calendar_section: prev.calendar_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        calendar_title: newTitle
                      } : item
                    ))
                  }));
                }}
              ></InputMask>
            </Box>
          </Grid2>
          <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>내용</span>
              <InputMask
                mask={""}
                placeholder={"내용"}
                id={`calendar_detail-${i}`}
                name={`calendar_detail-${i}`}
                className={"form-control"}
                maskChar={null}
                value={OBJECT?.calendar_section[i]?.calendar_detail}
                onChange={(e) => {
                  const newDetail = e.target.value;
                  setOBJECT((prev) => ({
                    ...prev,
                    calendar_section: prev.calendar_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        calendar_detail: newDetail
                      } : item
                    ))
                  }));
                }}
              ></InputMask>
            </Box>
          </Grid2>
        </Grid2>
      </React.Fragment>
    );
    const tableSection = () => (
      <React.Fragment>
        {Array.from({ length: COUNT.sectionCnt }, (_, i) => tableFragment(i))}
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {countNode()}
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Card>
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
  const daySaveNode = () => (
    <DaySave DATE={DATE} setDATE={setDATE} DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      part={"calendar"} plan={""} type={"detail"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"calendar"} plan={""} type={"save"}
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
      {daySaveNode()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};