// Footer.jsx

import {React}from "../../import/ImportReacts.jsx";
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
  const isCalendar = strings?.first === "calendar";
  const isFind = strings?.second === "find";

  const isDiffList = strings?.second === "diff" && strings?.third === "list";
  const isGoalList = strings?.second === "goal" && strings?.third === "list";
  const isGoalSave = strings?.second === "goal" && strings?.third === "save";
  const isList = strings?.second === "list" && strings?.third === "";
  const isSave = strings?.second === "save" && strings?.third === "";
  const isDummy = strings?.second === "data" && strings?.third === "list";
  const isCategory = strings?.second === "data" && strings?.third === "category";
  const isDetail = strings?.second === "data" && strings?.third === "detail";

  // 2. listFilter ---------------------------------------------------------------------------------
  const listFilterNode = () => (
    <ListFilter
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 3. btn ---------------------------------------------------------------------------------
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
    if (isCalendar && (isDiffList || isGoalList || isList)) {
      return null
    }
    else if (!isCalendar && (isDiffList || isGoalList || isList)) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-16vh radius border shadow-none"}>
          {listFilterNode()}
        </Paper>
      )
    }
    else if (isDummy) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-8vh radius border shadow-none"}>
          {dummyNode()}
        </Paper>
      )
    }
    else if (isFind) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-16vh radius border shadow-none"}>
          {findFoodNode()}
        </Paper>
      )
    }
    else if (isGoalSave || isSave) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-16vh radius border shadow-none"}>
          {btnNode()}
        </Paper>
      )
    }
    else if (isCategory || isDetail) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-8vh radius border shadow-none"}>
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