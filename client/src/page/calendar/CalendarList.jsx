// CalendarList.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, Calendar} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Icons, Div} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const CalendarList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_CALENDAR || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const PATH = location?.pathname;
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: location_dateStart || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
    dateEnd: location_dateEnd || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
  });
  const [SEND, setSEND] = useState({
    id: "",
    section_id: "",
    refresh: 0,
    dateType: "day",
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

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    _id: "",
    calendar_number: 0,
    calendar_dummy: false,
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

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res) => {
      setOBJECT(res.data.result && res.data.result.length > 0 ? res.data.result : OBJECT_DEF);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 7. calendar -----------------------------------------------------------------------------------
  const calendarNode = () => {
    const formatDate = (date) => (
      moment(date).format("YYYY-MM-DD")
    );
    const dateInRange = (date, dateStart, dateEnd) => {
      const currDate = formatDate(date);
      return currDate >= dateStart && currDate <= dateEnd;
    };
    const activeLine = (calendarForDates) => (
      calendarForDates?.map((calendar) =>
        calendar.calendar_section?.map((section) => (
          <Div
            key={`${calendar?._id}`}
            className={"calendar-filled"}
            style={{ backgroundColor: section.calendar_color }}
            onClick={(e) => {
              e.stopPropagation();
              Object.assign(SEND, {
                id: calendar._id,
                section_id: section._id,
                dateType: calendar.calendar_dateType,
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
      )
    );
    const unActiveLine = (calendarForDates) => (
      calendarForDates?.map((calendar) =>
        calendar.calendar_section.map((section) => (
          <Div key={calendar._id} className={"calendar-unfilled"}>
            <span className={"calendar-category"}>{section.calendar_title}</span>
          </Div>
        ))
      )
    );
    // 7-3. table
    const tableSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const tableFragment = (i) => (
        <Calendar
          key={`${i}`}
          locale={"ko"}
          view={"month"}
          value={new Date(DATE.dateStart)}
          onClickDay={undefined}
          showNavigation={true}
          showNeighboringMonth={true}
          showDoubleView={false}
          prev2Label={null}
          next2Label={null}
          prevLabel={<Icons name={"TbArrowLeft"} className={"w-24 h-24"} onClick={() => {}} />}
          nextLabel={<Icons name={"TbArrowRight"} className={"w-24 h-24"} onClick={() => {}} />}
          formatDay={(locale, date) => moment(date).format("D")}
          formatWeekday={(locale, date) => moment(date).format("d")}
          formatMonth={(locale, date) => moment(date).format("MM")}
          formatYear={(locale, date) => moment(date).format("YYYY")}
          formatLongDate={(locale, date) => moment(date).format("YYYY-MM-DD")}
          formatMonthYear={(locale, date) => moment(date).format("YYYY-MM")}
          formatShortWeekday={(locale, date) => {
            const day = moment(date).format("d");
            const week = [
              translate("sun"), translate("mon"), translate("tue"), translate("wed"),
              translate("thu"), translate("fri"), translate("sat")
            ];
            return week[day];
          }}
          onActiveStartDateChange={({ activeStartDate, value, view }) => {
            setDATE((prev) => ({
              ...prev,
              dateStart: moment(activeStartDate).startOf("month").format("YYYY-MM-DD"),
              dateEnd: moment(activeStartDate).endOf("month").format("YYYY-MM-DD"),
            }));
          }}
          tileClassName={({ date, view }) => {
            const calendarForDates = OBJECT.filter((calendar) => (
              dateInRange(date, calendar.calendar_dateStart, calendar.calendar_dateEnd)
            ));
            const className = calendarForDates.length >= 3 ? "calendar-tile over-y-auto" : "calendar-tile";
            return className;
          }}
          tileContent={({ date, view }) => {
            const calendarForDates = OBJECT.filter((calendar) => (
              dateInRange(date, calendar.calendar_dateStart, calendar.calendar_dateEnd)
            ));
            return calendarForDates.length > 0 ? activeLine(calendarForDates) : unActiveLine(calendarForDates);
          }}
        />
      );
      return (
        LOADING ? loadingFragment() : tableFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none pt-30 pb-80"}>
        <Div className={"block-wrapper h-min76vh"}>
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
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

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {calendarNode()}
      {footerNode()}
    </>
  );
};