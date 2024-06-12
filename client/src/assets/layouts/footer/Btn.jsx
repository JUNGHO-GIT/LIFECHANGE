// Btn.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, numeral} from "../../../import/ImportLibs.jsx";
import {PopUp, Div, Img, Br20, Br40} from "../../../import/ImportComponents.jsx";
import {Button, TextField, MenuItem, Card, TablePagination} from "../../../import/ImportMuis.jsx";
import {money2} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const Btn = ({
  strings, objects, functions, handlers
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const {translate} = useTranslate();

  // 1. go
  const btnGoToFind = () => (
    <Button size={"small"} color={"success"} variant={"contained"} className={"me-5"} onClick={() => {
      Object.assign(objects?.SEND, {
        dateType: objects?.DATE.dateType,
        dateStart: objects?.DATE.dateStart,
        dateEnd: objects?.DATE.dateEnd
      });
      handlers.navigate(objects?.SEND.toFind, {
        state: objects?.SEND,
      });
    }}>
      {translate("btn-goToFind")}
    </Button>
  );
  const btnGoToFindSave = () => (
    <Button size={"small"} color={"primary"} variant={"contained"} className={"me-5"} onClick={() => {
      Object.assign(objects?.SEND, {
        dateType: objects?.DATE.dateType,
        dateStart: objects?.DATE.dateStart,
        dateEnd: objects?.DATE.dateEnd
      });
      handlers.navigate(objects?.SEND.toSave, {
        state: objects?.SEND,
      });
    }}>
      {translate("btn-goToFindSave")}
    </Button>
  );

  // 3. flow
  const btnFlowSave = () => (
    <Button size={"small"} color={"primary"} variant={"contained"} className={"me-5"} onClick={() => {
      handlers.flowSave();
      Object.keys(sessionStorage).forEach((key) => {
        if (key.includes("foodSection")) {
          sessionStorage.removeItem(key);
        }
      });
    }}>
      {translate("btn-flowSave")}
    </Button>
  );
  const btnFlowDeletes = () => (
    <Button size={"small"} color={"error"} variant={"contained"} className={"me-5"} onClick={() => {
      handlers.flowDeletes();
    }}>
      {translate("btn-flowDeletes")}
    </Button>
  );
  const btnFlowFind = () => (
    <Div className={"d-center"}>
      <TextField
        select={false}
        size={"small"}
        variant={"outlined"}
        className={"w-20vw"}
        value={objects?.PAGING?.query}
        InputProps={{
          readOnly: false,
          startAdornment: null,
          endAdornment: null,
        }}
        onChange={(e) => {
          functions?.setPAGING((prev={}) => ({
            ...prev,
            query: e.target.value
          }));
        }}
      />
      <Button size={"small"} color={"primary"} variant={"contained"} className={"ms-5 me-5"} onClick={async () => {
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
  const btnPagination = () => (
    <TablePagination
      rowsPerPageOptions={[10]}
      component={"div"}
      labelRowsPerPage={""}
      count={objects?.COUNT.totalCnt}
      rowsPerPage={10}
      page={Math.max(0, objects?.PAGING.page - 1)}
      showFirstButton={true}
      showLastButton={true}
      onPageChange={(event, newPage) => {
        functions.setPAGING((prev) => ({
          ...prev,
          page: newPage + 1
        }));
      }}
      onRowsPerPageChange={(event) => {
        functions.setPAGING((prev) => ({
          ...prev,
          limit: parseInt(event.target.value, 10)
        }));
      }}
    />
  );
  const btnFlowDefault = () => (
    <Button size={"small"} color={"error"} variant={"contained"} className={"me-5"} onClick={handlers?.handlerDefault}>
      {translate("btn-flowDefault")}
    </Button>
  );
  const btnFlowDemo = () => (
    <Div className={"d-center"}>
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"me-2"}
        variant={"outlined"}
        value={objects?.PART}
        InputProps={{
          readOnly: false,
          className: "h-min0 h-30",
        }}
        defaultValue={"exercisePlan"}
        onChange={(e) => {
          const newPartVal = e.target.value;
          functions?.setPART(newPartVal);
          functions?.setPAGING((prev) => ({
            ...prev,
            page: 1
          }));
        }}>
        <MenuItem value={"exercisePlan"}>운동(계획)</MenuItem>
        <MenuItem value={"exercise"}>운동</MenuItem>
        <MenuItem value={"foodPlan"}>식사(계획)</MenuItem>
        <MenuItem value={"food"}>식사</MenuItem>
        <MenuItem value={"moneyPlan"}>지출(계획)</MenuItem>
        <MenuItem value={"money"}>지출</MenuItem>
        <MenuItem value={"sleepPlan"}>수면(계획)</MenuItem>
        <MenuItem value={"sleep"}>수면</MenuItem>
      </TextField>
      <TextField
        select={false}
        type={"text"}
        size={"small"}
        variant={"outlined"}
        value={Math.min(objects?.COUNT?.inputCnt, 100)}
        InputProps={{
          readOnly: false,
          className: "h-min0 h-30",
        }}
        onChange={(e) => {
          const limitedValue = Math.min(Number(e.target.value), 100);
          functions.setCOUNT((prev) => ({
            ...prev,
            inputCnt: limitedValue
          }));
        }}
      />
      <Button size={"small"} className={"ms-5"} color={"success"} variant={"contained"}
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
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnFlowDeletes()}
          </Card>
        );
      }
    }

    // 2. exercise
    else if (strings?.first === "exercise") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnFlowDeletes()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnFlowDeletes()}
          </Card>
        );
      }
    }

    // 3. food
    else if (strings?.first === "food") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "find" && strings?.third === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowFind()}
            {btnGoToFindSave()}
            {btnPagination()}
          </Card>
        );
      }
      else if (strings?.second === "find" && strings?.third === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnGoToFind()}
          </Card>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnFlowDeletes()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnFlowDeletes()}
          </Card>
        );
      }
    }

    // 4. money
    else if (strings?.first === "money") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnFlowDeletes()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnFlowDeletes()}
          </Card>
        );
      }
    }

    // 5. sleep
    else if (strings?.first === "sleep") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnFlowDeletes()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
            {btnFlowDeletes()}
          </Card>
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
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowDemo()}
          </Card>
        );
      }
      else if (strings?.second === "data" && strings?.third === "category") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowDefault()}
            {btnFlowSave()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return (
          <Card className={"block-wrapper border-none d-row h-8vh"}>
            {btnFlowSave()}
          </Card>
        );
      }
      else if (strings?.third === "" && strings?.second === "login") {
        return null;
      }
      else if (strings?.third === "" && strings?.second === "signup") {
        return null;
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