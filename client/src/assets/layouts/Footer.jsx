// Footer.jsx

import {React}from "../../import/ImportReacts.jsx";
import {Paper} from "../../import/ImportMuis.jsx";
import {Dummy} from "./footer/Dummy.jsx";
import {FindFood} from "./footer/FindFood.jsx";
import {SaveDelete} from "./footer/SaveDelete";
import {ListFilter} from "./footer/ListFilter.jsx";

// -------------------------------------------------------------------------------------------------
export const Footer = ({
  strings, objects, functions, handlers
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const isCalendar = strings?.first === "calendar";
  const isDiffList = strings?.second === "diff" && strings?.third === "list";
  const isGoalList = strings?.second === "goal" && strings?.third === "list";
  const isGoalSave = strings?.second === "goal" && strings?.third === "save";
  const isList = strings?.second === "list" && strings?.third === "";
  const isSave = strings?.second === "save" && strings?.third === "";
  const isDummy = strings?.second === "data" && strings?.third === "list";
  const isCategory = strings?.second === "data" && strings?.third === "category";
  const isFindList = strings?.second === "find" && strings?.third === "list";
  const isFindSave = strings?.second === "find" && strings?.third === "save";

  // 2. listFilter ---------------------------------------------------------------------------------
  const listFilterNode = () => (
    <ListFilter
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 3. saveDelete ---------------------------------------------------------------------------------
  const saveDeleteNode = () => (
    <SaveDelete
      strings={strings}
      objects={objects}
      functions={functions}
      handlers={handlers}
    />
  );

  // 4. findFood -----------------------------------------------------------------------------------
  const findFoodNode = () => (
    <FindFood
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
    else if (isFindList || isFindSave) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-16vh radius border shadow-none"}>
          {findFoodNode()}
        </Paper>
      )
    }
    else if (isGoalSave || isSave) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-16vh radius border shadow-none"}>
          {saveDeleteNode()}
        </Paper>
      )
    }
    else if (isCategory) {
      return (
        <Paper className={"flex-wrapper p-sticky bottom-8vh radius border shadow-none"}>
          {saveDeleteNode()}
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