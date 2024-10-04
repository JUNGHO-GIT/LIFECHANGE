// CalendarList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorage } from "@imports/ImportHooks";
import { Calendar } from "@imports/ImportSchemas";
import { moment, axios, CalendarReact } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Icons, Div } from "@imports/ImportComponents";
import { Paper, Grid, Card } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const CalendarList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, TITLE } = useCommonValue();
  const { sessionId, navigate, toDetail, localLocale } = useCommonValue();
  const { monthStartFmt, monthEndFmt } = useCommonDate();
  const { getDayFmt, getDayStartFmt, getDayEndFmt, getDayNotFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt } = useCommonDate();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `${TITLE}_date_(${PATH})`, {
      dateType: "",
      dateStart: monthStartFmt,
      dateEnd: monthEndFmt,
    }
  );
  const [PAGING, setPAGING] = useStorage(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>([Calendar]);
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
    setLOADING(true);
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
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {

    const dateInRange = (date: any, dateStart: any, dateEnd: any) => {
      const dayFmt = getDayFmt(date);
      const dayStart = getDayStartFmt(dateStart);
      const dayEnd = getDayEndFmt(dateEnd);

      return dayFmt >= dayStart && dayFmt <= dayEnd;
    };

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
    const unActiveLine = (calendarForDates: any) => (
      calendarForDates?.map((calendar: any) =>
        calendar.calendar_section.map((section: any) => (
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
    // 7-3. list
    const listSection = () => {
      const listFragment = (i: number) => (
        <Card className={"pt-20 pb-20"} key={`${i}-card`}>
          <Grid container spacing={2} columns={12}>
            <CalendarReact
              key={`${i}-calendar`}
              view={"month"}
              locale={localLocale}
              calendarType={"gregory"}
              value={new Date(DATE.dateStart)}
              showNavigation={true}
              showNeighboringMonth={true}
              showDoubleView={false}
              prev2Label={null}
              next2Label={null}
              formatDay={(locale, date) => getDayNotFmt(date).format("D")}
              formatWeekday={(locale, date) => getDayNotFmt(date).format("d")}
              formatMonth={(locale, date) => getDayNotFmt(date).format("MM")}
              formatYear={(locale, date) => getDayNotFmt(date).format("YYYY")}
              formatLongDate={(locale, date) => getDayNotFmt(date).format("YYYY-MM-DD")}
              formatMonthYear={(locale, date) => getDayNotFmt(date).format("YYYY-MM")}
              prevLabel={
                <Icons
                  key={"ArrowLeft"}
                  name={"ArrowLeft"}
                  className={"w-24 h-24"}
                />
              }
              nextLabel={
                <Icons
                  key={"ArrowRight"}
                  name={"ArrowRight"}
                  className={"w-24 h-24"}
                />
              }
              onActiveStartDateChange={({ activeStartDate, view }) => {
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
              tileClassName={({ date, view }) => {
                let className = "calendar-tile";
                // 토요일
                let isSat = moment(date).day() === 6;
                // 일요일
                let isSun = moment(date).day() === 0;
                // 오늘
                let isToday = moment(date).isSame(new Date(), 'day');
                // 이번달
                let isCurrentMonth = moment(date).isSame(moment(DATE.dateStart), 'month');

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
              tileContent={({ date, view }) => {
                const calendarForDates = OBJECT.filter((calendar: any) => (
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
        listFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 h-min75vh"}>
        <Grid container spacing={2} columns={12}>
          <Grid size={12}>
            {!LOADING ? listSection() : <Loading />}
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