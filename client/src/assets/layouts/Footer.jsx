// Footer.jsx

import {React}from "../../import/ImportReacts.jsx";
import {Paging, Filter, Btn, Navigation} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Footer = ({
  strings, objects, functions, handlers
}) => {

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

  // 7. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Paper className={"flex-wrapper p-sticky bottom-7vh border-top"}>
      {pagingNode()}
      {filterNode()}
      {btnNode()}
    </Paper>
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {footerNode()}
    </>
  );
};