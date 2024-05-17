// Paging.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {TablePagination} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Paging = ({
  strings, objects, functions, handlers
}) => {

  const pageOption =
  strings?.second === "find" ? (
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
      className={"over-x-hidden"}
      onPageChange={(event, newPage) => {
        functions.setPAGING((prev) => ({
          ...prev,
          page: newPage + 1
        }));
      }}
      onRowsPerPageChange={(event) => {
        functions.setPAGING((prev) => ({
          ...prev,
          page: 1,
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
      className={"over-x-hidden"}
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
    if (strings?.first === "calendar") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "detail") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "detail") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 2. exercise
    else if (strings?.first === "exercise") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "detail") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "detail") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 3. food
    else if (strings?.first === "food") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "find" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {findNode()}
          </Div>
        );
      }
      else if (strings?.second === "find" && strings?.third === "save") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "detail") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "detail") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 4. money
    else if (strings?.first === "money") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "detail") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "detail") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 5. sleep
    else if (strings?.first === "sleep") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "plan" && strings?.third === "detail") {
        return null
      }
      else if (strings?.second === "plan" && strings?.third === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "detail") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
    }

    // 6. user
    else if (strings?.first === "user") {
      if (strings?.second === "diff" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "data" && strings?.third === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.second === "data" && strings?.third === "set") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "list") {
        return (
          <Div className={"block-wrapper d-row h-7vh"}>
            {defaultNode()}
          </Div>
        );
      }
      else if (strings?.third === "" && strings?.second === "detail") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "save") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "login") {
        return null
      }
      else if (strings?.third === "" && strings?.second === "signup") {
        return null
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