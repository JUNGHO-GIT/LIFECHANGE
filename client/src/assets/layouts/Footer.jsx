// Footer.jsx

import {React} from "../../import/ImportReacts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper, TablePagination} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Footer = () => {
  
  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => (
    <Paper className={"flex-wrapper h-50 p-sticky bottom-0 d-row"} variant={"outlined"}>
    </Paper>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
    </>
  );
};