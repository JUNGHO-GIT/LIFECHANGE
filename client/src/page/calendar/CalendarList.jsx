// CalendarList.jsx

import {React, useState, useEffect, useRef} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, Calendar} from "../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Icons, Div} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const CalendarList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-2. useState -------------------------------------------------------------------------------->
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [isExist, setIsExist] = useState([""]);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) ---------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "전체",
      dateStart: moment().startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment().endOf("month").format("YYYY-MM-DD")
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    section_id: "",
    refresh: 0,
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    category: "",
    toSave: "/calendar/save"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    _id: "",
    calendar_number: 0,
    calendar_demo: false,
    calendar_dateType: "",
    calendar_dateStart: "0000-00-00",
    calendar_dateEnd: "0000-00-00",
    calendar_section: [{
      _id: "",
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
        user_id: sessionId,
        DATE: DATE,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 7. calendar ---------------------------------------------------------------------------------->
  const calendarNode = () => {
    const formatDate = (date) => (
      moment(date).format("YYYY-MM-DD")
    );
    const dateInRange = (date, dateStart, dateEnd) => {
      const currDate = formatDate(date);
      return currDate >= dateStart && currDate <= dateEnd;
    };
    const addBtn = (calendarForDates) => (
      calendarForDates?.map((calendar) => (
        calendar.calendar_section?.map((section) => (
          <Div key={calendar._id} className={"calendar-add"}
            onClick={(e) => {
              e.stopPropagation();
              Object.assign(SEND, {
                id: calendar._id,
                section_id: section._id,
                dateStart: calendar.calendar_dateStart,
                dateEnd: calendar.calendar_dateEnd,
              });
              navigate(SEND.toSave, {
                state: SEND
              });
            }}
          >
            <Icons name={"TbPlus"} className={"w-12 h-12"} />
          </Div>
        ))
      ))
    );
    const activeLine = (calendarForDates) => (
      calendarForDates?.map((calendar) => (
        calendar.calendar_section?.map((section) => (
          <Div key={calendar._id} className={"calendar-filled"}
            style={{
              backgroundColor: section.calendar_color
            }}
            onClick={(e) => {
              e.stopPropagation();
              Object.assign(SEND, {
                id: calendar._id,
                section_id: section._id,
                dateStart: calendar.calendar_dateStart,
                dateEnd: calendar.calendar_dateEnd,
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
        // (월 화 수 목 금 토 일) 한글로 표시
        formatShortWeekday={(locale, date) => {
          const day = moment(date).format("d");
          const week = ["일", "월", "화", "수", "목", "금", "토"];
          return week[day];
        }}
        onActiveStartDateChange={({ activeStartDate, value, view }) => {
          setDATE((prev) => ({
            ...prev,
            dateType: "전체",
            dateStart: moment(activeStartDate).startOf("month").format("YYYY-MM-DD"),
            dateEnd: moment(activeStartDate).endOf("month").format("YYYY-MM-DD")
          }));
        }}
        tileClassName={({date, view}) => {
          // 3개 이상일 경우
          const calendarForDates = OBJECT?.filter((calendar) => (
            dateInRange(date, calendar.calendar_dateStart, calendar.calendar_dateEnd)
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
            dateInRange(date, calendar.calendar_dateStart, calendar.calendar_dateEnd)
          ));
          return (
            <>
              {addBtn(calendarForDates)}
              {calendarForDates.length > 0 ? activeLine(calendarForDates) : unActiveLine(calendarForDates)}
            </>
          );
        }}
      />
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
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