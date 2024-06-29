// Footer.jsx

import {React}from "../../import/ImportReacts.jsx";
import {Filter} from "./footer/Filter.jsx";
import {Btn} from "./footer/Btn.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const Footer = ({
  strings, objects, functions, handlers
}) => {

  // 6. filterNode ---------------------------------------------------------------------------------
  const filterNode = () => (
    <Filter
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 6. btnNode ------------------------------------------------------------------------------------
  const btnNode = () => (
    <Btn
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 7. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    strings?.second === "data" ? (
      <Paper className={"flex-wrapper p-sticky bottom-8vh radius border shadow-none"}>
        {btnNode()}
      </Paper>
    ) : (
      <Paper className={"flex-wrapper p-sticky bottom-16vh radius border shadow-none over-x-auto"}>
        {filterNode()}
        {btnNode()}
      </Paper>
    )
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
    {footerNode()}
    </>
  );
};