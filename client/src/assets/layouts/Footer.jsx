// Footer.jsx

import {React, useState}from "../../import/ImportReacts.jsx";
import {Btn, Filter, Paging, Navigation} from "../../import/ImportComponents.jsx";
import {Paper, BottomNavigation, BottomNavigationAction} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Footer = ({
  strings, objects, functions, handlers
}) => {

  alert(JSON.stringify(strings));

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
    <Paper className={"flex-wrapper h-200 p-sticky bottom-0"}>
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