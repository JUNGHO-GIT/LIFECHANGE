// Paging.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper, TablePagination} from "../../import/ImportMuis.jsx";

// 9. paging -------------------------------------------------------------------------------------->
export const Paging = ({
  strings, objects, functions, handlers
}) => {

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Div className={"block-wrapper h-50 d-row"}>
      <TablePagination
        rowsPerPageOptions={[10]}
        component={"div"}
        labelRowsPerPage={""}
        count={objects?.COUNT.totalCnt}
        rowsPerPage={objects?.PAGING.limit}
        page={objects?.PAGING.page - 1}
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
    </Div>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {tableNode()}
    </>
  );
};