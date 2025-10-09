// FindFilter.tsx

import { Div, Grid, Icons } from "@importComponents";
import { Input } from "@importContainers";
import { useCommonValue } from "@importHooks";
import { TablePagination } from "@importMuis";
import { memo, useMemo } from "@importReacts";
import { useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
declare type FindFilterProps = {
  state: any;
  setState: any;
  flow: any;
}

// -------------------------------------------------------------------------------------------------
export const FindFilter = memo((
  { state, setState, flow }: FindFilterProps
) => {

	// 1. common ----------------------------------------------------------------------------------
  const { navigate, toDetail, isFind, isFavorite } = useCommonValue();
  const { translate } = useStoreLanguage();

	// 4. handler ------------------------------------------------------------------------------------
  const handleSearch = () => {
    flow.flowFind();
    setState?.setPAGING((prev: any) => ({
      ...prev,
      page: 0
    }));
    window.scrollTo(0, 0);
  };

	// 4. handler ------------------------------------------------------------------------------------
  const handleNavigateToDetail = () => {
    navigate(toDetail, {
			state: {
				dateType: state?.DATE.dateType,
				dateStart: state?.DATE.dateStart,
				dateEnd: state?.DATE.dateEnd,
			}
		});
	};

	// 7. find -------------------------------------------------------------------------------------
  const findSection = useMemo(() => (
    <Div className={"d-center"}>
      <Input
        label={translate("query")}
        value={state?.PAGING.query}
        disabled={false}
        inputclass={"h-30px"}
        shrink={"shrink"}
        onChange={(e: any) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            query: e.target.value
          }));
        }}
        onKeyDown={(e: any) => {
          e.key === 'Enter' && handleSearch();
        }}
      />
      <Div className={"d-center mr-n3px"}>
        <Icons
          key={"Search"}
          name={"Search"}
          className={"w-22px h-22px primary pointer-primary"}
          disabled={false}
          onClick={handleSearch}
        />
      </Div>
      <Div className={"d-center ml-n3px"}>
        <Icons
          key={"CheckCircle"}
          name={"CheckCircle"}
          className={"w-22px h-22px burgundy pointer-burgundy"}
          disabled={false}
          onClick={handleNavigateToDetail}
        />
      </Div>
    </Div>
  ), [state?.PAGING.query, translate, handleSearch, handleNavigateToDetail]);

	// 7. favorite ---------------------------------------------------------------------------------
  const favoriteSection = useMemo(() => (
    <Div className={"d-center"}>
      <Input
        label={translate("query")}
        value={translate("favorite")}
        disabled={true}
        inputclass={"h-30px"}
        shrink={"shrink"}
        onChange={(e: any) => {
          setState?.setPAGING((prev: any) => ({
            ...prev,
            query: "favorite"
          }));
        }}
        onKeyDown={(e: any) => {
          e.key === 'Enter' && handleSearch();
        }}
      />
      <Div className={"d-center mr-n3px"}>
        <Icons
          key={"Search"}
          name={"Search"}
          className={"w-22px h-22px grey"}
          disabled={true}
          onClick={handleSearch}
        />
      </Div>
      <Div className={"d-center ml-n3px"}>
        <Icons
          key={"CheckCircle"}
          name={"CheckCircle"}
          className={"w-22px h-22px burgundy pointer-burgundy"}
          onClick={handleNavigateToDetail}
        />
      </Div>
    </Div>
  ), [translate, handleSearch, handleNavigateToDetail]);

	// 7. pagination ------------------------------------------------------------------------------
  const paginationSection = useMemo(() => (
    <TablePagination
      rowsPerPageOptions={[10]}
      labelRowsPerPage={""}
      count={state?.COUNT.totalCnt}
      page={state?.PAGING.page}
      showFirstButton={true}
      showLastButton={true}
      component={"div"}
      disabled={isFavorite}
      className={"border-left-2"}
      rowsPerPage={10}
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
  ), [state?.COUNT.totalCnt, state?.PAGING.page, isFavorite, setState]);

	// 10. return ----------------------------------------------------------------------------------
  return (
    <Grid container={true} spacing={0}>
      <Grid size={7} className={"d-row-center"}>
				{isFind && findSection}
				{isFavorite && favoriteSection}
      </Grid>
      <Grid size={5} className={"h-100p d-col-center"}>
        {paginationSection}
      </Grid>
    </Grid>
  );
});