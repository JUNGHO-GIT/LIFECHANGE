// FindFilter.jsx
// Node -> Section -> Fragment

import { React } from "../../../import/ImportReacts.jsx";
import { useCommon } from "../../../import/ImportHooks.jsx";
import { Icons, Input } from "../../../import/ImportComponents.jsx";
import { Button,  TablePagination } from "../../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const FindFilter = ({
  state, setState, flow,
}) => {

  // 1. common -------------------------------------------------------------------------------------
  const {translate, firstStr, secondStr, thirdStr} = useCommon();

  // 7. find ---------------------------------------------------------------------------------------
  const findFilterNode = () => {
    // 1. query
    const querySection = () => (
      <Input
        variant={"outlined"}
        className={"w-30vw me-2vw"}
        value={state?.PAGING?.query}
        InputProps={{
          readOnly: false,
          className: "h-min0 h-30",
        }}
        onChange={(e) => {
          setState?.setPAGING((prev) => ({
            ...prev,
            query: e.target.value
          }));
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            flow.flowFind();
            setState?.setPAGING((prev) => ({
              ...prev,
              page: 0
            }));
            window.scrollTo(0, 0);
          }
        }}
      />
    );
    // 2. find
    const findSection = () => (
      <Icons
        name={"TbSearch"}
        className={"w-20 h-20 black"}
        onClick={() => {
          flow.flowFind();
          setState?.setPAGING((prev) => ({
            ...prev,
            page: 0
          }));
          window.scrollTo(0, 0);
        }}
      />
    );
    // 3. done
    const doneSection = () => (
      <Icons
        name={"TbCheckBox"}
        className={"w-20 h-20 black"}
        onClick={() => {
          Object.assign(state?.SEND, {
            dateType: state?.DATE.dateType,
            dateStart: state?.DATE.dateStart,
            dateEnd: state?.DATE.dateEnd
          });
          flow.navigate(state?.SEND.toSave, {
            state: state?.SEND,
          });
        }}
      />
    );
    // 4. pagination
    const paginationSection = () => (
      <TablePagination
        rowsPerPageOptions={[10]}
        component={"div"}
        labelRowsPerPage={""}
        count={state?.COUNT.totalCnt}
        page={state?.PAGING.page}
        showFirstButton={true}
        showLastButton={true}
        style={{
          width: "40vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginLeft: "3vw"
        }}
        rowsPerPage={10}
        onPageChange={(event, newPage) => {
          setState?.setPAGING((prev) => ({
            ...prev,
            page: newPage
          }));
        }}
        onRowsPerPageChange={(event) => {
          setState?.setPAGING((prev) => ({
            ...prev,
            limit: parseFloat(event.target.value)
          }));
        }}
      />
    );
    // 5. save
    const saveSection = () => (
      <Button
        size={"small"}
        color={"primary"}
        variant={"contained"}
        style={{
          padding: "4px 10px",
          textTransform: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginRight: "2vw",
          fontSize: "0.8rem"
        }}
        onClick={() => {
          flow.flowSave();
          Object.keys(sessionStorage).forEach((key) => {
            if (key.includes("foodSection") || key.includes("PAGING")) {
              sessionStorage.removeItem(key);
            }
          });
        }}
      >
        {translate("save")}
      </Button>
    );
    // 6. more
    const moreSection = () => (
      <Button
        size={"small"}
        color={"success"}
        variant={"contained"}
        style={{
          padding: "4px 10px",
          textTransform: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          marginRight: "2vw",
          fontSize: "0.8rem"
        }}
        onClick={() => {
          Object.assign(state?.SEND, {
            dateType: state?.DATE.dateType,
            dateStart: state?.DATE.dateStart,
            dateEnd: state?.DATE.dateEnd
          });
          flow.navigate(state?.SEND.toFind, {
            state: state?.SEND,
          });
        }}
      >
        {translate("find")}
      </Button>
    );
    return (
      firstStr === "food" && secondStr === "find" && thirdStr === "save" ? (
        <>
          {moreSection()}
          {saveSection()}
        </>
      ) : (
        <>
          {querySection()}
          {findSection()}
          {doneSection()}
          {paginationSection()}
        </>
      )
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {findFilterNode()}
    </>
  );
};