/**
 * @file ListFilter.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div } from "@exportComponents";
import { PickerDay, Select } from "@exportContainers";
import { useCommonValue as usCmmnVal } from "@exportHooks";
import { MenuItem } from "@exportMuis";
import { memo, useMemo } from "@exportReacts";
import { useStoreLanguage as usStrLang } from "@exportStores";

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
declare interface ListFilterProps {
	state: any;
	setState: any;
}

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const ListFilter = memo(({ state, setState }: ListFilterProps) => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { sessionCategory: sessCat } = usCmmnVal();
	const { isExerciseGoalList: isExerGlLst, isExerciseRecordList: isExerRecLst } = usCmmnVal();
	const { isFoodGoalList: isFdGlLst, isFoodRecordList: isFdRecLst } = usCmmnVal();
	const { isMoneyGoalList: isMnyGlLst, isMoneyRecordList: isMnyRecLst } = usCmmnVal();
	const { isSleepGoalList: isSlpGlLst, isSleepRecordList: isSlpRecLst } = usCmmnVal();
	const { translate } = usStrLang();

	// 2. array ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const dataArray = useMemo(() => {
		let result: any[] = [];

		(isExerGlLst || isExerRecLst) &&
			(result = sessCat?.exercise ?? []);
		(isFdGlLst || isFdRecLst) &&
			(result = sessCat?.food ?? []);
		(isMnyGlLst || isMnyRecLst) &&
			(result = sessCat?.money ?? []);
		(isSlpGlLst || isSlpRecLst) &&
			(result = sessCat?.sleep ?? []);

		return result;
	}, [
		isExerGlLst,
		isExerRecLst,
		isFdGlLst,
		isFdRecLst,
		isMnyGlLst,
		isMnyRecLst,
		isSlpGlLst,
		isSlpRecLst,
		sessCat,
	]);

	// 3. partArray ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const partArray = useMemo(() => {
		let partKey: string = ``;

		(isExerGlLst || isExerRecLst) &&
			(partKey = `exercise_record_part`);
		(isFdGlLst || isFdRecLst) && (partKey = `food_record_part`);
		(isMnyGlLst || isMnyRecLst) && (partKey = `money_record_part`);

		if (!partKey) {
			return [];
		}

		const parts: any[] = dataArray?.map((item: any) => item[partKey]) || [];
		const uniqueParts: any[] = [...new Set(parts)].filter(
			(p: string) => p !== `all`,
		);

		return [`all`, ...uniqueParts];
	}, [
		isExerGlLst,
		isExerRecLst,
		isFdGlLst,
		isFdRecLst,
		isMnyGlLst,
		isMnyRecLst,
		dataArray,
	]);

	// 4. titleArray ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const titleArray = useMemo(() => {
		let partKey: string = ``;
		let titleKey: string = ``;

		(isExerGlLst || isExerRecLst) &&
			((partKey = `exercise_record_part`),
			(titleKey = `exercise_record_title`));
		(isMnyGlLst || isMnyRecLst) &&
			((partKey = `money_record_part`), (titleKey = `money_record_title`));

		if (!partKey || !titleKey) {
			return [];
		}

		const selectedPart: any = state?.PAGING?.part ?? `all`;
		const targetItem: any = dataArray?.find(
			(item: any) => item[partKey] === selectedPart,
		);
		const titles: any[] = targetItem?.[titleKey] ?? [];
		const uniqueTitles: any[] = [...new Set(titles)].filter(
			(t: string) => t !== `all`,
		);

		return [`all`, ...uniqueTitles];
	}, [
		isExerGlLst,
		isExerRecLst,
		isMnyGlLst,
		isMnyRecLst,
		dataArray,
		state?.PAGING?.part,
	]);

	// 7. filter ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const lstFltNd = useMemo(() => {
		// 7-1. sort ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
		const sortSection = (
			<Select
				label={translate(`sort`)}
				value={state?.PAGING?.sort ?? `asc`}
				inputclass={`h-min-0px h-5vh`}
				onChange={(e: any) => {
					setState?.setPAGING((prev: any) => ({
						...prev,
						sort: e.target.value,
					}));
				}}
			>
				{[`asc`, `desc`]?.map((item: string) => (
					<MenuItem
						key={item}
						value={item}
						selected={state?.PAGING?.sort === item}
					>
						<Div className={`fs-0-8rem`}>{translate(item)}</Div>
					</MenuItem>
				))}
			</Select>
		);

		// 7-2. date ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
		const dateSection = (
			<PickerDay
				DATE={state?.DATE}
				setDATE={setState?.setDATE}
				EXIST={state?.EXIST}
			/>
		);

		// 7-3. part ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
		const partSection = (
			<Select
				label={translate(`part`)}
				value={state?.PAGING?.part ?? `all`}
				inputclass={`h-min-0px h-5vh`}
				onChange={(e: any) => {
					setState?.setPAGING((prev: any) => ({
						...prev,
						part: e.target.value,
						title: `all`,
					}));
				}}
			>
				{partArray?.map((item: string) => (
					<MenuItem
						key={item}
						value={item}
						selected={state?.PAGING?.part === item}
					>
						<Div className={`fs-0-8rem`}>{translate(item)}</Div>
					</MenuItem>
				))}
			</Select>
		);

		// 7-4. title ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
		const titleSection = (
			<Select
				label={translate(`title`)}
				value={state?.PAGING?.title ?? `all`}
				inputclass={`h-min-0px h-5vh`}
				onChange={(e: any) => {
					setState?.setPAGING((prev: any) => ({
						...prev,
						title: e.target.value,
					}));
				}}
			>
				{titleArray?.map((item: string) => (
					<MenuItem
						key={item}
						value={item}
						selected={state?.PAGING?.title === item}
					>
						<Div className={`fs-0-8rem`}>{translate(item)}</Div>
					</MenuItem>
				))}
			</Select>
		);

		// 7-9. return ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
		return (
			<Div
				className={`d-row w-100p h-100p over-x-auto`}
				style={{ alignItems: `baseline` }}
			>
				<Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
					{sortSection}
				</Div>
				<Div
					className={`d-center my-1vh mx-5px w-max-60vw`}
					style={{ flexShrink: 0 }}
				>
					{dateSection}
				</Div>
				{isExerGlLst || isExerRecLst ? (
					<>
						<Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
							{partSection}
						</Div>
						<Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
							{titleSection}
						</Div>
					</>
				) : null}
				{isFdGlLst || isFdRecLst ? (
					<Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
						{partSection}
					</Div>
				) : null}
				{isMnyGlLst || isMnyRecLst ? (
					<>
						<Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
							{partSection}
						</Div>
						<Div className={`d-center my-1vh mx-5px`} style={{ flexShrink: 0 }}>
							{titleSection}
						</Div>
					</>
				) : null}
			</Div>
		);
	}, [
		translate,
		state,
		setState,
		partArray,
		titleArray,
		isExerGlLst,
		isExerRecLst,
		isFdGlLst,
		isFdRecLst,
		isMnyGlLst,
		isMnyRecLst,
	]);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	return <>{lstFltNd}</>;
});
