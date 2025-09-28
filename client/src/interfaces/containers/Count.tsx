// Count.tsx

import { Div, Grid, Icons, Img } from "@importComponents";
import { Input } from "@importContainers";
import { useCommonValue } from "@importHooks";
import { memo, useCallback, useMemo } from "@importReacts";
import { useStoreAlert, useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
declare type CountProps = {
	COUNT: {
		totalCnt: number;
		sectionCnt: number;
		newSectionCnt: number;
	};
	setCOUNT: React.Dispatch<React.SetStateAction<{
		totalCnt: number;
		sectionCnt: number;
		newSectionCnt: number;
	}>>;
	LOCKED: string;
	setLOCKED: React.Dispatch<React.SetStateAction<string>>;
	limit: number;
	disabled?: boolean;
}

// -------------------------------------------------------------------------------------------------
export const Count = memo((
	{ COUNT, setCOUNT, LOCKED, setLOCKED, limit, disabled }: CountProps
) => {

	// 1. common ----------------------------------------------------------------------------------
	const { PATH, localLang } = useCommonValue();
	const { translate } = useStoreLanguage();
	const { setALERT } = useStoreAlert();

	// 2. callbacks ----------------------------------------------------------------------------------
	const handleLockToggle = useCallback(() => {
		if (disabled) {
			return;
		}
		setLOCKED(LOCKED === "locked" ? "unlocked" : "locked");
	}, [disabled, LOCKED, setLOCKED]);

	const handleMinus = useCallback(() => {
		if (disabled) {
			return;
		}
		if (LOCKED === "locked" || PATH.includes("/food/find/list")) {
			return;
		}
		if (COUNT.newSectionCnt > COUNT.sectionCnt) {
			setCOUNT((prev) => ({
				...prev,
				newSectionCnt: prev.newSectionCnt - 1
			}));
		}
		else {
			setALERT({
				open: true,
				severity: "error",
				msg: (
					localLang === "ko"
						? `${COUNT.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`
						: `Please enter ${COUNT.sectionCnt} or more and ${limit} or less.`
				),
			});
		}
	}, [disabled, LOCKED, PATH, COUNT.newSectionCnt, COUNT.sectionCnt, setCOUNT, setALERT, localLang, limit]);

	const handlePlus = useCallback(() => {
		if (disabled) {
			return;
		}
		if (LOCKED === "locked" || PATH.includes("/food/find/list")) {
			return;
		}
		if (COUNT.newSectionCnt < limit) {
			setCOUNT((prev) => ({
				...prev,
				newSectionCnt: prev.newSectionCnt + 1
			}));
		}
		else {
			setALERT({
				open: true,
				severity: "error",
				msg: (
					localLang === "ko"
						? `${COUNT.sectionCnt}개 이상 ${limit}개 이하로 입력해주세요.`
						: `Please enter ${COUNT.sectionCnt} or more and ${limit} or less.`
				),
			});
		}
	}, [disabled, LOCKED, PATH, COUNT.newSectionCnt, limit, COUNT.sectionCnt, setCOUNT, setALERT, localLang]);

	// 3. memoized components ------------------------------------------------------------------------
	const lockIcon = useMemo(() => (
		LOCKED === "locked" ? (
			<Icons
				key={"Lock"}
				name={"Lock"}
				className={"w-20px h-20px"}
			/>
		) : (
			<Icons
				key={"UnLock"}
				name={"UnLock"}
				className={"w-20px h-20px"}
			/>
		)
	), [LOCKED]);

	const countEndAdornment = useMemo(() => (
		!disabled || LOCKED === "unlocked" ? (
			<Div className={"d-row-center"}>
				<Div className={"mr-n5px"}>
					<Icons
						key={"Minus"}
						name={"Minus"}
						className={"w-20px h-20px"}
						locked={LOCKED}
						onClick={handleMinus}
					/>
				</Div>
				<Div className={"mr-n10px"}>
					<Icons
						key={"Plus"}
						name={"Plus"}
						className={"w-20px h-20px"}
						locked={LOCKED}
						onClick={handlePlus}
					/>
				</Div>
			</Div>
		) : null
	), [disabled, LOCKED, handleMinus, handlePlus]);

	// 7. countNode ----------------------------------------------------------------------------------
	const countNode = useMemo(() => {
		// 7-1. lock
		const lockSection = () => (
			<Input
				label={translate("itemLock")}
				value={translate(LOCKED) || ""}
				inputclass={`fs-0-8rem pointer`}
				adornmentclass={"ml-n10px"}
				disabled={disabled}
				onClick={handleLockToggle}
				startadornment={lockIcon}
			/>
		);
		// 7-2. count
		const countSection = () => (
			<Input
				label={translate("item")}
				value={COUNT.newSectionCnt}
				error={COUNT.newSectionCnt <= 0}
				locked={LOCKED}
				inputclass={`pointer`}
				disabled={disabled}
				sx={{
					"& .MuiOutlinedInput-notchedOutline": {
						borderColor: COUNT.newSectionCnt <= 0 ? "#f44336" : "rgba(0, 0, 0, 0.23)"
					}
				}}
				startadornment={
					<Img
						max={25}
						hover={true}
						shadow={false}
						radius={false}
						src={"common2.webp"}
					/>
				}
				endadornment={countEndAdornment}
			/>
		);
		// 7-3. return
		return (
			<Grid container={true} spacing={1}>
				<Grid size={{ xs: 4, sm: 3 }} className={"d-center"}>
					{lockSection()}
				</Grid>
				<Grid size={{ xs: 8, sm: 9 }} className={"d-center"}>
					{countSection()}
				</Grid>
			</Grid>
		);
	}, [translate, LOCKED, disabled, handleLockToggle, lockIcon, COUNT.newSectionCnt, countEndAdornment]);

	// 10. return ------------------------------------------------------------------------------------
	return (
		<>
			{countNode}
		</>
	);
});