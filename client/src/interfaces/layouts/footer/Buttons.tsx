/**
 * @file Buttons.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Btn, Div, Grid } from "@exportComponents";
import { PopUp } from "@exportContainers";
import { useCommonValue as usCmmnVal } from "@exportHooks";
import { memo, useMemo } from "@exportReacts";
import { setSession } from "@exportScripts";
import { useStoreLanguage as usStrLang } from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
declare interface ButtonsProps {
	state: any;
	flow: any;
}

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const Buttons = memo(({ state, flow }: ButtonsProps) => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { toFind, toFavorite, navigate } = usCmmnVal();
	const {
		isFoodRecordDetail: isFdRecDtl,
		isUserCategory: isUsrCat,
		isUserDetail,
		isDetail,
		isSleep,
		isCalendarDetail: isClndDtl,
	} = usCmmnVal();
	const { translate } = usStrLang();

	// 2. useMemo ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const navSt = useMemo(
		() => ({
			dateType: state?.DATE?.dateType,
			dateStart: state?.DATE?.dateStart,
			dateEnd: state?.DATE?.dateEnd,
		}),
		[state?.DATE?.dateType, state?.DATE?.dateStart, state?.DATE?.dateEnd],
	);

	// 3. handle ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const handleSave = (type: string) => {
		flow?.flowSave(type);
		setSession(`section`, `food`, ``, []);
	};

	// 7-1. btn - toFind ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const toFindBtn = useMemo(
		() => (
			<Btn
				color={`success`}
				className={`ml-2vw mr-2vw`}
				onClick={() => {
					void navigate(toFind, {
						state: navSt,
					});
				}}
			>
				{translate(`find`)}
			</Btn>
		),
		[navigate, toFind, navSt, translate],
	);

	// 7-2. btn - toFavorite ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const favoriteBtn = useMemo(
		() => (
			<Btn
				color={`warning`}
				className={`ml-2vw mr-2vw`}
				onClick={() => {
					void navigate(toFavorite, {
						state: navSt,
					});
				}}
			>
				{translate(`favorite`)}
			</Btn>
		),
		[navigate, toFavorite, navSt, translate],
	);

	// 8. btn - delete ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const deleteBtn = useMemo(
		() => (
			<Btn
				color={`error`}
				className={`ml-2vw mr-2vw`}
				onClick={() => {
					flow?.flowDelete();
				}}
			>
				{translate(`delete`)}
			</Btn>
		),
		[flow, translate],
	);

	// 9. btn - save ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const saveBtn = useMemo(
		() => (
			<PopUp
				key={`innerCenter`}
				type={`innerCenter`}
				position={`center`}
				direction={`center`}
				padding={`6px`}
				contents={
					<Grid
						container={true}
						spacing={2}
						className={`h-max-30vh d-row-center`}
					>
						<Grid size={12}>
							<Div className={`fs-0-8rem fw-600 pre-line dark-grey`}>
								{translate(`replaceOrInsert`)}
							</Div>
						</Grid>
						<Grid
							size={isSleep ? 12 : 6}
							className={isSleep ? `d-center` : `d-row-right`}
						>
							<Btn
								size={`large`}
								color={`primary`}
								variant={`text`}
								className={`fs-1-2rem fw-600 ml-2vw mr-2vw`}
								onClick={() => {
									handleSave(`replace`);
								}}
							>
								{translate(`replace`)}
							</Btn>
						</Grid>
						<Grid
							size={isSleep ? 0 : 6}
							className={isSleep ? `d-none` : `d-row-left`}
						>
							<Btn
								size={`large`}
								color={`primary`}
								variant={`text`}
								className={`fs-1-2rem fw-600 ml-2vw mr-2vw`}
								onClick={() => {
									handleSave(`insert`);
								}}
							>
								{translate(`insert`)}
							</Btn>
						</Grid>
					</Grid>
				}
				children={(popTrigger: any) => (
					<Btn
						color={`primary`}
						className={`ml-2vw mr-2vw`}
						onClick={(e: any) => {
							if (state.FLOW?.theme === `calendar`) {
								state.FLOW?.exist ? handleSave(`update`) : handleSave(`create`);
							} else {
								state.FLOW?.exist
									? state.FLOW?.itsMe
										? handleSave(`update`)
										: popTrigger.openPopup(e.currentTarget)
									: handleSave(`create`);
							}
						}}
					>
						{translate(`save`)}
					</Btn>
				)}
			/>
		),
		[isSleep, handleSave, state.FLOW, translate],
	);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return isUsrCat || isUserDetail ? (
		<Grid container={true} spacing={1}>
			<Grid size={10} className={`d-center`}>
				{saveBtn}
			</Grid>
		</Grid>
	) : isClndDtl || isDetail ? (
		<Grid container={true} spacing={1}>
			<Grid size={10} className={`d-center`}>
				{saveBtn}
				{deleteBtn}
				{isFdRecDtl ? toFindBtn : null}
				{isFdRecDtl ? favoriteBtn : null}
			</Grid>
		</Grid>
	) : null;
});
