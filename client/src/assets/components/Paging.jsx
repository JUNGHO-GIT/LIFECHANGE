// Paging.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {TablePagination} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Paging = ({
  strings, objects, functions, handlers
}) => {

  const pageOption =
  strings.type === "search" ? (
    [10]
  ) : (
    [5, 10, 20, 30]
  );

  const defaultNode = () => (
    <TablePagination
      rowsPerPageOptions={pageOption}
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
  );

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => (
    strings.type === "list" || strings.type === "diff" ? (
      <Div className={"block-wrapper d-row h-40"}>
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