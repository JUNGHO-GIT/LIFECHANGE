// CalendarList.jsx

import axios from "axios";
import "moment/locale/ko";
import moment from "moment-timezone";
import Calendar from "react-calendar";
import React, {useState, useEffect} from "react";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import {Container, Card, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Grid, TextField, Typography} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';

// ------------------------------------------------------------------------------------------------>
export const CalendarList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    section_id: "",
    refresh: 0,
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    category: "",
    toDetail: "/calendar/detail"
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().endOf("month").format("YYYY-MM-DD")
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    user_id: user_id,
    calendar_number: 0,
    calendar_startDt: "0000-00-00",
    calendar_endDt: "0000-00-00",
    calendar_section: [{
      calendar_part_idx: 0,
      calendar_part_val: "일정",
      calendar_title : "",
      calendar_color: "#000000",
      calendar_detail: ""
    }]
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: user_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const formatDate = (date) => (
      moment(date).format("YYYY-MM-DD")
    );
    const dateInRange = (date, startDt, endDt) => {
      const currDate = formatDate(date);
      return currDate >= startDt && currDate <= endDt;
    };
    const activeLine = (calendarForDates) => (
      <React.Fragment>
        {calendarForDates?.map((calendar) => (
          calendar.calendar_section.map((section) => (
            <div key={calendar._id} className={"calendar-filled"}
              style={{
                backgroundColor: section.calendar_color
              }}
              onClick={(e) => {
                e.stopPropagation();
                SEND.id = calendar._id;
                SEND.section_id = section._id;
                SEND.startDt = calendar.calendar_startDt;
                SEND.endDt = calendar.calendar_endDt;
                navParam(SEND.toDetail, {
                  state: SEND
                });
              }}
            >
              <span className={"calendar-category"}>{section.calendar_title}</span>
            </div>
          ))
        ))}
      </React.Fragment>
    );
    const unActiveLine = (calendarForDates) => (
      <React.Fragment>
        {calendarForDates?.map((calendar) => (
          calendar.calendar_section.map((section) => (
            <div key={calendar._id} className={"calendar-unfilled"}>
              <span className={"calendar-category"}>{section.calendar_title}</span>
            </div>
          ))
        ))}
      </React.Fragment>
    );
    const tableSection = () => (
      <React.Fragment>
        <Calendar
          view={"month"}
          value={new Date()}
          showNavigation={true}
          showNeighboringMonth={true}
          showDoubleView={false}
          prevLabel={<i className={"bx bxs-left-arrow"}></i>}
          nextLabel={<i className={"bx bxs-right-arrow"}></i>}
          prev2Label={null}
          next2Label={null}
          formatDay={(locale, date) => (moment(date).format("D"))}
          formatWeekday={(locale, date) => (moment(date).format("D"))}
          formatMonth={(locale, date) => (moment(date).format("MM"))}
          formatYear={(locale, date) => (moment(date).format("YYYY"))}
          formatLongDate={(locale, date) => (moment(date).format("YYYY-MM-DD"))}
          formatMonthYear={(locale, date) => (moment(date).format("YYYY-MM"))}
          // 월화수목금토일 한글로 표시
          formatShortWeekday={(locale, date) => {
            const day = moment(date).format("d");
            const week = ["일", "월", "화", "수", "목", "금", "토"];
            return week[day];
          }}
          onClickDay={(date) => {
            SEND.id = "";
            SEND.startDt = formatDate(date);
            SEND.endDt = formatDate(date);
            SEND.category = "";
            SEND.toDetail = "/calendar/detail";
            navParam(SEND.toDetail, {
              state: SEND
            });
          }}
          tileClassName={({date, view}) => {
            return "calendar-tile-text";
          }}
          tileContent={({date, view}) => {
            const calendarForDates = OBJECT?.filter((calendar) => (
              dateInRange(date, calendar.calendar_startDt, calendar.calendar_endDt)
            ));
            return (
              <React.Fragment>
                {calendarForDates.length > 0 ? activeLine(calendarForDates) : unActiveLine(calendarForDates)}
              </React.Fragment>
            );
          }}
        />
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <div className={"calendar-list-wrapper"}>
          {tableSection()}
        </div>
      </React.Fragment>
    );
  };

  // 9. loading ----------------------------------------------------------------------------------->
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

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {LOADING ? loadingNode() : tableNode()}
              </Grid2>
            </Grid2>
          </Container>
      </Card>
    </React.Fragment>
  );
};