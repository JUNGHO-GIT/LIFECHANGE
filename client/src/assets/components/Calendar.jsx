// Calendar.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, Div, Img, Icons} from "../../import/ImportComponents.jsx";
import {Badge, TextField, MenuItem, PickersDay} from "../../import/ImportMuis.jsx";
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // setTimeout을 사용하여 DOM 업데이트를 기다림
    const timer = setTimeout(() => {
      const pickerRoot = document.querySelectorAll(".MuiPickersDay-root");

      // 기존에 적용된 'Mui-selected' 클래스를 모두 제거
      pickerRoot.forEach(item => {
        item.classList.remove("Mui-selected");
        item.setAttribute("aria-selected", "false");
      });

      // 새로운 범위에 'Mui-selected' 클래스를 추가
      pickerRoot.forEach((item) => {
        const timestamp = parseInt(item.getAttribute('data-timestamp'));

        // dateStart와 dateEnd 사이의 날짜에 'Mui-selected' 클래스 추가
        if (
          timestamp >= moment(DATE.dateStart).startOf('day').valueOf() &&
          timestamp <= moment(DATE.dateEnd).endOf('day').valueOf()
        ) {
          item.classList.add("Mui-selected");
          item.setAttribute("aria-selected", "true");
        }
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [DATE.dateStart, DATE.dateEnd]);

  // 1. day --------------------------------------------------------------------------------------->
  const daySection = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => (
        <Div className={"d-center w-80vw h-60vh"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["year", "day"]}
              readOnly={false}
              defaultValue={moment(DATE.dateStart)}
              className={"radius border"}
              slots={{
                day: (props) => {
                  const {outsideCurrentMonth, day, ...other} = props;
                  const isSelected = isExist.includes(moment(day).format("YYYY-MM-DD"));
                  return (
                    <Badge
                      key={props.day.toString()}
                      badgeContent={""}
                      slotProps={{
                        badge: {style: {
                          width: 3,
                          height: 3,
                          padding: 0,
                          top: 8,
                          left: 30,
                          backgroundColor: isSelected ? "#0088FE" : undefined,
                        }}
                      }}
                    >
                      <PickersDay
                        {...other}
                        day={day}
                        outsideCurrentMonth={outsideCurrentMonth}
                      />
                    </Badge>
                  )
                }
              }}
              onMonthChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(date).startOf("month").format("YYYY-MM-DD"),
                  dateEnd: moment(date).endOf("month").format("YYYY-MM-DD")
                }));
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(date).format("YYYY-MM-DD"),
                  dateEnd: moment(date).format("YYYY-MM-DD")
                }));
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
          className={"w-60vw"}
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
        <Div className={"d-center w-80vw h-60vh"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["year", "day"]}
              readOnly={false}
              defaultValue={moment(DATE.dateStart)}
              className={"radius border"}
              slots={{
                day: (props) => {
                  const {outsideCurrentMonth, day, ...other} = props;
                  const isSelected = isExist.includes(moment(day).format("YYYY-MM-DD"));
                  return (
                    <Badge
                      key={props.day.toString()}
                      badgeContent={""}
                      slotProps={{
                        badge: {style: {
                          width: 3,
                          height: 3,
                          padding: 0,
                          top: 8,
                          left: 30,
                          backgroundColor: isSelected ? "#0088FE" : undefined,
                        }}
                      }}
                    >
                      <PickersDay
                        {...other}
                        day={day}
                        outsideCurrentMonth={outsideCurrentMonth}
                      />
                    </Badge>
                  )
                }
              }}
              onMonthChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(date).startOf("month").format("YYYY-MM-DD"),
                  dateEnd: moment(date).endOf("month").format("YYYY-MM-DD")
                }));
              }}
              onChange={(date) => {

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
          className={"w-60vw"}
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
        <Div className={"d-center w-80vw h-60vh"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["year", "day"]}
              readOnly={false}
              defaultValue={moment(DATE.dateStart)}
              className={"radius border"}
              slots={{
                day: (props) => {
                  const {outsideCurrentMonth, day, ...other} = props;
                  const isSelected = isExist.includes(moment(day).format("YYYY-MM-DD"));
                  return (
                    <Badge
                      key={props.day.toString()}
                      badgeContent={""}
                      slotProps={{
                        badge: {style: {
                          width: 3,
                          height: 3,
                          padding: 0,
                          top: 8,
                          left: 30,
                          backgroundColor: isSelected ? "#0088FE" : undefined,
                        }}
                      }}
                    >
                      <PickersDay
                        {...other}
                        day={day}
                        outsideCurrentMonth={outsideCurrentMonth}
                      />
                    </Badge>
                  )
                }
              }}
              onMonthChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(date).startOf("month").format("YYYY-MM-DD"),
                  dateEnd: moment(date).endOf("month").format("YYYY-MM-DD")
                }));
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(date).format("YYYY-MM-DD"),
                  dateEnd: moment(date).format("YYYY-MM-DD")
                }));
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
          className={"w-60vw"}
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
        <Div className={"d-center w-80vw h-60vh"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["year", "day"]}
              readOnly={false}
              defaultValue={moment(DATE.dateStart)}
              className={"radius border"}
              slots={{
                day: (props) => {
                  const {outsideCurrentMonth, day, ...other} = props;
                  const isSelected = isExist.includes(moment(day).format("YYYY-MM-DD"));
                  return (
                    <Badge
                      key={props.day.toString()}
                      badgeContent={""}
                      slotProps={{
                        badge: {style: {
                          width: 3,
                          height: 3,
                          padding: 0,
                          top: 8,
                          left: 30,
                          backgroundColor: isSelected ? "#0088FE" : undefined,
                        }}
                      }}
                    >
                      <PickersDay
                        {...other}
                        day={day}
                        outsideCurrentMonth={outsideCurrentMonth}
                      />
                    </Badge>
                  )
                }
              }}
              onMonthChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(date).startOf("month").format("YYYY-MM-DD"),
                  dateEnd: moment(date).endOf("month").format("YYYY-MM-DD")
                }));
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(date).format("YYYY-MM-DD"),
                  dateEnd: moment(date).format("YYYY-MM-DD")
                }));
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
          className={"w-60vw"}
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
          }}>
          {["전체", "day", "week", "month", "year"].map((item) => (
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
