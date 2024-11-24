// FindFilter.tsx

import { useCommonValue, useStoreLanguage } from "@importHooks";
import { Input } from "@importContainers";
import { Icons, Div } from "@importComponents";
import { TablePagination, Grid } from "@importMuis";

// -------------------------------------------------------------------------------------------------
declare type FindFilterProps = {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const FindFilter = (
  { state, setState, flow }: FindFilterProps
) => {

  // 1. common -------------------------------------------------------------------------------------
  const { PATH, navigate , toDetail } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 7. find ---------------------------------------------------------------------------------------
  const findFilterNode = () => {
    // 1. query
    const querySection = () => (
      <Input
        label={translate("query")}
        value={PATH.includes("/favorite/list") ? translate("favorite") : state?.PAGING.query}
        disabled={PATH.includes("/favorite/list") ? true : false}
        inputclass={"h-30px"}
        shrink={"shrink"}
        onChange={(e: any) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            query: PATH.includes("/favorite/list") ? "favorite" : e.target.value
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
      <Div className={"d-center mr-n3px"}>
        <Icons
          key={"Search"}
          name={"Search"}
          className={"w-22px h-22px"}
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
      <Div className={"d-center ml-n3px"}>
        <Icons
          key={"CheckCircle"}
          name={"CheckCircle"}
          className={"w-22px h-22px"}
          onClick={() => {
            navigate(toDetail, {
              state: {
                dateType: state?.DATE.dateType,
                dateStart: state?.DATE.dateStart,
                dateEnd: state?.DATE.dateEnd
              }
            });
          }}
        />
      </Div>
    );
    // 4. pagination
    const paginationSection = () => (
      <TablePagination
        rowsPerPageOptions={[10]}
        labelRowsPerPage={""}
        count={state?.COUNT.totalCnt}
        page={state?.PAGING.page}
        showFirstButton={true}
        showLastButton={true}
        component={"div"}
        disabled={PATH.includes("/favorite/list") ? true : false}
        className={"border-left-2"}
        rowsPerPage={10}
        // 숫자 숨기기 ( 1 of 10 )
        labelDisplayedRows={() => ""}
        onPageChange={(_event, newPage) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            page: newPage
          }));
          window.scrollTo(0, 0);
        }}
        onRowsPerPageChange={(event) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            limit: parseFloat(event.target.value)
          }));
          window.scrollTo(0, 0);
        }}
      />
    );
    return (
      <Grid container={true} spacing={0}>
        <Grid size={6} className={"d-row-center"}>
          {querySection()}
          {findSection()}
          {doneSection()}
        </Grid>
        <Grid size={6} className={"h-100p d-col-center"}>
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