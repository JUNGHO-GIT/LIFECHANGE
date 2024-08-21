// Picker.jsx

import {React, useLocation, useEffect, useState} from "../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../import/ImportHooks.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, Div, Img, Br20, Br10} from "../../import/ImportComponents.jsx";
import {Badge, TextField, MenuItem, PickersDay, Button} from "../../import/ImportMuis.jsx";
import {DateCalendar, AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const Picker = ({
  DATE, setDATE, EXIST, setEXIST
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
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
      dateStart: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
    },
    weekDate: {
      dateType: isToday ? "day" : "",
      dateStart: moment().tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD"),
    },
    monthDate: {
      dateType: isToday ? "day" : "",
      dateStart: moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD"),
    },
    yearDate: {
      dateType: isToday ? "day" : "",
      dateStart: moment().tz("Asia/Seoul").startOf("year").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("year").format("YYYY-MM-DD"),
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
      setInnerStr("h-min0 h-4vh fs-0-7rem pointer");
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
        dateStart = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
      }
      if (dateEnd === "") {
        dateEnd = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
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
      <Div className={"d-column"}>
        <Div className={"d-center fs-1-2rem fw-600"}>
          {translate("viewDay")}
        </Div>
        <Br20 />
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
                <Button
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
                </Button>
              ),
              nextIconButton: (props) => (
                <Button
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
                </Button>
              )
            }}
          />
        </LocalizationProvider>
      </Div>
      )}>
      {(popTrigger={}) => (
        <TextField
          type={"text"}
          size={"small"}
          label={translate("date")}
          variant={"outlined"}
          value={`${DATE.dateStart}`}
          className={widthStr}
          InputProps={{
            readOnly: true,
            className: innerStr,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
          }}
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
        <Div className={"d-column"}>
          <Div className={"d-center fs-1-2rem fw-600"}>
            {translate("viewWeek")}
          </Div>
          <Br20 />
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
                  <Button
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
                  </Button>
                ),
                nextIconButton: (props) => (
                  <Button
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
                  </Button>
                ),
              }}
            />
          </LocalizationProvider>
        </Div>
      )}>
      {(popTrigger={}) => (
        <TextField
          type={"text"}
          size={"small"}
          label={translate("duration")}
          variant={"outlined"}
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={widthStr}
          InputProps={{
            readOnly: true,
            className: innerStr,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
          }}
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
        <Div className={"d-column"}>
          <Div className={"d-center fs-1-2rem fw-600"}>
            {translate("viewMonth")}
          </Div>
          <Br20 />
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
                  <Button
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
                  </Button>
                ),
                nextIconButton: (props) => (
                  <Button
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
                  </Button>
                )
              }}
            />
          </LocalizationProvider>
        </Div>
      )}>
      {(popTrigger={}) => (
        <TextField
          type={"text"}
          size={"small"}
          label={translate("duration")}
          variant={"outlined"}
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={widthStr}
          InputProps={{
            readOnly: true,
            className: innerStr,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
          }}
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
        <Div className={"d-column"}>
          <Div className={"d-center fs-1-2rem fw-600"}>
            {translate("viewYear")}
          </Div>
          <Br20 />
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
                  <Button
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
                  </Button>
                ),
                nextIconButton: (props) => (
                  <Button
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
                  </Button>
                )
              }}
            />
          </LocalizationProvider>
        </Div>
      )}>
      {(popTrigger={}) => (
        <TextField
          type={"text"}
          size={"small"}
          label={translate("duration")}
          variant={"outlined"}
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={widthStr}
          InputProps={{
            readOnly: true,
            className: innerStr,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
          }}
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
        <Div className={"d-column"}>
          <Div className={"d-center fs-1-2rem fw-600"}>
            {translate("viewSelect")}
          </Div>
          <Br20 />
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
        </Div>
      )}>
      {(popTrigger = {}) => (
        <TextField
          type={"text"}
          size={"small"}
          label={translate("duration")}
          variant={"outlined"}
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={widthStr}
          InputProps={{
            readOnly: true,
            className: innerStr,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
          }}
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
        <Div className={"d-column p-10"}>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "thisToday" ? "#1976d2" : "#F9FAFB",
              color: clickedType === "thisToday" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("thisToday");
            }}
          >
            {translate("thisToday")}
          </Button>
          <Br10/>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "thisWeek" ? "#1976d2" :"#F9FAFB",
              color: clickedType === "thisWeek" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("thisWeek");
            }}
          >
            {translate("thisWeek")}
          </Button>
          <Br10/>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "thisMonth" ? "#1976d2" :"#F9FAFB",
              color: clickedType === "thisMonth" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("thisMonth");
            }}
          >
            {translate("thisMonth")}
          </Button>
          <Br10/>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "thisYear" ? "#1976d2" :"#F9FAFB",
              color: clickedType === "thisYear" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("thisYear");
            }}
          >
            {translate("thisYear")}
          </Button>
          <Br10/>
          <Button
            size={"small"}
            variant={"contained"}
            style={{
              lineHeight: "1.4",
              padding: "3px 9px",
              textTransform: "none",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.7rem",
              backgroundColor: clickedType === "selectDate" ? "#1976d2" :"#F9FAFB",
              color: clickedType === "selectDate" ? "#ffffff" : "#1976d2",
            }}
            onClick={() => {
              setClickedType("selectDate");
            }}
          >
            {translate("selectDate")}
          </Button>
        </Div>
      )}
    >
      {(popTrigger={}) => (
        <Button
          size={"small"}
          color={"primary"}
          variant={"contained"}
          className={"ms-3vw"}
          style={{
            lineHeight: "1.4",
            padding: "3px 9px",
            textTransform: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.7rem"
          }}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}
        >
          {translate(clickedType)}
        </Button>
      )}
    </PopUp>
  );

  // 7. type ---------------------------------------------------------------------------------------
  const saveTypeSection = () => (
    (firstStr === "calendar" && secondStr !== "goal") ||
    (firstStr !== "calendar" && secondStr === "goal") ? (
      <TextField
        select={true}
        label={translate("dateType")}
        size={"small"}
        value={DATE.dateType || ""}
        variant={"outlined"}
        className={"w-26vw me-3vw"}
        InputProps={{
          readOnly: false,
          className: typeStr
        }}
        onChange={(e) => {
          if (e.target.value === "day") {
            setDATE((prev) => ({
              ...prev,
              dateType: "day",
              dateStart: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
              dateEnd: moment().tz("Asia/Seoul").format("YYYY-MM-DD")
            }));
          }
          else if (e.target.value === "week") {
            setDATE((prev) => ({
              ...prev,
              dateType: "week",
              dateStart: moment().tz("Asia/Seoul").startOf("isoWeek").format("YYYY-MM-DD"),
              dateEnd: moment().tz("Asia/Seoul").endOf("isoWeek").format("YYYY-MM-DD")
            }));
          }
          else if (e.target.value === "month") {
            setDATE((prev) => ({
              ...prev,
              dateType: "month",
              dateStart: moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
              dateEnd: moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD")
            }));
          }
          else if (e.target.value === "year") {
            setDATE((prev) => ({
              ...prev,
              dateType: "year",
              dateStart: moment().tz("Asia/Seoul").startOf("year").format("YYYY-MM-DD"),
              dateEnd: moment().tz("Asia/Seoul").endOf("year").format("YYYY-MM-DD")
            }));
          }
          else if (e.target.value === "select") {
            setDATE((prev) => ({
              ...prev,
              dateType: "select",
              dateStart: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
              dateEnd: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
            }));
          }
        }}
      >
        {["day", "week", "month", "year", "select"]?.map((item) => (
          <MenuItem key={item} value={item} selected={item === DATE.dateType}>
            {translate(item)}
          </MenuItem>
        ))}
      </TextField>
    ) : (
      null
    )
  );

  // 6. list ---------------------------------------------------------------------------------------
  const listNode = () => (
    <Div className={"d-center"}>
      {selectSection()}
      {isToday ? null : listClickNode()}
    </Div>
  );

  // 6. save ---------------------------------------------------------------------------------------
  const saveNode = () => (
    <Div className={"d-center"}>
      {saveTypeSection()}
      {DATE.dateType === "day" && daySection()}
      {DATE.dateType === "week" && weekSection()}
      {DATE.dateType === "month" && monthSection()}
      {DATE.dateType === "year" && yearSection()}
      {DATE.dateType === "select" && selectSection()}
    </Div>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {(isGoalList || isList) && listNode()}
      {(isGoalSave || isSave || isFind) && saveNode()}
    </>
  );
};
