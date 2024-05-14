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
      handlers.navigate(objects?.SEND.toUpdate, {
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
      handlers.navigate(objects?.SEND.toList, {
        state: objects?.SEND,
      });
    }}>
      List
    </Button>
  );
  const btnToFind = () => (
    <Button size={"small"} type={"button"} color={"secondary"} variant={"contained"}
    className={"secondary-btn"} onClick={() => {
      objects.SEND.startDt = objects?.DATE.startDt;
      objects.SEND.endDt = objects?.DATE.endDt;
      handlers.navigate(objects?.SEND.toFind, {
        state: objects?.SEND,
      });
    }}>
      Find
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
      handlers.navigate(0);
    }}>
      Refresh
    </Button>
  );
  const btnGetFind = () => (
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
          functions?.setPAGING((prev) => ({
            ...prev,
            page: 0
          }));
        }}
      />
      <Button size={"small"} type={"button"} color={"primary"} variant={"outlined"}
      className={"primary-btn"} onClick={() => {
        handlers.flowFind();
      }}>
        Find
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
      position={"top"}
      direction={"center"}
      contents={({closePopup}) => (
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
          <DateCalendar
            timezone={"Asia/Seoul"}
            views={["year", "day"]}
            readOnly={false}
            defaultValue={moment(koreanDate)}
            sx={{
              width: "80vw",
              height: "60vh"
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
      )}>
      {(popTrigger={}) => (
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
  const btnNode = () => {

    // 1. calendar
    if (strings?.part === "calendar") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          null
        );
      }
      else if (strings?.type === "detail") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnToSave()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 2. exercise
    else if (strings?.part === "exercise") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnOpenCalendar()}
            {btnGetToday()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnToUpdate()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "save") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnToSave()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
    }

    // 3. food
    else if (strings?.part === "food") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnOpenCalendar()}
            {btnGetToday()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "find") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnGetFind()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnToUpdate()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "save") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnToSave()}
            {btnToFind()}
            {btnRefresh()}
          </Div>
        );
      }
    }

    // 4. money
    else if (strings?.part === "money") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnOpenCalendar()}
            {btnGetToday()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnToUpdate()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "save") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnToSave()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
    }

    // 5. sleep
    else if (strings?.part === "sleep") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnOpenCalendar()}
            {btnGetToday()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnToUpdate()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "save") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnToSave()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
    }

    // 6. user
    else if (strings?.part === "user") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnInsertDemo()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "dataset") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnResetDefault()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "login") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnLogin()}
          </Div>
        );
      }
      else if (strings?.type === "signup") {
        return (
          <Div className={"block-wrapper d-row h-40"}>
            {btnSignup()}
          </Div>
        );
      }
    }
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {btnNode()}
    </>
  );
};