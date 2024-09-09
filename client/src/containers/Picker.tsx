// Picker.tsx

import { useEffect, useState } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorage, useTranslate } from "@imports/ImportHooks";
import { Btn, Input, Img, Div, Select, Icons } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { MenuItem, PickersDay, Grid, Card, Badge } from "@imports/ImportMuis";
import { DateCalendar, AdapterMoment, LocalizationProvider } from "@imports/ImportMuis";
import { common1 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
declare interface PickerProps {
  DATE: any;
  setDATE: any;
  EXIST: any;
  setEXIST: any;
}

// -------------------------------------------------------------------------------------------------
export const Picker = (
  { DATE, setDATE, EXIST, setEXIST }: PickerProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt,
    weekStartFmt, weekEndFmt, monthStartFmt, monthEndFmt, yearStartFmt, yearEndFmt,
    getDayFmt, getDayNotFmt,
    getDayStartFmt, getDayEndFmt,
    getWeekStartFmt, getWeekEndFmt,
    getPrevWeekStartFmt, getPrevWeekEndFmt,
    getNextWeekStartFmt, getNextWeekEndFmt,
    getMonthStartFmt, getMonthEndFmt,
    getPrevMonthStartFmt, getPrevMonthEndFmt,
    getNextMonthStartFmt, getNextMonthEndFmt,
    getYearStartFmt, getYearEndFmt,
    getPrevYearStartFmt, getPrevYearEndFmt,
    getNextYearStartFmt, getNextYearEndFmt,
  } = useCommonDate();
  const {
    sessionLocale, sessionTimeZone,
    TITLE, PATH, firstStr, secondStr, thirdStr,
  } = useCommonValue();

  const isToday = firstStr === "today";
  const isFind  = secondStr === "find";
  const isGoalList = secondStr === "goal" && thirdStr === "list";
  const isGoalSave = secondStr === "goal" && thirdStr === "save";
  const isGoalUpdate = secondStr === "goal" && thirdStr === "update";
  const isList = secondStr === "list" && thirdStr === "";
  const isSave = secondStr === "save" && thirdStr === "";
  const isUpdate = secondStr === "update" && thirdStr === "";

  let sessionDate = sessionStorage?.getItem(`DATE(${PATH})`) || "{}";
  let parseDate = JSON?.parse(sessionDate);
  let dateStart = parseDate?.dateStart;
  let dateEnd = parseDate?.dateEnd;

  // 2-1. useState ---------------------------------------------------------------------------------
  const [typeStr, setTypeStr] = useState<string>("");
  const [innerStr, setInnerStr] = useState<string>("");

  // 2-2. useStorage -------------------------------------------------------------------------------
  const [clickedType, setClickedType] = useStorage(
    `${TITLE}_clickedType_(${PATH})`, "thisToday"
  );
  const clickedDate = {
    todayDate: {
      dateType: isToday ? "day" : "",
      dateStart: dayFmt,
      dateEnd: dayFmt,
    },
    weekDate: {
      dateType: isToday ? "day" : "",
      dateStart: weekStartFmt,
      dateEnd: weekEndFmt,
    },
    monthDate: {
      dateType: isToday ? "day" : "",
      dateStart: monthStartFmt,
      dateEnd: monthEndFmt,
    },
    yearDate: {
      dateType: isToday ? "day" : "",
      dateStart: yearStartFmt,
      dateEnd: yearEndFmt,
    },
    selectDate: {
      dateType: isToday ? "day" : "",
      dateStart: dateStart,
      dateEnd: dateEnd,
    }
  };

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isGoalList || isList) {
      setTypeStr("h-min0 h-4vh fs-0-7rem pointer");
      setInnerStr("h-min0 h-4vh fs-0-7rem pointer");
    }
    else if (isGoalSave || isSave || isGoalUpdate || isUpdate || isFind) {
      setTypeStr("h-min40 fs-0-8rem pointer");
      setInnerStr("h-min40 fs-0-8rem pointer");
    }
  }, [PATH]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (!isSave && !isGoalSave && !isGoalUpdate && !isUpdate) {
      if (!dateStart) {
        dateStart = dayFmt;
      }
      if (!dateEnd) {
        dateEnd = dayFmt;
      }
    }
  }, [dateStart, dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (!isSave && !isGoalSave && !isGoalUpdate && !isUpdate) {
      if (clickedType === "thisToday") {
        setDATE(clickedDate?.todayDate);
      }
      else if (clickedType === "thisWeek") {
        setDATE(clickedDate?.weekDate);
      }
      else if (clickedType === "thisMonth") {
        setDATE(clickedDate?.monthDate);
      }
      else if (clickedType === "thisYear") {
        setDATE(clickedDate?.yearDate);
      }
    }
  }, [clickedType]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (!isSave && !isGoalSave && !isGoalUpdate && !isUpdate) {
      if (
        (DATE?.dateStart === clickedDate?.todayDate?.dateStart) &&
        (DATE?.dateEnd === clickedDate?.todayDate?.dateEnd)
      ) {
        setClickedType("thisToday");
      }
      else if (
        (DATE?.dateStart === clickedDate?.weekDate?.dateStart) &&
        (DATE?.dateEnd === clickedDate?.weekDate?.dateEnd)
      ) {
        setClickedType("thisWeek");
      }
      else if (
        (DATE?.dateStart === clickedDate?.monthDate?.dateStart) &&
        (DATE?.dateEnd === clickedDate?.monthDate?.dateEnd)
      ) {
        setClickedType("thisMonth");
      }
      else if (
        (DATE?.dateStart === clickedDate?.yearDate?.dateStart) &&
        (DATE?.dateEnd === clickedDate?.yearDate?.dateEnd)
      ) {
        setClickedType("thisYear");
      }
      else {
        setClickedType("selectDate");
      }
    }
  }, [DATE]);

  // 7. pickerNode ---------------------------------------------------------------------------------
  const pickerNode = () => {

    // 1. day --------------------------------------------------------------------------------------
    const daySection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Card className={"w-max70vw p-0"}>
            <Grid container spacing={3}>
              <Grid size={8} className={"d-left ms-20"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewDay")}
                </Div>
              </Grid>
              <Grid size={2} className={"d-center"}>
                <Icons
                  key={"Refresh"}
                  name={"Refresh"}
                  className={"w-24 h-24"}
                  onClick={() => {
                    setDATE((prev: any) => ({
                      ...prev,
                      dateType: prev.initDateType,
                      dateStart: prev.initDateStart,
                      dateEnd: prev.initDateEnd,
                    }));
                  }}
                />
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={sessionLocale}>
                  <DateCalendar
                    timezone={sessionTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      day: (props) => {

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        const {outsideCurrentMonth, day, ...other} = props;

                        const isInitStart = DATE.initDateStart === getDayStartFmt(day);
                        const isInitEnd = DATE.initDateEnd === getDayEndFmt(day);
                        const isInit = DATE.initDateStart <= getDayFmt(day) && DATE.initDateEnd >= getDayFmt(day);

                        const isBadged = EXIST.includes(getDayFmt(day));
                        const isSelected = DATE.dateStart === getDayFmt(day);

                        if (isInit) {
                          if (isInitStart && isInitEnd) {
                            boxShadow = "0 0 0 0 #D1D5DB";
                            borderRadius = "50%";
                          }
                          else if (isInitStart) {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "50% 0 0 50%";
                          }
                          else if (isInitEnd) {
                            boxShadow = "-5px 0 0 0 #D1D5DB";
                            borderRadius = "0 50% 50% 0";
                          }
                          else {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "0";
                          }
                          color = "#ffffff";
                          backgroundColor = "#D1D5DB";
                          zIndex = 5;
                        }
                        if (isSelected) {
                          color = "#ffffff";
                          backgroundColor = "#1976d2";
                          boxShadow = "0 0 0 0 #1976d2";
                          borderRadius = "50%";
                          zIndex = 10;
                        }

                        return (
                          <Badge
                            key={props.day.toString()}
                            badgeContent={""}
                            slotProps={{
                              badge: {
                                style: {
                                  width: 3, height: 3, padding: 0, top: 8, left: 30,
                                  backgroundColor: isBadged ? "#1976d2" : undefined,
                                }
                              }
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
                                setDATE((prev: any) => ({
                                  ...prev,
                                  dateStart: getDayFmt(day),
                                  dateEnd: getDayFmt(day),
                                }));
                                Object.keys(sessionStorage).forEach((key) => {
                                  if (key.includes(`foodSection`)) {
                                    sessionStorage.removeItem(key);
                                  }
                                });
                              }}
                            />
                          </Badge>
                        )
                      },
                      previousIconButton: (props) => (
                        <Btn
                          {...props}
                          className={"fs-1-4rem"}
                          onClick={() => {
                            setDATE((prev: any) => ({
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
                          className={"fs-1-4rem"}
                          onClick={() => {
                            setDATE((prev: any) => ({
                              ...prev,
                              dateStart: getNextMonthStartFmt(prev.dateStart),
                              dateEnd: getNextMonthEndFmt(prev.dateStart),
                            }));
                          }}
                        >
                          {props.children}
                        </Btn>
                      )
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Input
            label={translate("date")}
            value={`${DATE.dateStart}`}
            readOnly={true}
            inputclass={innerStr}
            startadornment={
              <Img
              	src={common1}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday) {
                popTrigger.openPopup(e.currentTarget);
              }
            }}
          />
        )}
      </PopUp>
    );

    // 2. week -------------------------------------------------------------------------------------
    const weekSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Card className={"w-max70vw p-0"}>
            <Grid container spacing={3}>
              <Grid size={8} className={"d-left ms-20"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewWeek")}
                </Div>
              </Grid>
              <Grid size={2} className={"d-center"}>
                <Icons
                  key={"Refresh"}
                  name={"Refresh"}
                  className={"w-24 h-24"}
                  onClick={() => {
                    setDATE((prev: any) => ({
                      ...prev,
                      dateType: prev.initDateType,
                      dateStart: prev.initDateStart,
                      dateEnd: prev.initDateEnd,
                    }));
                  }}
                />
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={sessionLocale}>
                  <DateCalendar
                    timezone={sessionTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      // 일주일에 해당하는 날짜를 선택
                      day: (props) => {

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        const { outsideCurrentMonth, day, ...other } = props;

                        const isInitStart = DATE.initDateStart === getDayStartFmt(day);
                        const isInitEnd = DATE.initDateEnd === getDayEndFmt(day);
                        const isInit = DATE.initDateStart <= getDayFmt(day) && DATE.initDateEnd >= getDayFmt(day);

                        const isFirst = DATE.dateStart === getDayStartFmt(day);
                        const isLast = DATE.dateEnd === getDayEndFmt(day);
                        const isSelected = DATE.dateStart <= getDayFmt(day) && DATE.dateEnd >= getDayFmt(day);

                        if (isInit) {
                          if (isInitStart && isInitEnd) {
                            boxShadow = "0 0 0 0 #D1D5DB";
                            borderRadius = "50%";
                          }
                          else if (isInitStart) {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "50% 0 0 50%";
                          }
                          else if (isInitEnd) {
                            boxShadow = "-5px 0 0 0 #D1D5DB";
                            borderRadius = "0 50% 50% 0";
                          }
                          else {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "0";
                          }
                          color = "#ffffff";
                          backgroundColor = "#D1D5DB";
                          zIndex = 5;
                        }
                        if (isSelected) {
                          if (isFirst && isLast) {
                            boxShadow = "0 0 0 0 #1976d2";
                            borderRadius = "50%";
                          }
                          else if (isFirst) {
                            boxShadow = "5px 0 0 0 #1976d2";
                            borderRadius = "50% 0 0 50%";
                          }
                          else if (isLast) {
                            boxShadow = "-5px 0 0 0 #1976d2";
                            borderRadius = "0 50% 50% 0";
                          }
                          else {
                            boxShadow = "5px 0 0 0 #1976d2";
                            borderRadius = "0%";
                          }
                          color = "#ffffff";
                          backgroundColor = "#1976d2";
                          zIndex = 10;
                        }
                        return (
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
                              setDATE((prev: any) => ({
                                ...prev,
                                dateStart: getWeekStartFmt(day),
                                dateEnd: getWeekEndFmt(day),
                              }));
                            }}
                          />
                        )
                      },
                      previousIconButton: (props) => (
                        <Btn
                          {...props}
                          className={"fs-1-4rem"}
                          onClick={() => {
                            setDATE((prev: any) => ({
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
                          className={"fs-1-4rem"}
                          onClick={() => {
                            setDATE((prev: any) => ({
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
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
            inputclass={innerStr}
            readOnly={true}
            startadornment={
              <Img
              	src={common1}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday) {
                popTrigger.openPopup(e.currentTarget);
              }
            }}
          />
        )}
      </PopUp>
    );

    // 3. month ------------------------------------------------------------------------------------
    const monthSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Card className={"w-max70vw p-0"}>
            <Grid container spacing={3}>
              <Grid size={8} className={"d-left ms-20"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewMonth")}
                </Div>
              </Grid>
              <Grid size={2} className={"d-center"}>
                <Icons
                  key={"Refresh"}
                  name={"Refresh"}
                  className={"w-24 h-24"}
                  onClick={() => {
                    setDATE((prev: any) => ({
                      ...prev,
                      dateType: prev.initDateType,
                      dateStart: prev.initDateStart,
                      dateEnd: prev.initDateEnd,
                    }));
                  }}
                />
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={sessionLocale}>
                  <DateCalendar
                    timezone={sessionTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      // 월의 첫번째 날을 선택
                      day: (props) => {

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        const { outsideCurrentMonth, day, ...other } = props;

                        const isInitStart = DATE.initDateStart === getDayStartFmt(day);
                        const isInitEnd = DATE.initDateEnd === getDayEndFmt(day);
                        const isInit = DATE.initDateStart <= getDayFmt(day) && DATE.initDateEnd >= getDayFmt(day);

                        const isSelected = DATE.dateStart === getDayFmt(day) && getDayNotFmt(day).date() === 1;

                        if (isInit) {
                          if (isInitStart && isInitEnd) {
                            boxShadow = "0 0 0 0 #D1D5DB";
                            borderRadius = "50%";
                          }
                          else if (isInitStart) {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "50% 0 0 50%";
                          }
                          else if (isInitEnd) {
                            boxShadow = "-5px 0 0 0 #D1D5DB";
                            borderRadius = "0 50% 50% 0";
                          }
                          else {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "0";
                          }
                          color = "#ffffff";
                          backgroundColor = "#D1D5DB";
                          zIndex = 5;
                        }
                        if (isSelected) {
                          color = "#ffffff";
                          backgroundColor = "#1976d2";
                          boxShadow = "0 0 0 0 #1976d2";
                          borderRadius = "50%";
                          zIndex = 10;
                        }

                        return (
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
                              setDATE((prev: any) => ({
                                ...prev,
                                dateStart: getMonthStartFmt(day),
                                dateEnd: getMonthEndFmt(day),
                              }));
                            }}
                          />
                        )
                      },
                      previousIconButton: (props) => (
                        <Btn
                          {...props}
                          className={"fs-1-4rem"}
                          onClick={() => {
                            setDATE((prev: any) => ({
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
                          className={"fs-1-4rem"}
                          onClick={() => {
                            setDATE((prev: any) => ({
                              ...prev,
                              dateStart: getNextMonthStartFmt(prev.dateStart),
                              dateEnd: getNextMonthEndFmt(prev.dateStart),
                            }));
                          }}
                        >
                          {props.children}
                        </Btn>
                      )
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
            inputclass={innerStr}
            readOnly={true}
            startadornment={
              <Img
              	src={common1}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday) {
                popTrigger.openPopup(e.currentTarget);
              }
            }}
          />
        )}
      </PopUp>
    );

    // 4. year -------------------------------------------------------------------------------------
    const yearSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Card className={"w-max70vw p-0"}>
            <Grid container spacing={3}>
              <Grid size={8} className={"d-left ms-20"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewYear")}
                </Div>
              </Grid>
              <Grid size={2} className={"d-center"}>
                <Icons
                  key={"Refresh"}
                  name={"Refresh"}
                  className={"w-24 h-24"}
                  onClick={() => {
                    setDATE((prev: any) => ({
                      ...prev,
                      dateType: prev.initDateType,
                      dateStart: prev.initDateStart,
                      dateEnd: prev.initDateEnd,
                    }));
                  }}
                />
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={sessionLocale}>
                  <DateCalendar
                    timezone={sessionTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      // 매년 1월 1일 선택
                      day: (props) => {

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        const {outsideCurrentMonth, day, ...other} = props;

                        const isInitStart = DATE.initDateStart === getDayStartFmt(day);
                        const isInitEnd = DATE.initDateEnd === getDayEndFmt(day);
                        const isInit = DATE.initDateStart <= getDayFmt(day) && DATE.initDateEnd >= getDayFmt(day);

                        const isSelected = getDayNotFmt(day).month() === 0 && getDayNotFmt(day).date() === 1;

                        if (isInit) {
                          if (isInitStart && isInitEnd) {
                            boxShadow = "0 0 0 0 #D1D5DB";
                            borderRadius = "50%";
                          }
                          else if (isInitStart) {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "50% 0 0 50%";
                          }
                          else if (isInitEnd) {
                            boxShadow = "-5px 0 0 0 #D1D5DB";
                            borderRadius = "0 50% 50% 0";
                          }
                          else {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "0";
                          }
                          color = "#ffffff";
                          backgroundColor = "#D1D5DB";
                          zIndex = 5;
                        }
                        if (isSelected) {
                          color = "#ffffff";
                          backgroundColor = "#1976d2";
                          boxShadow = "0 0 0 0 #1976d2";
                          borderRadius = "50%";
                          zIndex = 10;
                        }

                        return (
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
                              setDATE((prev: any) => ({
                                ...prev,
                                dateStart: getYearStartFmt(day),
                                dateEnd: getYearEndFmt(day),
                              }));
                            }}
                          />
                        )
                      },
                      previousIconButton: (props) => (
                        <Btn
                          {...props}
                          className={"fs-1-4rem"}
                          onClick={() => {
                            setDATE((prev: any) => ({
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
                          className={"fs-1-4rem"}
                          onClick={() => {
                            setDATE((prev: any) => ({
                              ...prev,
                              dateStart: getNextYearStartFmt(prev.dateStart),
                              dateEnd: getNextYearEndFmt(prev.dateStart),
                            }));
                          }}
                        >
                          {props.children}
                        </Btn>
                      )
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
            inputclass={innerStr}
            readOnly={true}
            startadornment={
              <Img
              	src={common1}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday) {
                popTrigger.openPopup(e.currentTarget);
              }
            }}
          />
        )}
      </PopUp>
    );

    // 5. select -----------------------------------------------------------------------------------
    const selectSection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={({ closePopup }: any) => (
          <Card className={"w-max70vw p-0"}>
            <Grid container spacing={3}>
              <Grid size={8} className={"d-left ms-20"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewSelect")}
                </Div>
              </Grid>
              <Grid size={2} className={"d-center"}>
                <Icons
                  key={"Refresh"}
                  name={"Refresh"}
                  className={"w-24 h-24"}
                  onClick={() => {
                    setDATE((prev: any) => ({
                      ...prev,
                      dateType: prev.initDateType,
                      dateStart: prev.initDateStart,
                      dateEnd: prev.initDateEnd,
                    }));
                  }}
                />
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={sessionLocale}>
                  <DateCalendar
                    timezone={sessionTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      day: (props) => {

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        const { outsideCurrentMonth, day, ...other } = props;

                        const isInitStart = DATE.initDateStart === getDayStartFmt(day);
                        const isInitEnd = DATE.initDateEnd === getDayEndFmt(day);
                        const isInit = DATE.initDateStart <= getDayFmt(day) && DATE.initDateEnd >= getDayFmt(day);

                        const isFirst = DATE.dateStart === getDayStartFmt(day);
                        const isLast = DATE.dateEnd === getDayEndFmt(day);
                        const isSelected = DATE.dateStart <= getDayFmt(day) && DATE.dateEnd >= getDayFmt(day);

                        if (isInit) {
                          if (isInitStart && isInitEnd) {
                            boxShadow = "0 0 0 0 #D1D5DB";
                            borderRadius = "50%";
                          }
                          else if (isInitStart) {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "50% 0 0 50%";
                          }
                          else if (isInitEnd) {
                            boxShadow = "-5px 0 0 0 #D1D5DB";
                            borderRadius = "0 50% 50% 0";
                          }
                          else {
                            boxShadow = "5px 0 0 0 #D1D5DB";
                            borderRadius = "0";
                          }
                          color = "#ffffff";
                          backgroundColor = "#D1D5DB";
                          zIndex = 5;
                        }
                        if (isSelected) {
                          if (isFirst && isLast) {
                            boxShadow = "0 0 0 0 #1976d2";
                            borderRadius = "50%";
                          }
                          else if (isFirst) {
                            boxShadow = "5px 0 0 0 #1976d2";
                            borderRadius = "50% 0 0 50%";
                          }
                          else if (isLast) {
                            boxShadow = "-5px 0 0 0 #1976d2";
                            borderRadius = "0 50% 50% 0";
                          }
                          else {
                            boxShadow = "5px 0 0 0 #1976d2";
                            borderRadius = "0%";
                          }
                          color = "#ffffff";
                          backgroundColor = "#1976d2";
                          zIndex = 10;
                        }
                        return (
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
                              if (
                                !DATE.dateStart ||
                                DATE.dateEnd ||
                                getDayNotFmt(day).isBefore(DATE.dateStart)
                              ) {
                                setDATE((prev: any) => ({
                                  ...prev,
                                  dateStart: getDayFmt(day),
                                  dateEnd: "",
                                }));
                              }
                              else {
                                setDATE((prev: any) => ({
                                  ...prev,
                                  dateStart: getDayFmt(prev.dateStart),
                                  dateEnd: getDayFmt(day),
                                }));
                              }
                            }}
                          />
                        )
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
            readOnly={true}
            inputclass={`${innerStr}`}
            startadornment={
              <Img
              	src={common1}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday) {
                popTrigger.openPopup(e.currentTarget);
              }
            }}
          />
        )}
      </PopUp>
    );

    // 6. listType ---------------------------------------------------------------------------------
    const listTypeSection = () => (
      <PopUp
        type={"modal"}
        position={"top"}
        direction={"center"}
        contents={({closePopup}: any) => (
          <Card className={"w-max18vw h-max30vh p-0 d-fit"}>
            <Grid container spacing={1}>
              <Grid size={12} className={"d-center"}>
                <Btn
                  style={{
                    padding: "1px 9px",
                    fontSize: "0.7rem",
                    width: "50px",
                    backgroundColor: clickedType === "thisToday" ? "#1976d2" : "#F9FAFB",
                    color: clickedType === "thisToday" ? "#ffffff" : "#1976d2",
                  }}
                  onClick={() => {
                    setClickedType("thisToday");
                  }}
                >
                  {translate("thisToday")}
                </Btn>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Btn
                  style={{
                    padding: "1px 9px",
                    fontSize: "0.7rem",
                    width: "50px",
                    backgroundColor: clickedType === "thisWeek" ? "#1976d2" :"#F9FAFB",
                    color: clickedType === "thisWeek" ? "#ffffff" : "#1976d2",
                  }}
                  onClick={() => {
                    setClickedType("thisWeek");
                  }}
                >
                  {translate("thisWeek")}
                </Btn>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Btn
                  style={{
                    padding: "1px 9px",
                    fontSize: "0.7rem",
                    width: "50px",
                    backgroundColor: clickedType === "thisMonth" ? "#1976d2" :"#F9FAFB",
                    color: clickedType === "thisMonth" ? "#ffffff" : "#1976d2",
                  }}
                  onClick={() => {
                    setClickedType("thisMonth");
                  }}
                >
                  {translate("thisMonth")}
                </Btn>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Btn
                  style={{
                    padding: "1px 9px",
                    fontSize: "0.7rem",
                    width: "50px",
                    backgroundColor: clickedType === "thisYear" ? "#1976d2" :"#F9FAFB",
                    color: clickedType === "thisYear" ? "#ffffff" : "#1976d2",
                  }}
                  onClick={() => {
                    setClickedType("thisYear");
                  }}
                >
                  {translate("thisYear")}
                </Btn>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <Btn
                  style={{
                    padding: "1px 9px",
                    fontSize: "0.7rem",
                    width: "50px",
                    backgroundColor: clickedType === "selectDate" ? "#1976d2" :"#F9FAFB",
                    color: clickedType === "selectDate" ? "#ffffff" : "#1976d2",
                  }}
                  onClick={() => {}}
                >
                  {translate("selectDate")}
                </Btn>
              </Grid>
            </Grid>
          </Card>
        )}
      >
        {(popTrigger: any) => (
          <Btn
            color={"primary"}
            className={"pt-1 pb-1 ps-9 pe-9 fs-0-7rem ms-n2vw"}
            onClick={(e: any) => {
              if (!isToday) {
                popTrigger.openPopup(e.currentTarget);
              }
            }}
          >
            {translate(clickedType)}
          </Btn>
        )}
      </PopUp>
    );

    // 7. saveType ---------------------------------------------------------------------------------
    const saveTypeSection = () => (
      <Select
        label={translate("dateType")}
        value={DATE.dateType || ""}
        inputclass={typeStr}
        onChange={(e: any) => {
          if (e.target.value === "day") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "day",
              dateStart: dayFmt,
              dateEnd: dayFmt
            }));
          }
          else if (e.target.value === "week") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "week",
              dateStart: weekStartFmt,
              dateEnd: weekEndFmt
            }));
          }
          else if (e.target.value === "month") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "month",
              dateStart: monthStartFmt,
              dateEnd: monthEndFmt
            }));
          }
          else if (e.target.value === "year") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "year",
              dateStart: yearStartFmt,
              dateEnd: yearEndFmt
            }));
          }
          else if (e.target.value === "select") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "select",
              dateStart: dayFmt,
              dateEnd: dayFmt
            }));
          }
        }}
      >
        {["day", "week", "month", "year", "select"]?.map((item: any) => (
          <MenuItem key={item} value={item} selected={item === DATE.dateType}>
            {translate(item)}
          </MenuItem>
        ))}
      </Select>
    );

    // 10. return
    return (
      isGoalList || isList ? (
        <Grid container spacing={2}>
          <Grid size={9} className={"d-center"}>
            {selectSection()}
          </Grid>
          <Grid size={3} className={"d-center"}>
            {listTypeSection()}
          </Grid>
        </Grid>
      )
      : isGoalSave || isSave || isGoalUpdate || isUpdate ? (
        <Grid container spacing={2}>
          <Grid size={3} className={"d-center"}>
            {saveTypeSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {DATE.dateType === "day" && daySection()}
            {DATE.dateType === "week" && weekSection()}
            {DATE.dateType === "month" && monthSection()}
            {DATE.dateType === "year" && yearSection()}
            {DATE.dateType === "select" && selectSection()}
          </Grid>
        </Grid>
      ) : null
    )
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {pickerNode()}
    </>
  );
};
