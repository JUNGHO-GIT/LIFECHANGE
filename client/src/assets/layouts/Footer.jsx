// Footer.jsx

import {React}from "../../import/ImportReacts.jsx";
import {Paging, Filter, Btn, Navigation} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Footer = ({
  strings, objects, functions, handlers
}) => {

  // 1. common ------------------------------------------------------------------------------------>
  const height =
  strings?.type === "list" ? (
    "h-160"
  ) : strings?.type === "diff" ? (
    "h-160"
  ) : strings?.type === "detail" ? (
    "h-80"
  ) : strings?.type === "search" ? (
    "h-80"
  ) : strings?.type === "save" ? (
    "h-80"
  ) : "";

  // 6. pagingNode -------------------------------------------------------------------------------->
  const pagingNode = () => (
    <Paging
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 6. filterNode -------------------------------------------------------------------------------->
  const filterNode = () => (
    <Filter
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 6. btnNode ----------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 6. navigationNode ---------------------------------------------------------------------------->
  const navigationNode = () => (
    <Navigation
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 7. resultNode -------------------------------------------------------------------------------->
  const resultNode = () => (
    <Paper className={`flex-wrapper ${height} p-sticky bottom-0`}>
      {pagingNode()}
      {filterNode()}
      {btnNode()}
      {navigationNode()}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {resultNode()}
    </>
  );
};