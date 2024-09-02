// FindListFilter.tsx
// Node -> Section -> Fragment

import { useCommon } from "@imports/ImportHooks";
import { Icons, Input } from "@imports/ImportComponents";
import { TablePagination, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
interface FindListFilterProps {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const FindListFilter = (
  { state, setState, flow }: FindListFilterProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate
  } = useCommon();

  // 7. find ---------------------------------------------------------------------------------------
  const findFilterNode = () => {
    // 1. query
    const querySection = () => (
      <Input
        label={translate("query")}
        value={state?.PAGING?.query}
        onChange={(e: any) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            query: e.target.value
          }));
        }}
        onKeyDown={(e: any) => {
          if (e.key === 'Enter') {
            flow.flowFind();
            setState?.setPAGING((prev: any) => ({
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
          setState?.setPAGING((prev: any) => ({
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
          setState?.setPAGING((prev: any) => ({
            ...prev,
            page: newPage
          }));
        }}
        onRowsPerPageChange={(event) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            limit: parseFloat(event.target.value)
          }));
        }}
      />
    );
    return (
      <Grid container spacing={2}>
        <Grid size={4} className={"d-center"}>
          {querySection()}
        </Grid>
        <Grid size={2} className={"d-center"}>
          {findSection()}
          {doneSection()}
        </Grid>
        <Grid size={6} className={"d-center"}>
          {paginationSection()}
        </Grid>
      </Grid>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {findFilterNode()}
    </>
  );
};