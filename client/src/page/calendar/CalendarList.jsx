// CalendarList.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, Calendar} from "../../import/ImportLibs.jsx";
import {useStorage} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Icons, Div} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const CalendarList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: moment().startOf("month").format("YYYY-MM-DD"),
      endDt: moment().endOf("month").format("YYYY-MM-DD")
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    section_id: "",
    refresh: 0,
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    category: "",
    toSave: "/calendar/save"
  });

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
      calendar_content: ""
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

  // 7. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    const formatDate = (date) => (
      moment(date).format("YYYY-MM-DD")
    );
    const dateInRange = (date, startDt, endDt) => {
      const currDate = formatDate(date);
      return currDate >= startDt && currDate <= endDt;
    };
    const activeLine = (calendarForDates) => (
      calendarForDates?.map((calendar) => (
        calendar.calendar_section.map((section) => (
          <Div key={calendar._id} className={"calendar-filled"}
            style={{
              backgroundColor: section.calendar_color
            }}
            onClick={(e) => {
              e.stopPropagation();
              Object.assign(SEND, {
                id: calendar._id,
                section_id: section._id,
                startDt: calendar.calendar_startDt,
                endDt: calendar.calendar_endDt,
              });
              navigate(SEND.toSave, {
                state: SEND
              });
            }}
          >
            <span className={"calendar-category"}>{section.calendar_title}</span>
          </Div>
        ))
      ))
    );
    const unActiveLine = (calendarForDates) => (
      calendarForDates?.map((calendar) => (
        calendar.calendar_section.map((section) => (
          <Div key={calendar._id} className={"calendar-unfilled"}>
            <span className={"calendar-category"}>{section.calendar_title}</span>
          </Div>
        ))
      ))
    );
    // 7-7. table
    const tableFragment = (i) => (
      <Calendar
        key={i}
        locale={"ko"}
        view={"month"}
        value={new Date()}
        showNavigation={true}
        showNeighboringMonth={true}
        showDoubleView={false}
        prevLabel={<Icons name={"TbArrowLeft"} className={"w-24 h-24"} />}
        nextLabel={<Icons name={"TbArrowRight"} className={"w-24 h-24"} />}
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
          Object.assign(SEND, {
            startDt: formatDate(date),
            endDt: formatDate(date)
          });
          navigate(SEND.toSave, {
            state: SEND
          });
        }}
        onActiveStartDateChange={({ activeStartDate, value, view }) => {
          setDATE({
            startDt: moment(activeStartDate).startOf("month").format("YYYY-MM-DD"),
            endDt: moment(activeStartDate).endOf("month").format("YYYY-MM-DD")
          });
        }}
        tileClassName={({date, view}) => {
          // 3개 이상일 경우
          const calendarForDates = OBJECT?.filter((calendar) => (
            dateInRange(date, calendar.calendar_startDt, calendar.calendar_endDt)
          ));
          if (calendarForDates.length > 2) {
            return `calendar-tile over-y-auto`;
          }
          else {
            return `calendar-tile`;
          }
        }}
        tileContent={({date, view}) => {
          const calendarForDates = OBJECT?.filter((calendar) => (
            dateInRange(date, calendar.calendar_startDt, calendar.calendar_endDt)
          ));
          return (
            calendarForDates.length > 0 ? activeLine(calendarForDates) : unActiveLine(calendarForDates)
          );
        }}
      />
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min80vh"}>
        <Div className={"d-column"}>
          {tableFragment(0)}
        </Div>
      </Div>
    );
    // 7-7. return
    return (
      <Paper className={"content-wrapper"}>
        {tableSection()}
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND
      }}
      functions={{
        setDATE, setSEND
      }}
      handlers={{
        navigate
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {LOADING ? loadingNode() : calendarNode()}
      {footerNode()}
    </>
  );
};