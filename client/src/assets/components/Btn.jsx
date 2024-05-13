// Button.jsx

import {React} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, PopDown, Div, Icons} from "../../import/ImportComponents.jsx";
import {Button, Paper, TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis.jsx";
import {newDate, koreanDate, curWeekStart, curWeekEnd, curMonthStart, curMonthEnd, curYearStart, curYearEnd}
from "../../import/ImportLogics.jsx";

// 11. button ------------------------------------------------------------------------------------->
export const Btn = ({
  DATE, setDATE, SEND, FILTER, setFILTER,
  PAGING, setPAGING, flowSave, navParam,
  part, plan, type, handler = () => {}
}) => {

  // 11. button ----------------------------------------------------------------------------------->
  const btnGetToday = () => (
    <Button size={"small"} type={"button"} color={"success"} variant={"contained"}
    className={"success-btn"} onClick={() => {
      (FILTER && FILTER.type !== "") && (
        setFILTER((prev) => ({
          ...prev,
          type: "day",
        }))
      );
      (PAGING && PAGING.page !== 1) && (
        setPAGING((prev) => ({
          ...prev,
          page: 1,
        }))
      );
      setDATE((prev) => ({
        ...prev,
        startDt: koreanDate,
        endDt: koreanDate,
      }));
    }}>
      Today
    </Button>
  );
  const btnToSave = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      flowSave();
    }}>
      Save
    </Button>
  );
  const btnToUpdate = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toUpdate, {
        state: SEND,
      });
    }}>
      Update
    </Button>
  );
  const btnToList = () => (
    <Button size={"small"} type={"button"} color={"secondary"} variant={"contained"}
    className={"secondary-btn"} onClick={() => {
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND,
      });
    }}>
      List
    </Button>
  );
  const btnToSearch = () => (
    <Button size={"small"} type={"button"} color={"secondary"} variant={"contained"}
    className={"secondary-btn"} onClick={() => {
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toSearch, {
        state: SEND,
      });
    }}>
      Search
    </Button>
  );
  const btnLogin = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      flowSave();
    }}>
      Log In
    </Button>
  );
  const btnSignup = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      flowSave();
    }}>
      Sign Up
    </Button>
  );
  const btnRefresh = () => (
    <Button size={"small"} type={"button"} color={"success"} variant={"contained"}
    className={"success-btn"} onClick={() => {
      navParam(0);
    }}>
      Refresh
    </Button>
  );
  const btnGetSearch = () => (
    <Div className={"d-center"}>
      <TextField
        select={false}
        label={"검색"}
        size={"small"}
        variant={"outlined"}
        className={"w-150"}
        value={FILTER?.query}
        InputProps={{
          readOnly: false
        }}
        onChange={(e) => {
          setFILTER((prev) => ({
            ...prev,
            query: e.target.value
          }));
        }}
      />
      <Button size={"small"} type={"button"} color={"primary"} variant={"outlined"}
      className={"primary-btn"} onClick={() => {
        flowSave();
      }}>
        Search
      </Button>
    </Div>
  );
  const btnResetDefault = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"danger-btn"} onClick={handler}>
      Default
    </Button>
  );
  const btnOpenCalendar = () => (
    <PopUp elementId={`popup`} contents={
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DateCalendar
          timezone={"Asia/Seoul"}
          views={["year", "day"]}
          className={"m-auto"}
          readOnly={false}
          defaultValue={moment(koreanDate)}
          sx={{
            "width": "250px",
            "height": "330px",
            "& .MuiPickersLayout-contentWrapper": {
              width: "250px",
              height: "330px",
            },
            "& .MuiDateCalendar-root": {
              width: "250px",
              height: "330px",
            }
          }}
          onChange={(date) => {
            (FILTER && FILTER.type !== "day") && (
              setFILTER((prev) => ({
                ...prev,
                type: "day",
              }))
            );
            (PAGING && PAGING.page !== 1) && (
              setPAGING((prev) => ({
                ...prev,
                page: 1,
              }))
            );
            setDATE((prev) => ({
              ...prev,
              startDt: koreanDate,
              endDt: koreanDate,
            }));
          }}
          onMonthChange={(date) => {
            (FILTER && FILTER.type !== "month") && (
              setFILTER((prev) => ({
                ...prev,
                type: "month",
              }))
            );
            (PAGING && PAGING.page !== 1) && (
              setPAGING((prev) => ({
                ...prev,
                page: 1,
              }))
            );
            setDATE((prev) => ({
              ...prev,
              startDt: curMonthStart,
              endDt: curMonthEnd
            }));
          }}
          onYearChange={(date) => {
            (FILTER && FILTER.type !== "year") && (
              setFILTER((prev) => ({
                ...prev,
                type: "year",
              }))
            );
            (PAGING && PAGING.page !== 1) && (
              setPAGING((prev) => ({
                ...prev,
                page: 1,
              }))
            );
            setDATE((prev) => ({
              ...prev,
              startDt: curYearStart,
              endDt: curYearEnd
            }));
          }}
        />
      </LocalizationProvider>
    }>
      {popProps => (
        <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
        className={"primary-btn"} onClick={(e) => {
          popProps.openPopup(e.currentTarget)
        }}>
          달력
        </Button>
      )}
    </PopUp>
  );

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Paper className={"flex-wrapper h-50 p-sticky bottom-0 d-row"}>
      {type === "list" ? (
        <>
        {btnOpenCalendar()}
        {btnGetToday()}
        </>
      ) : type === "detail" ? (
        <>
        {btnToUpdate()}
        {btnToList()}
        </>
      ) : type === "save" && part !== "food" ? (
        <>
        {btnToSave()}
        {btnGetToday()}
        {btnToList()}
        </>
      ) : type === "save" && part === "food" ? (
        <>
        {btnToSave()}
        {btnToSearch()}
        </>
      ) : type === "search" ? (
        <>
        {btnGetSearch()}
        </>
      ) : type === "dataset" ? (
        <>
        {btnToSave()}
        {btnResetDefault()}
        </>
      ) : type === "login" ? (
        <>
        {btnLogin()}
        {btnRefresh()}
        </>
      ) : type === "signup" ? (
        <>
        {btnSignup()}
        {btnRefresh()}
        </>
      ) : null}
    </Paper>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};