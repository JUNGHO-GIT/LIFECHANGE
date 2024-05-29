// Picker.jsx

import {React} from "../../import/ImportReacts.jsx";
import {useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, Div, Img, Br20} from "../../import/ImportComponents.jsx";
import {Badge, TextField, MenuItem, PickersDay, Button} from "../../import/ImportMuis.jsx";
import {DateCalendar, AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Picker = ({
  DATE, setDATE, EXIST, setEXIST
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  const selectStr =
  (secondStr === "plan" && thirdStr === "list") ||
  (secondStr === "list" && thirdStr === "") ? (
    "h-min0 h-4vh fs-0-7rem pointer"
  ) : (secondStr === "plan" && thirdStr === "save") ||
  (secondStr === "save" && thirdStr === "") ? (
    "h-min40 fs-0-8rem pointer"
  ) : "pointer";

  const dateStr1 =
  (firstStr !== "calendar" && secondStr === "plan" && thirdStr === "list") ? (
    "w-50vw"
  ) : (firstStr !== "calendar" && secondStr === "diff" && thirdStr === "list") ? (
    "w-50vw"
  ) : (firstStr !== "calendar" && secondStr === "find" && thirdStr === "save") ? (
    "w-75vw"
  ) : (firstStr !== "calendar" && secondStr === "list" && thirdStr === "") ? (
    "w-50vw"
  ) : (firstStr !== "calendar" && secondStr === "plan" && thirdStr === "save") ? (
    "w-60vw"
  ) : (firstStr !== "calendar" && secondStr === "save" && thirdStr === "") ? (
    "w-75vw"
  ) : (firstStr === "calendar" && secondStr === "save" && thirdStr === "") ? (
    "w-60vw"
  ) : "";

  const dateStr2 =
  (firstStr !== "calendar" && secondStr === "plan" && thirdStr === "list") ? (
    "h-min0 h-4vh fs-0-7rem pointer"
  ) : (firstStr !== "calendar" && secondStr === "diff" && thirdStr === "list") ? (
    "h-min0 h-4vh fs-0-7rem pointer"
  ) : (firstStr !== "calendar" && secondStr === "list" && thirdStr === "") ? (
    "h-min0 h-4vh fs-0-7rem pointer"
  ) : (firstStr !== "calendar" && secondStr === "plan" && thirdStr === "save") ? (
    "h-min40 fs-0-8rem pointer"
  ) : (firstStr !== "calendar" && secondStr === "save" && thirdStr === "") ? (
    "h-min40 fs-0-8rem pointer"
  ) : (firstStr === "calendar" && secondStr === "save" && thirdStr === "") ? (
    "h-min40 fs-0-8rem pointer"
  ) : "";

  // 1. day --------------------------------------------------------------------------------------->
  const daySection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
      <Div className={"d-column"}>
        <Div className={"d-center fs-1-2rem fw-bold"}>
          {translate("common-viewDay")}
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
                const isBadged = EXIST.includes(moment(day).format("YYYY-MM-DD"));
                const isSelected = DATE.dateStart === moment(day).format("YYYY-MM-DD");
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
                    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth}
                      day={day} selected={isSelected}
                      onDaySelect={(day) => {
                        setDATE((prev={}) => ({
                          ...prev,
                          dateStart: moment(day).format("YYYY-MM-DD"),
                          dateEnd: moment(day).format("YYYY-MM-DD")
                        }));
                      }}
                    />
                  </Badge>
                )
              },
              previousIconButton: (props) => (
                <Button {...props} className={"fs-1-4rem"} onClick={() => {
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
                <Button {...props} className={"fs-1-4rem"} onClick={() => {
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
          label={translate("common-date")}
          variant={"outlined"}
          value={`${DATE.dateStart}`}
          className={dateStr1}
          InputProps={{
            readOnly: true,
            className: dateStr2,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
            endAdornment: null
          }}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    </PopUp>
  );

  // 2. week -------------------------------------------------------------------------------------->
  const weekSection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Div className={"d-column"}>
          <Div className={"d-center fs-1-2rem fw-bold"}>
            {translate("common-viewWeek")}
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
                  const isFirst = moment(day).format("YYYY-MM-DD") === DATE.dateStart;
                  const isLast = moment(day).format("YYYY-MM-DD") === DATE.dateEnd;
                  const isSelected =
                  DATE.dateStart <= moment(day).format("YYYY-MM-DD") &&
                  DATE.dateEnd >= moment(day).format("YYYY-MM-DD")
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
                    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth}
                      day={day} selected={isSelected}
                      style={{
                        borderRadius: borderRadius,
                        boxShadow: isSelected ? "0 0 0 3px #1976d2" : "none",
                      }}
                      onDaySelect={(day) => {
                        setDATE((prev={}) => ({
                          ...prev,
                          dateStart: moment(day).startOf("isoWeek").format("YYYY-MM-DD"),
                          dateEnd: moment(day).endOf("isoWeek").format("YYYY-MM-DD")
                        }));
                      }}
                    />
                  )
                },
                previousIconButton: (props) => (
                  <Button {...props} className={"fs-1-4rem"} onClick={() => {
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
                  <Button {...props} className={"fs-1-4rem"} onClick={() => {
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
          label={translate("common-duration")}
          variant={"outlined"}value={`${DATE.dateStart}~${DATE.dateEnd}`}
          className={dateStr1}
          InputProps={{
            readOnly: true,
            className: dateStr2,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
            endAdornment: null
          }}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    </PopUp>
  );

  // 3. month ------------------------------------------------------------------------------------->
  const monthSection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Div className={"d-column"}>
          <Div className={"d-center fs-1-2rem fw-bold"}>
            {translate("common-viewMonth")}
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
                  const isSelected = moment(day).date() === 1;
                  return (
                    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth}
                      day={day} selected={isSelected}
                    />
                  )
                },
                previousIconButton: (props) => (
                  <Button {...props} className={"fs-1-4rem"} onClick={() => {
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
                  <Button {...props} className={"fs-1-4rem"} onClick={() => {
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
          label={translate("common-duration")}
          variant={"outlined"}value={`${DATE.dateStart}~${DATE.dateEnd}`}
          className={dateStr1}
          InputProps={{
            readOnly: true,
            className: dateStr2,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
            endAdornment: null
          }}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    </PopUp>
  );

  // 4. year -------------------------------------------------------------------------------------->
  const yearSection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Div className={"d-column"}>
          <Div className={"d-center fs-1-2rem fw-bold"}>
            {translate("common-viewYear")}
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
                  const isSelected = moment(day).month() === 0 && moment(day).date() === 1;
                  return (
                    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth}
                      day={day} selected={isSelected}
                    />
                  )
                },
                previousIconButton: (props) => (
                  <Button {...props} className={"fs-1-4rem"} onClick={() => {
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
                  <Button {...props} className={"fs-1-4rem"} onClick={() => {
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
          label={translate("common-duration")}
          variant={"outlined"}value={`${DATE.dateStart}~${DATE.dateEnd}`}
          className={dateStr1}
          InputProps={{
            readOnly: true,
            className: dateStr2,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
            endAdornment: null
          }}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    </PopUp>
  );

  // 4. select ------------------------------------------------------------------------------------>
  const selectSection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({ closePopup }) => (
        <Div className={"d-column"}>
          <Div className={"d-center fs-1-2rem fw-bold"}>
            {translate("common-viewSelect")}
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
                  const isFirst = moment(day).format("YYYY-MM-DD") === DATE.dateStart;
                  const isLast = moment(day).format("YYYY-MM-DD") === DATE.dateEnd;
                  const isSelected = DATE.dateStart <= moment(day).format("YYYY-MM-DD") &&
                  DATE.dateEnd >= moment(day).format("YYYY-MM-DD")
                  let borderRadius = "";
                  let backgroundColor = "";
                  if (isSelected) {
                    if (isFirst) {
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
                    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth}
                      day={day} selected={isSelected}
                      style={{
                        borderRadius: borderRadius,
                        backgroundColor: backgroundColor,
                        boxShadow: isSelected ? "0 0 0 3px #1976d2" : "none",
                      }}
                      onDaySelect={(day) => {
                        if (
                          !DATE.dateStart ||
                          DATE.dateEnd ||
                          moment(day).isBefore(DATE.dateStart)
                        ) {
                          setDATE((prev={}) => ({
                            ...prev,
                            dateStart: moment(day).format("YYYY-MM-DD"),
                            dateEnd: ""
                          }));
                        }
                        else {
                          setDATE((prev={}) => ({
                            ...prev,
                            dateStart: prev.dateStart,
                            dateEnd: moment(day).format("YYYY-MM-DD")
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
          label={translate("common-duration")}
          variant={"outlined"}
          value={`${DATE.dateStart}~${DATE.dateEnd}`}
          className={dateStr1}
          InputProps={{
            readOnly: true,
            className: dateStr2,
            startAdornment: (
              <Img src={common1} className={"w-16 h-16"} />
            ),
            endAdornment: null
          }}
          onClick={(e) => {
            popTrigger.openPopup(e.currentTarget);
          }}
        />
      )}
    </PopUp>
  );

  // 5. select ------------------------------------------------------------------------------------>
  const selectNode = () => (
    (firstStr === "calendar" && secondStr !== "plan") ||
    (firstStr !== "calendar" && secondStr === "plan") ? (
      <TextField
        select={true}
        label={translate("common-dateType")}
        size={"small"}
        value={DATE.dateType || ""}
        variant={"outlined"}
        className={"w-20vw me-3"}
        InputProps={{
          readOnly: false,
          className: selectStr,
          startAdornment: null,
          endAdornment: null
        }}
        onChange={(e) => {
          if (e.target.value === "day") {
            setDATE((prev={}) => ({
              ...prev,
              dateType: "day",
              dateStart: moment().format("YYYY-MM-DD"),
              dateEnd: moment().format("YYYY-MM-DD")
            }));
          }
          else if (e.target.value === "week") {
            setDATE((prev={}) => ({
              ...prev,
              dateType: "week",
              dateStart: moment().startOf("isoWeek").format("YYYY-MM-DD"),
              dateEnd: moment().endOf("isoWeek").format("YYYY-MM-DD")
            }));
          }
          else if (e.target.value === "month") {
            setDATE((prev={}) => ({
              ...prev,
              dateType: "month",
              dateStart: moment().startOf("month").format("YYYY-MM-DD"),
              dateEnd: moment().endOf("month").format("YYYY-MM-DD")
            }));
          }
          else if (e.target.value === "year") {
            setDATE((prev={}) => ({
              ...prev,
              dateType: "year",
              dateStart: moment().startOf("year").format("YYYY-MM-DD"),
              dateEnd: moment().endOf("year").format("YYYY-MM-DD")
            }));
          }
          else if (e.target.value === "select") {
            setDATE((prev={}) => ({
              ...prev,
              dateType: "select",
              dateStart: moment().format("YYYY-MM-DD"),
              dateEnd: moment().format("YYYY-MM-DD")
            }));
          }
        }}
      >
        {["day", "week", "month", "year", "select"].map((item) => (
          <MenuItem key={item} value={item} selected={item === DATE.dateType}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    ) : (
      null
    )
  );

  // 6. list -------------------------------------------------------------------------------------->
  const listNode = () => (
    <Div className={"d-row"}>
      {selectSection()}
    </Div>
  );

  // 6. save -------------------------------------------------------------------------------------->
  const saveNode = () => (
    <Div className={"d-row"}>
      {selectNode()}
      {DATE.dateType === "day" ? (
        daySection()
      ) : DATE.dateType === "week" ? (
        weekSection()
      ) : DATE.dateType === "month" ? (
        monthSection()
      ) : DATE.dateType === "year" ? (
        yearSection()
      ) : DATE.dateType === "select" ? (
        selectSection()
      ) : null}
    </Div>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {secondStr === "list" || thirdStr === "list" ? (
        listNode()
      ) : secondStr === "save" || thirdStr === "save" ? (
        saveNode()
      ) : null}
    </>
  );
};
