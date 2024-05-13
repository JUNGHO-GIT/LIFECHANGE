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
  strings?.part === "calendar"&&(strings?.type === "list" || strings?.part === "diff") ? (
    "h-0"
  ) : strings?.part === "calendar"&&(strings?.type === "detail" || strings?.part === "save") ? (
    "h-80"
  ) : strings?.part === "exercise"&&(strings?.type === "list" || strings?.part === "diff") ? (
    "h-160"
  ) : strings?.part === "exercise"&&(strings?.type === "detail" || strings?.part === "save") ? (
    "h-80"
  ) : strings?.part === "food"&&(strings?.type === "list" || strings?.part === "diff") ? (
    "h-160"
  ) : strings?.part === "food"&&(strings?.type === "detail" || strings?.part === "save") ? (
    "h-80"
  ) : strings?.part === "money"&&(strings?.type === "list" || strings?.part === "diff") ? (
    "h-160"
  ) : strings?.part === "money"&&(strings?.type === "detail" || strings?.part === "save") ? (
    "h-80"
  ) : strings?.part === "sleep"&&(strings?.type === "list" || strings?.part === "diff") ? (
    "h-160"
  ) : strings?.part === "sleep"&&(strings?.type === "detail" || strings?.part === "save") ? (
    "h-80"
  ) : strings?.part === "user"&&(strings?.type === "list" || strings?.part === "diff") ? (
    "h-160"
  ) : strings?.part === "user"&&(strings?.type === "detail" || strings?.part === "save") ? (
    "h-80"
  ) : "h-40";


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
    <Paper className={`flex-wrapper ${height} p-sticky bottom-0 border`}>
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