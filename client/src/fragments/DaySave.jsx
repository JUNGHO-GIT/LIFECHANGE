// DaySave.jsx

import "moment/locale/ko";
import moment from "moment-timezone";
import {ko} from "date-fns/locale";
import React, { useEffect } from "react";
import {DayPicker} from "react-day-picker";
import InputMask from "react-input-mask";
import {Container, Card, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Box, Paper, Button} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';

// 4. date ---------------------------------------------------------------------------------------->
export const DaySave = ({
  DATE, setDATE, DAYPICKER, setDAYPICKER, part, plan, type
}) => {

  // endDt 값을 startDt로 설정
  useEffect(() => {
    if (part === "sleep") {
      setDATE((prev) => ({
        ...prev,
        endDt: DATE.startDt
      }));
    }
  }, [DATE.startDt]);

  // 1. useEffect (startDt) ----------------------------------------------------------------------->
  // startDt가 endDt보다 클 경우 endDt를 startDt로 설정
  useEffect(() => {
    if (part !== "sleep" && moment(DATE.startDt).isAfter(DATE.endDt)) {
      setDATE((prev) => ({
        ...prev,
        endDt: DATE.startDt
      }));
    }
  }, [DATE.startDt]);

  // 중복 방지
   useEffect(() => {
    if (DAYPICKER.dayStartOpen) {
      setDAYPICKER((prev) => ({
        ...prev,
        dayEndOpen: false,
      }));
    }
  }, [DAYPICKER.dayStartOpen]);

  // 2. useEffect (endDt) ------------------------------------------------------------------------->
  // endDt가 startDt보다 작을 경우 startDt를 endDt로 설정
  useEffect(() => {
    if (part !== "sleep" && moment(DATE.endDt).isBefore(DATE.startDt)) {
      setDATE((prev) => ({
        ...prev,
        startDt: DATE.endDt
      }));
    }
  }, [DATE.endDt]);

  // 중복 방지
  useEffect(() => {
    if (DAYPICKER.dayEndOpen) {
      setDAYPICKER((prev) => ({
        ...prev,
        dayStartOpen: false,
      }));
    }
  }, [DAYPICKER.dayEndOpen]);

  // 닫기 버튼 ------------------------------------------------------------------------------------>
  const closeBtn = (type) => (
    <span className={"d-right fw-700 dayPicker-x-btn"} onClick={() => {
      setDAYPICKER((prev) => ({
        ...prev,
        [`day${type}Open`]: false,
      }));
    }}>
      X
    </span>
  );

  // 달력 본체 ------------------------------------------------------------------------------------>
  const dayPicker = (type) => (
    <React.Fragment>
      <h5 className={"text-center drag"}>{type === "start" ? "시작일" : "종료일"}</h5>
      <DayPicker
        weekStartsOn={1}
        showOutsideDays={true}
        locale={ko}
        mode={"single"}
        selected={new Date(DATE[`${type}Dt`])}
        month={new Date(DATE[`${type}Dt`])}
        modifiersClassNames={{
          selected: "selected", disabled: "disabled", outside: "outside", inside: "inside",
        }}
        onDayClick={(day) => {
          setDATE((prev) => ({
            ...prev,
            [`${type}Dt`]: moment(day).tz("Asia/Seoul").format("YYYY-MM-DD")
          }));
        }}
        onMonthChange={(month) => {
          setDATE((prev) => ({
            ...prev,
            [`${type}Dt`]: moment(month).tz("Asia/Seoul").format("YYYY-MM-DD")
          }));
        }}
      ></DayPicker>
    </React.Fragment>
  );

  // 7-1. popup ----------------------------------------------------------------------------------->
  const popupNode = () => (
    <React.Fragment>
      <div className={`dayPicker-container ${DAYPICKER.dayStartOpen ? "" : "d-none"}`}>
        {closeBtn("Start")}
        <div className="h-2vh"></div>
        {dayPicker("start")}
      </div>
      <div className={`dayPicker-container ${DAYPICKER.dayEndOpen ? "" : "d-none"}`}>
        {closeBtn("End")}
        <div className="h-2vh"></div>
        {dayPicker("end")}
      </div>
    </React.Fragment>
  );

  // 7-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection1 = () => (
      <React.Fragment>
        <Grid2 container spacing={3}>
          <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>날짜</span>
              <InputMask
                mask={"9999-99-99"}
                id={"dayPicker_startDt"}
                name={"dayPicker_startDt"}
                className={"form-control pointer"}
                maskChar={null}
                value={DATE?.startDt}
                readOnly={true}
                onClick={() => {
                  setDAYPICKER((prev) => ({
                    ...prev,
                    dayStartOpen: !prev.dayStartOpen
                  }));
                }}
              ></InputMask>
            </div>
          </Grid2>
        </Grid2>
      </React.Fragment>
    );
    const tableSection2 = () => (
      <React.Fragment>
        <Grid2 container spacing={3}>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>시작일</span>
              <InputMask
                mask={"9999-99-99"}
                id={"dayPicker_startDt"}
                name={"dayPicker_startDt"}
                className={"form-control pointer"}
                maskChar={null}
                value={DATE?.startDt}
                readOnly={true}
                onClick={() => {
                  setDAYPICKER((prev) => ({
                    ...prev,
                    dayStartOpen: !prev.dayStartOpen
                  }));
                }}
              ></InputMask>
            </div>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>종료일</span>
              <InputMask
                mask={"9999-99-99"}
                id={"dayPicker_endDt"}
                name={"dayPicker_endDt"}
                className={"form-control pointer"}
                maskChar={null}
                value={DATE?.endDt}
                readOnly={true}
                onClick={() => {
                  setDAYPICKER((prev) => ({
                    ...prev,
                    dayEndOpen: !prev.dayEndOpen
                  }));
                }}
              ></InputMask>
            </div>
          </Grid2>
        </Grid2>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Card className={"flex-wrapper h-8vh p-sticky bottom-35"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
                {part === "sleep" ? tableSection1() : tableSection2()}
              </Grid2>
            </Grid2>
          </Container>
        </Card>
      </React.Fragment>
    );
  };

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {popupNode()}
      {tableNode()}
    </React.Fragment>
  );
};