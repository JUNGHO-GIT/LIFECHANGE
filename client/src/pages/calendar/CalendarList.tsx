/**
 * @file CalendarList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { Calendar, CalendarType } from "@exportSchemas";
import { axios, ReactCalendar } from "@exportLibs";
import { Footer } from "@exportLayouts";
import { Icons, Div, Br, Paper, Grid } from "@exportComponents";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const CalendarList = memo(() => {

  // 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const {
    URL_OBJECT, PATH, sessionId, navigate, localLang,
  } = useCommonValue();
  const { getMoment, getDayFmt, getDayStartFmt, getDayEndFmt, getDayNotFmt } = useCommonDate();
  const { getPrevMonthStartFmt, getPrevMonthEndFmt } = useCommonDate();
  const { getNextMonthStartFmt, getNextMonthEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const [ DATE, setDATE ] = useStorageLocal(
    `date`, PATH, ``, {
      dateType: ``,
      dateStart: getMonthStartFmt(),
      dateEnd: getMonthEndFmt(),
    },
  );
  const [ PAGING, _setPAGING ] = useStorageLocal(
    `paging`, PATH, ``, {
      sort: `asc`,
      page: 1,
    },
  );

  // 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const [ OBJECT, setOBJECT ] = useState([Calendar]);
  const [ EXIST, setEXIST ] = useState({
    day: [``],
    week: [``],
    month: [``],
    year: [``],
    select: [``],
  });
  const [ SEND, setSEND ] = useState({
    category: ``,
    refresh: 0,
    dateType: `day`,
    dateStart: `0000-00-00`,
    dateEnd: `0000-00-00`,
  });

  // 2-2. useDeferredValue ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  // 달력 타일의 날짜별 항목 계산·렌더를 비긴급으로 분리: 달력 틀이 먼저 그려지고 표식은 다음 프레임에 채워짐
  const deferredObject = useDeferredValue(OBJECT);

  // 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: {
          dateType: ``,
          dateStart: DATE?.dateStart,
          dateEnd: DATE?.dateEnd,
        },
      },
    })
    .then((res: any) => {
      setLOADING(false);
      setOBJECT(res.data.result?.length > 0 ? res.data.result : [Calendar]);
    })
    .catch((error: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(error.response.data.msg as string),
        severity: `error`,
      });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [ URL_OBJECT, sessionId, DATE?.dateStart, DATE?.dateEnd ]);

  // 7. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const listNode = () => {

    // 7-1. dateInRange
    const dateInRange = (date: any, dateStart: any, dateEnd: any) => {
      const isValid = (d: any) => !!d && d !== `0000-00-00`;
      if (!isValid(dateStart) || !isValid(dateEnd)) {
        return false;
      }
      const dayFmt: string = getDayFmt(date as string | Date);
      const dayStart: string = getDayStartFmt(dateStart as string | Date);
      const dayEnd: string = getDayEndFmt(dateEnd as string | Date);
      return dayFmt >= dayStart && dayFmt <= dayEnd;
    };

    // 7-2. title
    const titleSection = () => (
      <Grid container={true} spacing={1}>
        <Grid size={3} className={`d-row-left`}>
          <Icons
            key={`ArrowLeft`}
            name={`ArrowLeft`}
            color={`dark`}
            fill={`dark`}
            className={`w-24px h-24px`}
            onClick={() => {
              setDATE((prev) => ({
                ...prev,
                dateStart: getPrevMonthStartFmt(prev.dateStart),
                dateEnd: getPrevMonthEndFmt(prev.dateStart),
              }));
            }}
          />
        </Grid>
        <Grid size={6} className={`d-row-center`}>
          <Div
            className={`fs-1-4rem fw-500`}
            onClick={() => {
              setDATE((prev) => ({
                ...prev,
                dateStart: getMonthStartFmt(),
                dateEnd: getMonthEndFmt(),
              }));
            }}
          >
            {getDayNotFmt(DATE?.dateStart).format(`YYYY-MM`)}
          </Div>
        </Grid>
        <Grid size={3} className={`d-row-right`}>
          <Icons
            key={`ArrowRight`}
            name={`ArrowRight`}
            color={`dark`}
            fill={`dark`}
            className={`w-24px h-24px`}
            onClick={() => {
              setDATE((prev) => ({
                ...prev,
                dateStart: getNextMonthStartFmt(prev.dateStart),
                dateEnd: getNextMonthEndFmt(prev.dateStart),
              }));
            }}
          />
        </Grid>
      </Grid>
    );

    // 7-2. reactCalendar
    const reactCalendarSection = () => (
      <ReactCalendar
        view={`month`}
        locale={localLang}
        calendarType={`gregory`}
        value={getMoment(DATE?.dateStart).toDate()}
        showNavigation={false}
        showDoubleView={false}
        showNeighboringMonth={true}
        prev2Label={null}
        next2Label={null}
        formatDay={(_locale, date) => getDayNotFmt(date).format(`D`)}
        formatWeekday={(_locale, date) => getDayNotFmt(date).format(`d`)}
        formatMonth={(_locale, date) => getDayNotFmt(date).format(`MM`)}
        formatYear={(_locale, date) => getDayNotFmt(date).format(`YYYY`)}
        formatLongDate={(_locale, date) => getDayNotFmt(date).format(`YYYY-MM-DD`)}
        formatMonthYear={(_locale, date) => getDayNotFmt(date).format(`YYYY-MM`)}
        className={`border-1 shadow-2 radius-2 over-hidden`}
        onActiveStartDateChange={({ activeStartDate }) => {
          setDATE((prev) => ({
            ...prev,
            dateStart: getMonthStartFmt(activeStartDate ?? new Date()),
            dateEnd: getMonthEndFmt(activeStartDate ?? new Date()),
          }));
        }}
        onClickDay={(value: Date) => {
          void navigate(`/calendar/detail`, {
            state: {
              dateType: `day`,
              dateStart: getDayFmt(value),
              dateEnd: getDayFmt(value),
            },
          });
        }}
        tileClassName={({ date }) => {
          // 토요일
          const isSat: boolean = getMoment(date).day() === 6;

          // 일요일
          const isSun: boolean = getMoment(date).day() === 0;

          // 오늘
          const isToday: boolean = getMoment(date).isSame(new Date(), `day`);

          // 이번달
          const isCurrentMonth: boolean = getMoment(date).isSame(getMoment(DATE?.dateStart), `month`);

          // 섹션이 3개 이상인 경우 스크롤
          let className: string = `calendar-tile`;

          const itemMatchesDate = (item: any) => (
            dateInRange(date, item.calendar_exercise_dateStart, item.calendar_exercise_dateEnd)
            || dateInRange(date, item.calendar_food_dateStart, item.calendar_food_dateEnd)
            || dateInRange(date, item.calendar_money_dateStart, item.calendar_money_dateEnd)
            || dateInRange(date, item.calendar_sleep_dateStart, item.calendar_sleep_dateEnd)
          );
          const calendarForDates: any[] = OBJECT?.filter((element) => {
            return itemMatchesDate(element);
          });

          if (calendarForDates?.length > 0) {
            const sectionsCountFor = (item: any) => (
              Number((dateInRange(
                date, item.calendar_exercise_dateStart, item.calendar_exercise_dateEnd) ? (
                  item.calendar_exercise_section?.length ?? 0
                ) : 0
              )) +
              Number((dateInRange(
                date, item.calendar_food_dateStart, item.calendar_food_dateEnd) ? (
                  item.calendar_food_section?.length ?? 0
                ) : 0
              )) +
              Number((dateInRange(
                date, item.calendar_money_dateStart, item.calendar_money_dateEnd) ? (
                  item.calendar_money_section?.length ?? 0
                ) : 0
              )) +
              Number((dateInRange(
                date, item.calendar_sleep_dateStart, item.calendar_sleep_dateEnd) ? (
                  item.calendar_sleep_section?.length ?? 0
                ) : 0
              ))
            );

            const hasManySections: boolean = calendarForDates.some((item: any) => sectionsCountFor(item) > 2);
            hasManySections && (className += ` over-y-auto`);
          }

          // 토요일 색상 변경
          if (isSat) {
            className += ` calendar-sat`;
          }

          // 일요일 색상 변경
          if (isSun) {
            className += ` calendar-sun`;
          }

          // 오늘 날짜
          if (isToday) {
            className += ` calendar-today`;
          }

          // 이전달 or 다음달
          if (!isCurrentMonth) {
            className += ` calendar-outside`;
          }
          return className;
        }}
        tileContent={({ date }) => {
          const exerciseForDates: CalendarType[] = deferredObject?.filter((item: any) => (
            dateInRange(date, item.calendar_exercise_dateStart, item.calendar_exercise_dateEnd)
          ));
          const foodForDates: CalendarType[] = deferredObject?.filter((item: any) => (
            dateInRange(date, item.calendar_food_dateStart, item.calendar_food_dateEnd)
          ));
          const moneyForDates: CalendarType[] = deferredObject?.filter((item: any) => (
            dateInRange(date, item.calendar_money_dateStart, item.calendar_money_dateEnd)
          ));
          const sleepForDates: CalendarType[] = deferredObject?.filter((item: any) => (
            dateInRange(date, item.calendar_sleep_dateStart, item.calendar_sleep_dateEnd)
          ));
          return (
            <>
              {exerciseForDates?.length > 0 && exerciseForDates.map((item: any) => (
                <Div
                  key={`exercise-${item._id}`}
                  className={`calendar-filled`}
                  style={{ backgroundColor: `#1976d2` }}
                >
                  <span className={`calendar-category`}>
                    {translate(`exercise`)}
                  </span>
                </Div>
              ))}
              {foodForDates?.length > 0 && foodForDates.map((item: any) => (
                <Div
                  key={`food-${item._id}`}
                  className={`calendar-filled`}
                  style={{ backgroundColor: `#FF5722` }}
                >
                  <span className={`calendar-category`}>
                    {translate(`food`)}
                  </span>
                </Div>
              ))}
              {moneyForDates?.length > 0 && moneyForDates.map((item: any) => (
                <Div
                  key={`money-${item._id}`}
                  className={`calendar-filled`}
                  style={{ backgroundColor: `#4CAF50` }}
                >
                  <span className={`calendar-category`}>
                    {translate(`money`)}
                  </span>
                </Div>
              ))}
              {sleepForDates?.length > 0 && sleepForDates.map((item: any) => (
                <Div
                  key={`sleep-${item._id}`}
                  className={`calendar-filled`}
                  style={{ backgroundColor: `#673AB7` }}
                >
                  <span className={`calendar-category`}>
                    {translate(`sleep`)}
                  </span>
                </Div>
              ))}
            </>
          );
        }}
      />
    );

    // 7-10. return
    return (
      <Paper className={`content-wrapper radius-2 border-1 shadow-1 h-min-75vh`}>
        {titleSection()}
        <Br m={10} />
        {reactCalendarSection()}
      </Paper>
    );
  };

  // 9. footer ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  const footerNode = () => (
    <Footer
      state={{
        DATE: DATE, SEND: SEND, EXIST: EXIST,
      }}
      setState={{
        setDATE: setDATE, setSEND: setSEND, setEXIST: setEXIST,
      }}
    />
  );

  // 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
  return (
    <>
      {listNode()}
      {footerNode()}
    </>
  );
});
