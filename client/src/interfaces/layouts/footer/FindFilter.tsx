/**
 * @file FindFilter.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div, Grid, Icons } from "@exportComponents";
import { Input } from "@exportContainers";
import { useCommonValue as usCmmnVal } from "@exportHooks";
import { TablePagination as TblPgnt } from "@exportMuis";
import { memo, useMemo } from "@exportReacts";
import { useStoreLanguage as usStrLang } from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
declare interface FindFilterProps {
	state: any;
	setState: any;
	flow: any;
}

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const FindFilter = memo(({ state, setState, flow }: FindFilterProps) => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { navigate, toDetail, isFind, isFavorite } = usCmmnVal();
	const { translate } = usStrLang();

	// 4. handle ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const handleSearch = () => {
		flow.flowFind();
		setState?.setPAGING((prev: any) => ({
			...prev,
			page: 0,
		}));
		window.scrollTo(0, 0);
	};

	// 4. handle ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const hndlNvgtTDtl = () => {
		void navigate(toDetail, {
			state: {
				dateType: state?.DATE?.dateType,
				dateStart: state?.DATE?.dateStart,
				dateEnd: state?.DATE?.dateEnd,
			},
		});
	};

	// 7. find ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const findSection = useMemo(
		() => (
			<Div className={`d-center`}>
				<Input
					label={translate(`query`)}
					value={state?.PAGING.query}
					disabled={false}
					inputclass={`h-30px`}
					shrink={`shrink`}
					onChange={(e: any) => {
						setState?.setPAGING((prev: any) => ({
							...prev,
							query: e.target.value,
						}));
					}}
					onKeyDown={(e: any) => {
						e.key === `Enter` && handleSearch();
					}}
				/>
				<Div className={`d-center mr-n3px`}>
					<Icons
						key={`Search`}
						name={`Search`}
						className={`w-22px h-22px primary pointer-primary`}
						disabled={false}
						onClick={handleSearch}
					/>
				</Div>
				<Div className={`d-center ml-n3px`}>
					<Icons
						key={`CheckCircle`}
						name={`CheckCircle`}
						className={`w-22px h-22px burgundy pointer-burgundy`}
						disabled={false}
						onClick={hndlNvgtTDtl}
					/>
				</Div>
			</Div>
		),
		[
			state?.PAGING.query,
			translate,
			setState,
			handleSearch,
			hndlNvgtTDtl,
		],
	);

	// 7. favorite ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const favSec = useMemo(
		() => (
			<Div className={`d-center`}>
				<Input
					label={translate(`query`)}
					value={translate(`favorite`)}
					disabled={true}
					inputclass={`h-30px`}
					shrink={`shrink`}
					onChange={(_e: any) => {
						setState?.setPAGING((prev: any) => ({
							...prev,
							query: `favorite`,
						}));
					}}
					onKeyDown={(e: any) => {
						e.key === `Enter` && handleSearch();
					}}
				/>
				<Div className={`d-center mr-n3px`}>
					<Icons
						key={`Search`}
						name={`Search`}
						className={`w-22px h-22px grey`}
						disabled={true}
						onClick={handleSearch}
					/>
				</Div>
				<Div className={`d-center ml-n3px`}>
					<Icons
						key={`CheckCircle`}
						name={`CheckCircle`}
						className={`w-22px h-22px burgundy pointer-burgundy`}
						onClick={hndlNvgtTDtl}
					/>
				</Div>
			</Div>
		),
		[translate, handleSearch, hndlNvgtTDtl],
	);

	// 7. pagination ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const pgntSec = useMemo(
		() => (
			<TblPgnt
				rowsPerPageOptions={[10]}
				labelRowsPerPage={``}
				count={state?.COUNT.totalCnt}
				page={state?.PAGING.page}
				showFirstButton={true}
				showLastButton={true}
				component={`div`}
				disabled={isFavorite}
				className={`border-left-2`}
				rowsPerPage={10}
				labelDisplayedRows={() => ``}
				onPageChange={(_event, newPage) => {
					setState?.setPAGING((prev: any) => ({
						...prev,
						page: newPage,
					}));
					window.scrollTo(0, 0);
				}}
				onRowsPerPageChange={(event) => {
					setState?.setPAGING((prev: any) => ({
						...prev,
						limit: Number.parseFloat(event.target.value),
					}));
					window.scrollTo(0, 0);
				}}
			/>
		),
		[state?.COUNT.totalCnt, state?.PAGING.page, isFavorite, setState],
	);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return (
		<Grid container={true} spacing={0}>
			<Grid size={7} className={`d-row-center`}>
				{isFind ? findSection : null}
				{isFavorite ? favSec : null}
			</Grid>
			<Grid size={5} className={`h-100p d-col-center`}>
				{pgntSec}
			</Grid>
		</Grid>
	);
});
