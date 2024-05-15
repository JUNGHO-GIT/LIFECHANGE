// Btn.jsx

import React from "react";
import moment from "moment-timezone";
import {PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Button, TextField, DateCalendar} from "../../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Btn = ({
  strings, objects, functions, handlers
}) => {

  const btnGetToday = () => (
    <Button size={"small"} type={"button"} color={"success"} variant={"contained"}
    className={"success-btn"} onClick={() => {
      (objects?.FILTER) && (
        functions?.setFILTER((prev) => ({
          ...prev,
          type: "day",
        }))
      );
      (objects?.PAGING) && (
        functions?.setPAGING((prev) => ({
          ...prev,
          page: 1,
        }))
      );
      (objects?.DATE) && (
        functions?.setDATE((prev) => ({
          ...prev,
          startDt: moment().tz("Asia/Seoul").format("YYYY-MM-DD"),
          endDt: moment().tz("Asia/Seoul").format("YYYY-MM-DD")
        }))
      );
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
      Object.assign(objects?.SEND, {
        startDt: objects?.DATE.startDt,
        endDt: objects?.DATE.endDt
      });
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
      Object.assign(objects?.SEND, {
        startDt: objects?.DATE.startDt,
        endDt: objects?.DATE.endDt
      });
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
      Object.assign(objects?.SEND, {
        startDt: objects?.DATE.startDt,
        endDt: objects?.DATE.endDt
      });
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
            defaultValue={moment(objects?.DATE.startDt)}
            sx={{
              width: "80vw",
              height: "60vh"
            }}
            onChange={(date) => {
              (objects?.FILTER) && (
                functions?.setFILTER((prev) => ({
                  ...prev,
                  type: "day",
                }))
              );
              (objects?.PAGING) && (
                functions?.setPAGING((prev) => ({
                  ...prev,
                  page: 1,
                }))
              );
              (objects?.DATE) && (
                functions?.setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).format("YYYY-MM-DD"),
                  endDt: moment(date).format("YYYY-MM-DD")
                }))
              );
            }}
            onMonthChange={(date) => {
              (objects?.FILTER) && (
                functions?.setFILTER((prev) => ({
                  ...prev,
                  type: "month",
                }))
              );
              (objects?.DATE) && (
                functions?.setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).startOf("month").format("YYYY-MM-DD"),
                  endDt: moment(date).endOf("month").format("YYYY-MM-DD")
                }))
              );
            }}
            onYearChange={(date) => {
              (objects?.FILTER) && (
                functions?.setFILTER((prev) => ({
                  ...prev,
                  type: "year",
                }))
              );
              (objects?.PAGING) && (
                functions?.setPAGING((prev) => ({
                  ...prev,
                  page: 1,
                }))
              );
              (objects?.DATE) && (
                functions?.setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).startOf("year").format("YYYY-MM-DD"),
                  endDt: moment(date).endOf("year").format("YYYY-MM-DD")
                }))
              );
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
          <Div className={"block-wrapper d-row h-7vh"}>
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
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnOpenCalendar()}
            {btnGetToday()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnToUpdate()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
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
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnOpenCalendar()}
            {btnGetToday()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "find") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetFind()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnToUpdate()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
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
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnOpenCalendar()}
            {btnGetToday()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnToUpdate()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
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
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnOpenCalendar()}
            {btnGetToday()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnToUpdate()}
            {btnToList()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
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
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnInsertDemo()}
          </Div>
        );
      }
      else if (strings?.type === "dataset") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnResetDefault()}
            {btnRefresh()}
          </Div>
        );
      }
      else if (strings?.type === "login") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnLogin()}
          </Div>
        );
      }
      else if (strings?.type === "signup") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
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