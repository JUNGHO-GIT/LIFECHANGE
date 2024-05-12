// Paging.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper, TablePagination} from "../../import/ImportMuis.jsx";

// 9. paging -------------------------------------------------------------------------------------->
export const Paging = ({
  PAGING, setPAGING, COUNT, setCOUNT, part, plan, type
}) => {

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    type === "search" ? (
      <Paper className={"flex-wrapper h-50 p-sticky bottom-50 shadow-none radius-top"}>
        <Div className={"d-center"}>
          <TablePagination
            rowsPerPageOptions={[10]}
            component={"div"}
            labelRowsPerPage={""}
            count={COUNT.totalCnt}
            rowsPerPage={PAGING.limit}
            page={PAGING.page - 1}
            onPageChange={(event, newPage) => {
              setPAGING((prev) => ({
                ...prev,
                page: newPage + 1
              }));
            }}
            onRowsPerPageChange={(event) => {
              setPAGING((prev) => ({
                ...prev,
                limit: parseInt(event.target.value, 10)
              }));
            }}
          />
        </Div>
      </Paper>
    ) : (
      <Paper className={"flex-wrapper h-50 p-sticky bottom-100 shadow-none radius-top"}>
        <Div className={"d-center"}>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component={"div"}
            labelRowsPerPage={""}
            count={COUNT.totalCnt}
            rowsPerPage={PAGING.limit}
            page={PAGING.page - 1}
            onPageChange={(event, newPage) => {
              setPAGING((prev) => ({
                ...prev,
                page: newPage + 1
              }));
            }}
            onRowsPerPageChange={(event) => {
              setPAGING((prev) => ({
                ...prev,
                limit: parseInt(event.target.value, 10)
              }));
            }}
          />
        </Div>
      </Paper>
    )
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};