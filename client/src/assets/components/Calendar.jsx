// Calendar.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {moment, axios} from "../../import/ImportLibs.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField, MenuItem} from "../../import/ImportMuis.jsx";
import {DateCalendar, DigitalClock} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1} from "../../import/ImportImages.jsx";

export const Calendar = ({DATE, setDATE}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const location = useLocation();
  const navigate = useNavigate();
  const {translate} = useTranslate();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  const testReturn = () => {
    alert("testReturn");
  }

  const dateSection = () => (
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
        <PopUp
          type={"innerCenter"}
          position={"center"}
          direction={"center"}
          contents={({closePopup}) => (
            <Div className={"d-center w-max86vw"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DateCalendar
                  timezone={"Asia/Seoul"}
                  views={["year", "day"]}
                  readOnly={true}
                  defaultValue={moment(DATE.dateStart)}
                  className={"radius border h-max40vh me-2"}
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
                      width: "3.5vh",
                      height: "3.5vh",
                    },
                    '& .MuiPickersDay-root': {
                      fontSize: "0.7rem",
                      width: "3.5vh",
                      height: "3.5vh",
                    },
                  }}
                />
                <DateCalendar
                  timezone={"Asia/Seoul"}
                  views={["year", "day"]}
                  readOnly={true}
                  defaultValue={moment(DATE.dateEnd)}
                  className={"radius border h-max40vh ms-2"}
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
                      width: "3.5vh",
                      height: "3.5vh",
                    },
                    '& .MuiPickersDay-root': {
                      fontSize: "0.7rem",
                      width: "3.5vh",
                      height: "3.5vh",
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
      </Div>
    </Div>
  );

  return (
    <>
      {DATE.dateType === "week" && testReturn()}
      {dateSection()}
    </>
  );
};
