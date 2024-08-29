// Picker.jsx

import { useEffect, useState } from "../../imports/ImportReacts.jsx";
import { useCommon, useStorage } from "../../imports/ImportHooks.jsx";
import { moment } from "../../imports/ImportLibs.jsx";
import { Btn, Input, Img, Div, Br, Select } from "../../imports/ImportComponents.jsx";
import { PopUp } from "../../imports/ImportContainers.jsx";
import { MenuItem, PickersDay, Grid, Card, Badge } from "../../imports/ImportMuis.jsx";
import { DateCalendar, AdapterMoment, LocalizationProvider } from "../../imports/ImportMuis.jsx";
import { common1 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Picker = ({
  DATE, setDATE, EXIST, setEXIST
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const { translate, PATH, firstStr, secondStr, thirdStr, koreanDate, curWeekStart, curWeekEnd,
  curMonthStart, curMonthEnd, curYearStart, curYearEnd } = useCommon();

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
    `CLICKED(${PATH})`, "thisToday"
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
  const [widthStr, setWidthStr] = useState("");
  const [innerStr, setInnerStr] = useState("");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isGoalList || isList) {
      setTypeStr("h-min0 h-4vh fs-0-7rem pointer");
      setWidthStr("w-46vw");
      setInnerStr("h-min0 h-4vh fs-0-6rem pointer");
    }
    else if (isGoalSave || isSave || isFind) {
      setTypeStr("h-min40 fs-0-8rem pointer");
      setWidthStr("w-86vw");
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

  // 1. day ----------------------------------------------------------------------------------------
  const daySection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"w-max70vw p-0"}>
          <Grid container rowSpacing={3}>
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
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: moment(day).tz("Asia/Seoul").format("YYYY-MM-DD"),
                                dateEnd: moment(day).tz("Asia/Seoul").format("YYYY-MM-DD")
                              }));
                              Object.keys(sessionStorage).forEach((key) => {
                                if (key.includes("foodSection")) {
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
                          setDATE((prev = {}) => {
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
                          setDATE((prev = {}) => {
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
      )}>
      {(popTrigger={}) => (
        <Input
          label={translate("date")}
          value={`${DATE.dateStart}`}
          className={widthStr}
          readOnly={true}
          inputclass={innerStr}
          startadornment={
            <Img src={common1} className={"w-16 h-16"} />
          }
          onClick={(e) => {
            if (!isToday) {
              popTrigger.openPopup(e.currentTarget);
            }
          }}
        />
      )}
    </PopUp>
  );

  // 2. week ---------------------------------------------------------------------------------------
  const weekSection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"w-max70vw p-0"}>
          <Grid container rowSpacing={3}>
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
                            setDATE((prev) => ({
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
                        setDATE((prev = {}) => {
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
                        setDATE((prev = {}) => {
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
      )}>
      {(popTrigger={}) => (
        <Input
          label={translate("duration")}
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={widthStr}
          inputclass={innerStr}
          readOnly={true}
          startadornment={
            <Img src={common1} className={"w-16 h-16"} />
          }
          onClick={(e) => {
            if (!isToday) {
              popTrigger.openPopup(e.currentTarget);
            }
          }}
        />
      )}
    </PopUp>
  );

  // 3. month --------------------------------------------------------------------------------------
  const monthSection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"w-max70vw p-0"}>
          <Grid container rowSpacing={3}>
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
                        setDATE((prev = {}) => {
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
                        setDATE((prev = {}) => {
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
      )}>
      {(popTrigger={}) => (
        <Input
          label={translate("duration")}
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={widthStr}
          inputclass={innerStr}
          readOnly={true}
          startadornment={
            <Img src={common1} className={"w-16 h-16"} />
          }
          onClick={(e) => {
            if (!isToday) {
              popTrigger.openPopup(e.currentTarget);
            }
          }}
        />
      )}
    </PopUp>
  );

  // 4. year ---------------------------------------------------------------------------------------
  const yearSection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"w-max70vw p-0"}>
          <Grid container rowSpacing={3}>
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
                        setDATE((prev = {}) => {
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
                        setDATE((prev = {}) => {
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
      )}>
      {(popTrigger={}) => (
        <Input
          label={translate("duration")}
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={widthStr}
          inputclass={innerStr}
          readOnly={true}
          startadornment={
            <Img src={common1} className={"w-16 h-16"} />
          }
          onClick={(e) => {
            if (!isToday) {
              popTrigger.openPopup(e.currentTarget);
            }
          }}
        />
      )}
    </PopUp>
  );

  // 5. select -------------------------------------------------------------------------------------
  const selectSection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({ closePopup }) => (
        <Card className={"w-max70vw p-0"}>
          <Grid container rowSpacing={3}>
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
                              setDATE((prev) => ({
                                ...prev,
                                dateStart: moment(day).tz("Asia/Seoul").format("YYYY-MM-DD"),
                                dateEnd: ""
                              }));
                            }
                            else {
                              setDATE((prev) => ({
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
      )}>
      {(popTrigger = {}) => (
        <Input
          label={translate("duration")}
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={widthStr}
          readOnly={true}
          inputclass={innerStr}
          startadornment={
            <Img src={common1} className={"w-16 h-16"} />
          }
          onClick={(e) => {
            if (!isToday) {
              popTrigger.openPopup(e.currentTarget);
            }
          }}
        />
      )}
    </PopUp>
  );

  // 6. listClickNode ------------------------------------------------------------------------------
  const listClickNode = () => (
    <PopUp
      type={"dropdown"}
      position={"top"}
      direction={"center"}
      contents={({closePopup}) => (
        <Card className={"w-max18vw h-max30vh p-0 d-fit"}>
          <Grid container rowSpacing={1}>
            <Grid size={12} className={"d-center"}>
              <Btn
                style={{
                  padding: "1px 9px",
                  fontSize: "0.7rem",
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
                  padding: "1px 1px",
                  fontSize: "0.7rem",
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
                  backgroundColor: clickedType === "selectDate" ? "#1976d2" :"#F9FAFB",
                  color: clickedType === "selectDate" ? "#ffffff" : "#1976d2",
                }}
                onClick={() => {
                  setClickedType("selectDate");
                }}
              >
                {translate("selectDate")}
              </Btn>
            </Grid>
          </Grid>
        </Card>
      )}>
      {(popTrigger={}) => (
        <Btn
          color={"primary"}
          className={"pt-1 pb-1 ps-9 pe-9 fs-0-7rem ms-n2vw"}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget);
          }
        }>
          {translate(clickedType)}
        </Btn>
      )}
    </PopUp>
  );

  // 7. type ---------------------------------------------------------------------------------------
  const saveTypeSection = () => (
    <Select
      label={translate("dateType")}
      value={DATE.dateType || ""}
      inputclass={typeStr}
      onChange={(e) => {
        if (e.target.value === "day") {
          setDATE((prev) => ({
            ...prev,
            dateType: "day",
            dateStart: koreanDate,
            dateEnd: koreanDate
          }));
        }
        else if (e.target.value === "week") {
          setDATE((prev) => ({
            ...prev,
            dateType: "week",
            dateStart: curWeekStart,
            dateEnd: curWeekEnd
          }));
        }
        else if (e.target.value === "month") {
          setDATE((prev) => ({
            ...prev,
            dateType: "month",
            dateStart: curMonthStart,
            dateEnd: curMonthEnd
          }));
        }
        else if (e.target.value === "year") {
          setDATE((prev) => ({
            ...prev,
            dateType: "year",
            dateStart: curYearStart,
            dateEnd: curYearEnd
          }));
        }
        else if (e.target.value === "select") {
          setDATE((prev) => ({
            ...prev,
            dateType: "select",
            dateStart: koreanDate,
            dateEnd: koreanDate,
          }));
        }
      }}
    >
      {["day", "week", "month", "year", "select"]?.map((item) => (
        <MenuItem key={item} value={item} selected={item === DATE.dateType}>
          {translate(item)}
        </MenuItem>
      ))}
    </Select>
  );

  // 6. list ---------------------------------------------------------------------------------------
  const listNode = () => (
    !isToday ? (
      <Grid container columnSpacing={1}>
        <Grid size={9} className={"d-center"}>
          {selectSection()}
        </Grid>
        <Grid size={3} className={"d-center"}>
          {listClickNode()}
        </Grid>
      </Grid>
    ) : (
      <Grid container columnSpacing={1}>
        <Grid size={12} className={"d-center"}>
          {selectSection()}
        </Grid>
      </Grid>
    )
  );

  // 6. save ---------------------------------------------------------------------------------------
  const saveNode = () => (
    <Grid container columnSpacing={1}>
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
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {(isGoalList || isList) && listNode()}
      {(isGoalSave || isSave || isFind) && saveNode()}
    </>
  );
};
