// CalendarList.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../imports/ImportReacts.jsx";
import { useCommon, useStorage } from "../../imports/ImportHooks.jsx";
import { moment, axios, Calendar } from "../../imports/ImportLibs.jsx";
import { Loading, Footer } from "../../imports/ImportLayouts.jsx";
import { Icons, Div, Br } from "../../imports/ImportComponents.jsx";
import { Paper, Grid, Card } from "../../imports/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const CalendarList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, PATH, curMonthStart, curMonthEnd, URL_OBJECT, sessionId,
  translate } = useCommon();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `DATE(${PATH})`, {
      dateType: "",
      dateStart: curMonthStart,
      dateEnd: curMonthEnd,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    section_id: "",
    category: "",
    refresh: 0,
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave: "/calendar/save"
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    _id: "",
    calendar_number: 0,
    calendar_dummy: "N",
    calendar_dateType: "",
    calendar_dateStart: "0000-00-00",
    calendar_dateEnd: "0000-00-00",
    calendar_section: [{
      _id: "",
      calendar_part_idx: 0,
      calendar_part_val: "all",
      calendar_color: "#000000",
      calendar_title : "",
      calendar_content: ""
    }]
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res) => {
      setOBJECT(res.data.result && res.data.result.length > 0 ? res.data.result : OBJECT_DEF);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 7. calendar -----------------------------------------------------------------------------------
  const calendarNode = () => {

    const dateInRange = (date=new Date, dateStart="0000-00-00", dateEnd="0000-00-00") => {
      const currDate = moment(date).tz("Asia/Seoul").startOf('day');
      const startDate = moment(dateStart).tz("Asia/Seoul").startOf('day');
      const endDate = moment(dateEnd).tz("Asia/Seoul").endOf('day');

      return currDate.isSameOrAfter(startDate) && currDate.isSameOrBefore(endDate);
    };

    const activeLine = (calendarForDates) => (
      calendarForDates?.map((calendar) =>
        calendar.calendar_section?.map((section) => (
          <Div
            key={`filled-${calendar._id}-${section._id}`}
            className={"calendar-filled"}
            style={{
              backgroundColor: section.calendar_color
            }}
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
            <span className={"calendar-category"}>
              {section.calendar_title}
            </span>
          </Div>
        ))
      )
    );
    const unActiveLine = (calendarForDates) => (
      calendarForDates?.map((calendar) =>
        calendar.calendar_section.map((section) => (
          <Div
            key={`unfilled-${calendar._id}-${section._id}`}
            className={"calendar-unfilled"}
          >
            <span className={"calendar-category"}>
              {section.calendar_title}
            </span>
          </Div>
        ))
      )
    );
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"pt-20 pb-20"} key={`${i}-card`}>
          <Grid container columnSpacing={1} rowSpacing={2}>
            <Calendar
              key={`${i}-calendar`}
              locale={"ko"}
              view={"month"}
              value={new Date(DATE.dateStart)}
              showNavigation={true}
              showNeighboringMonth={true}
              showDoubleView={false}
              prev2Label={null}
              next2Label={null}
              prevLabel={<Icons name={"TbArrowLeft"} className={"w-24 h-24"} onClick={() => {}} />}
              nextLabel={<Icons name={"TbArrowRight"} className={"w-24 h-24"} onClick={() => {}} />}
              formatDay={(locale, date) => moment(date).tz("Asia/Seoul").format("D")}
              formatWeekday={(locale, date) => moment(date).tz("Asia/Seoul").format("d")}
              formatMonth={(locale, date) => moment(date).tz("Asia/Seoul").format("MM")}
              formatYear={(locale, date) => moment(date).tz("Asia/Seoul").format("YYYY")}
              formatLongDate={(locale, date) => moment(date).tz("Asia/Seoul").format("YYYY-MM-DD")}
              formatMonthYear={(locale, date) => moment(date).tz("Asia/Seoul").format("YYYY-MM")}
              formatShortWeekday={(locale, date) => {
                const day = moment(date).tz("Asia/Seoul").format("d");
                const week = [
                  translate("sun"), translate("mon"), translate("tue"), translate("wed"),
                  translate("thu"), translate("fri"), translate("sat")
                ];
                return week[day];
              }}
              onClickDay={(value) => {
                const calendarForDate = OBJECT.filter((calendar) =>
                  dateInRange(value, calendar.calendar_dateStart, calendar.calendar_dateEnd)
                );
                
                // 항목이 없는 경우에만 클릭 이벤트를 발생시킴
                if (calendarForDate.length === 0) {
                  Object.assign(SEND, {
                    id: "",
                    section_id: "",
                    dateType: "day",
                    dateStart: moment(value).tz("Asia/Seoul").format("YYYY-MM-DD"),
                    dateEnd: moment(value).tz("Asia/Seoul").format("YYYY-MM-DD"),
                  });
                  navigate(SEND.toSave, {
                    state: SEND
                  });
                }
              }}
              tileClassName={({ date, view }) => {
                let className = "calendar-tile";
                let isToday = moment(date).isSame(new Date(), 'day');

                const calendarForDates = OBJECT.filter((calendar) => (
                  dateInRange(date, calendar.calendar_dateStart, calendar.calendar_dateEnd)
                ));
                if (calendarForDates.length > 0) {
                  const hasManySections = calendarForDates.some((calendar) => (
                    calendar.calendar_section.length > 2
                  ));
                  if (hasManySections) {
                    className += " over-y-auto";
                  }
                }
                if (isToday) {
                  className += " calendar-today";
                }

                return className;
              }}
              tileContent={({ date, view }) => {
                const calendarForDates = OBJECT.filter((calendar) => (
                  dateInRange(date, calendar.calendar_dateStart, calendar.calendar_dateEnd)
                ));
                const content
                  = calendarForDates.length > 0
                  ? activeLine(calendarForDates)
                  : unActiveLine(calendarForDates);
                return content;
              }}
            />
          </Grid>
        </Card>
      );
      return (
        LOADING ? <Loading /> : cardFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min60vh"}>
        <Grid container columnSpacing={1} rowSpacing={2}>
          <Grid size={12}>
            {cardSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND
      }}
      setState={{
        setDATE, setSEND
      }}
      flow={{
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