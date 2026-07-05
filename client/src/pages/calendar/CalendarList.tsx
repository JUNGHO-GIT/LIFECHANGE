/**
 * @file CalendarList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { useState, useEffect, useDeferredValue, useMemo, memo } from "@exportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { Calendar, CalendarType } from "@exportSchemas";
import { axios, ReactCalendar } from "@exportLibs";
import { Footer } from "@exportLayouts";
import { PickerDay } from "@exportContainers";
import { Icons, Div, Br, Paper, Grid } from "@exportComponents";

// -------------------------------------------------------------------------------------------------
declare interface CalendarDayItems {
  exercise: CalendarType[];
  food: CalendarType[];
  money: CalendarType[];
  sleep: CalendarType[];
  sectionCount: number;
}

// -------------------------------------------------------------------------------------------------
export const CalendarList = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
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

  // 2-1. useStorageLocal ------------------------------------------------------------------------
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

  // 2-2. useState -------------------------------------------------------------------------------
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

  // 2-2. useDeferredValue ----------------------------------------------------------------------
  // - 달력 타일의 날짜별 항목 계산·렌더를 비긴급으로 분리
  // - 달력 틀이 먼저 그려지고 표식은 다음 프레임에 채워짐
  const deferredObject = useDeferredValue(OBJECT);

  // 2-3. useMemo --------------------------------------------------------------------------------
  const calendarDayMap = useMemo(() => {
    const result: Record<string, CalendarDayItems> = {};
    const ensureDay = (dateKey: string) => {
      result[dateKey] ??= {
        exercise: [],
        food: [],
        money: [],
        sleep: [],
        sectionCount: 0,
      };
      return result[dateKey];
    };
    const addRange = (
      item: CalendarType,
      dateStart: string,
      dateEnd: string,
      category: keyof Omit<CalendarDayItems, `sectionCount`>,
      sectionCount: number,
    ) => {
      const isValid: boolean = Boolean(dateStart) && Boolean(dateEnd) && dateStart !== `0000-00-00` && dateEnd !== `0000-00-00`;
      if (!isValid) {
        return;
      }

      const current = getMoment(getDayStartFmt(dateStart));
      const last = getMoment(getDayEndFmt(dateEnd));
      while (current.isSameOrBefore(last, `day`)) {
        const day = ensureDay(getDayFmt(current.toDate()));
        day[category].push(item);
        day.sectionCount += sectionCount;
        current.add(1, `day`);
      }
    };

    deferredObject?.forEach((item: CalendarType) => {
      addRange(item, item.calendar_exercise_dateStart, item.calendar_exercise_dateEnd, `exercise`, item.calendar_exercise_section?.length ?? 0);
      addRange(item, item.calendar_food_dateStart, item.calendar_food_dateEnd, `food`, item.calendar_food_section?.length ?? 0);
      addRange(item, item.calendar_money_dateStart, item.calendar_money_dateEnd, `money`, item.calendar_money_section?.length ?? 0);
      addRange(item, item.calendar_sleep_dateStart, item.calendar_sleep_dateEnd, `sleep`, item.calendar_sleep_section?.length ?? 0);
    });

    return result;
  }, [ deferredObject, getMoment, getDayFmt, getDayStartFmt, getDayEndFmt ]);

  // 2-3. useEffect -----------------------------------------------------------------------------
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

  // 7. list -----------------------------------------------------------------------------------
  const listNode = () => {

    // 7-2. title
    const titleSection = () => (
      <Grid container={true} spacing={1}>
        <Grid size={3} className={`d-row-left`}>
          <Icons
            key={`ArrowLeft`}
            name={`ArrowLeft`}
            isIconButton={true}
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
          <PickerDay
            DATE={DATE}
            setDATE={setDATE}
            EXIST={EXIST}
          />
        </Grid>
        <Grid size={3} className={`d-row-right`}>
          <Icons
            key={`ArrowRight`}
            name={`ArrowRight`}
            isIconButton={true}
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
        className={`radius-1 border-light-1 shadow-1 over-hidden`}
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
          const dayItems = calendarDayMap[getDayFmt(date)];
          dayItems?.sectionCount > 2 && (className += ` over-y-auto`);

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
          const dayItems = calendarDayMap[getDayFmt(date)];
          const exerciseForDates: CalendarType[] = dayItems?.exercise ?? [];
          const foodForDates: CalendarType[] = dayItems?.food ?? [];
          const moneyForDates: CalendarType[] = dayItems?.money ?? [];
          const sleepForDates: CalendarType[] = dayItems?.sleep ?? [];
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
      <Paper className={`content-wrapper radius-3 border-light-1 shadow-1 h-min-75vh`}>
        {titleSection()}
        <Br m={20} />
        {reactCalendarSection()}
      </Paper>
    );
  };

  // 9. footer ----------------------------------------------------------------------------------
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

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {footerNode()}
    </>
  );
});
