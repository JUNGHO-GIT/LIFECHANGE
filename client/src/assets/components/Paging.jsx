// Paging.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {TablePagination} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Paging = ({
  strings, objects, functions, handlers
}) => {

  const pageOption =
  strings.type === "find" ? (
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

  const findNode = () => (
    <TablePagination
      rowsPerPageOptions={pageOption}
      component={"div"}
      labelRowsPerPage={""}
      count={objects?.COUNT.totalCnt}
      rowsPerPage={objects?.PAGING.limit}
      page={objects?.PAGING.page}
      showFirstButton={true}
      showLastButton={true}
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

  // 7. paging ------------------------------------------------------------------------------------>
  const pagingNode = () => {

    // 1. calendar
    if (strings?.part === "calendar") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          null
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 2. exercise
    else if (strings?.part === "exercise") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 3. food
    else if (strings?.part === "food") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.type === "find") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {findNode()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 4. money
    else if (strings?.part === "money") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 5. sleep
    else if (strings?.part === "sleep") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.type === "detail") {
        return (
          null
        );
      }
      else if (strings?.type === "save") {
        return (
          null
        );
      }
    }

    // 6. user
    else if (strings?.part === "user") {
      if (strings?.type === "list" || strings?.type === "diff") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.type === "dataset") {
        return (
          null
        );
      }
      else if (strings?.type === "login") {
        return (
          null
        );
      }
      else if (strings?.type === "signup") {
        return (
          null
        );
      }
    }
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {pagingNode()}
    </>
  );
};