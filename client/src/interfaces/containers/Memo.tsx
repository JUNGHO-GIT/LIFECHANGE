// Memo.tsx

import { Grid, Img } from "@importComponents";
import { Input, PopUp } from "@importContainers";
import { useCommonValue } from "@importHooks";
import { TextArea } from "@importMuis";
import { memo, useCallback, useMemo } from "@importReacts";
import { useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
declare type MemoProps = {
	OBJECT: any;
	setOBJECT: any;
	LOCKED: string;
	extra: string;
	i: number;
}

// -------------------------------------------------------------------------------------------------
export const Memo = memo((
	{ OBJECT, setOBJECT, LOCKED, extra, i }: MemoProps
) => {

	// 1. common ----------------------------------------------------------------------------------
	const { firstStr } = useCommonValue();
	const { translate } = useStoreLanguage();

	// 2. callbacks ----------------------------------------------------------------------------------
	const handleTextChange = useCallback((e: any) => {
		// 빈값 처리
		let value = e.target.value || "";
		setOBJECT((prev: any) => ({
			...prev,
			[`${firstStr}_section`]: prev[`${firstStr}_section`]?.map((section: any, idx: number) => (
				idx === i ? {
					...section,
					[`${extra}`]: value
				} : section
			))
		}));
	}, [setOBJECT, firstStr, i, extra]);

	// 3. memoized values ---------------------------------------------------------------------------
	const memoValue = useMemo(() => {
		return OBJECT?.[`${firstStr}_section`]?.[i]?.[`${extra}`] || "";
	}, [OBJECT, firstStr, i, extra]);

	// 4. memoNode -----------------------------------------------------------------------------------
	const memoNode = useMemo(() => (
		<PopUp
			type={"innerCenter"}
			position={"center"}
			direction={"center"}
			contents={
				<Grid container spacing={3} columns={12} className={"w-max-70vw"}>
					<Grid size={12} className={"d-center"}>
						<TextArea
							className={"w-86vw h-55vh border-1 p-10px"}
							value={memoValue}
							style={{
								fontFamily: "inherit",
								fontSize: "inherit",
								fontWeight: "inherit"
							}}
							onChange={handleTextChange}
						/>
					</Grid>
				</Grid>
			}
			children={(popTrigger: any) => (
				<Input
					label={translate("memo")}
					className={"pointer"}
					value={memoValue}
					readOnly={true}
					locked={LOCKED}
					startadornment={
						<Img
							max={14}
							hover={true}
							shadow={false}
							radius={false}
							src={"schedule3.webp"}
						/>
					}
					onClick={(e: any) => {
						popTrigger.openPopup(e.currentTarget);
					}}
				/>
			)}
		/>
	), [memoValue, handleTextChange, translate, LOCKED]);

	// 10. return ------------------------------------------------------------------------------------
	return (
		<>
			{memoNode}
		</>
	);
});