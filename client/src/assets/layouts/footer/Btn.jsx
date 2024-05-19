// Btn.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, numeral} from "../../../import/ImportLibs.jsx";
import {PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Button, TextField, DateCalendar} from "../../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../../import/ImportMuis.jsx";
import {money2} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Btn = ({
  strings, objects, functions, handlers
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const {translate} = useTranslate();

  // 1. go
  const btnGoToList = () => (
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
      {translate("btn-goToList")}
    </Button>
  );
  const btnGoToFind = () => (
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
      {translate("btn-goToFind")}
    </Button>
  );
  const btnGoToFindSave = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      Object.assign(objects?.SEND, {
        startDt: objects?.DATE.startDt,
        endDt: objects?.DATE.endDt
      });
      handlers.navigate(objects?.SEND.toSave, {
        state: objects?.SEND,
      });
    }}>
      {translate("btn-goToFindSave")}
    </Button>
  );

  // 2. get
  const btnGetToday = () => (
    <Button size={"small"} type={"button"} color={"secondary"} variant={"contained"}
    className={"secondary-btn"} onClick={() => {
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
      {translate("btn-getToday")}
    </Button>
  );
  const btnGetCalendar = () => (
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
          {translate("btn-getCalendar")}
        </Button>
      )}
    </PopUp>
  );
  const btnGetProperty = () => (
    <PopUp
      type={"innerCenter"}
      position={"center"}
      direction={"center"}
      contents={({closePopup}) => {
        const property = JSON.parse(sessionStorage.getItem("property") || "{}");
        const totalIn = property?.totalIn || 0;
        const totalOut = property?.totalOut || 0;
        const totalProperty = property?.totalProperty || 0;
        const startDt = property?.startDt;
        const endDt = property?.endDt;
        return (
          <Div className={"w-max75vw h-max65vh border d-column p-20"}>
            <Div className={"d-center mb-20"}>
              <Div className={"fs-1-7rem fw-bold"}>
                재무 상태
              </Div>
            </Div>
            <Div className={"d-center mb-40"}>
              <Div className={"fs-1-2rem fw-normal"}>
                {startDt} ~ {endDt}
              </Div>
            </Div>
            <Div className={"d-center mb-20"}>
              <TextField
                select={false}
                label={"총 재산"}
                size={"small"}
                variant={"outlined"}
                className={"w-60vw"}
                value={`${numeral(totalProperty).format('0,0')}`}
                InputProps={{
                  readOnly: true,
                  className: "h-8vh fs-1-0rem fw-bold",
                  startAdornment: (
                    <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>{translate("money-endCurrency")}</Div>
                  )
                }}
              />
            </Div>
            <Div className={"d-center mb-20"}>
              <TextField
                select={false}
                label={"총 수입"}
                size={"small"}
                variant={"outlined"}
                className={"w-60vw"}
                value={`${numeral(totalIn).format('0,0')}`}
                InputProps={{
                  readOnly: true,
                  className:  "h-8vh fs-1-0rem fw-bold",
                  startAdornment: (
                    <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>{translate("money-endCurrency")}</Div>
                  )
                }}
              />
            </Div>
            <Div className={"d-center"}>
              <TextField
                select={false}
                label={"총 지출"}
                size={"small"}
                variant={"outlined"}
                className={"w-60vw"}
                value={`${numeral(totalOut).format('0,0')}`}
                InputProps={{
                  readOnly: true,
                  className:  "h-8vh fs-1-0rem fw-bold",
                  startAdornment: (
                    <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>{translate("money-endCurrency")}</Div>
                  )
                }}
              />
            </Div>
          </Div>
        );
      }}>
      {(popTrigger={}) => (
        <Button size={"small"} type={"button"} color={"success"} variant={"contained"}
        className={"success-btn"} onClick={(e) => {
          popTrigger.openPopup(e.currentTarget)
        }}>
          {translate("btn-getProperty")}
        </Button>
      )}
    </PopUp>
  );

  // 3. flow
  const btnFlowLogin = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      handlers.flowSave();
    }}>
      {translate("btn-flowLogin")}
    </Button>
  );
  const btnFlowSignup = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      handlers.flowSave();
    }}>
      {translate("btn-flowSignup")}
    </Button>
  );
  const btnFlowSave = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      handlers.flowSave();
    }}>
      {translate("btn-flowSave")}
    </Button>
  );
  const btnFlowFind = () => (
    <Div className={"d-center"}>
      <TextField
        select={false}
        size={"small"}
        variant={"outlined"}
        className={"w-150"}
        value={objects?.FILTER?.query}
        InputProps={{
          readOnly: false,
          startAdornment: null,
          endAdornment: null,
        }}
        onChange={(e) => {
          functions?.setFILTER((prev) => ({
            ...prev,
            query: e.target.value
          }));
        }}
      />
      <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
      className={"secondary-btn"} onClick={async () => {
        handlers.flowFind();
        functions?.setPAGING((prev) => ({
          ...prev,
          page: 0
        }));
      }}>
        {translate("btn-flowFind")}
      </Button>
    </Div>
  );
  const btnFlowDefault = () => (
    <Button size={"small"} type={"button"} color={"error"} variant={"contained"}
    className={"danger-btn"} onClick={handlers?.handlerDefault}>
      {translate("btn-flowDefault")}
    </Button>
  );
  const btnFlowDemo = () => (
    <Div className={"d-center"}>
      <TextField
        select={false}
        label={""}
        type={"text"}
        variant={"outlined"}
        size={"small"}
        value={Math.min(objects?.COUNT?.inputCnt, 100)}
        InputProps={{
          readOnly: false
        }}
        onChange={(e) => {
          const limitedValue = Math.min(Number(e.target.value), 100);
          functions.setCOUNT((prev) => ({
            ...prev,
            inputCnt: limitedValue
          }));
        }}
      />
      <Button size={"small"} className={"secondary-btn"} color={"secondary"} variant={"contained"}
      onClick={() => (handlers.flowSave(objects.PART))}>
        {translate("btn-flowDemo")}
      </Button>
    </Div>
  );

  // 7. btn --------------------------------------------------------------------------------------->
  const btnNode = () => {

    // 1. calendar
    if (strings?.first === "calendar") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 2. exercise
    else if (strings?.first === "exercise") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 3. food
    else if (strings?.first === "food") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "find" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowFind()}
            {btnGoToFindSave()}
          </Div>
        );
      }
      else if (strings?.second === "find" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToFind()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 4. money
    else if (strings?.first === "money") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 5. sleep
    else if (strings?.first === "sleep") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
            {btnGetProperty()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
            {btnGetProperty()}
          </Div>
        );
      }
    }

    // 6. user
    else if (strings?.first === "user") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "data" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowDemo()}
          </Div>
        );
      }
      else if (strings?.second === "data" && strings?.third === "set") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowDefault()}
            {btnFlowSave()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnGetCalendar()}
            {btnGetToday()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSave()}
            {btnGoToList()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "login") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowLogin()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "signup") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {btnFlowSignup()}
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