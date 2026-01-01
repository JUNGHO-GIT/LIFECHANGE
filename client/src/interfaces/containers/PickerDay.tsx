/**
 * @file PickerDay.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { React, memo, useEffect, useState } from "@exportReacts";
import { Btn, Div, Grid, Icons, Img } from "@exportComponents";
import { Input, PopUp, Select } from "@exportContainers";
import { useCommonDate, useCommonValue, useStorageLocal } from "@exportHooks";
import { AdapterMoment, Badge, DateCalendar, LocalizationProvider, MenuItem, PickersDay } from "@exportMuis";
import { setSession } from "@exportScripts";
import { useStoreLanguage } from "@exportStores";

// -------------------------------------------------------------------------------------------------
declare interface PickerDayProps {
  DATE: {
    dateType: string;
    dateStart: string;
    dateEnd: string;
  };
  setDATE: React.Dispatch<React.SetStateAction<{
    dateType: string;
    dateStart: string;
    dateEnd: string;
  }>>;
  EXIST: {
    day: string[];
    week: string[];
    month: string[];
    year: string[];
    select: string[];
  };
}

// -------------------------------------------------------------------------------------------------
export const PickerDay = memo((
  { DATE, setDATE, EXIST }: PickerDayProps,
) => {

  // 1. common ----------------------------------------------------------------------------------
  const { PATH, localLang, localTimeZone } = useCommonValue();
  const { isGoalList, isGoalDetail } = useCommonValue();
  const { isRecordList, isRecordDetail } = useCommonValue();
  const { isCalendarDetail } = useCommonValue();
  const { isList, isDetail } = useCommonValue();
  const { getDayFmt, getDayNotFmt, getDayStartFmt, getDayEndFmt } = useCommonDate();
  const { getPrevDayStartFmt, getPrevDayEndFmt } = useCommonDate();
  const { getNextDayStartFmt, getNextDayEndFmt } = useCommonDate();
  const { getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getPrevWeekStartFmt, getPrevWeekEndFmt } = useCommonDate();
  const { getNextWeekStartFmt, getNextWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { getPrevMonthStartFmt, getPrevMonthEndFmt } = useCommonDate();
  const { getNextMonthStartFmt, getNextMonthEndFmt } = useCommonDate();
  const { getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { getPrevYearStartFmt, getPrevYearEndFmt } = useCommonDate();
  const { getNextYearStartFmt, getNextYearEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ dateStrInSave, setDateStrInSave ] = useState<string>(``);
  const [ dateStrInList, setDateStrInList ] = useState<string>(``);
  const [ dateClassInSave, setDateClassInSave ] = useState<string>(``);
  const [ dateClassInList, setDateClassInList ] = useState<string>(``);

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [ dateTypeInSave, setDateTypeInSave ] = useState<string>(``);
  const [ dateTypeInList, setDateTypeInList ] = useStorageLocal(
    `type`, `list`, PATH, (
      `month`
    ),
  );

  // 2-2. useEffect -----------------------------------------------------------------------------
  /* useEffect(() => {
    console.log(`
      DATE: ${JSON.stringify(DATE, null, 2)}
      dateStrInSave: ${dateStrInSave}
      dateStrInList: ${dateStrInList}
      dateTypeInSave: ${dateTypeInSave}
      dateTypeInList: ${dateTypeInList}
    `);
  }, [ dateStrInSave, dateStrInList, dateTypeInSave, dateTypeInList ]); */

  // 2-2. useEffect -----------------------------------------------------------------------------
  // - 화면 로딩시 초기값 설정 1
  // - 클래스 설정
  useEffect(() => {
    if (isList) {
      setDateClassInSave(`h-min-0px h-5vh fs-0-8rem pointer`);
      setDateClassInList(`h-min-0px h-5vh fs-0-8rem pointer`);
    }
    else {
      setDateClassInSave(`h-min-40px fs-0-8rem pointer`);
      setDateClassInList(`h-min-40px fs-0-8rem pointer`);
    }
  }, []);

  // 2-2. useEffect -----------------------------------------------------------------------------
  // - 화면 로딩시 초기값 설정 2
  // - 리스트 설정
  useEffect(() => {
    // 1. Goal
    if (isGoalList) {
      if (dateTypeInList === `day`) {
        setDATE({
          dateType: `day`,
          dateStart: DATE?.dateStart ?? getDayFmt(),
          dateEnd: DATE?.dateEnd ?? getDayFmt(),
        });
      }
      else if (dateTypeInList === `week`) {
        setDATE({
          dateType: `week`,
          dateStart: DATE?.dateStart ?? getWeekStartFmt(),
          dateEnd: DATE?.dateEnd ?? getWeekEndFmt(),
        });
      }
      else if (dateTypeInList === `month`) {
        setDATE({
          dateType: `month`,
          dateStart: DATE?.dateStart ?? getMonthStartFmt(),
          dateEnd: DATE?.dateEnd ?? getMonthEndFmt(),
        });
      }
      else if (dateTypeInList === `year`) {
        setDATE({
          dateType: `year`,
          dateStart: DATE?.dateStart ?? getYearStartFmt(),
          dateEnd: DATE?.dateEnd ?? getYearEndFmt(),
        });
      }
    }

    // 4. Record
    else if (isRecordList) {
      if (dateTypeInList === `day`) {
        setDATE({
          dateType: `day`,
          dateStart: DATE?.dateStart ?? getDayFmt(),
          dateEnd: DATE?.dateEnd ?? getDayFmt(),
        });
      }
      else if (dateTypeInList === `week`) {
        setDATE({
          dateType: `week`,
          dateStart: DATE?.dateStart ?? getWeekStartFmt(),
          dateEnd: DATE?.dateEnd ?? getWeekEndFmt(),
        });
      }
      else if (dateTypeInList === `month`) {
        setDATE({
          dateType: `month`,
          dateStart: DATE?.dateStart ?? getMonthStartFmt(),
          dateEnd: DATE?.dateEnd ?? getMonthEndFmt(),
        });
      }
      else if (dateTypeInList === `year`) {
        setDATE({
          dateType: `year`,
          dateStart: DATE?.dateStart ?? getYearStartFmt(),
          dateEnd: DATE?.dateEnd ?? getYearEndFmt(),
        });
      }
    }
  }, []);

  // 2-2. useEffect -----------------------------------------------------------------------------
  // - 화면 로딩시 초기값 설정 3
  // - 상세 설정
  // - 리스트에서 디테일로 들어가기 때문에 dateTypeInList 사용
  // - 목표 = 주, 월, 년만 가능
  // - 기록 = 일 만 가능
  useEffect(() => {
    // 1. Goal
    if (isGoalDetail) {
      if (dateTypeInList === `week`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `week`,
          dateStart: getWeekStartFmt(prev.dateStart),
          dateEnd: getWeekEndFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInList === `month`) {
        setDATE({
          dateType: `month`,
          dateStart: getMonthStartFmt(),
          dateEnd: getMonthEndFmt(),
        });
      }
      else if (dateTypeInList === `year`) {
        setDATE({
          dateType: `year`,
          dateStart: getYearStartFmt(),
          dateEnd: getYearEndFmt(),
        });
      }
    }

    // 2. Record
    else if (isRecordDetail) {
      setDATE((prev) => ({
        ...prev,
        dateType: `day`,
        dateStart: getDayFmt(prev.dateStart),
        dateEnd: getDayFmt(prev.dateStart),
      }));
    }
  }, []);

  // 2-3. useEffect -----------------------------------------------------------------------------
  // - 리스트에서 타입 변경시 처리 (일, 주, 월, 년)
  useEffect(() => {
    // 1. Goal - List
    if (isGoalList) {
      if (dateTypeInList === `day`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `day`,
          dateStart: getDayFmt(prev.dateStart),
          dateEnd: getDayFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInList === `week`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `week`,
          dateStart: getWeekStartFmt(prev.dateStart),
          dateEnd: getWeekEndFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInList === `month`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `month`,
          dateStart: getMonthStartFmt(prev.dateStart),
          dateEnd: getMonthEndFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInList === `year`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `year`,
          dateStart: getYearStartFmt(prev.dateStart),
          dateEnd: getYearEndFmt(prev.dateStart),
        }));
      }
    }

    // 4. Record - List
    else if (isRecordList) {
      if (dateTypeInList === `day`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `day`,
          dateStart: getDayFmt(prev.dateStart),
          dateEnd: getDayFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInList === `week`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `week`,
          dateStart: getWeekStartFmt(prev.dateStart),
          dateEnd: getWeekEndFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInList === `month`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `month`,
          dateStart: getMonthStartFmt(prev.dateStart),
          dateEnd: getMonthEndFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInList === `year`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `year`,
          dateStart: getYearStartFmt(prev.dateStart),
          dateEnd: getYearEndFmt(prev.dateStart),
        }));
      }
    }
  }, [dateTypeInList]);

  // 2-3. useEffect -----------------------------------------------------------------------------
  // - 상세에서 타입 변경시 처리 (일, 주, 월, 년)
  useEffect(() => {
    // 1. Goal - Detail
    if (isGoalDetail) {
      if (dateTypeInSave === `day`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `day`,
          dateStart: getDayFmt(prev.dateStart),
          dateEnd: getDayFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInSave === `week`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `week`,
          dateStart: getWeekStartFmt(prev.dateStart),
          dateEnd: getWeekEndFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInSave === `month`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `month`,
          dateStart: getMonthStartFmt(prev.dateStart),
          dateEnd: getMonthEndFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInSave === `year`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `year`,
          dateStart: getYearStartFmt(prev.dateStart),
          dateEnd: getYearEndFmt(prev.dateStart),
        }));
      }
    }

    // 2. Record - Detail
    else if (isRecordDetail) {
      if (dateTypeInSave === `day`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `day`,
          dateStart: getDayFmt(prev.dateStart),
          dateEnd: getDayFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInSave === `week`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `week`,
          dateStart: getWeekStartFmt(prev.dateStart),
          dateEnd: getWeekEndFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInSave === `month`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `month`,
          dateStart: getMonthStartFmt(prev.dateStart),
          dateEnd: getMonthEndFmt(prev.dateStart),
        }));
      }
      else if (dateTypeInSave === `year`) {
        setDATE((prev) => ({
          ...prev,
          dateType: `year`,
          dateStart: getYearStartFmt(prev.dateStart),
          dateEnd: getYearEndFmt(prev.dateStart),
        }));
      }
    }
  }, [dateTypeInSave]);

  // --------------------------------------------------------------------------------------------
  // 2-3. useEffect
  // - 타입 및 날짜 변경시 표시 날짜 텍스트 변경
  // - handle 사용해서 월, 일만 표시
  useEffect(() => {

    // 1. List
    if (isList) {
      // ex. 2026-01-15
      if (DATE?.dateType === `day`) {
        setDateStrInList(
          handleDateFormat(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`),
        );
      }
      // ex. 01-15 - 01-21
      else if (DATE?.dateType === `week`) {
        setDateStrInList(
          `${handleDateFormat(getWeekStartFmt(DATE?.dateStart), `mm-dd`)} - ${handleDateFormat(getWeekEndFmt(DATE?.dateStart), `mm-dd`)}`,
        );
      }
      // ex. 01-01 - 01-31
      else if (DATE?.dateType === `month`) {
        setDateStrInList(
          `${handleDateFormat(getMonthStartFmt(DATE?.dateStart), `mm-dd`)} - ${handleDateFormat(getMonthEndFmt(DATE?.dateStart), `mm-dd`)}`,
        );
      }
      // ex. 2026
      else if (DATE?.dateType === `year`) {
        setDateStrInList(
          handleDateFormat(getYearStartFmt(DATE?.dateStart), `yyyy`),
        );
      }
      else {
        setDateStrInList(
          handleDateFormat(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`),
        );
      }
    }

    // 2. Detail
    else if (isDetail) {
      // ex. 2026-01-15
      if (DATE?.dateType === `day`) {
        setDateStrInSave(
          handleDateFormat(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`),
        );
      }
      // ex. 01-15 - 01-21
      else if (DATE?.dateType === `week`) {
        setDateStrInSave(
          `${handleDateFormat(getWeekStartFmt(DATE?.dateStart), `mm-dd`)} - ${handleDateFormat(getWeekEndFmt(DATE?.dateStart), `mm-dd`)}`,
        );
      }
      // ex. 01-01 - 01-31
      else if (DATE?.dateType === `month`) {
        setDateStrInSave(
          `${handleDateFormat(getMonthStartFmt(DATE?.dateStart), `mm-dd`)} - ${handleDateFormat(getMonthEndFmt(DATE?.dateStart), `mm-dd`)}`,
        );
      }
      // ex. 2026
      else if (DATE?.dateType === `year`) {
        setDateStrInSave(
          handleDateFormat(getYearStartFmt(DATE?.dateStart), `yyyy`),
        );
      }
      else {
        setDateStrInSave(
          handleDateFormat(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`),
        );
      }
    }
  }, [ isList, isDetail, DATE?.dateType, DATE?.dateStart, DATE?.dateEnd ]);

  // 4. handle ----------------------------------------------------------------------------
  const handleDateFormat = (str: string, format?: string): string => {
    // 1. yyyy
    if (format === `yyyy`) {
      if (str?.split(`-`).length >= 1) {
        return str.split(`-`)[0];
      }
      return ``;
    }
    // 2. mm-dd
    else if (format === `mm-dd`) {
      if (str?.split(`-`).length === 3) {
        return `${str.split(`-`)[1]}-${str.split(`-`)[2]}`;
      }
      return ``;
    }
    // 3. yyyy-mm-dd
    else if (format === `yyyy-mm-dd`) {
      return str;
    }
    return str;
  };

  // 7. pickerNode  ----------------------------------------------------------------------------
  const pickerNode = () => {

    // 1. dateTypeInList ---------------------------------------------------------------------------------
    const dateTypeInListSection = () => (
      <Select
        label={translate(`dateType`)}
        value={DATE?.dateType ?? dateTypeInList}
        inputclass={`pointer ${dateClassInList}`}
        onChange={(e: any) => {
          setDateTypeInList(e.target.value);
        }}
      >
        {[ `day`, `week`, `month`, `year` ]?.map((item: any) => (
          <MenuItem
            key={item}
            value={item}
            selected={item === dateTypeInList}
          >
            <Div className={`fs-0-8rem`}>
              {translate(item as string)}
            </Div>
          </MenuItem>
        ))}
      </Select>
    );

    // 2. dateTypeInSave ---------------------------------------------------------------------------------
    const dateTypeInSaveSection = () => (
      <Select
        label={translate(`dateType`)}
        value={DATE?.dateType ?? dateTypeInSave}
        inputclass={`pointer ${dateClassInSave}`}
        disabled={!isGoalDetail}
        onChange={(e: any) => {
          if (e.target.value === `day`) {
            setDateTypeInSave(`day`);
          }
          else if (e.target.value === `week`) {
            setDateTypeInSave(`week`);
          }
          else if (e.target.value === `month`) {
            setDateTypeInSave(`month`);
          }
          else if (e.target.value === `year`) {
            setDateTypeInSave(`year`);
          }
        }}
      >
        {isGoalDetail ? (
					[ `week`, `month`, `year` ]?.map((item: any) => (
					  <MenuItem
					    key={item}
					    value={item}
					    selected={item === dateTypeInSave}
					  >
					    <Div className={`fs-0-8rem`}>
					      {translate(item as string)}
					    </Div>
					  </MenuItem>
					))
				) : (
					[`day`]?.map((item: any) => (
					  <MenuItem
					    key={item}
					    value={item}
					    selected={item === dateTypeInSave}
					  >
					    <Div className={`fs-0-8rem`}>
					      {translate(item as string)}
					    </Div>
					  </MenuItem>
					))
				)}
      </Select>
    );

    // 3. day --------------------------------------------------------------------------------------
    const daySection = () => (
      <PopUp
        type={`innerCenter`}
        position={`center`}
        direction={`center`}
        contents={(
          <Grid container={true} spacing={2} className={`w-min-70vw`}>
            <Grid size={12} className={`d-row-center`}>
              <Div className={`fs-1-2rem fw-600 mr-10px`}>
                {translate(`viewDay`)}
              </Div>
              <Div className={`fs-0-8rem fw-500 dark`}>
                {`[${handleDateFormat(getDayFmt(DATE?.dateStart), `yyyy-mm-dd`)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={`d-center`}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DateCalendar
                  timezone={localTimeZone}
                  views={[`day`]}
                  readOnly={false}
                  value={getDayNotFmt(DATE?.dateStart ?? DATE?.dateEnd)}
                  className={`border-1 radius-2`}
                  showDaysOutsideCurrentMonth={true}
                  slotProps={{
                    calendarHeader: {
                      format: `YYYY/MM`,
                    },
                  }}
                  slots={{
                    day: (props) => {
                      const { outsideCurrentMonth, day, ...other } = props;

                      let isSelected: boolean = false;
                      let isBadged: boolean = false;
                      let color: string = ``;
                      let borderRadius: string = ``;
                      let backgroundColor: string = ``;
                      let boxShadow: string = ``;
                      let zIndex: number = 0;
                      // badge 표시는 일 단위로 표시
                      if (EXIST?.day) {
                        EXIST?.day.forEach((item: any) => {
                          if (
                            item.split(` - `) &&
														item.split(` - `)?.length === 2 &&
														getDayFmt(day) >= item.split(` - `)[0] &&
														getDayFmt(day) <= item.split(` - `)[1]
                          ) {
                            isBadged = true;
                          }
                        });
                      }

                      if (DATE?.dateStart && DATE?.dateEnd) {
                        isSelected = DATE?.dateStart === getDayFmt(day);
                      }

                      if (isSelected) {
                        color = `#ffffff`;
                        backgroundColor = `#1976d2`;
                        boxShadow = `0 0 0 0 #1976d2`;
                        borderRadius = `50%`;
                        zIndex = 10;
                      }
                      return (
                        <Badge
                          key={day as unknown as string}
                          badgeContent={``}
                          slotProps={{
                            badge: {
                              style: {
                                width: 3,
                                height: 3,
                                padding: 0,
                                top: 8,
                                left: 30,
                                backgroundColor: isBadged ? `#1976d2` : undefined,
                              },
                            },
                          }}
                        >
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              color: color,
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: boxShadow,
                              zIndex: zIndex,
                            }}
                            onDaySelect={(day) => {
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: getDayFmt(day),
                                dateEnd: getDayFmt(day),
                              }));
                              setSession(`section`, `food`, ``, []);
                            }}
                          />
                        </Badge>
                      );
                    },
                    previousIconButton: (props) => (
                      <Btn
                        {...props}
                        className={`fs-1-4rem`}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getPrevMonthStartFmt(prev.dateStart),
                            dateEnd: getPrevMonthStartFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                    nextIconButton: (props) => (
                      <Btn
                        {...props}
                        className={`fs-1-4rem`}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getNextMonthStartFmt(prev.dateStart),
                            dateEnd: getNextMonthStartFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
        children={(popTrigger: any) => (
          <Input
            label={translate(`date`)}
            value={isList ? dateStrInList : isDetail ? dateStrInSave : ``}
            inputclass={`pointer ${dateClassInList}`}
            readOnly={true}
            startadornment={(
              <Img
                max={25}
                hover={true}
                shadow={false}
                radius={false}
                src={`common1.webp`}
              />
            )}
            endadornment={(
              <Div className={`d-row-center`}>
                <Div className={`mr-n10px`}>
                  <Icons
                    key={`ChevronLeft`}
                    name={`ChevronLeft`}
                    className={`w-20px h-20px`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getPrevDayStartFmt(prev.dateStart),
                        dateEnd: getPrevDayEndFmt(prev.dateStart),
                      }));
                      setSession(`section`, `food`, ``, []);
                    }}
                  />
                </Div>
                <Div className={`mr-n15px`}>
                  <Icons
                    key={`ChevronRight`}
                    name={`ChevronRight`}
                    className={`w-20px h-20px`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getNextDayStartFmt(prev.dateStart),
                        dateEnd: getNextDayEndFmt(prev.dateStart),
                      }));
                      setSession(`section`, `food`, ``, []);
                    }}
                  />
                </Div>
              </Div>
            )}
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      />
    );

    // 4. week -------------------------------------------------------------------------------------
    const weekSection = () => (
      <PopUp
        type={`innerCenter`}
        position={`center`}
        direction={`center`}
        contents={(
          <Grid container={true} spacing={2} className={`w-min-70vw`}>
            <Grid size={12} className={`d-row-center`}>
              <Div className={`fs-1-2rem fw-600 mr-10px`}>
                {translate(`viewWeek`)}
              </Div>
              <Div className={`fs-0-8rem fw-500 dark`}>
                {`[${handleDateFormat(getWeekStartFmt(DATE?.dateStart), `mm-dd`)} - ${handleDateFormat(getWeekEndFmt(DATE?.dateEnd), `mm-dd`)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={`d-center`}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DateCalendar
                  timezone={localTimeZone}
                  views={[`day`]}
                  readOnly={false}
                  value={getDayNotFmt(DATE?.dateStart ?? DATE?.dateEnd)}
                  className={`border-1 radius-2`}
                  showDaysOutsideCurrentMonth={true}
                  slotProps={{
                    calendarHeader: {
                      format: `YYYY/MM`,
                    },
                  }}
                  slots={{
                    day: (props) => {
                      const { outsideCurrentMonth, day, ...other } = props;

                      let isSelected: boolean = false;
                      let isBadged: boolean = false;
                      let isFirst: boolean = false;
                      let isLast: boolean = false;

                      let color: string = ``;
                      let borderRadius: string = ``;
                      let backgroundColor: string = ``;
                      let boxShadow: string = ``;
                      let zIndex: number = 0;

                      // badge 표시는 일 단위로 표시
                      if (EXIST?.day) {
                        EXIST?.day.forEach((item: any) => {
                          if (
                            item.split(` - `) &&
														item.split(` - `)?.length === 2 &&
														getDayFmt(day) >= item.split(` - `)[0] &&
														getDayFmt(day) <= item.split(` - `)[1]
                          ) {
                            isBadged = true;
                          }
                        });
                      }

                      if (DATE?.dateStart && DATE?.dateEnd) {
                        isSelected = DATE?.dateStart <= getDayFmt(day) && DATE?.dateEnd >= getDayFmt(day);
                        isFirst = DATE?.dateStart === getDayStartFmt(day);
                        isLast = DATE?.dateEnd === getDayEndFmt(day);
                      }

                      if (isSelected) {
                        if (isFirst && isLast) {
                          boxShadow = `0 0 0 0 #1976d2`;
                          borderRadius = `50%`;
                        }
                        else if (isFirst) {
                          boxShadow = `5px 0 0 0 #1976d2`;
                          borderRadius = `50% 0 0 50%`;
                        }
                        else if (isLast) {
                          boxShadow = `-5px 0 0 0 #1976d2`;
                          borderRadius = `0 50% 50% 0`;
                        }
                        else {
                          boxShadow = `5px 0 0 0 #1976d2`;
                          borderRadius = `0%`;
                        }
                        color = `#ffffff`;
                        backgroundColor = `#1976d2`;
                        zIndex = 10;
                      }
                      return (
                        <Badge
                          key={day as unknown as string}
                          badgeContent={``}
                          slotProps={{
                            badge: {
                              style: {
                                width: 3,
                                height: 3,
                                padding: 0,
                                top: 8,
                                left: 30,
                                backgroundColor: isBadged ? `#1976d2` : undefined,
                              },
                            },
                          }}
                        >
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              color: color,
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: boxShadow,
                              zIndex: zIndex,
                            }}
                            onDaySelect={(day) => {
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: getWeekStartFmt(day),
                                dateEnd: getWeekEndFmt(day),
                              }));
                            }}
                          />
                        </Badge>
                      );
                    },
                    previousIconButton: (props) => (
                      <Btn
                        {...props}
                        className={`fs-1-4rem`}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getPrevWeekStartFmt(prev.dateStart),
                            dateEnd: getPrevWeekEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                    nextIconButton: (props) => (
                      <Btn
                        {...props}
                        className={`fs-1-4rem`}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getNextWeekStartFmt(prev.dateStart),
                            dateEnd: getNextWeekEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
        children={(popTrigger: any) => (
          <Input
            label={translate(`duration`)}
            value={isList ? dateStrInList : isDetail ? dateStrInSave : ``}
            inputclass={`pointer ${dateClassInList}`}
            readOnly={true}
            startadornment={(
              <Img
                max={25}
                hover={true}
                shadow={false}
                radius={false}
                src={`common1.webp`}
              />
            )}
            endadornment={(
              <Div className={`d-row-center`}>
                <Div className={`mr-n10px`}>
                  <Icons
                    key={`ChevronLeft`}
                    name={`ChevronLeft`}
                    className={`w-20px h-20px`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getPrevWeekStartFmt(prev.dateStart),
                        dateEnd: getPrevWeekEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
                <Div className={`mr-n15px`}>
                  <Icons
                    key={`ChevronRight`}
                    name={`ChevronRight`}
                    className={`w-20px h-20px`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getNextWeekStartFmt(prev.dateStart),
                        dateEnd: getNextWeekEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
              </Div>
            )}
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      />
    );

    // 5. month ------------------------------------------------------------------------------------
    const monthSection = () => (
      <PopUp
        type={`innerCenter`}
        position={`center`}
        direction={`center`}
        contents={(
          <Grid container={true} spacing={2} className={`w-min-70vw`}>
            <Grid size={12} className={`d-row-center`}>
              <Div className={`fs-1-2rem fw-600 mr-10px`}>
                {translate(`viewMonth`)}
              </Div>
              <Div className={`fs-0-8rem fw-500 dark`}>
                {`[${handleDateFormat(getMonthStartFmt(DATE?.dateStart), `mm-dd`)} - ${handleDateFormat(getMonthEndFmt(DATE?.dateEnd), `mm-dd`)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={`d-center`}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DateCalendar
                  timezone={localTimeZone}
                  views={[`day`]}
                  readOnly={false}
                  value={getDayNotFmt(DATE?.dateStart ?? DATE?.dateEnd)}
                  className={`border-1 radius-2`}
                  showDaysOutsideCurrentMonth={true}
                  slotProps={{
                    calendarHeader: {
                      format: `YYYY/MM`,
                    },
                  }}
                  slots={{
                    day: (props) => {
                      const { outsideCurrentMonth, day, ...other } = props;

                      let isSelected: boolean = false;
                      let isBadged: boolean = false;

                      let color: string = ``;
                      let borderRadius: string = ``;
                      let backgroundColor: string = ``;
                      let boxShadow: string = ``;
                      let zIndex: number = 0;

                      // badge 표시는 일 단위로 표시
                      if (EXIST?.day) {
                        EXIST?.day.forEach((item: any) => {
                          if (
                            item.split(` - `) &&
														item.split(` - `)?.length === 2 &&
														getDayFmt(day) >= item.split(` - `)[0] &&
														getDayFmt(day) <= item.split(` - `)[1]
                          ) {
                            isBadged = true;
                          }
                        });
                      }

                      if (DATE?.dateStart && DATE?.dateEnd) {
                        isSelected = DATE?.dateStart === getDayFmt(day) && getDayNotFmt(day).date() === 1;
                      }

                      if (isSelected) {
                        color = `#ffffff`;
                        backgroundColor = `#1976d2`;
                        boxShadow = `0 0 0 0 #1976d2`;
                        borderRadius = `50%`;
                        zIndex = 10;
                      }

                      return (
                        <Badge
                          key={day as unknown as string}
                          badgeContent={``}
                          slotProps={{
                            badge: {
                              style: {
                                width: 3,
                                height: 3,
                                padding: 0,
                                top: 8,
                                left: 30,
                                backgroundColor: isBadged ? `#1976d2` : undefined,
                              },
                            },
                          }}
                        >
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              color: color,
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: boxShadow,
                              zIndex: zIndex,
                            }}
                            onDaySelect={(day) => {
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: getMonthStartFmt(day),
                                dateEnd: getMonthEndFmt(day),
                              }));
                            }}
                          />
                        </Badge>
                      );
                    },
                    previousIconButton: (props) => (
                      <Btn
                        {...props}
                        className={`fs-1-4rem`}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getPrevMonthStartFmt(prev.dateStart),
                            dateEnd: getPrevMonthEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                    nextIconButton: (props) => (
                      <Btn
                        {...props}
                        className={`fs-1-4rem`}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getNextMonthStartFmt(prev.dateStart),
                            dateEnd: getNextMonthEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
        children={(popTrigger: any) => (
          <Input
            label={translate(`duration`)}
            value={isList ? dateStrInList : isDetail ? dateStrInSave : ``}
            inputclass={`pointer ${dateClassInList}`}
            readOnly={true}
            startadornment={(
              <Img
                max={25}
                hover={true}
                shadow={false}
                radius={false}
                src={`common1.webp`}
              />
            )}
            endadornment={(
              <Div className={`d-row-center`}>
                <Div className={`mr-n10px`}>
                  <Icons
                    key={`ChevronLeft`}
                    name={`ChevronLeft`}
                    className={`w-20px h-20px`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getPrevMonthStartFmt(prev.dateStart),
                        dateEnd: getPrevMonthEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
                <Div className={`mr-n15px`}>
                  <Icons
                    key={`ChevronRight`}
                    name={`ChevronRight`}
                    className={`w-20px h-20px`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getNextMonthStartFmt(prev.dateStart),
                        dateEnd: getNextMonthEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
              </Div>
            )}
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      />
    );

    // 6. year -------------------------------------------------------------------------------------
    const yearSection = () => (
      <PopUp
        type={`innerCenter`}
        position={`center`}
        direction={`center`}
        contents={(
          <Grid container={true} spacing={2} className={`w-min-70vw`}>
            <Grid size={12} className={`d-row-center`}>
              <Div className={`fs-1-2rem fw-600 mr-10px`}>
                {translate(`viewYear`)}
              </Div>
              <Div className={`fs-0-8rem fw-500 dark`}>
                {`[${handleDateFormat(getYearStartFmt(DATE?.dateStart), `yyyy`)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={`d-center`}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
                <DateCalendar
                  timezone={localTimeZone}
                  views={[`day`]}
                  readOnly={false}
                  value={getDayNotFmt(DATE?.dateStart ?? DATE?.dateEnd)}
                  className={`border-1 radius-2`}
                  showDaysOutsideCurrentMonth={true}
                  slotProps={{
                    calendarHeader: {
                      format: `YYYY/MM`,
                    },
                  }}
                  slots={{
                    day: (props) => {

                      const { outsideCurrentMonth, day, ...other } = props;

                      let isSelected: boolean = false;
                      let isBadged: boolean = false;

                      let color: string = ``;
                      let borderRadius: string = ``;
                      let backgroundColor: string = ``;
                      let boxShadow: string = ``;
                      let zIndex: number = 0;

                      if (DATE?.dateStart && DATE?.dateEnd) {
                        isSelected = getDayNotFmt(day).month() === 0 && getDayNotFmt(day).date() === 1;
                      }

                      // badge 표시는 일 단위로 표시
                      if (EXIST?.day) {
                        EXIST?.day.forEach((item: any) => {

                          const startYear: string = item.split(` - `)[0].split(`-`)[0];
                          const currentYear: string = getDayFmt(day).split(`-`)[0];
                          const isJanuary: boolean = day.month() === 0;

                          if (startYear === currentYear && isJanuary) {
                            isBadged = true;
                          }
                        });
                      }

                      if (isSelected) {
                        color = `#ffffff`;
                        backgroundColor = `#1976d2`;
                        boxShadow = `0 0 0 0 #1976d2`;
                        borderRadius = `50%`;
                        zIndex = 10;
                      }

                      return (
                        <Badge
                          key={day as unknown as string}
                          badgeContent={``}
                          slotProps={{
                            badge: {
                              style: {
                                width: 3,
                                height: 3,
                                padding: 0,
                                top: 8,
                                left: 30,
                                backgroundColor: isBadged ? `#1976d2` : undefined,
                              },
                            },
                          }}
                        >
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              color: color,
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: boxShadow,
                              zIndex: zIndex,
                            }}
                            onDaySelect={(day) => {
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: getYearStartFmt(day),
                                dateEnd: getYearEndFmt(day),
                              }));
                            }}
                          />
                        </Badge>
                      );
                    },
                    previousIconButton: (props) => (
                      <Btn
                        {...props}
                        className={`fs-1-4rem`}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getPrevYearStartFmt(prev.dateStart),
                            dateEnd: getPrevYearEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                    nextIconButton: (props) => (
                      <Btn
                        {...props}
                        className={`fs-1-4rem`}
                        onClick={() => {
                          setDATE((prev) => ({
                            ...prev,
                            dateStart: getNextYearStartFmt(prev.dateStart),
                            dateEnd: getNextYearEndFmt(prev.dateStart),
                          }));
                        }}
                      >
                        {props.children}
                      </Btn>
                    ),
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}
        children={(popTrigger: any) => (
          <Input
            label={translate(`duration`)}
            value={isList ? dateStrInList : isDetail ? dateStrInSave : ``}
            inputclass={`pointer ${dateClassInList}`}
            readOnly={true}
            startadornment={(
              <Img
                max={25}
                hover={true}
                shadow={false}
                radius={false}
                src={`common1.webp`}
              />
            )}
            endadornment={(
              <Div className={`d-row-center`}>
                <Div className={`mr-n10px`}>
                  <Icons
                    key={`ChevronLeft`}
                    name={`ChevronLeft`}
                    className={`w-20px h-20px`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getPrevYearStartFmt(prev.dateStart),
                        dateEnd: getPrevYearEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
                <Div className={`mr-n15px`}>
                  <Icons
                    key={`ChevronRight`}
                    name={`ChevronRight`}
                    className={`w-20px h-20px`}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev) => ({
                        ...prev,
                        dateStart: getNextYearStartFmt(prev.dateStart),
                        dateEnd: getNextYearEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
              </Div>
            )}
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      />
    );

    // 10. return ----------------------------------------------------------------------------------
    return (

			// 1-1. 리스트 (Goal)
			isGoalList ? (
				<Grid container={true} spacing={1}>
				  <Grid size={3} className={`d-center`}>
				    {dateTypeInListSection()}
				  </Grid>
				  <Grid size={9} className={`d-center`}>
				    {dateTypeInList === `day` && daySection()}
				    {dateTypeInList === `week` && weekSection()}
				    {dateTypeInList === `month` && monthSection()}
				    {dateTypeInList === `year` && yearSection()}
				  </Grid>
				</Grid>
			)

			// 1-2. 리스트 (Record)
      : isRecordList ? (
        <Grid container={true} spacing={1}>
          <Grid size={3} className={`d-center`}>
            {dateTypeInListSection()}
          </Grid>
          <Grid size={9} className={`d-center`}>
            {dateTypeInList === `day` && daySection()}
            {dateTypeInList === `week` && weekSection()}
            {dateTypeInList === `month` && monthSection()}
            {dateTypeInList === `year` && yearSection()}
          </Grid>
        </Grid>
      )

      // 2-1. 세이브 (Calendar)
      : isCalendarDetail ? (
        <Grid container={true} spacing={1}>
          <Grid size={{ xs: 4, sm: 3 }} className={`d-center`}>
            {dateTypeInSaveSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={`d-center`}>
            {DATE?.dateType === `day` && daySection()}
            {DATE?.dateType === `week` && weekSection()}
            {DATE?.dateType === `month` && monthSection()}
            {DATE?.dateType === `year` && yearSection()}
          </Grid>
        </Grid>
      )

      // 2-2. 세이브 (Goal)
      : isGoalDetail ? (
        <Grid container={true} spacing={1}>
          <Grid size={{ xs: 4, sm: 3 }} className={`d-center`}>
            {dateTypeInSaveSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={`d-center`}>
            {DATE?.dateType === `week` && weekSection()}
            {DATE?.dateType === `month` && monthSection()}
            {DATE?.dateType === `year` && yearSection()}
          </Grid>
        </Grid>
      )

      // 2-3. 세이브 (Record)
      : isRecordDetail ? (
        <Grid container={true} spacing={1}>
          <Grid size={{ xs: 4, sm: 3 }} className={`d-center`}>
            {dateTypeInSaveSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={`d-center`}>
            {DATE?.dateType === `day` && daySection()}
          </Grid>
        </Grid>
      )
      : null
    );
  };

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {pickerNode()}
    </>
  );
});
