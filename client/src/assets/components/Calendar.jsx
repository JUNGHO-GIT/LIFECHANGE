// Calendar.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";
import {Badge, TextField, MenuItem} from "../../import/ImportMuis.jsx";
import {DateCalendar, AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Calendar = ({DATE, setDATE}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname.trim().toString();

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    alert(DATE.dateStart + DATE.dateEnd);

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
        <Div className={"d-center w-max86vw"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              readOnly={false}
              defaultValue={moment(DATE.dateStart)}
              className={"radius border h-max60vh me-2"}
              onChange={(e) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(e).format("YYYY-MM-DD"),
                  dateEnd: moment(e).format("YYYY-MM-DD")
                }));
              }}
              sx={{
                "& .MuiDateCalendar-root": {
                  width: "100%",
                  height: "100%",
                },
                "& .MuiYearCalendar-root": {
                  width: "100%",
                  height: "100%",
                },
                "& .MuiDayCalendar-slideTransition": {
                  minHeight: "0px",
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  fontSize: "0.7rem",
                  width: "6.5vh",
                  height: "6.5vh",
                  margin: "0px",
                },
                '& .MuiPickersDay-root': {
                  fontSize: "0.7rem",
                  width: "6.5vh",
                  height: "6.5vh",
                  margin: "0px",
                  borderRadius: "0px",
                },
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
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={"w-63vw"}
          InputProps={{
            readOnly: true,
            className: "fw-bold",
            startAdornment: (
              <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
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
        <Div className={"d-center w-max86vw"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              readOnly={false}
              value={moment(DATE.dateStart)}
              className={"radius border h-max60vh me-2"}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(date).startOf("isoWeek").format("YYYY-MM-DD"),
                  dateEnd: moment(date).endOf("isoWeek").format("YYYY-MM-DD")
                }));
              }}
              sx={{
                "& .MuiDateCalendar-root": {
                  width: "100%",
                  height: "100%",
                },
                "& .MuiYearCalendar-root": {
                  width: "100%",
                  height: "100%",
                },
                "& .MuiDayCalendar-slideTransition": {
                  minHeight: "0px",
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  fontSize: "0.7rem",
                  width: "6.5vh",
                  height: "6.5vh",
                  margin: "0px",
                },
                '& .MuiPickersDay-root': {
                  fontSize: "0.7rem",
                  width: "6.5vh",
                  height: "6.5vh",
                  margin: "0px",
                  borderRadius: "0px",
                },
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
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={"w-63vw"}
          InputProps={{
            readOnly: true,
            className: "fw-bold",
            startAdornment: (
              <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
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
        <Div className={"d-center w-max86vw"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              readOnly={false}
              defaultValue={moment(DATE.dateStart)}
              className={"radius border h-max60vh me-2"}
              onChange={(e) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(e).format("YYYY-MM-DD"),
                  dateEnd: moment(e).format("YYYY-MM-DD")
                }));
              }}
              sx={{
                "& .MuiDateCalendar-root": {
                  width: "100%",
                  height: "100%",
                },
                "& .MuiYearCalendar-root": {
                  width: "100%",
                  height: "100%",
                },
                "& .MuiDayCalendar-slideTransition": {
                  minHeight: "0px",
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  fontSize: "0.7rem",
                  width: "6.5vh",
                  height: "6.5vh",
                  margin: "0px",
                },
                '& .MuiPickersDay-root': {
                  fontSize: "0.7rem",
                  width: "6.5vh",
                  height: "6.5vh",
                  margin: "0px",
                  borderRadius: "0px",
                },
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
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={"w-63vw"}
          InputProps={{
            readOnly: true,
            className: "fw-bold",
            startAdornment: (
              <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
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
        <Div className={"d-center w-max86vw"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              readOnly={false}
              defaultValue={moment(DATE.dateStart)}
              className={"radius border h-max60vh me-2"}
              onChange={(e) => {
                setDATE((prev) => ({
                  ...prev,
                  dateStart: moment(e).format("YYYY-MM-DD"),
                  dateEnd: moment(e).format("YYYY-MM-DD")
                }));
              }}
              sx={{
                "& .MuiDateCalendar-root": {
                  width: "100%",
                  height: "100%",
                },
                "& .MuiYearCalendar-root": {
                  width: "100%",
                  height: "100%",
                },
                "& .MuiDayCalendar-slideTransition": {
                  minHeight: "0px",
                },
                "& .MuiDayCalendar-weekDayLabel": {
                  fontSize: "0.7rem",
                  width: "6.5vh",
                  height: "6.5vh",
                  margin: "0px",
                },
                '& .MuiPickersDay-root': {
                  fontSize: "0.7rem",
                  width: "6.5vh",
                  height: "6.5vh",
                  margin: "0px",
                  borderRadius: "0px",
                },
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
          value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
          className={"w-63vw"}
          InputProps={{
            readOnly: true,
            className: "fw-bold",
            startAdornment: (
              <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
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
    <Div className={"d-row"}>
      <Div className={"d-center"}>
        <TextField
          select={true}
          label={translate("common-dateType")}
          size={"small"}
          value={DATE.dateType || "day"}
          variant={"outlined"}
          className={"w-20vw me-3vw"}
          InputProps={{
            readOnly: false,
            className: "fw-bold",
            startAdornment: null,
            endAdornment: null
          }}
          onChange={(e) => {
            setDATE((prev) => ({
              ...prev,
              dateType: e.target.value
            }));
          }}>
          {["전체", "day", "week", "month", "year"].map((item) => (
            <MenuItem key={item} value={item} selected={item === DATE.dateType}>
              {item}
            </MenuItem>
          ))}
        </TextField>
      </Div>
      <Div className={"d-center"}>
        {/* {DATE.dateType === "day" && daySection()}
        {DATE.dateType === "week" && weekSection()}
        {DATE.dateType === "month" && monthSection()}
        {DATE.dateType === "year" && yearSection()} */}
        {weekSection()}
      </Div>
    </Div>
  );

  return (
    <>
      {dateNode()}
    </>
  );
};
