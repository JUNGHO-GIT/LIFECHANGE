// FoodPaging.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {Card, TablePagination} from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodPaging = ({
  strings, objects, functions, handlers
}) => {

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

  // 7. foodPaging ---------------------------------------------------------------------------------
  const foodPagingNode = () => (
    <Card className={"block-wrapper d-row h-8vh w-100p shadow-none"}>
      {paginationNode()}
    </Card>
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {foodPagingNode()}
    </>
  );
};