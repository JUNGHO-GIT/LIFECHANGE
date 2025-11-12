// PickerTime.tsx

import { Grid, Img } from "@importComponents";
import { Input, PopUp } from "@importContainers";
import { useCommonValue } from "@importHooks";
import { moment } from "@importLibs";
import { AdapterMoment, DigitalClock, LocalizationProvider } from "@importMuis";
import { memo, useCallback, useEffect, useMemo, useState } from "@importReacts";
import { useStoreLanguage } from "@importStores";

// -------------------------------------------------------------------------------------------------
declare type PickerTimeProps = {
	OBJECT: any;
	setOBJECT: React.Dispatch<React.SetStateAction<any>>;
	REFS: Record<string, any>;
	ERRORS: Record<string, any>;
	DATE: Record<string, any>;
	LOCKED: string;
	extra: string;
	i: number;
}

// -------------------------------------------------------------------------------------------------
export const PickerTime = memo((
	{ OBJECT, setOBJECT, REFS, ERRORS, DATE, LOCKED, extra, i }: PickerTimeProps
) => {

	// 1. common ----------------------------------------------------------------------------------
	const { firstStr, secondStr, localLang, localTimeZone } = useCommonValue();
	const { translate } = useStoreLanguage();

	// 2-2. useState ---------------------------------------------------------------------------------
	const [image, setImage] = useState<string>("");
	const [targetStr, setTargetStr] = useState<string>("");
	const [translateStr, setTranslateStr] = useState<string>("");

	// 2-3. useEffect ----------------------------------------------------------------------------
	useEffect(() => {
		// 1. today & calendar
		(firstStr === `today` || firstStr === `calendar`) && (
			extra === `exercise_record_cardio` ? (
				setImage(`exercise4`),
				setTargetStr(`exercise`),
				setTranslateStr(translate(`cardio`))
			)
			: extra === `sleep_record_bedTime` ? (
				setImage(`sleep2`),
				setTargetStr(`sleep`),
				setTranslateStr(translate(`bedTime`))
			)
			: extra === `sleep_record_wakeTime` ? (
				setImage(`sleep3`),
				setTargetStr(`sleep`),
				setTranslateStr(translate(`wakeTime`))
			)
			: extra === `sleep_record_sleepTime` && (
				setImage(`sleep4`),
				setTargetStr(`sleep`),
				setTranslateStr(translate(`sleepTime`))
			)
		);

		// 2. exercise
		firstStr === `exercise` && (
			// 1. exercise - goal 인 경우
			secondStr === `goal` && extra === `exercise_goal_cardio` && (
				setImage(`exercise4`),
				setTargetStr(`exercise`),
				setTranslateStr(
					DATE?.dateType === `day`
					? translate(`goalCardio`)
					: `${translate(`goalCardio`)} (${translate(`total`)})`
				)
			),

			// 4. exercise - goal 아닌 경우
			secondStr !== `goal` && extra === `exercise_record_cardio` && (
				setImage(`exercise4`),
				setTargetStr(`exercise`),
				setTranslateStr(translate(`cardio`))
			)
		);

		// 3. sleep
		firstStr === `sleep` && (
			// 1. sleep - goal 인 경우
			secondStr === `goal` && (
				extra === `sleep_goal_bedTime` ? (
					setImage(`sleep2`),
					setTargetStr(`sleep`),
					setTranslateStr(
						DATE?.dateType === `day`
						? translate(`goalBedTime`)
						: `${translate(`goalBedTime`)} (${translate(`avg`)})`
					)
				)
				: extra === `sleep_goal_wakeTime` ? (
					setImage(`sleep3`),
					setTargetStr(`sleep`),
					setTranslateStr(
						DATE?.dateType === `day`
						? translate(`goalWakeTime`)
						: `${translate(`goalWakeTime`)} (${translate(`avg`)})`
					)
				)
				: extra === `sleep_goal_sleepTime` && (
					setImage(`sleep4`),
					setTargetStr(`sleep`),
					setTranslateStr(
						DATE?.dateType === `day`
						? translate(`goalSleepTime`)
						: `${translate(`goalSleepTime`)} (${translate(`avg`)})`
					)
				)
			),

			// 2. sleep - goal 아닌 경우
			secondStr !== `goal` && (
				extra === `sleep_record_bedTime` ? (
					setImage(`sleep2`),
					setTargetStr(`sleep`),
					setTranslateStr(translate(`bedTime`))
				)
				: extra === `sleep_record_wakeTime` ? (
					setImage(`sleep3`),
					setTargetStr(`sleep`),
					setTranslateStr(translate(`wakeTime`))
				)
				: extra === `sleep_record_sleepTime` && (
					setImage(`sleep4`),
					setTargetStr(`sleep`),
					setTranslateStr(translate(`sleepTime`))
				)
			)
		);
	}, [firstStr, secondStr, extra, DATE, translate]);

	// 4. handle ----------------------------------------------------------------------------------
	const handleTodayChange = useCallback((e: any, closePopup: any) => {
		setOBJECT((prev: any) => ({
			...prev,
			[`today_${targetStr}_section`]: prev?.[`today_${targetStr}_section`]?.map((section: any, idx: number) => (
				idx === i ? {
					...section,
					[`${extra}`]: moment(e).format("HH:mm")
				} : section
			))
		}));
		closePopup();
	}, [setOBJECT, targetStr, i, extra]);

	// 4. handle ----------------------------------------------------------------------------------
	const handleGoalChange = useCallback((e: any, closePopup: any) => {
		setOBJECT((prev: any) => ({
			...prev,
			[`${extra}`]: moment(e).format("HH:mm")
		}));
		closePopup();
	}, [setOBJECT, extra]);

	// 4. handle ----------------------------------------------------------------------------------
	const handleRecordChange = useCallback((e: any, closePopup: any) => {
		setOBJECT((prev: any) => ({
			...prev,
			[`${firstStr}_section`]: prev?.[`${firstStr}_section`]?.map((section: any, idx: number) => (
				idx === i ? {
					...section,
					[`${extra}`]: moment(e).format("HH:mm")
				} : section
			))
		}));
		closePopup();
	}, [setOBJECT, firstStr, i, extra]);

	// 4. memoized values ---------------------------------------------------------------------------
	const imgAdornment = useMemo(() => (
		<Img
			max={14}
			hover={true}
			shadow={false}
			radius={false}
			src={`${image}.webp`}
		/>
	), [image]);

	// 4. memoized values ---------------------------------------------------------------------------
	const digitalClockProps = useMemo(() => ({
		timeStep: 10,
		ampm: false,
		timezone: localTimeZone,
		sx: {
			width: "40vw",
			height: "40vh"
		}
	}), [localTimeZone]);

	// 7. time ---------------------------------------------------------------------------------------
	const timeNode = useMemo(() => {
		// 1. today & calendar
		const todaySection = () => (
			<PopUp
				key={`${firstStr}-${extra}-${i}`}
				type={"innerCenter"}
				position={"center"}
				direction={"center"}
				contents={({ closePopup }: any) => (
					<Grid container={true} spacing={2} className={"w-max-40vw h-max-40vh"}>
						<Grid size={12} className={"d-center"}>
							<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
								<DigitalClock
									{...digitalClockProps}
									value={moment(OBJECT?.[`today_${targetStr}_section`]?.[i]?.[`${extra}`], "HH:mm")}
									onChange={(e: any) => handleTodayChange(e, closePopup)}
								/>
							</LocalizationProvider>
						</Grid>
					</Grid>
				)}
				children={(popTrigger: any) => (
					<Input
						label={translateStr}
						value={OBJECT?.[`today_${targetStr}_section`]?.[i]?.[`${extra}`] || ``}
						inputRef={REFS?.[i]?.[`${extra}`]}
						error={ERRORS?.[i]?.[`${extra}`]}
						readOnly={true}
						locked={LOCKED}
						startadornment={imgAdornment}
						endadornment={translate("hm")}
						onClick={(e: any) => (
							extra !== "sleep_record_sleepTime" &&
							LOCKED === "unlocked" &&
							popTrigger.openPopup(e.currentTarget)
						)}
					/>
				)}
			/>
		);
		// 2. goal
		const goalSection = () => (
			<PopUp
				key={`${firstStr}-${extra}-goal-${i}`}
				type={"innerCenter"}
				position={"center"}
				direction={"center"}
				contents={({ closePopup }: any) => (
					<Grid container={true} spacing={2} className={"w-max-40vw h-max-40vh"}>
						<Grid size={12} className={"d-center"}>
							<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
								<DigitalClock
									{...digitalClockProps}
									value={moment(OBJECT?.[`${extra}`], "HH:mm")}
									onChange={(e: any) => handleGoalChange(e, closePopup)}
								/>
							</LocalizationProvider>
						</Grid>
					</Grid>
				)}
				children={(popTrigger: any) => (
					<Input
						label={translateStr}
						value={OBJECT?.[`${extra}`] || ``}
						inputRef={REFS?.[i]?.[`${extra}`]}
						error={ERRORS?.[i]?.[`${extra}`]}
						readOnly={true}
						locked={LOCKED}
						startadornment={imgAdornment}
						endadornment={translate("hm")}
						onClick={(e: any) => (
							LOCKED === "unlocked" &&
							popTrigger.openPopup(e.currentTarget)
						)}
					/>
				)}
			/>
		);
		// 3. record
		const recordSection = () => (
			<PopUp
				key={`${firstStr}-${extra}-record-${i}`}
				type={"innerCenter"}
				position={"center"}
				direction={"center"}
				contents={({ closePopup }: any) => (
					<Grid container={true} spacing={2} className={"w-max-40vw h-max-40vh"}>
						<Grid size={12} className={"d-center"}>
							<LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={localLang}>
								<DigitalClock
									{...digitalClockProps}
									value={moment(OBJECT?.[`${firstStr}_section`]?.[i]?.[`${extra}`], "HH:mm")}
									onChange={(e: any) => handleRecordChange(e, closePopup)}
								/>
							</LocalizationProvider>
						</Grid>
					</Grid>
				)}
				children={(popTrigger: any) => (
					<Input
						label={translateStr}
						value={OBJECT?.[`${firstStr}_section`]?.[i]?.[`${extra}`] || ``}
						inputRef={REFS?.[i]?.[`${extra}`]}
						error={ERRORS?.[i]?.[`${extra}`]}
						readOnly={true}
						locked={LOCKED}
						startadornment={imgAdornment}
						endadornment={translate("hm")}
						onClick={(e: any) => (
							extra !== "sleep_record_sleepTime" &&
							LOCKED === "unlocked" &&
							popTrigger.openPopup(e.currentTarget)
						)}
					/>
				)}
			/>
		);
		return (
			<>
				{(firstStr === "today" || firstStr === "calendar") && todaySection()}
				{(firstStr !== "today" && firstStr !== "calendar" && secondStr === "goal") && goalSection()}
				{(firstStr !== "today" && firstStr !== "calendar" && secondStr !== "goal") && recordSection()}
			</>
		);
	}, [
		firstStr, secondStr, extra, i, OBJECT, REFS, ERRORS, LOCKED, targetStr, translateStr, imgAdornment, digitalClockProps, localLang, translate, handleTodayChange, handleGoalChange, handleRecordChange
	]);

	// 10. return ------------------------------------------------------------------------------------
	return (
		<>
			{timeNode}
		</>
	);
});