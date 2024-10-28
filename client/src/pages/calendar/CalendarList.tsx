// CalendarList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { Calendar } from "@imports/ImportSchemas";
import { axios, CalendarReact } from "@imports/ImportUtils";
import { Footer } from "@imports/ImportLayouts";
import { Icons, Div, Br } from "@imports/ImportComponents";
import { Paper, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const CalendarList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH } = useCommonValue();
  const { sessionId, navigate, toDetail, localLang } = useCommonValue();
  const { getMoment, getDayFmt, getDayStartFmt, getDayEndFmt, getDayNotFmt } = useCommonDate();
  const { getPrevMonthStartFmt, getPrevMonthEndFmt } = useCommonDate();
  const { getNextMonthStartFmt, getNextMonthEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();

  // 2-1. useStorageLocal ------------------------------------------------------------------------
  const [DATE, setDATE] = useStorageLocal(
    "date", PATH, "", {
      dateType: "",
      dateStart: getMonthStartFmt(),
      dateEnd: getMonthEndFmt(),
    }
  );
  const [PAGING, _setPAGING] = useStorageLocal(
    "paging", PATH, "", {
      sort: "asc",
      page: 1,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState<any>([Calendar]);
  const [EXIST, setEXIST] = useState<any>({
    day: [""],
    week: [""],
    month: [""],
    year: [""],
    select: [""],
  });
  const [SEND, setSEND] = useState<any>({
    id: "",
    section_id: "",
    category: "",
    refresh: 0,
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result.length > 0 ? res.data.result : [Calendar]);
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {

    // 7-1. dateInRange
    const dateInRange = (date: any, dateStart: any, dateEnd: any) => {
      const dayFmt = getDayFmt(date);
      const dayStart = getDayStartFmt(dateStart);
      const dayEnd = getDayEndFmt(dateEnd);

      return dayFmt >= dayStart && dayFmt <= dayEnd;
    };
    // 7-2. activeLine
    const activeLine = (calendarForDates: any) => (
      calendarForDates?.map((calendar: any) =>
        calendar.calendar_section?.map((section: any) => (
          <Div
            key={`filled-${calendar._id}-${section._id}`}
            className={"calendar-filled"}
            style={{
              backgroundColor: section.calendar_color
            }}
            onClick={(e: any) => {
              e.stopPropagation();
              navigate(toDetail, {
                state: {
                  id: calendar._id,
                  section_id: section._id,
                  dateType: calendar.calendar_dateType,
                  dateStart: calendar.calendar_dateStart,
                  dateEnd: calendar.calendar_dateEnd,
                }
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
    // 7-3. unActiveLine
    const unActiveLine = (calendarForDates: any) => (
      calendarForDates?.map((calendar: any) =>
        calendar.calendar_section.map((section: any) => (
          <Div key={`unfilled-${calendar._id}-${section._id}`} className={"calendar-unfilled"}>
            <span className={"calendar-category"}>
              {section.calendar_title}
            </span>
          </Div>
        ))
      )
    );

    // 7-5. calendar
    const calendarSection = () => {
      const titleFragment = () => (
        <Grid container={true} spacing={2}>
          <Grid size={3} className={"d-row-left"}>
            <Icons
              key={"ArrowLeft"}
              name={"ArrowLeft"}
              className={"w-24 h-24"}
              onClick={() => {
                setDATE((prev: any) => ({
                  ...prev,
                  dateStart: getPrevMonthStartFmt(prev.dateStart),
                  dateEnd: getPrevMonthEndFmt(prev.dateStart),
                }));
              }}
            />
          </Grid>
          <Grid size={6} className={"d-row-center"}>
            <Div
              className={"fs-1-4rem fw-500"}
              onClick={() => {
                setDATE((prev: any) => ({
                  ...prev,
                  dateStart: getMonthStartFmt(),
                  dateEnd: getMonthEndFmt(),
                }));
              }}
            >
              {getDayNotFmt(DATE.dateStart).format("YYYY-MM")}
            </Div>
          </Grid>
          <Grid size={3} className={"d-row-right"}>
            <Icons
              key={"ArrowRight"}
              name={"ArrowRight"}
              className={"w-24 h-24"}
              onClick={() => {
                setDATE((prev: any) => ({
                  ...prev,
                  dateStart: getNextMonthStartFmt(prev.dateStart),
                  dateEnd: getNextMonthEndFmt(prev.dateStart),
                }));
              }}
            />
          </Grid>
        </Grid>
      );
      const calendarFragment = () => (
        <Grid container={true} spacing={0}>
          <Grid size={12} className={"d-row-center"}>
            <CalendarReact
              view={"month"}
              locale={localLang}
              calendarType={"gregory"}
              value={getMoment(DATE.dateStart).toDate()}
              showNavigation={false}
              showDoubleView={false}
              showNeighboringMonth={true}
              prev2Label={null}
              next2Label={null}
              formatDay={(_locale, date) => getDayNotFmt(date).format("D")}
              formatWeekday={(_locale, date) => getDayNotFmt(date).format("d")}
              formatMonth={(_locale, date) => getDayNotFmt(date).format("MM")}
              formatYear={(_locale, date) => getDayNotFmt(date).format("YYYY")}
              formatLongDate={(_locale, date) => getDayNotFmt(date).format("YYYY-MM-DD")}
              formatMonthYear={(_locale, date) => getDayNotFmt(date).format("YYYY-MM")}
              onActiveStartDateChange={({ activeStartDate }) => {
                setDATE((prev: any) => ({
                  ...prev,
                  dateStart: getMonthStartFmt(activeStartDate),
                  dateEnd: getMonthEndFmt(activeStartDate),
                }));
              }}
              onClickDay={(value: Date) => {
                const calendarForDate = OBJECT.filter((calendar: any) => (
                  dateInRange(value, calendar.calendar_dateStart, calendar.calendar_dateEnd)
                ));
                // 항목이 없는 경우에만 클릭 가능
                if (calendarForDate.length === 0) {
                  navigate(toDetail, {
                    state: {
                      id: "",
                      section_id: "",
                      dateType: "day",
                      dateStart: getDayFmt(value),
                      dateEnd: getDayFmt(value),
                    }
                  });
                }
              }}
              tileClassName={({ date }) => {

                // 토요일
                let isSat = getMoment(date).day() === 6;

                // 일요일
                let isSun = getMoment(date).day() === 0;

                // 오늘
                let isToday = getMoment(date).isSame(new Date(), 'day');

                // 이번달
                let isCurrentMonth = getMoment(date).isSame(getMoment(DATE.dateStart), 'month');

                // 섹션이 3개 이상인 경우 스크롤
                let className = "calendar-tile";
                const calendarForDates = OBJECT.filter((calendar: any) => (
                  dateInRange(date, calendar.calendar_dateStart, calendar.calendar_dateEnd)
                ));
                if (calendarForDates.length > 0) {
                  const hasManySections = calendarForDates.some((calendar: any) => (
                    calendar.calendar_section.length > 2
                  ));
                  if (hasManySections) {
                    className += " over-y-auto";
                  }
                }

                // 토요일 색상 변경
                if (isSat) {
                  className += " calendar-sat";
                }

                // 일요일 색상 변경
                if (isSun) {
                  className += " calendar-sun";
                }

                // 오늘 날짜
                if (isToday) {
                  className += " calendar-today";
                }

                // 이전달 or 다음달
                if (!isCurrentMonth) {
                  className += " calendar-outside";
                }
                return className;
              }}
              tileContent={({ date }) => {
                const calendarForDates = OBJECT.filter((calendar: any) => (
                  dateInRange(date, calendar.calendar_dateStart, calendar.calendar_dateEnd)
                ));
                const content = (
                  calendarForDates.length > 0
                  ? activeLine(calendarForDates)
                  : unActiveLine(calendarForDates)
                );
                return content;
              }}
            />
          </Grid>
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {titleFragment()}
          <Br px={20} />
          {calendarFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        {calendarSection()}
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, EXIST
      }}
      setState={{
        setDATE, setSEND, setEXIST
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {footerNode()}
    </>
  );
};