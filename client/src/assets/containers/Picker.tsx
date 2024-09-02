// Picker.tsx

import { useEffect, useState } from "@imports/ImportReacts";
import { useCommon, useStorage } from "@imports/ImportHooks";
import { moment } from "@imports/ImportLibs";
import { Btn, Input, Img, Div, Select } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { MenuItem, PickersDay, Grid, Card, Badge } from "@imports/ImportMuis";
import { DateCalendar, AdapterMoment, LocalizationProvider } from "@imports/ImportMuis";
import { common1 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
interface PickerProps {
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
    translate, PATH, firstStr, secondStr, thirdStr, koreanDate, curWeekStart, curWeekEnd,
    curMonthStart, curMonthEnd, curYearStart, curYearEnd, TITLE,
  } = useCommon();

  const isToday = firstStr === "today";
  const isGoalList = secondStr === "goal" && thirdStr === "list";
  const isGoalSave = secondStr === "goal" && thirdStr === "save";
  const isList = secondStr === "list" && thirdStr === "";
  const isSave = secondStr === "save" && thirdStr === "";
  const isFind  = secondStr === "find";

  let sessionDate = sessionStorage?.getItem(`DATE(${PATH})`) || "{}";
  let parseDate = JSON?.parse(sessionDate);
  let dateStart = parseDate?.dateStart;
  let dateEnd = parseDate?.dateEnd;

  // 2-2. useStorage -------------------------------------------------------------------------------
  const [clickedType, setClickedType] = useStorage(
    `${TITLE}_clickedType_(${PATH})`, "thisToday"
  );
  const clickedDate = {
    todayDate: {
      dateType: isToday ? "day" : "",
      dateStart: koreanDate,
      dateEnd: koreanDate,
    },
    weekDate: {
      dateType: isToday ? "day" : "",
      dateStart: curWeekStart,
      dateEnd: curWeekEnd,
    },
    monthDate: {
      dateType: isToday ? "day" : "",
      dateStart: curMonthStart,
      dateEnd: curMonthEnd,
    },
    yearDate: {
      dateType: isToday ? "day" : "",
      dateStart: curYearStart,
      dateEnd: curYearEnd,
    },
    selectDate: {
      dateType: isToday ? "day" : "",
      dateStart: dateStart,
      dateEnd: dateEnd,
    }
  };
  const [typeStr, setTypeStr] = useState("");
  const [innerStr, setInnerStr] = useState("");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isGoalList || isList) {
      setTypeStr("h-min0 h-4vh fs-0-7rem pointer");
      setInnerStr("h-min0 h-4vh fs-0-7rem pointer");
    }
    else if (isGoalSave || isSave || isFind) {
      setTypeStr("h-min40 fs-0-8rem pointer");
      setInnerStr("h-min40 fs-0-8rem pointer");
    }
  }, [PATH]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (!isSave && !isGoalSave) {
      if (dateStart === "") {
        dateStart = koreanDate;
      }
      if (dateEnd === "") {
        dateEnd = koreanDate;
      }
    }
  }, [dateStart, dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (!isSave && !isGoalSave) {
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
      else {
        setDATE(clickedDate?.selectDate);
      }
    }
  }, [clickedType]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (!isSave && !isGoalSave) {
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
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewDay")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                  <DateCalendar
                    timezone={"Asia/Seoul"}
                    views={["day"]}
                    readOnly={false}
                    value={moment(DATE.dateStart)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      day: (props) => {
                        const {outsideCurrentMonth, day, ...other} = props;
                        const isBadged = EXIST.includes(moment(day).tz("Asia/Seoul").format("YYYY-MM-DD"));
                        const isSelected = DATE.dateStart === moment(day).tz("Asia/Seoul").format("YYYY-MM-DD");
                        return (
                          <Badge
                            key={props.day.toString()}
                            badgeContent={""}
                            slotProps={{
                              badge: {style: {
                                width: 3, height: 3, padding: 0, top: 8, left: 30,
                                backgroundColor: isBadged ? "#1976d2" : undefined,
                              }}
                            }}
                          >
                            <PickersDay
                              {...other}
                              day={day}
                              selected={isSelected}
                              outsideCurrentMonth={outsideCurrentMonth}
                              onDaySelect={(day) => {
                                setDATE((prev: any) => ({
                                  ...prev,
                                  dateStart: moment(day).tz("Asia/Seoul").format("YYYY-MM-DD"),
                                  dateEnd: moment(day).tz("Asia/Seoul").format("YYYY-MM-DD")
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
                            setDATE((prev: any) => {
                              const newDateStart = moment(prev.dateStart).subtract(1, "month");
                              const newDateEnd = newDateStart.clone().endOf('month');
                              return {
                                ...prev,
                                dateStart: newDateStart.format("YYYY-MM-DD"),
                                dateEnd: newDateEnd.format("YYYY-MM-DD")
                              };
                            });
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
                            setDATE((prev: any) => {
                              const newDateStart = moment(prev.dateStart).add(1, "month");
                              const newDateEnd = newDateStart.clone().endOf('month');
                              return {
                                ...prev,
                                dateStart: newDateStart.format("YYYY-MM-DD"),
                                dateEnd: newDateEnd.format("YYYY-MM-DD")
                              };
                            });
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
              <Img src={common1} className={"w-16 h-16"} />
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
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewWeek")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                  <DateCalendar
                    timezone={"Asia/Seoul"}
                    views={["day"]}
                    readOnly={false}
                    value={moment(DATE.dateEnd) || moment(DATE.dateStart)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      // 일주일에 해당하는 날짜를 선택
                      day: (props) => {
                        const {outsideCurrentMonth, day, ...other} = props;
                        const isFirst = moment(day).tz("Asia/Seoul").format("YYYY-MM-DD") === DATE.dateStart;
                        const isLast = moment(day).tz("Asia/Seoul").format("YYYY-MM-DD") === DATE.dateEnd;
                        const isSelected =
                        DATE.dateStart <= moment(day).tz("Asia/Seoul").format("YYYY-MM-DD") &&
                        DATE.dateEnd >= moment(day).tz("Asia/Seoul").format("YYYY-MM-DD")
                        let borderRadius = "";
                        if (isSelected) {
                          if (isFirst) {
                            borderRadius = "50% 0 0 50%";
                          }
                          else if (isLast) {
                            borderRadius = "0 50% 50% 0";
                          }
                          else {
                            borderRadius = "0";
                          }
                        }
                        return (
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              borderRadius: borderRadius,
                              boxShadow: isSelected ? "0 0 0 3px #1976d2" : "none",
                            }}
                            onDaySelect={(day) => {
                              setDATE((prev: any) => ({
                                ...prev,
                                dateStart: moment(day).tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD"),
                                dateEnd: moment(day).tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD")
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
                          setDATE((prev: any) => {
                            const newDateStart = moment(prev.dateStart).subtract(1, "week").startOf("isoWeek");
                            const newDateEnd = newDateStart.clone().endOf("isoWeek");
                            return {
                              ...prev,
                              dateStart: newDateStart.format("YYYY-MM-DD"),
                              dateEnd: newDateEnd.format("YYYY-MM-DD"),
                            };
                          });
                        }}>
                          {props.children}
                        </Btn>
                      ),
                      nextIconButton: (props) => (
                        <Btn
                          {...props}
                          className={"fs-1-4rem"}
                          onClick={() => {
                          setDATE((prev: any) => {
                            const newDateStart = moment(prev.dateStart).add(1, "week").startOf("isoWeek");
                            const newDateEnd = newDateStart.clone().endOf("isoWeek");
                            return {
                              ...prev,
                              dateStart: newDateStart.format("YYYY-MM-DD"),
                              dateEnd: newDateEnd.format("YYYY-MM-DD"),
                            };
                          });
                        }}>
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
              <Img src={common1} className={"w-16 h-16"} />
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
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewMonth")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                  <DateCalendar
                    timezone={"Asia/Seoul"}
                    views={["day"]}
                    readOnly={false}
                    value={moment(DATE.dateEnd) || moment(DATE.dateStart)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      // 월의 첫번째 날을 선택
                      day: (props) => {
                        const {outsideCurrentMonth, day, ...other} = props;
                        const isSelected = moment(day).tz("Asia/Seoul").date() === 1;
                        return (
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                          />
                        )
                      },
                      previousIconButton: (props) => (
                        <Btn
                          {...props}
                          className={"fs-1-4rem"}
                          onClick={() => {
                          setDATE((prev: any) => {
                            const newDateStart = moment(prev.dateStart).subtract(1, "month");
                            const newDateEnd = newDateStart.clone().endOf('month');
                            return {
                              ...prev,
                              dateStart: newDateStart.format("YYYY-MM-DD"),
                              dateEnd: newDateEnd.format("YYYY-MM-DD")
                            };
                          });
                        }}>
                          {props.children}
                        </Btn>
                      ),
                      nextIconButton: (props) => (
                        <Btn
                          {...props}
                          className={"fs-1-4rem"}
                          onClick={() => {
                          setDATE((prev: any) => {
                            const newDateStart = moment(prev.dateStart).add(1, "month");
                            const newDateEnd = newDateStart.clone().endOf('month');
                            return {
                              ...prev,
                              dateStart: newDateStart.format("YYYY-MM-DD"),
                              dateEnd: newDateEnd.format("YYYY-MM-DD")
                            };
                          });
                        }}>
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
              <Img src={common1} className={"w-16 h-16"} />
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
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewYear")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                  <DateCalendar
                    timezone={"Asia/Seoul"}
                    views={["day"]}
                    readOnly={false}
                    value={moment(DATE.dateEnd) || moment(DATE.dateStart)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      // 매년 1월 1일 선택
                      day: (props) => {
                        const {outsideCurrentMonth, day, ...other} = props;
                        const isSelected = moment(day).tz("Asia/Seoul").month() === 0 && moment(day).tz("Asia/Seoul").date() === 1;
                        return (
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                          />
                        )
                      },
                      previousIconButton: (props) => (
                        <Btn
                          {...props}
                          className={"fs-1-4rem"}
                          onClick={() => {
                          setDATE((prev: any) => {
                            const newDateStart = moment(prev.dateStart).subtract(1, "year");
                            const newDateEnd = newDateStart.clone().endOf('year');
                            return {
                              ...prev,
                              dateStart: newDateStart.format("YYYY-MM-DD"),
                              dateEnd: newDateEnd.format("YYYY-MM-DD")
                            };
                          });
                        }}>
                          {props.children}
                        </Btn>
                      ),
                      nextIconButton: (props) => (
                        <Btn
                          {...props}
                          className={"fs-1-4rem"}
                          onClick={() => {
                          setDATE((prev: any) => {
                            const newDateStart = moment(prev.dateStart).add(1, "year");
                            const newDateEnd = newDateStart.clone().endOf('year');
                            return {
                              ...prev,
                              dateStart: newDateStart.format("YYYY-MM-DD"),
                              dateEnd: newDateEnd.format("YYYY-MM-DD")
                            };
                          });
                        }}>
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
              <Img src={common1} className={"w-16 h-16"} />
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
              <Grid size={12} className={"d-center"}>
                <Div className={"fs-1-2rem fw-600"}>
                  {translate("viewSelect")}
                </Div>
              </Grid>
              <Grid size={12} className={"d-center"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                  <DateCalendar
                    timezone={"Asia/Seoul"}
                    views={["day"]}
                    readOnly={false}
                    value={moment(DATE.dateEnd) || moment(DATE.dateStart)}
                    className={"radius border"}
                    showDaysOutsideCurrentMonth={true}
                    slots={{
                      day: (props) => {
                        const {outsideCurrentMonth, day, ...other} = props;
                        const isFirst = moment(day).tz("Asia/Seoul").format("YYYY-MM-DD") === DATE.dateStart;
                        const isLast = moment(day).tz("Asia/Seoul").format("YYYY-MM-DD") === DATE.dateEnd;
                        const isSelected = DATE.dateStart <= moment(day).tz("Asia/Seoul").format("YYYY-MM-DD") &&
                        DATE.dateEnd >= moment(day).tz("Asia/Seoul").format("YYYY-MM-DD")
                        let borderRadius = "";
                        let backgroundColor = "";
                        if (isSelected) {
                          if (isFirst && isLast) {
                            borderRadius = "50%";
                            backgroundColor = "#1976d2";
                          }
                          else if (isFirst) {
                            borderRadius = "50% 0 0 50%";
                            backgroundColor = "#1976d2";
                          }
                          else if (isLast) {
                            borderRadius = "0 50% 50% 0";
                            backgroundColor = "#1976d2";
                          }
                          else {
                            borderRadius = "0";
                          }
                        }
                        return (
                          <PickersDay
                            {...other}
                            day={day}
                            selected={isSelected}
                            outsideCurrentMonth={outsideCurrentMonth}
                            style={{
                              borderRadius: borderRadius,
                              backgroundColor: backgroundColor,
                              boxShadow: isSelected ? "0 0 0 3px #1976d2" : "none",
                            }}
                            onDaySelect={(day) => {
                              if (
                                !DATE.dateStart ||
                                DATE.dateEnd ||
                                moment(day).tz("Asia/Seoul").isBefore(DATE.dateStart)
                              ) {
                                setDATE((prev: any) => ({
                                  ...prev,
                                  dateStart: moment(day).tz("Asia/Seoul").format("YYYY-MM-DD"),
                                  dateEnd: ""
                                }));
                              }
                              else {
                                setDATE((prev: any) => ({
                                  ...prev,
                                  dateStart: prev.dateStart,
                                  dateEnd: moment(day).tz("Asia/Seoul").format("YYYY-MM-DD")
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
              <Img src={common1} className={"w-16 h-16"} />
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

    // 6. listClickNode ----------------------------------------------------------------------------
    const listClickNode = () => (
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

    // 7. type -------------------------------------------------------------------------------------
    const saveTypeSection = () => (
      <Select
        label={translate("dateType")}
        value={DATE.dateType || ""}
        nputclass={typeStr}
        onChange={(e: any) => {
          if (e.target.value === "day") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "day",
              dateStart: koreanDate,
              dateEnd: koreanDate
            }));
          }
          else if (e.target.value === "week") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "week",
              dateStart: curWeekStart,
              dateEnd: curWeekEnd
            }));
          }
          else if (e.target.value === "month") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "month",
              dateStart: curMonthStart,
              dateEnd: curMonthEnd
            }));
          }
          else if (e.target.value === "year") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "year",
              dateStart: curYearStart,
              dateEnd: curYearEnd
            }));
          }
          else if (e.target.value === "select") {
            setDATE((prev: any) => ({
              ...prev,
              dateType: "select",
              dateStart: koreanDate,
              dateEnd: koreanDate,
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

    // 7. return
    return (
      isGoalList || isList ? (
        <Grid container spacing={2}>
          <Grid size={9} className={"d-center"}>
            {selectSection()}
          </Grid>
          <Grid size={3} className={"d-center"}>
            {listClickNode()}
          </Grid>
        </Grid>
      ) : isGoalSave || isSave || isFind ? (
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
      ) : (
        null
      )
    )
  };

  return (
    <>
      {pickerNode()}
    </>
  );
};
