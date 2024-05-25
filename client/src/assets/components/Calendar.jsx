// Calendar.jsx

import {React} from "../../import/ImportReacts.jsx";
import {useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, Div, Img, Br20} from "../../import/ImportComponents.jsx";
import {Badge, TextField, MenuItem, PickersDay, Button} from "../../import/ImportMuis.jsx";
import {DateCalendar, AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Calendar = ({
  DATE, setDATE, isExist, setIsExist
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const secondStr = PATH?.split("/")[2] || "";

  // 1. day --------------------------------------------------------------------------------------->
  const daySection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Div className={"d-column"}>
          <Div className={"d-center fs-1-2rem fw-bold"}>
            일별
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
                  const isBadged = isExist.includes(moment(day).format("YYYY-MM-DD"));
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
                          setDATE((prev) => ({
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
                  <Button {...props} onClick={() => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(prev.dateStart).subtract(1, "month").format("YYYY-MM-DD"),
                      dateEnd: moment(prev.dateEnd).subtract(1, "month").format("YYYY-MM-DD")
                    }));
                  }}>
                    {props.children}
                  </Button>
                ),
                nextIconButton: (props) => (
                  <Button {...props} onClick={() => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(prev.dateStart).add(1, "month").format("YYYY-MM-DD"),
                      dateEnd: moment(prev.dateEnd).add(1, "month").format("YYYY-MM-DD")
                    }));
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
          label={"날짜"}
          variant={"outlined"}
          value={`${DATE.dateStart}`}
          className={`pointer ${secondStr === "plan" ? "w-60vw" : "w-83vw"}`}
          InputProps={{
            readOnly: true,
            className: "fs-0-8rem",
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
            주별
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
                        setDATE((prev) => ({
                          ...prev,
                          dateStart: moment(day).startOf("isoWeek").format("YYYY-MM-DD"),
                          dateEnd: moment(day).endOf("isoWeek").format("YYYY-MM-DD")
                        }));
                      }}
                    />
                  )
                },
                previousIconButton: (props) => (
                  <Button {...props} onClick={() => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(prev.dateStart).subtract(1, "month").format("YYYY-MM-DD"),
                      dateEnd: moment(prev.dateEnd).subtract(1, "month").format("YYYY-MM-DD")
                    }));
                  }}>
                    {props.children}
                  </Button>
                ),
                nextIconButton: (props) => (
                  <Button {...props} onClick={() => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(prev.dateStart).add(1, "month").format("YYYY-MM-DD"),
                      dateEnd: moment(prev.dateEnd).add(1, "month").format("YYYY-MM-DD")
                    }));
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
          label={"기간"}
          variant={"outlined"}
          value={`${DATE.dateStart}~${DATE.dateEnd}`}
          className={`pointer ${secondStr === "plan" ? "w-60vw" : "w-83vw"}`}
          InputProps={{
            readOnly: true,
            className: "fs-0-8rem",
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
            월별
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
                  <Button {...props} onClick={() => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(prev.dateStart).subtract(1, "month").format("YYYY-MM-DD"),
                      dateEnd: moment(prev.dateEnd).subtract(1, "month").format("YYYY-MM-DD")
                    }));
                  }}>
                    {props.children}
                  </Button>
                ),
                nextIconButton: (props) => (
                  <Button {...props} onClick={() => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(prev.dateStart).add(1, "month").format("YYYY-MM-DD"),
                      dateEnd: moment(prev.dateEnd).add(1, "month").format("YYYY-MM-DD")
                    }));
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
          label={"기간"}
          variant={"outlined"}
          value={`${DATE.dateStart}~${DATE.dateEnd}`}
          className={`pointer ${secondStr === "plan" ? "w-60vw" : "w-83vw"}`}
          InputProps={{
            readOnly: true,
            className: "fs-0-8rem",
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
            년별
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
                  <Button {...props} onClick={() => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(prev.dateStart).subtract(1, "year").format("YYYY-MM-DD"),
                      dateEnd: moment(prev.dateEnd).subtract(1, "year").format("YYYY-MM-DD")
                    }));
                  }}>
                    {props.children}
                  </Button>
                ),
                nextIconButton: (props) => (
                  <Button {...props} onClick={() => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(prev.dateStart).add(1, "year").format("YYYY-MM-DD"),
                      dateEnd: moment(prev.dateEnd).add(1, "year").format("YYYY-MM-DD")
                    }));
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
          label={"기간"}
          variant={"outlined"}
          value={`${DATE.dateStart}~${DATE.dateEnd}`}
          className={`pointer ${secondStr === "plan" ? "w-60vw" : "w-83vw"}`}
          InputProps={{
            readOnly: true,
            className: "fs-0-8rem",
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

  // 5. date -------------------------------------------------------------------------------------->
  const dateNode = () => (
    <Div className={"d-center"}>
      {secondStr === "plan" ? (
        <TextField
          select={true}
          label={translate("common-dateType")}
          size={"small"}
          value={DATE.dateType || "day"}
          variant={"outlined"}
          className={"w-20vw me-3vw"}
          InputProps={{
            readOnly: false,
            startAdornment: null,
            endAdornment: null
          }}
          onChange={(e) => {
            if (e.target.value === "day") {
              setDATE((prev) => ({
                ...prev,
                dateType: e.target.value,
                dateStart: moment().format("YYYY-MM-DD"),
                dateEnd: moment().format("YYYY-MM-DD")
              }));
            }
            else if (e.target.value === "week") {
              setDATE((prev) => ({
                ...prev,
                dateType: e.target.value,
                dateStart: moment().startOf("isoWeek").format("YYYY-MM-DD"),
                dateEnd: moment().endOf("isoWeek").format("YYYY-MM-DD")
              }));
            }
            else if (e.target.value === "month") {
              setDATE((prev) => ({
                ...prev,
                dateType: e.target.value,
                dateStart: moment().startOf("month").format("YYYY-MM-DD"),
                dateEnd: moment().endOf("month").format("YYYY-MM-DD")
              }));
            }
            else if (e.target.value === "year") {
              setDATE((prev) => ({
                ...prev,
                dateType: e.target.value,
                dateStart: moment().startOf("year").format("YYYY-MM-DD"),
                dateEnd: moment().endOf("year").format("YYYY-MM-DD")
              }));
            }
            else {
              setDATE((prev) => ({
                ...prev,
                dateType: e.target.value,
                dateStart: moment().startOf("year").format("YYYY-MM-DD"),
                dateEnd: moment().endOf("year").format("YYYY-MM-DD")
              }));
            }
          }}
        >
          {["day", "week", "month", "year"].map((item) => (
            <MenuItem key={item} value={item} selected={item === DATE.dateType}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        null
      )}
      {DATE.dateType === "day" ? (
        daySection()
      ) : DATE.dateType === "week" ? (
        weekSection()
      ) : DATE.dateType === "month" ? (
        monthSection()
      ) : DATE.dateType === "year" ? (
        yearSection()
      ) : (
        daySection()
      )}
    </Div>
  );

  return (
    <>
      {dateNode()}
    </>
  );
};
