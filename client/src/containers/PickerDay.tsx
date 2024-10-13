// Picker.tsx
// 계획은 week, month, year
// 실제는 day

import { useEffect, useState } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { PopUp, Input, Select } from "@imports/ImportContainers";
import { Btn, Img, Div, Icons } from "@imports/ImportComponents";
import { MenuItem, PickersDay, Grid, Card, Badge } from "@imports/ImportMuis";
import { DateCalendar, AdapterMoment, LocalizationProvider } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare type PickerDayProps = {
  DATE: any;
  setDATE: any;
  EXIST: any;
}

// -------------------------------------------------------------------------------------------------
export const PickerDay = (
  { DATE, setDATE, EXIST }: PickerDayProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, TITLE, localLocale, localTimeZone } = useCommonValue();
  const { isToday, isGoalToday, isGoalList, isGoalDetail } = useCommonValue();
  const { isRealList, isRealDetail, isCalendarDetail } = useCommonValue();
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
  const { translate } = useLanguageStore();

  // ex. 2024-11-12 ~ 12-15
  const durStr = (
    `${DATE.dateStart.split("-")[1] || "" }-${DATE.dateStart.split("-")[2] || "" } ~ ` +
    `${DATE.dateEnd.split("-")[1] || "" }-${DATE.dateEnd.split("-")[2] || "" }`
  );

  // 2-1. useState ---------------------------------------------------------------------------------
  const [listTypeStr, setListTypeStr] = useState<string>("");
  const [saveTypeStr, setDetailTypeStr] = useState<string>("");

  // 2-1. useStorageLocal ------------------------------------------------------------------------
  const [listType, setListType] = useStorageLocal(
    `${TITLE}_listType_(${PATH})`, "month"
  );
  const [saveType, setSaveType] = useState<string>("");

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
    if (isGoalToday) {
      setListType("month");
      setDATE({
        dateType: "",
        dateStart: getMonthStartFmt(),
        dateEnd: getMonthEndFmt(),
      });
    }
    else if (isToday) {
      setListType("day");
      setDATE({
        dateType: "day",
        dateStart: getDayFmt(),
        dateEnd: getDayFmt(),
      });
    }
    else if (isGoalList || isRealList) {
      if (listType === "day") {
        setDATE({
          dateType: "",
          dateStart: getDayFmt(),
          dateEnd: getDayFmt(),
        });
      }
      else if (listType === "week") {
        setDATE({
          dateType: "",
          dateStart: getWeekStartFmt(),
          dateEnd: getWeekEndFmt(),
        });
      }
      else if (listType === "month") {
        setDATE({
          dateType: "",
          dateStart: getMonthStartFmt(),
          dateEnd: getMonthEndFmt(),
        });
      }
      else if (listType === "year") {
        setDATE({
          dateType: "",
          dateStart: getYearStartFmt(),
          dateEnd: getYearEndFmt(),
        });
      }
      else if (listType === "select") {
        setDATE({
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd,
        });
      }
    }
  }, [listType]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isGoalDetail || isRealDetail) {
      if (saveType === "day") {
        setDATE({
          dateType: "day",
          dateStart: getDayFmt(),
          dateEnd: getDayFmt(),
        });
      }
      else if (saveType === "week") {
        setDATE({
          dateType: "week",
          dateStart: getWeekStartFmt(),
          dateEnd: getWeekEndFmt(),
        });
      }
      else if (saveType === "month") {
        setDATE({
          dateType: "month",
          dateStart: getMonthStartFmt(),
          dateEnd: getMonthEndFmt(),
        });
      }
      else if (saveType === "year") {
        setDATE({
          dateType: "year",
          dateStart: getYearStartFmt(),
          dateEnd: getYearEndFmt(),
        });
      }
      else if (saveType === "select") {
        setDATE({
          dateType: "select",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd,
        });
      }
    }
  }, [saveType]);

  // 7. pickerNode ---------------------------------------------------------------------------------
  const pickerNode = () => {

    // 1. day --------------------------------------------------------------------------------------
    const daySection = () => (
      <PopUp
        key={"day"}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Card className={"w-min70vw p-0"}>
            <Grid container spacing={1} columns={12}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewDay")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLocale}>
                  <DateCalendar
                    timezone={localTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"border-1 radius-1"}
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
            endadornment={
              <Div className={"d-row-center"}>
                <Div className={"me-n10"}>
                  <Icons
                    key={"ChevronLeft"}
                    name={"ChevronLeft"}
                    className={"w-16 h-16"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev: any) => ({
                        ...prev,
                        dateStart: getPrevDayStartFmt(prev.dateStart),
                        dateEnd: getPrevDayEndFmt(prev.dateStart),
                      }));
                      Object.keys(sessionStorage).forEach((key) => {
                        if (key.includes(`foodSection`)) {
                          sessionStorage.removeItem(key);
                        }
                      });
                    }}
                  />
                </Div>
                <Div className={"me-n15"}>
                  <Icons
                    key={"ChevronRight"}
                    name={"ChevronRight"}
                    className={"w-16 h-16"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev: any) => ({
                        ...prev,
                        dateStart: getNextDayStartFmt(prev.dateStart),
                        dateEnd: getNextDayEndFmt(prev.dateStart),
                      }));
                      Object.keys(sessionStorage).forEach((key) => {
                        if (key.includes(`foodSection`)) {
                          sessionStorage.removeItem(key);
                        }
                      });
                    }}
                  />
                </Div>
              </Div>
            }
            onClick={(e: any) => {
              (!isGoalToday && !isToday) && popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      </PopUp>
    );

    // 2. week -------------------------------------------------------------------------------------
    const weekSection = () => (
      <PopUp
        key={"week"}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Card className={"w-min70vw p-0"}>
            <Grid container spacing={1} columns={12}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewWeek")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLocale}>
                  <DateCalendar
                    timezone={localTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"border-1 radius-1"}
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
            endadornment={
              <Div className={"d-row-center"}>
                <Div className={"me-n10"}>
                  <Icons
                    key={"ChevronLeft"}
                    name={"ChevronLeft"}
                    className={"w-16 h-16"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev: any) => ({
                        ...prev,
                        dateStart: getPrevWeekStartFmt(prev.dateStart),
                        dateEnd: getPrevWeekEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
                <Div className={"me-n15"}>
                  <Icons
                    key={"ChevronRight"}
                    name={"ChevronRight"}
                    className={"w-16 h-16"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev: any) => ({
                        ...prev,
                        dateStart: getNextWeekStartFmt(prev.dateStart),
                        dateEnd: getNextWeekEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
              </Div>
            }
            onClick={(e: any) => {
              (!isGoalToday && !isToday) && popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      </PopUp>
    );

    // 3. month ------------------------------------------------------------------------------------
    const monthSection = () => (
      <PopUp
        key={"month"}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Card className={"w-min70vw p-0"}>
            <Grid container spacing={1} columns={12}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewMonth")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLocale}>
                  <DateCalendar
                    timezone={localTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"border-1 radius-1"}
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
            endadornment={
              <Div className={"d-row-center"}>
                <Div className={"me-n10"}>
                  <Icons
                    key={"ChevronLeft"}
                    name={"ChevronLeft"}
                    className={"w-16 h-16"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev: any) => ({
                        ...prev,
                        dateStart: getPrevMonthStartFmt(prev.dateStart),
                        dateEnd: getPrevMonthEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
                <Div className={"me-n15"}>
                  <Icons
                    key={"ChevronRight"}
                    name={"ChevronRight"}
                    className={"w-16 h-16"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev: any) => ({
                        ...prev,
                        dateStart: getNextMonthStartFmt(prev.dateStart),
                        dateEnd: getNextMonthEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
              </Div>
            }
            onClick={(e: any) => {
              (!isGoalToday && !isToday) && popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      </PopUp>
    );

    // 4. year -------------------------------------------------------------------------------------
    const yearSection = () => (
      <PopUp
        key={"year"}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Card className={"w-min70vw p-0"}>
            <Grid container spacing={1} columns={12}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewYear")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLocale}>
                  <DateCalendar
                    timezone={localTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"border-1 radius-1"}
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
            endadornment={
              <Div className={"d-row-center"}>
                <Div className={"me-n10"}>
                  <Icons
                    key={"ChevronLeft"}
                    name={"ChevronLeft"}
                    className={"w-16 h-16"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev: any) => ({
                        ...prev,
                        dateStart: getPrevYearStartFmt(prev.dateStart),
                        dateEnd: getPrevYearEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
                <Div className={"me-n15"}>
                  <Icons
                    key={"ChevronRight"}
                    name={"ChevronRight"}
                    className={"w-16 h-16"}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      setDATE((prev: any) => ({
                        ...prev,
                        dateStart: getNextYearStartFmt(prev.dateStart),
                        dateEnd: getNextYearEndFmt(prev.dateStart),
                      }));
                    }}
                  />
                </Div>
              </Div>
            }
            onClick={(e: any) => {
              (!isGoalToday && !isToday) && popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      </PopUp>
    );

    // 5. select -----------------------------------------------------------------------------------
    const selectSection = () => (
      <PopUp
        key={"select"}
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Card className={"w-min70vw p-0"}>
            <Grid container spacing={1} columns={12}>
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewSelect")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLocale}>
                  <DateCalendar
                    timezone={localTimeZone}
                    views={["day"]}
                    readOnly={false}
                    value={getDayNotFmt(DATE.dateStart || DATE.dateEnd)}
                    className={"border-1 radius-1"}
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
              (!isGoalToday && !isToday) && popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      </PopUp>
    );

    // 6. listType ---------------------------------------------------------------------------------
    const listTypeSection = () => (
      <Select
        label={translate("dateType")}
        value={listType}
        inputclass={listTypeStr}
        readOnly={isToday}
        onChange={(e: any) => {
          if (e.target.value === "day") {
            setListType("day");
          }
          else if (e.target.value === "week") {
            setListType("week");
          }
          else if (e.target.value === "month") {
            setListType("month");
          }
          else if (e.target.value === "year") {
            setListType("year");
          }
          else if (e.target.value === "select") {
            setListType("select");
          }
        }}
      >
        {["day", "week", "month", "year", "select"]?.map((item: any) => (
          <MenuItem
            key={item}
            value={item}
            selected={item === listType}
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
        value={DATE.dateType}
        inputclass={saveTypeStr}
        readOnly={isRealDetail && !isCalendarDetail}
        onChange={(e: any) => {
          if (e.target.value === "day") {
            setSaveType("day");
          }
          else if (e.target.value === "week") {
            setSaveType("week");
          }
          else if (e.target.value === "month") {
            setSaveType("month");
          }
          else if (e.target.value === "year") {
            setSaveType("year");
          }
          else if (e.target.value === "select") {
            setSaveType("select");
          }
        }}
      >
        {isCalendarDetail ? (
          ["day", "week", "month", "year", "select"]?.map((item: any) => (
            <MenuItem
              key={item}
              value={item}
              selected={item === saveType}
            >
              {translate(item)}
            </MenuItem>
          ))
        )
        : isGoalDetail ? (
          ["week", "month", "year"]?.map((item: any) => (
            <MenuItem
              key={item}
              value={item}
              selected={item === saveType}
            >
              {translate(item)}
            </MenuItem>
          ))
        )
        : (
          ["day"]?.map((item: any) => (
            <MenuItem
              key={item}
              value={item}
              selected={item === saveType}
            >
              {translate(item)}
            </MenuItem>
          ))
        )}
      </Select>
    );

    // 10. return ----------------------------------------------------------------------------------
    return (

      // 1-1. 리스트 (목표)
      isGoalList ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={3} className={"d-center"}>
            {listTypeSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {listType === "day" && daySection()}
            {listType === "week" && weekSection()}
            {listType === "month" && monthSection()}
            {listType === "year" && yearSection()}
            {listType === "select" && selectSection()}
          </Grid>
        </Grid>
      )

      // 1-2. 리스트 (실제)
      : isRealList ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={3} className={"d-center"}>
            {listTypeSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {listType === "day" && daySection()}
            {listType === "week" && weekSection()}
            {listType === "month" && monthSection()}
            {listType === "year" && yearSection()}
            {listType === "select" && selectSection()}
          </Grid>
        </Grid>
      )

      // 2-1. 세이브 (목표)
      : isGoalDetail ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {saveTypeSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
            {DATE.dateType === "week" && weekSection()}
            {DATE.dateType === "month" && monthSection()}
            {DATE.dateType === "year" && yearSection()}
          </Grid>
        </Grid>
      )

      // 2-2. 세이브 (실제)
      : isRealDetail ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {saveTypeSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
            {DATE.dateType === "day" && daySection()}
          </Grid>
        </Grid>
      )

      // 2-3. 세이브 (일정)
      : isCalendarDetail ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {saveTypeSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
            {DATE.dateType === "day" && daySection()}
            {DATE.dateType === "week" && weekSection()}
            {DATE.dateType === "month" && monthSection()}
            {DATE.dateType === "year" && yearSection()}
            {DATE.dateType === "select" && selectSection()}
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
