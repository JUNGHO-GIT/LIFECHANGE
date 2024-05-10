// Paging.jsx

import {React} from "../../import/ImportReacts";
import {Paper, TablePagination, Box} from "../../import/ImportMuis";

// 9. paging -------------------------------------------------------------------------------------->
export const Paging = ({
  PAGING, setPAGING, COUNT, setCOUNT, part, plan, type
}) => {

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    type === "search" ? (
      <Paper className={"flex-wrapper h-8vh p-sticky bottom-48"} variant={"outlined"}>
        <Box className={"d-center"}>
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
        </Box>
      </Paper>
    ) : (
      <Paper className={"flex-wrapper h-8vh p-sticky bottom-96"} variant={"outlined"}>
        <Box className={"d-center"}>
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
        </Box>
      </Paper>
    )
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {tableNode()}
    </React.Fragment>
  );
};