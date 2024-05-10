// CalendarList.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {moment, axios, Calendar} from "../../import/ImportLibs";
import {useDate, useStorage, useTime} from "../../import/ImportHooks";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Loading} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis";
import {Popover, bindPopover} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";

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

  // 2-2. useState -------------------------------------------------------------------------------->
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

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().endOf("month").format("YYYY-MM-DD")
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
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

  // 7. table ------------------------------------------------------------------------------------->
  const TableNode = () => {
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
            <Box key={calendar._id} className={"calendar-filled"}
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
            </Box>
          ))
        ))}
      </React.Fragment>
    );
    const unActiveLine = (calendarForDates) => (
      <React.Fragment>
        {calendarForDates?.map((calendar) => (
          calendar.calendar_section.map((section) => (
            <Box key={calendar._id} className={"calendar-unfilled"}>
              <span className={"calendar-category"}>{section.calendar_title}</span>
            </Box>
          ))
        ))}
      </React.Fragment>
    );
    // 7-7. table
    const tableSection = () => (
      <React.Fragment>
        <Calendar
          view={"month"}
          value={new Date()}
          showNavigation={true}
          showNeighboringMonth={true}
          showDoubleView={false}
          prevLabel={<CustomIcons name={"BiChevronLeft"} className={"w-24 h-24 dark"} />}
          nextLabel={<CustomIcons name={"BiChevronRight"} className={"w-24 h-24 dark"} />}
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

  // 14. loading ---------------------------------------------------------------------------------->
  const LoadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Header />
      <NavBar />
      {LOADING ? <LoadingNode /> : <TableNode />}
    </React.Fragment>
  );
};