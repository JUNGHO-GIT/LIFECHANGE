// Footer.jsx

import {React, useLocation} from "../../import/ImportReacts.jsx";
import {Paper} from "../../import/ImportMuis.jsx";
import {Dummy} from "./footer/Dummy.jsx";
import {FindFilter} from "./footer/FindFilter.jsx";
import {Btn} from "./footer/Btn.jsx";
import {ListFilter} from "./footer/ListFilter.jsx";

// -------------------------------------------------------------------------------------------------
export const Footer = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const location = useLocation();
  const PATH = location?.pathname;

  // 2. listFilter ---------------------------------------------------------------------------------
  const listFilterNode = () => (
    <ListFilter
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 3. btn ----------------------------------------------------------------------------------------
  const btnNode = () => (
    <Btn
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 4. findFood -----------------------------------------------------------------------------------
  const findFoodNode = () => (
    <FindFilter
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 6. dummy --------------------------------------------------------------------------------------
  const dummyNode = () => (
    <Dummy
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 7. footer -------------------------------------------------------------------------------------
  const footerNode = () => {
    if (
      PATH.indexOf("/calendar") > -1 && (
        PATH.indexOf("/diff/list") > -1 ||
        PATH.indexOf("/goal/list") > -1 ||
        PATH.indexOf("/list") > -1
      )
    ) {
      return null
    }

    else if (
      PATH.indexOf("/calendar") === -1 && (
        PATH.indexOf("/diff/list") > -1 ||
        PATH.indexOf("/goal/list") > -1 ||
        PATH.indexOf("/list") > -1
      )
    ) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-8vh60 radius border shadow-none"}>
          {listFilterNode()}
        </Paper>
      )
    }

    else if (PATH.indexOf("/user/dummy") > -1) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-60 radius border shadow-none"}>
          {dummyNode()}
        </Paper>
      )
    }

    else if (PATH.indexOf("/food/find") > -1) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-8vh60 radius border shadow-none"}>
          {findFoodNode()}
        </Paper>
      )
    }

    else if (PATH.indexOf("/goal/save") > -1 || PATH.indexOf("/save") > -1) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-8vh60 radius border shadow-none"}>
          {btnNode()}
        </Paper>
      )
    }

    else if (PATH.indexOf("/user/category") > -1 || PATH.indexOf("/user/detail") > -1) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-60 radius border shadow-none"}>
          {btnNode()}
        </Paper>
      )
    }

    else {
      return null
    }
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {footerNode()}
    </>
  );
};