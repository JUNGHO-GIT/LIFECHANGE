// CalendarList.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { Calendar } from "@importSchemas";
import { axios, CalendarReact } from "@importLibs";
import { Footer } from "@importLayouts";
import { Icons, Div, Br, Paper, Grid, Card } from "@importComponents";

// -------------------------------------------------------------------------------------------------
export const CalendarList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH } = useCommonValue();
  const { sessionId, navigate, toDetail, localLang } = useCommonValue();
  const { getMoment, getDayFmt, getDayStartFmt, getDayEndFmt, getDayNotFmt } = useCommonDate();
  const { getPrevMonthStartFmt, getPrevMonthEndFmt } = useCommonDate();
  const { getNextMonthStartFmt, getNextMonthEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

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
        DATE: {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd,
        },
      },
    })
    .then((res: any) => {
      setLOADING(false);
      setOBJECT(res.data.result.length > 0 ? res.data.result : [Calendar]);
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {

    // 7-1. dateInRange
    const dateInRange = (date: any, dateStart: any, dateEnd: any) => {
      if (!dateStart || !dateEnd) {
        return false
      }

      const dayFmt = getDayFmt(date)
      const dayStart = getDayStartFmt(dateStart)
      const dayEnd = getDayEndFmt(dateEnd)

      return dayFmt >= dayStart && dayFmt <= dayEnd
    }

    // 7-2. calendar
    const calendarSection = () => {
      const titleFragment = () => (
        <Grid container={true} spacing={2}>
          <Grid size={3} className={"d-row-left"}>
            <Icons
              key={"ArrowLeft"}
              name={"ArrowLeft"}
              className={"w-24px h-24px"}
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
              className={"w-24px h-24px"}
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
                navigate(toDetail, {
                  state: {
                    dateType: "day",
                    dateStart: getDayFmt(value),
                    dateEnd: getDayFmt(value),
                  }
                });
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
                const exerciseForDates = OBJECT.filter((calendar: any) => (
                  dateInRange(date, calendar.exercise_dateStart, calendar.exercise_dateEnd)
                ));
                const foodForDates = OBJECT.filter((calendar: any) => (
                  dateInRange(date, calendar.food_dateStart, calendar.food_dateEnd)
                ));
                const moneyForDates = OBJECT.filter((calendar: any) => (
                  dateInRange(date, calendar.money_dateStart, calendar.money_dateEnd)
                ));
                const sleepForDates = OBJECT.filter((calendar: any) => (
                  dateInRange(date, calendar.sleep_dateStart, calendar.sleep_dateEnd)
                ));
                return (
                  <>
                    {calendarForDates.length > 0 && calendarForDates.map((calendar: any) => (
                      <Div
                        key={`calendar-${calendar._id}`}
                        className={"calendar-filled"}
                        style={{ backgroundColor: "blue" }}
                      >
                        <span className={"calendar-category"}>
                          {"일정"}
                        </span>
                      </Div>
                    ))}
                    {exerciseForDates.length > 0 && exerciseForDates.map((exercise: any) => (
                      <Div
                        key={`exercise-${exercise._id}`}
                        className={"calendar-filled"}
                        style={{ backgroundColor: "green" }}
                      >
                        <span className={"calendar-category"}>
                          {"운동"}
                        </span>
                      </Div>
                    ))}
                    {foodForDates.length > 0 && foodForDates.map((food: any) => (
                      <Div
                        key={`food-${food._id}`}
                        className={"calendar-filled"}
                        style={{ backgroundColor: "orange" }}
                      >
                        <span className={"calendar-category"}>
                          {"음식"}
                        </span>
                      </Div>
                    ))}
                    {moneyForDates.length > 0 && moneyForDates.map((money: any) => (
                      <Div
                        key={`money-${money._id}`}
                        className={"calendar-filled"}
                        style={{ backgroundColor: "purple" }}
                      >
                        <span className={"calendar-category"}>
                          {"가계부"}
                        </span>
                      </Div>
                    ))}
                    {sleepForDates.length > 0 && sleepForDates.map((sleep: any) => (
                      <Div
                        key={`sleep-${sleep._id}`}
                        className={"calendar-filled"}
                        style={{ backgroundColor: "grey" }}
                      >
                        <span className={"calendar-category"}>
                          {"수면"}
                        </span>
                      </Div>
                    ))}
                  </>
                );
              }}
            />
          </Grid>
        </Grid>
      );
      return (
        <Card className={"d-col-center border-0 shadow-0 radius-0"}>
          {titleFragment()}
          <Br m={20} />
          {calendarFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min-75vh"}>
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