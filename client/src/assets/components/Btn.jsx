// Button.jsx

import {React} from "../../import/ImportReacts.jsx";
import {moment} from "../../import/ImportLibs.jsx";
import {Button, Container, Paper, Grid2, TextField, Box} from "../../import/ImportMuis.jsx";

// 11. button ------------------------------------------------------------------------------------->
export const Btn = ({
  DAYPICKER, setDAYPICKER, DATE, setDATE, SEND, FILTER, setFILTER, PAGING, setPAGING,
  flowSave, navParam, part, plan, type
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");

  // 11. button ----------------------------------------------------------------------------------->
  const btnOpenCalendar = () => (
    <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
    className={"primary-btn"} onClick={() => {
      setDAYPICKER((prev) => ({
        ...prev,
        dayOpen: !prev.dayOpen,
      }));
    }}>
      달력
    </Button>
  );
  const btnGetToday = () => (
    <Button size={"small"} type={"button"} color={"success"} variant={"contained"}
    className={"success-btn"} onClick={() => {
      FILTER && (
        setFILTER((prev) => ({
          ...prev,
          type: "day",
        }))
      );
      PAGING && (
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
    <Box className={"d-center"}>
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
    </Box>
  );

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Paper className={"flex-wrapper h-8vh p-sticky bottom-0 d-row"} variant={"outlined"}>
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