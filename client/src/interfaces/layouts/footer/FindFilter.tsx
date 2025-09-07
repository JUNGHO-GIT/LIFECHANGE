// FindFilter.tsx

import { useCommonValue } from "@importHooks";
import { useStoreLanguage } from "@importStores";
import { Input } from "@importContainers";
import { Icons, Div, Grid } from "@importComponents";
import { TablePagination } from "@importMuis";

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

	// 1. common ----------------------------------------------------------------------------------
  const { PATH, navigate , toDetail } = useCommonValue();
  const { translate } = useStoreLanguage();

	// 7. find -------------------------------------------------------------------------------------
  const findFilterNode = () => {
		// 1. find
		const findSection = () => (
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
				<Div className={"d-center mr-n3px"}>
					<Icons
						key={"Search"}
						name={"Search"}
						className={"w-22px h-22px primary pointer-primary"}
						disabled={false}
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
				<Div className={"d-center ml-n3px"}>
					<Icons
						key={"CheckCircle"}
						name={"CheckCircle"}
						className={"w-22px h-22px burgundy pointer-burgundy"}
						disabled={false}
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
			</Div>
    );
		// 2. favorite
		const favoriteSection = () => (
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
				<Div className={"d-center mr-n3px"}>
					<Icons
						key={"Search"}
						name={"Search"}
						className={"w-22px h-22px grey"}
						disabled={true}
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
				<Div className={"d-center ml-n3px"}>
					<Icons
						key={"CheckCircle"}
						name={"CheckCircle"}
						className={"w-22px h-22px burgundy pointer-burgundy"}
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
			</Div>
		);
    // 3. pagination
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
        <Grid size={8} className={"d-row-center"}>
					{PATH.includes("/favorite/list") ? favoriteSection() : findSection()}
        </Grid>
        <Grid size={4} className={"h-100p d-col-center"}>
          {paginationSection()}
        </Grid>
      </Grid>
    );
  };

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {findFilterNode()}
    </>
  );
};