// Footer.jsx

import {React}from "../../import/ImportReacts.jsx";
import {Paging} from "./footer/Paging.jsx";
import {Filter} from "./footer/Filter.jsx";
import {Btn} from "./footer/Btn.jsx";
import {Paper} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const Footer = ({
  strings, objects, functions, handlers
}) => {

  const isLogin = strings.first === "user" && strings.second === "login";
  const isSignup = strings.first === "user" && strings.second === "signup";

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
    isLogin || isSignup ? (
      <Paper className={"flex-wrapper p-sticky bottom-0vh border-top p-0"}>
        {filterNode()}
        {btnNode()}
      </Paper>
    ) : (
      <Paper className={"flex-wrapper p-sticky bottom-7vh border-top p-0"}>
        {filterNode()}
        {btnNode()}
      </Paper>
    )
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
    {footerNode()}
    </>
  );
};