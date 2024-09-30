// FindFilter.tsx

import { useCommonValue, useTranslate } from "@imports/ImportHooks";
import { Input } from "@imports/ImportContainers";
import { Icons, Div } from "@imports/ImportComponents";
import { TablePagination, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
declare interface FindFilterProps {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const FindFilter = (
  { state, setState, flow }: FindFilterProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    location, toDetail, navigate
  } = useCommonValue();
  const {
    translate
  } = useTranslate();

  // 7. find ---------------------------------------------------------------------------------------
  const findFilterNode = () => {
    // 1. query
    const querySection = () => (
      <Input
        label={translate("query")}
        value={state?.PAGING?.query}
        inputclass={"h-30"}
        shrink={"shrink"}
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
      <Div className={"d-center me-n3"}>
        <Icons
          key={"Search"}
          name={"Search"}
          className={"w-22 h-22"}
          onClick={() => {
            flow.flowFind();
            setState?.setPAGING((prev: any) => ({
              ...prev,
              page: 0
            }));
            window.scrollTo(0, 0);
          }}
        />
      </Div>
    );
    // 3. done
    const doneSection = () => (
      <Div className={"d-center ms-n3"}>
        <Icons
          key={"CheckCircle"}
          name={"CheckCircle"}
          className={"w-22 h-22"}
          onClick={() => {
            Object.assign(state?.SEND, {
              dateType: state?.DATE.dateType,
              dateStart: state?.DATE.dateStart,
              dateEnd: state?.DATE.dateEnd
            });
            // 이전 페이지가 update인경우
            if (location?.state?.url?.includes("update")) {
              navigate(toDetail, {
                state: state?.SEND,
              });
            }
            // 이전 페이지가 save인경우
            else {
              navigate(toDetail, {
                state: state?.SEND,
              });
            }
          }}
        />
      </Div>
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
        onPageChange={(_event, newPage) => {
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