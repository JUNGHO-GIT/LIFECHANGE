// Paging.jsx

import React from "react";
import {Container, Card, TablePagination} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';

// 9. paging -------------------------------------------------------------------------------------->
export const Paging = ({
  PAGING, setPAGING, COUNT, setCOUNT, part, plan, type
}) => {

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <React.Fragment>
      <Card className={"flex-wrapper h-8vh p-sticky bottom-80"}>
        <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
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
              ></TablePagination>
            </Grid2>
          </Grid2>
        </Container>
      </Card>
    </React.Fragment>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {tableNode()}
    </React.Fragment>
  );
};