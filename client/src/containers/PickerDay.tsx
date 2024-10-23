// Picker.tsx
// 계획은 week, month, year
// 실제는 day

import { useEffect, useState } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { setSession } from "@imports/ImportUtils";
import { PopUp, Input, Select } from "@imports/ImportContainers";
import { Btn, Img, Div, Icons } from "@imports/ImportComponents";
import { MenuItem, PickersDay, Grid, Badge } from "@imports/ImportMuis";
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
  const { PATH, TITLE, localLang, localTimeZone, sessionTitle } = useCommonValue();
  const { isTodayList, isGoalTodayList, isGoalList, isGoalDetail } = useCommonValue();
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
  const [typeListStr, setTypeListStr] = useState<string>("");
  const [typeSaveStr, setTypeSaveStr] = useState<string>("");

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [typeSave, setTypeSave] = useState<string>("");
  const [typeList, setTypeList] = useStorageLocal(
    TITLE, "typeList", PATH, (
      "month"
    ),
  );

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isGoalTodayList || isGoalList || isTodayList || isRealList) {
      setTypeSaveStr("h-min0 h-4vh fs-0-7rem pointer");
      setTypeListStr("h-min0 h-4vh fs-0-7rem pointer");
    }
    else {
      setTypeSaveStr("h-min40 fs-0-8rem pointer");
      setTypeListStr("h-min40 fs-0-8rem pointer");
    }
  }, [PATH]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isGoalTodayList || isTodayList) {
      setTypeList("day");
      setDATE({
        dateType: "",
        dateStart: DATE.dateStart || getDayFmt(),
        dateEnd: DATE.dateEnd || getDayFmt(),
      });
    }
    else if (isGoalList || isRealList) {
      if (typeList === "day") {
        setDATE({
          dateType: "",
          dateStart: DATE.dateStart || getDayFmt(),
          dateEnd: DATE.dateEnd || getDayFmt(),
        });
      }
      else if (typeList === "week") {
        setDATE({
          dateType: "",
          dateStart: getWeekStartFmt(),
          dateEnd: getWeekEndFmt(),
        });
      }
      else if (typeList === "month") {
        setDATE({
          dateType: "",
          dateStart: getMonthStartFmt(),
          dateEnd: getMonthEndFmt(),
        });
      }
      else if (typeList === "year") {
        setDATE({
          dateType: "",
          dateStart: getYearStartFmt(),
          dateEnd: getYearEndFmt(),
        });
      }
      else if (typeList === "select") {
        setDATE({
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd,
        });
      }
    }
  }, [typeList]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isCalendarDetail || isGoalDetail || isRealDetail) {
      if (typeSave === "day") {
        setDATE({
          dateType: "day",
          dateStart: getDayFmt(),
          dateEnd: getDayFmt(),
        });
      }
      else if (typeSave === "week") {
        setDATE({
          dateType: "week",
          dateStart: getWeekStartFmt(),
          dateEnd: getWeekEndFmt(),
        });
      }
      else if (typeSave === "month") {
        setDATE({
          dateType: "month",
          dateStart: getMonthStartFmt(),
          dateEnd: getMonthEndFmt(),
        });
      }
      else if (typeSave === "year") {
        setDATE({
          dateType: "year",
          dateStart: getYearStartFmt(),
          dateEnd: getYearEndFmt(),
        });
      }
      else if (typeSave === "select") {
        setDATE({
          dateType: "select",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd,
        });
      }
    }
  }, [typeSave]);

  // 7. pickerNode ---------------------------------------------------------------------------------
  const pickerNode = () => {

    // 1. day --------------------------------------------------------------------------------------
    const daySection = () => (
      <PopUp
        type={"innerCenter"}
        position={"center"}
        direction={"center"}
        contents={
          <Grid container spacing={2} columns={12} className={"w-min70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 me-10"}>
                {translate("viewDay")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${getDayFmt(DATE.dateStart)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
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
                              setSession("section", "food", "", []);
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
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("date")}
            value={`${DATE.dateStart}`}
            readOnly={true}
            inputclass={typeListStr}
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
                      setSession("section", "food", "", []);
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
                      setSession("section", "food", "", []);
                    }}
                  />
                </Div>
              </Div>
            }
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
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
          <Grid container spacing={2} columns={12} className={"w-min70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 me-10"}>
                {translate("viewWeek")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${getWeekStartFmt(DATE.dateStart)} ~ ${getWeekEndFmt(DATE.dateEnd)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
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
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={typeListStr}
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
              popTrigger.openPopup(e.currentTarget);
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
          <Grid container spacing={2} columns={12} className={"w-min70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 me-10"}>
                {translate("viewMonth")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${getMonthStartFmt(DATE.dateStart)} ~ ${getMonthEndFmt(DATE.dateEnd)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
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
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={typeListStr}
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
              popTrigger.openPopup(e.currentTarget);
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
          <Grid container spacing={2} columns={12} className={"w-min70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 me-10"}>
                {translate("viewYear")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${getYearStartFmt(DATE.dateStart)} ~ ${getYearEndFmt(DATE.dateEnd)}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
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
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            inputclass={typeListStr}
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
              popTrigger.openPopup(e.currentTarget);
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
          <Grid container spacing={2} columns={12} className={"w-min70vw"}>
            <Grid size={12} className={"d-row-center"}>
              <Div className={"fs-1-2rem fw-600 me-10"}>
                {translate("viewSelect")}
              </Div>
              <Div className={"fs-0-8rem fw-500 dark"}>
                {`[${DATE?.dateStart} ~ ${DATE?.dateEnd}]`}
              </Div>
            </Grid>
            <Grid size={12} className={"d-center"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
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
        }
      >
        {(popTrigger: any) => (
          <Input
            label={translate("duration")}
            value={durStr}
            readOnly={true}
            inputclass={`${typeListStr}`}
            startadornment={
              <Img
              	key={"common1"}
              	src={"common1"}
              	className={"w-16 h-16"}
              />
            }
            onClick={(e: any) => {
              popTrigger.openPopup(e.currentTarget);
            }}
          />
        )}
      </PopUp>
    );

    // 6. typeList ---------------------------------------------------------------------------------
    const typeListSection = () => (
      <Select
        label={translate("dateType")}
        value={typeList}
        inputclass={typeListStr}
        disabled={isGoalTodayList || isTodayList}
        onChange={(e: any) => {
          setTypeList(e.target.value);
        }}
      >
        {["day", "week", "month", "year", "select"]?.map((item: any) => (
          <MenuItem
            key={item}
            value={item}
            selected={item === typeList}
          >
            <Div className={"fs-0-6rem"}>
              {translate(item)}
            </Div>
          </MenuItem>
        ))}
      </Select>
    );

    // 7. typeSave ---------------------------------------------------------------------------------
    const typeSaveSection = () => (
      <Select
        label={translate("dateType")}
        value={DATE.dateType}
        inputclass={typeSaveStr}
        disabled={isRealDetail && !isCalendarDetail}
        onChange={(e: any) => {
          if (e.target.value === "day") {
            setTypeSave("day");
          }
          else if (e.target.value === "week") {
            setTypeSave("week");
          }
          else if (e.target.value === "month") {
            setTypeSave("month");
          }
          else if (e.target.value === "year") {
            setTypeSave("year");
          }
          else if (e.target.value === "select") {
            setTypeSave("select");
          }
        }}
      >
        {isCalendarDetail ? (
          ["day", "week", "month", "year", "select"]?.map((item: any) => (
            <MenuItem
              key={item}
              value={item}
              selected={item === typeSave}
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
              selected={item === typeSave}
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
              selected={item === typeSave}
            >
              {translate(item)}
            </MenuItem>
          ))
        )}
      </Select>
    );

    // 10. return ----------------------------------------------------------------------------------
    return (

      // 1-1. 리스트 (목표 - 오늘)
      isGoalTodayList ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={3} className={"d-center"}>
            {typeListSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {typeList === "day" && daySection()}
          </Grid>
        </Grid>
      )

      // 1-2. 리스트 (목표)
      : isGoalList ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={3} className={"d-center"}>
            {typeListSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {typeList === "day" && daySection()}
            {typeList === "week" && weekSection()}
            {typeList === "month" && monthSection()}
            {typeList === "year" && yearSection()}
            {typeList === "select" && selectSection()}
          </Grid>
        </Grid>
      )

      // 1-3. 리스트 (실제 - 오늘)
      : isTodayList ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={3} className={"d-center"}>
            {typeListSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {typeList === "day" && daySection()}
          </Grid>
        </Grid>
      )

      // 1-4. 리스트 (실제)
      : isRealList ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={3} className={"d-center"}>
            {typeListSection()}
          </Grid>
          <Grid size={9} className={"d-center"}>
            {typeList === "day" && daySection()}
            {typeList === "week" && weekSection()}
            {typeList === "month" && monthSection()}
            {typeList === "year" && yearSection()}
            {typeList === "select" && selectSection()}
          </Grid>
        </Grid>
      )

      // 2-1. 세이브 (일정)
      : isCalendarDetail ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {typeSaveSection()}
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

      // 2-2. 세이브 (목표)
      : isGoalDetail ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {typeSaveSection()}
          </Grid>
          <Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
            {DATE.dateType === "week" && weekSection()}
            {DATE.dateType === "month" && monthSection()}
            {DATE.dateType === "year" && yearSection()}
          </Grid>
        </Grid>
      )

      // 2-3. 세이브 (실제)
      : isRealDetail ? (
        <Grid container spacing={1} columns={12}>
          <Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
            {typeSaveSection()}
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
