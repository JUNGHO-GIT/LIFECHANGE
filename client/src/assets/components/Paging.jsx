// Paging.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {TablePagination} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Paging = ({
  strings, objects, functions, handlers
}) => {

  const defaultNode = () => (
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

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => (
    strings.type === "list" ? (
      <Div className={"block-wrapper d-row"}>
        {defaultNode()}
      </Div>
    ) : (
      null
    )
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {pagingNode()}
    </>
  );
};