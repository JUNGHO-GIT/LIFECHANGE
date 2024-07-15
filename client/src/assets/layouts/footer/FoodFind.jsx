// FoodFind.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {Button, TextField, Card, TablePagination} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodFind = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate} = useTranslate();

  // 2. query --------------------------------------------------------------------------------------
  const queryNode = () => (
    <TextField
      select={false}
      size={"small"}
      variant={"outlined"}
      className={"w-20vw me-3vw"}
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
      onClick={async () => {
        handlers.flowFind();
        functions?.setPAGING((prev) => ({
          ...prev,
          page: 0
        }));
      }}
    >
      {translate("find")}
    </Button>
  );

  // 4. done ---------------------------------------------------------------------------------------
  const doneNode = () => (
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
        fontSize: "0.8rem"
      }}
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
    >
      {translate("done")}
    </Button>
  );

  // 6. pagination ---------------------------------------------------------------------------------
  const paginationNode = () => (
    <TablePagination
      rowsPerPageOptions={[10]}
      component={"div"}
      labelRowsPerPage={""}
      count={objects?.COUNT.totalCnt}
      rowsPerPage={10}
      page={Math.max(0, objects?.PAGING.page - 1)}
      showFirstButton={true}
      showLastButton={true}
      style={{
        width: "50vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: "5vw"
      }}
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

  // 7. foodFind -----------------------------------------------------------------------------------
  const foodFindNode = () => (
    <Card className={"block-wrapper d-row h-8vh w-100p shadow-none over-x-auto"}>
      {queryNode()}
      {findNode()}
      {doneNode()}
      {paginationNode()}
    </Card>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {foodFindNode()}
    </>
  );
};