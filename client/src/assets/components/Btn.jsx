// Btn.jsx

import {React, useEffect} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";
import {Button, Paper, TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {newDate, koreanDate, curWeekStart, curWeekEnd, curMonthStart, curMonthEnd, curYearStart, curYearEnd}
from "../../import/ImportLogics.jsx";

// ------------------------------------------------------------------------------------------------>
export const Btn = ({
  strings, objects, functions, handlers
}) => {

  const btnGetToday = () => (
    <Button size={"small"} type={"button"} color={"success"} variant={"contained"}
    className={"success-btn"} onClick={() => {
      (objects?.FILTER && objects?.FILTER.type !== "day") && (
        functions?.setFILTER((prev) => ({
          ...prev,
          type: "day",
        }))
      );
      (objects?.PAGING && objects?.PAGING.page !== 1) && (
        functions?.setPAGING((prev) => ({
          ...prev,
          page: 1,
        }))
      );
      functions?.setDATE((prev) => ({
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
      handlers.flowSave();
    }}>
      Save
    </Button>
  );
  const btnToUpdate = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      objects.SEND.startDt = objects?.DATE.startDt;
      objects.SEND.endDt = objects?.DATE.endDt;
      handlers.navParam(objects?.SEND.toUpdate, {
        state: objects?.SEND,
      });
    }}>
      Update
    </Button>
  );
  const btnToList = () => (
    <Button size={"small"} type={"button"} color={"secondary"} variant={"contained"}
    className={"secondary-btn"} onClick={() => {
      objects.SEND.startDt = objects?.DATE.startDt;
      objects.SEND.endDt = objects?.DATE.endDt;
      handlers.navParam(objects?.SEND.toList, {
        state: objects?.SEND,
      });
    }}>
      List
    </Button>
  );
  const btnToSearch = () => (
    <Button size={"small"} type={"button"} color={"secondary"} variant={"contained"}
    className={"secondary-btn"} onClick={() => {
      objects.SEND.startDt = objects?.DATE.startDt;
      objects.SEND.endDt = objects?.DATE.endDt;
      handlers.navParam(objects?.SEND.toSearch, {
        state: objects?.SEND,
      });
    }}>
      Search
    </Button>
  );
  const btnLogin = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      handlers.flowSave();
    }}>
      Log In
    </Button>
  );
  const btnSignup = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      handlers.flowSave();
    }}>
      Sign Up
    </Button>
  );
  const btnRefresh = () => (
    <Button size={"small"} type={"button"} color={"success"} variant={"contained"}
    className={"success-btn"} onClick={() => {
      handlers.navParam(0);
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
        value={objects?.FILTER?.query}
        InputProps={{
          readOnly: false
        }}
        onChange={(e) => {
          functions?.setFILTER((prev) => ({
            ...prev,
            query: e.target.value
          }));
        }}
      />
      <Button size={"small"} type={"button"} color={"primary"} variant={"outlined"}
      className={"primary-btn"} onClick={() => {
        handlers.flowSave();
      }}>
        Search
      </Button>
    </Div>
  );
  const btnResetDefault = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"danger-btn"} onClick={handlers?.handlerReset}>
      Default
    </Button>
  );
  const btnOpenCalendar = () => (
    <PopUp
      type={"calendar"}
      elementId={"popover"}
      className={""}
      position={"top"}
      direction={"center"}
      contents={
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
          <DateCalendar
            timezone={"Asia/Seoul"}
            views={["year", "day"]}
            className={"m-auto"}
            readOnly={false}
            defaultValue={moment(koreanDate)}
            sx={{
              "width": "250px",
              "height": "330px"
            }}
            onChange={(date) => {
              (objects?.FILTER && objects?.FILTER.type !== "day") && (
                functions?.setFILTER((prev) => ({
                  ...prev,
                  type: "day",
                }))
              );
              (objects?.PAGING && objects?.PAGING.page !== 1) && (
                functions?.setPAGING((prev) => ({
                  ...prev,
                  page: 1,
                }))
              );
              functions?.setDATE((prev) => ({
                ...prev,
                startDt: koreanDate,
                endDt: koreanDate,
              }));
            }}
            onMonthChange={(date) => {
              (objects?.FILTER && objects?.FILTER.type !== "month") && (
                functions?.setFILTER((prev) => ({
                  ...prev,
                  type: "month",
                }))
              );
              (objects?.PAGING && objects?.PAGING.page !== 1) && (
                functions?.setPAGING((prev) => ({
                  ...prev,
                  page: 1,
                }))
              );
              functions?.setDATE((prev) => ({
                ...prev,
                startDt: curMonthStart,
                endDt: curMonthEnd
              }));
            }}
            onYearChange={(date) => {
              (objects?.FILTER && objects?.FILTER.type !== "year") && (
                functions?.setFILTER((prev) => ({
                  ...prev,
                  type: "year",
                }))
              );
              (objects?.PAGING && objects?.PAGING.page !== 1) && (
                functions?.setPAGING((prev) => ({
                  ...prev,
                  page: 1,
                }))
              );
              functions?.setDATE((prev) => ({
                ...prev,
                startDt: curYearStart,
                endDt: curYearEnd
              }));
            }}
          />
        </LocalizationProvider>
      }>
      {(popTrigger) => (
        <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
        className={"primary-btn"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          달력
        </Button>
      )}
    </PopUp>
  );
  const btnInsertDemo = () => (
    <Div className={"d-center"}>
      <TextField
        select={false}
        label={"추가"}
        type={"text"}
        variant={"outlined"}
        id={"inputCount"}
        name={"inputCount"}
        className={""}
        size={"small"}
        value={Math.min(objects?.COUNT?.inputCnt, 10)}
        InputProps={{
          readOnly: false
        }}
        onChange={(e) => {
          const limitedValue = Math.min(Number(e.target.value), 10);
          functions.setCOUNT((prev) => ({
            ...prev,
            inputCnt: limitedValue
          }));
        }}
      />
      <Button size={"small"} className={"secondary-btn"} color={"secondary"} variant={"contained"}
      onClick={() => (handlers.flowAdd(objects.PART))}>
        추가
      </Button>
    </Div>
  );

  // 7. btn --------------------------------------------------------------------------------------->
  const btnNode = () => (
    strings?.part === "calendar" && (strings?.type === "list" || strings?.type === "diff") ? (
      null
    ) : strings?.part === "calendar" && (strings?.type === "detail" || strings?.type === "save") ? (
      <Div className={"block-wrapper d-row"}>
        {btnToSave()}
        {btnToList()}
      </Div>
    ) : strings?.part === "exercise" && (strings?.type === "list" || strings?.type === "diff") ? (
      <Div className={"block-wrapper d-row"}>
        {btnOpenCalendar()}
        {btnGetToday()}
      </Div>
    ) :   strings?.part === "food" && (strings?.type === "list" || strings?.type === "diff") ? (
      <Div className={"block-wrapper d-row"}>
        {btnOpenCalendar()}
        {btnGetToday()}
      </Div>
    ) : strings?.part === "money" && (strings?.type === "list" || strings?.type === "diff") ? (
      <Div className={"block-wrapper d-row"}>
        {btnOpenCalendar()}
        {btnGetToday()}
      </Div>
    ) : strings?.part === "sleep" && (strings?.type === "list" || strings?.type === "diff") ? (
      <Div className={"block-wrapper d-row"}>
        {btnOpenCalendar()}
        {btnGetToday()}
      </Div>
    ) : strings?.part === "user" && (strings?.type === "list" || strings?.type === "diff") ? (
      <Div className={"block-wrapper d-row"}>
        {btnInsertDemo()}
      </Div>
    ) : null
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {btnNode()}
    </>
  );
};