// FindFood.jsx

import {React, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {Icons} from "../../../import/ImportComponents.jsx";
import {Button, TextField, Card, TablePagination} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const FindFood = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2. query --------------------------------------------------------------------------------------
  const queryNode = () => (
    <TextField
      select={false}
      size={"small"}
      variant={"outlined"}
      className={"w-30vw me-2vw"}
      value={objects?.PAGING?.query}
      InputProps={{
        readOnly: false,
        className: "h-min0 h-30",
      }}
      onChange={(e) => {
        functions?.setPAGING((prev={}) => ({
          ...prev,
          query: e.target.value
        }));
      }}
    />
  );

  // 3. find ---------------------------------------------------------------------------------------
  const findNode = () => (
    <Icons
      name={"TbSearch"}
      className={"w-20 h-20 black"}
      onClick={async () => {
        handlers.flowFind();
        functions?.setPAGING((prev) => ({
          ...prev,
          page: 0
        }));
      }}
    />
  );

  // 4. done ---------------------------------------------------------------------------------------
  const doneNode = () => (
    <Icons
      name={"TbCheckBox"}
      className={"w-20 h-20 black"}
      onClick={() => {
        Object.assign(objects?.SEND, {
          dateType: objects?.DATE.dateType,
          dateStart: objects?.DATE.dateStart,
          dateEnd: objects?.DATE.dateEnd
        });
        handlers.navigate(objects?.SEND.toSave, {
          state: objects?.SEND,
        });
      }}
    />
  );

  // 5. pagination ---------------------------------------------------------------------------------
  const paginationNode = () => (
    <TablePagination
      rowsPerPageOptions={[10]}
      component={"div"}
      labelRowsPerPage={""}
      count={objects?.COUNT.totalCnt}
      page={objects?.PAGING.page}
      showFirstButton={true}
      showLastButton={true}
      style={{
        width: "40vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "3vw"
      }}
      rowsPerPage={10}
      onPageChange={(event, newPage) => {
        functions.setPAGING((prev) => ({
          ...prev,
          page: newPage
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

  // 6. save ---------------------------------------------------------------------------------------
  const saveNode = () => (
    <Button
      size={"small"}
      color={"primary"}
      variant={"contained"}
      style={{
        padding: "4px 10px",
        textTransform: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginRight: "2vw",
        fontSize: "0.8rem"
      }}
      onClick={() => {
        handlers.flowSave();
        Object.keys(sessionStorage).forEach((key) => {
          if (key.includes("foodSection") || key.includes("PAGING")) {
            sessionStorage.removeItem(key);
          }
        });
      }}
    >
      {translate("save")}
    </Button>
  );

  // 6. more ---------------------------------------------------------------------------------------
  const moreNode = () => (
    <Button
      size={"small"}
      color={"success"}
      variant={"contained"}
      style={{
        padding: "4px 10px",
        textTransform: "none",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginRight: "2vw",
        fontSize: "0.8rem"
      }}
      onClick={() => {
        Object.assign(objects?.SEND, {
          dateType: objects?.DATE.dateType,
          dateStart: objects?.DATE.dateStart,
          dateEnd: objects?.DATE.dateEnd
        });
        handlers.navigate(objects?.SEND.toFind, {
          state: objects?.SEND,
        });
      }}
    >
      {translate("find")}
    </Button>
  );

  // 7. findFood -----------------------------------------------------------------------------------
  const findFoodNode = () => (
    <Card className={"block-wrapper d-row h-8vh w-100p shadow-none over-x-auto"}>
      {(firstStr === "food" && secondStr === "find" && thirdStr === "save") ? (
        <>
          {moreNode()}
          {saveNode()}
        </>
      ) : (
        <>
          {queryNode()}
          {findNode()}
          {doneNode()}
          {paginationNode()}
        </>
      )}
    </Card>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {findFoodNode()}
    </>
  );
};