// Picker.tsx
// 계획은 week, month, year, select
// 실제는 day

import { useEffect, useState } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorage, useTranslate } from "@imports/ImportHooks";
import { Btn, Input, Img, Div, Select } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { MenuItem, PickersDay, Grid, Card, Badge } from "@imports/ImportMuis";
import { DateCalendar, AdapterMoment, LocalizationProvider } from "@imports/ImportMuis";

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
    sessionLocale, sessionTimeZone, TITLE, PATH
  } = useCommonValue();

  const isGoalToday = PATH.includes("/today/goal");
  const isToday = !isGoalToday && PATH.includes("/today/list");
  const isCalendar = PATH.includes("/calendar");
  const isGoalList = PATH.includes("/goal/list");
  const isGoalDetail = PATH.includes("/goal/detail");
  const isRealList = !PATH.includes("/goal") && PATH.includes("/list");
  const isRealDetail = !PATH.includes("/goal") && PATH.includes("/detail");

  let sessionDate = sessionStorage?.getItem(`${TITLE}_date_(${PATH})`);
  let parseDate = JSON?.parse(sessionDate || "{}");
  let dateStart = parseDate?.dateStart;
  let dateEnd = parseDate?.dateEnd;

  // ex. 2024-11-12 ~ 12-15
  const durStr =
    `${DATE.dateStart} ~ ${DATE.dateEnd.split("-")[1] || "" }-${DATE.dateEnd.split("-")[2] || "" }`;

  // 2-1. useState ---------------------------------------------------------------------------------
  const [saveTypeStr, setDetailTypeStr] = useState<string>("");
  const [listTypeStr, setListTypeStr] = useState<string>("");

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
    if (!DATE.dateType) {
      if (isGoalList || isGoalDetail) {
        setDATE((prev: any) => ({
          ...prev,
          dateType: "select",
        }));
      }
      else if (isRealList || isRealDetail) {
        setDATE((prev: any) => ({
          ...prev,
          dateType: "day",
        }));
      }
    }
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isGoalList || isRealList) {
      setDetailTypeStr("h-min0 h-4vh fs-0-7rem pointer");
      setListTypeStr("h-min0 h-4vh fs-0-7rem pointer");
    }
    else {
      setDetailTypeStr("h-min40 fs-0-8rem pointer");
      setListTypeStr("h-min40 fs-0-8rem pointer");
    }
  }, [PATH]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isGoalList || isRealList) {
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
    if (isGoalList || isRealList) {
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
    if (isGoalList || isRealList) {
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
        contents={
          <Card className={"w-min70vw p-0"}>
            <Grid container spacing={3}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewDay")}
                </Div>
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
                        const { outsideCurrentMonth, day, ...other } = props;

                        let isSelected = false;
                        let isBadged = false;

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        if (DATE.dateStart && DATE.dateEnd) {
                          isSelected = DATE.dateStart === getDayFmt(day);
                        }
                        if (EXIST?.day) {
                          EXIST?.day.forEach((item: any) => {
                            if (
                              item.split(" ~ ") &&
                              item.split(" ~ ").length === 2 &&
                              getDayFmt(day) >= item.split(" ~ ")[0] &&
                              getDayFmt(day) <= item.split(" ~ ")[1]
                            ) {
                              isBadged = true;
                            }
                          });
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
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("date")}
            value={`${DATE.dateStart}`}
            readOnly={true}
            inputclass={listTypeStr}
            startadornment={
              <Img
              	key={"common1"}
              	src={"common1"}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday && !isGoalToday) {
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
        contents={
          <Card className={"w-min70vw p-0"}>
            <Grid container spacing={3}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewWeek")}
                </Div>
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
                        const { outsideCurrentMonth, day, ...other } = props;

                        let isSelected = false;
                        let isBadged = false;
                        let isFirst = false;
                        let isLast = false;

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        if (DATE.dateStart && DATE.dateEnd) {
                          isSelected = DATE.dateStart <= getDayFmt(day) && DATE.dateEnd >= getDayFmt(day);
                          isFirst = DATE.dateStart === getDayStartFmt(day);
                          isLast = DATE.dateEnd === getDayEndFmt(day);
                        }

                        if (EXIST?.week) {
                          EXIST?.week.forEach((item: any) => {
                            if (
                              item.split(" ~ ") &&
                              item.split(" ~ ").length === 2 &&
                              getDayFmt(day) >= item.split(" ~ ")[0] &&
                              getDayFmt(day) <= item.split(" ~ ")[1]
                            ) {
                              isBadged = true;
                            }
                          });
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
                                  dateStart: getWeekStartFmt(day),
                                  dateEnd: getWeekEndFmt(day),
                                }));
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
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={listTypeStr}
            readOnly={true}
            startadornment={
              <Img
              	key={"common1"}
              	src={"common1"}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday && !isGoalToday) {
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
        contents={
          <Card className={"w-min70vw p-0"}>
            <Grid container spacing={3}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewMonth")}
                </Div>
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
                        const { outsideCurrentMonth, day, ...other } = props;

                        let isSelected = false;
                        let isBadged = false;

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        if (DATE.dateStart && DATE.dateEnd) {
                          isSelected = DATE.dateStart === getDayFmt(day) && getDayNotFmt(day).date() === 1
                        }

                        if (EXIST?.month) {
                          EXIST?.month.forEach((item: any) => {
                            if (
                              item.split(" ~ ") &&
                              item.split(" ~ ").length === 2 &&
                              getDayFmt(day) >= item.split(" ~ ")[0] &&
                              getDayFmt(day) <= item.split(" ~ ")[1]
                            ) {
                              isBadged = true;
                            }
                          });
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
                                  dateStart: getMonthStartFmt(day),
                                  dateEnd: getMonthEndFmt(day),
                                }));
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
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={listTypeStr}
            readOnly={true}
            startadornment={
              <Img
              	key={"common1"}
              	src={"common1"}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday && !isGoalToday) {
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
        contents={
          <Card className={"w-min70vw p-0"}>
            <Grid container spacing={3}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewYear")}
                </Div>
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

                        const { outsideCurrentMonth, day, ...other } = props;

                        let isSelected = false;
                        let isBadged = false;

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        if (DATE.dateStart && DATE.dateEnd) {
                          isSelected = getDayNotFmt(day).month() === 0 && getDayNotFmt(day).date() === 1
                        }

                        // year 는 해당 년도 1월 달만 배지 표시
                        if (EXIST?.year) {
                          EXIST?.year.forEach((item: any) => {
                            const startYear = item.split(" ~ ")[0].split("-")[0];
                            const currentYear = getDayFmt(day).split("-")[0];
                            const isJanuary = day.month() === 0;

                            if (startYear === currentYear && isJanuary) {
                              isBadged = true;
                            }
                          });
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
                                  dateStart: getYearStartFmt(day),
                                  dateEnd: getYearEndFmt(day),
                                }));
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
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={listTypeStr}
            readOnly={true}
            startadornment={
              <Img
              	key={"common1"}
              	src={"common1"}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday && !isGoalToday) {
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
        contents={
          <Card className={"p-0"}>
            <Grid container spacing={3}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewSelect")}
                </Div>
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
                        const { outsideCurrentMonth, day, ...other } = props;

                        let isSelected = false;
                        let isBadged = false;
                        let isFirst = false;
                        let isLast = false;

                        let color = "";
                        let borderRadius = "";
                        let backgroundColor = "";
                        let boxShadow = "";
                        let zIndex = 0;

                        if (DATE.dateStart && DATE.dateEnd) {
                          isSelected = DATE.dateStart <= getDayFmt(day) && DATE.dateEnd >= getDayFmt(day);
                          isFirst = DATE.dateStart === getDayStartFmt(day);
                          isLast = DATE.dateEnd === getDayEndFmt(day);
                        }

                        if (EXIST?.select) {
                          EXIST?.select.forEach((item: any) => {
                            if (
                              item.split(" ~ ") &&
                              item.split(" ~ ").length === 2 &&
                              getDayFmt(day) >= item.split(" ~ ")[0] &&
                              getDayFmt(day) <= item.split(" ~ ")[1]
                            ) {
                              isBadged = true;
                            }
                          });
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
                          </Badge>
                        )
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Card>
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            readOnly={true}
            inputclass={`${listTypeStr}`}
            startadornment={
              <Img
              	key={"common1"}
              	src={"common1"}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              if (!isToday && !isGoalToday) {
                popTrigger.openPopup(e.currentTarget);
              }
            }}
          />
        )}
      </PopUp>
    );

    // 6. listType ---------------------------------------------------------------------------------
    const listTypeSection = () => (
      <Select
        label={translate("dateType")}
        value={clickedType || ""}
        inputclass={listTypeStr}
        onChange={(e: any) => {
          if (e.target.value === "thisToday") {
            setClickedType("thisToday");
          }
          else if (e.target.value === "thisWeek") {
            setClickedType("thisWeek");
          }
          else if (e.target.value === "thisMonth") {
            setClickedType("thisMonth");
          }
          else if (e.target.value === "thisYear") {
            setClickedType("thisYear");
          }
        }}
      >
        {["thisToday", "thisWeek", "thisMonth", "thisYear", "selectDate"]?.map((item: any) => (
          <MenuItem
            key={item}
            value={item}
            selected={item === clickedType}
          >
            <Div className={"fs-0-6rem"}>
              {translate(item)}
            </Div>
          </MenuItem>
        ))}
      </Select>
    );

    // 7. saveType ---------------------------------------------------------------------------------
    const saveTypeSection = () => (
      <Select
        label={translate("dateType")}
        value={
          isRealDetail ? (
            DATE.dateType || "day"
          ) : (
            DATE.dateType || ""
          )
        }
        inputclass={saveTypeStr}
        readOnly={isRealDetail && !isCalendar}
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
        {isGoalDetail || isCalendar ? (
          ["week", "month", "year", "select"]?.map((item: any) => (
            <MenuItem
              key={item}
              value={item}
              selected={item === DATE.dateType}
            >
              {translate(item)}
            </MenuItem>
          ))
        ) : (
          ["day"]?.map((item: any) => (
            <MenuItem
              key={item}
              value={item}
              selected={item === DATE.dateType}
            >
              {translate(item)}
            </MenuItem>
          ))
        )}
      </Select>
    );

    // 10. return
    return (

      // 1-1. 목표인 경우 (리스트)
      isGoalList ? (
        <Grid container spacing={1}>
          <Grid size={4} className={"d-center"}>
            {listTypeSection()}
          </Grid>
          <Grid size={8} className={"d-center"}>
            {selectSection()}
          </Grid>
        </Grid>
      )

      // 1-2. 목표인 경우 (세이브)
      : isGoalDetail || isCalendar ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {saveTypeSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
            {DATE.dateType === "week" && weekSection()}
            {DATE.dateType === "month" && monthSection()}
            {DATE.dateType === "year" && yearSection()}
            {DATE.dateType === "select" && selectSection()}
          </Grid>
        </Grid>
      )

      // 2-1. 실제인 경우 (리스트)
      : isRealList ? (
        <Grid container spacing={1}>
          <Grid size={4} className={"d-center"}>
            {listTypeSection()}
          </Grid>
          <Grid size={8} className={"d-center"}>
            {selectSection()}
          </Grid>
        </Grid>
      )

      // 2-2. 실제인 경우 (세이브)
      : isRealDetail ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {saveTypeSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
            {DATE.dateType === "day" && daySection()}
          </Grid>
        </Grid>
      )
      : null
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {pickerNode()}
    </>
  );
};
