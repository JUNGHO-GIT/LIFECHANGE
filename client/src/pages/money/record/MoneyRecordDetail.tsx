// MoneyRecordDetail.tsx

import { useState, useEffect, useRef, useCallback, useMemo, memo } from "@importReacts";
import { useCommonValue, useCommonDate, useValidateMoney } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { axios } from "@importLibs";
import { fnInsertComma, fnSync } from "@importScripts";
import { MoneyRecord, MoneyRecordType } from "@importSchemas";
import { Footer, Dialog } from "@importLayouts";
import { PickerDay, Memo, Count, Delete, Select, Input } from "@importContainers";
import { Img, Bg, Div, Paper, Grid, Br } from "@importComponents";
import { Checkbox, MenuItem } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const MoneyRecordDetail = memo(() => {

	// 1. common ----------------------------------------------------------------------------------
	const { URL_OBJECT, navigate, sessionId, localCurrency, moneyArray } = useCommonValue();
	const { toList, toSchedule, bgColors } = useCommonValue();
	const { location_from, location_dateStart, location_dateEnd } = useCommonValue();
	const { getDayFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
	const { ERRORS, REFS, validate } = useValidateMoney();
	const { translate } = useStoreLanguage();
	const { setALERT } = useStoreAlert();
	const { setLOADING } = useStoreLoading();

	// 2-2. useState -------------------------------------------------------------------------------
	const [LOCKED, setLOCKED] = useState<string>("unlocked");
	const [OBJECT, setOBJECT] = useState<MoneyRecordType>(MoneyRecord);
	const [EXIST, setEXIST] = useState({
		day: [""],
		week: [""],
		month: [""],
		year: [""],
		select: [""],
	});
	const [FLOW, setFLOW] = useState({
		exist: false,
		itsMe: false,
		itsNew: false,
	});
	const [SEND, setSEND] = useState({
		id: "",
		dateType: "",
		dateStart: "0000-00-00",
		dateEnd: "0000-00-00",
	});
	const [COUNT, setCOUNT] = useState({
		totalCnt: 0,
		sectionCnt: 0,
		newSectionCnt: 0
	});
	const [DATE, setDATE] = useState({
		dateType: "day",
		dateStart: location_dateStart || getDayFmt(),
		dateEnd: location_dateEnd || getDayFmt(),
	});

	// 2-2. useRef ----------------------------------------------------------------------------------
	const countRef = useRef(COUNT);
	const objectRef = useRef(OBJECT);
	const dateRef = useRef(DATE);
	const existTimerRef = useRef<any>(null);
	const detailReqSeqRef = useRef<number>(0);

	// 2-3. useEffect ------------------------------------------------------------------------------
	useEffect(() => {
		COUNT !== countRef.current && (countRef.current = COUNT);
		OBJECT !== objectRef.current && (objectRef.current = OBJECT);
		DATE !== dateRef.current && (dateRef.current = DATE);
	}, [
		COUNT, OBJECT, DATE
	]);

	// 2-3. useMemo ---------------------------------------------------------------------------------
	const partIndexMap = useMemo(() => {
		return new Map<string, number>(moneyArray.map((m: any, idx: number) => [m.money_record_part, idx]));
	}, [moneyArray]);

	// 2-3. useMemo ---------------------------------------------------------------------------------
	const totals = useMemo(() => {
		const acc = (OBJECT?.money_section || []).reduce((acc: any, cur: any) => {
			const amount = Number(cur?.money_record_amount || 0);
			cur?.money_record_part === "income" ? acc.income += amount : cur?.money_record_part === "expense" ? acc.expense += amount : null;
			return acc;
		}, { income: 0, expense: 0 });

		return {
			income: Math.round(acc.income).toString(),
			expense: Math.round(acc.expense).toString()
		};
	}, [OBJECT?.money_section]);

	// 2-3. useMemo ---------------------------------------------------------------------------------
	const defaultSection = useMemo(() => ({
		money_record_part: moneyArray[1]?.money_record_part || "",
		money_record_title: moneyArray[0]?.money_record_title?.[0] || "",
		money_record_amount: "0",
		money_record_content: "",
		money_record_include: "Y",
	}), [moneyArray]);

	// 2-4. useEffect -------------------------------------------------------------------------------
	useEffect(() => {
		if (EXIST?.[DATE.dateType as keyof typeof EXIST]?.length > 0) {
			const dateRange = `${DATE.dateStart.trim()} - ${DATE.dateEnd.trim()}`;
			const objectRange = `${OBJECT.money_record_dateStart.trim()} - ${OBJECT.money_record_dateEnd.trim()}`;

			const isExist = (
				EXIST?.[DATE.dateType as keyof typeof EXIST]?.includes(dateRange)
			);
			const itsMe = (
				dateRange === objectRange
			);
			const itsNew = (
				OBJECT.money_record_dateStart === "0000-00-00" &&
				OBJECT.money_record_dateEnd === "0000-00-00"
			);

			setFLOW((prev) => ({
				...prev,
				exist: isExist,
				itsMe: itsMe,
				itsNew: itsNew
			}));
		}
	}, [EXIST, DATE.dateType, DATE.dateStart, DATE.dateEnd, OBJECT.money_record_dateStart, OBJECT.money_record_dateEnd]);

	// 2-4. useEffect -------------------------------------------------------------------------------
	useEffect(() => {
		if (existTimerRef.current) {
			clearTimeout(existTimerRef.current);
		}

		const controller = new AbortController();

		existTimerRef.current = setTimeout(() => {
			axios.get(`${URL_OBJECT}/record/exist`, {
				params: {
					user_id: sessionId,
					DATE: {
						dateType: "",
						dateStart: getMonthStartFmt(DATE.dateStart),
						dateEnd: getMonthEndFmt(DATE.dateEnd),
					},
				},
				signal: controller.signal
			})
			.then((res: any) => {
				const next = res?.data?.result;
				setEXIST(
					next && typeof next === "object"
						? next
						: {
							day: [""],
							week: [""],
							month: [""],
							year: [""],
							select: [""],
						}
				);
			})
			.catch((err: any) => {
				if (axios.isCancel && axios.isCancel(err)) {
					return;
				}
				if (err?.name === "CanceledError") {
					return;
				}
				setALERT({
					open: true,
					msg: translate(err?.response?.data?.msg),
					severity: "error",
				});
			});
		}, 300);

		return () => {
			controller.abort();
			if (existTimerRef.current) {
				clearTimeout(existTimerRef.current);
			}
		};
	}, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

	// 2-4. useEffect -------------------------------------------------------------------------------
	useEffect(() => {
		setLOADING(true);
		if (LOCKED === "locked") {
			setLOADING(false);
			return;
		}

		const seq = ++detailReqSeqRef.current;
		const controller = new AbortController();

		axios.get(`${URL_OBJECT}/record/detail`, {
			params: {
				user_id: sessionId,
				DATE: DATE,
			},
			signal: controller.signal
		})
		.then((res: any) => {
			if (seq !== detailReqSeqRef.current) {
				return;
			}

			const data = res?.data || {};
			const next = data?.result || MoneyRecord;

			// sectionCnt가 0이면 section 초기화
			if ((data.sectionCnt || 0) <= 0) {
				setOBJECT((prev) => ({
					...prev,
					...next,
					money_section: []
				}));
			}
			// sectionCnt가 0이 아니면 section 내부 재정렬
			else {
				const sorted = (next.money_section || []).slice().sort((a: any, b: any) => {
					const ai = partIndexMap.get(a?.money_record_part) ?? 9999;
					const bi = partIndexMap.get(b?.money_record_part) ?? 9999;
					return ai - bi;
				});

				setOBJECT((prev) => ({
					...prev,
					...next,
					money_section: sorted
				}));
			}

			setCOUNT((prev) => ({
				...prev,
				totalCnt: data.totalCnt || 0,
				sectionCnt: data.sectionCnt || 0,
				newSectionCnt: data.sectionCnt || 0
			}));
		})
		.catch((err: any) => {
			if (axios.isCancel && axios.isCancel(err)) {
				return;
			}
			if (err?.name === "CanceledError") {
				return;
			}
			setALERT({
				open: true,
				msg: translate(err?.response?.data?.msg),
				severity: "error",
			});
			console.error(err);
		})
		.finally(() => {
			setLOADING(false);
		});

		return () => {
			controller.abort();
		};
	}, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

	// 2-4. useEffect -------------------------------------------------------------------------------
	useEffect(() => {
		setOBJECT((prev) => {
			const cur = prev?.money_section || [];
			const nextLen = COUNT?.newSectionCnt || 0;

			if (cur.length === nextLen) {
				return prev;
			}

			const filled = Array.from({ length: nextLen }, (_: any, idx: number) => (
				idx < cur.length ? cur[idx] : { ...defaultSection }
			));

			// 내용이 동일하면 갱신 불필요
			let same = cur.length === filled.length;
			same &&= cur.every((v: any, i: number) => v === filled[i]);
			return same ? prev : { ...prev, money_section: filled };
		});
	}, [COUNT?.newSectionCnt, defaultSection]);

	// 3. flow ------------------------------------------------------------------------------------
	const flowSave = useCallback(async (type: string) => {
		setLOADING(true);

		const ok = await validate(OBJECT, COUNT, "record");
		if (!ok) {
			setLOADING(false);
			return;
		}

		axios({
			method: type === "create" ? "post" : "put",
			url: type === "create" ? `${URL_OBJECT}/record/create` : `${URL_OBJECT}/record/update`,
			data: {
				user_id: sessionId,
				OBJECT: OBJECT,
				DATE: DATE,
				type: type,
			}
		})
		.then((res: any) => {
			if (res.data.status === "success") {
				setALERT({
					open: true,
					msg: translate(res.data.msg),
					severity: "success",
				});

				navigate(
					location_from === "schedule" ? toSchedule : toList,
					{
						state: {
							dateType: "",
							dateStart: DATE.dateStart,
							dateEnd: DATE.dateEnd
						}
					}
				);

				fnSync("property");
			}
			else {
				setALERT({
					open: true,
					msg: translate(res.data.msg),
					severity: "error",
				});
			}
		})
		.catch((err: any) => {
			setALERT({
				open: true,
				msg: translate(err?.response?.data?.msg),
				severity: "error",
			});
			console.error(err);
		})
		.finally(() => {
			setLOADING(false);
		});
	}, [OBJECT, COUNT, DATE, URL_OBJECT, sessionId, validate, setLOADING, setALERT, translate, navigate, location_from, toSchedule, toList]);

	// 3. flow ------------------------------------------------------------------------------------
	const flowDelete = useCallback(async () => {
		setLOADING(true);

		const ok = await validate(OBJECT, COUNT, "delete");
		if (!ok) {
			setLOADING(false);
			return;
		}

		axios.delete(`${URL_OBJECT}/record/delete`, {
			data: {
				user_id: sessionId,
				DATE: DATE,
			}
		})
		.then((res: any) => {
			if (res.data.status === "success") {
				setALERT({
					open: true,
					msg: translate(res.data.msg),
					severity: "success",
				});

				navigate(
					location_from === "schedule" ? toSchedule : toList,
					{
						state: {
							dateType: "",
							dateStart: DATE.dateStart,
							dateEnd: DATE.dateEnd
						}
					}
				);

				fnSync("property");
			}
			else {
				setALERT({
					open: true,
					msg: translate(res.data.msg),
					severity: "error",
				});
			}
		})
		.catch((err: any) => {
			setALERT({
				open: true,
				msg: translate(err?.response?.data?.msg),
				severity: "error",
			});
			console.error(err);
		})
		.finally(() => {
			setLOADING(false);
		});
	}, [OBJECT, COUNT, DATE, URL_OBJECT, sessionId, validate, setLOADING, setALERT, translate, navigate, location_from, toSchedule, toList]);

	// 4-3. handle --------------------------------------------------------------------------------
	const handleDelete = useCallback((index: number) => {
		setOBJECT((prev) => ({
			...prev,
			money_section: (prev.money_section || []).filter((_item: any, idx: number) => (idx !== index))
		}));
		setCOUNT((prev) => ({
			...prev,
			newSectionCnt: prev.newSectionCnt - 1,
		}));
	}, []);

	// 7. detail ----------------------------------------------------------------------------------
	const detailNode = () => {
		// 7-1. date + count
		const dateCountSection = () => (
			<Grid container={true} spacing={2} className={`radius-2 border-1 shadow-0 p-20px`}>
				<Grid size={12}>
					<PickerDay
						DATE={DATE}
						setDATE={setDATE}
						EXIST={EXIST}
					/>
				</Grid>
				<Grid size={12}>
					<Count
						COUNT={COUNT}
						setCOUNT={setCOUNT}
						LOCKED={LOCKED}
						setLOCKED={setLOCKED}
						limit={10}
					/>
				</Grid>
			</Grid>
		);
		// 7-2. total
		const totalSection = () => (
			<Grid container={true} spacing={2} className={`radius-2 border-1 shadow-0 p-20px`}>
				{/** row 1 **/}
				<Grid container={true} spacing={1}>
					<Grid size={12}>
						<Input
							locked={LOCKED}
							readOnly={true}
							label={translate("totalIncome")}
							value={fnInsertComma(totals.income || "0")}
							startadornment={
								<Img
									max={14}
									hover={true}
									shadow={false}
									radius={false}
									src={"money2.webp"}
								/>
							}
							endadornment={
								localCurrency
							}
						/>
					</Grid>
				</Grid>
				{/** /.row 1 **/}

				{/** row 2 **/}
				<Grid container={true} spacing={1}>
					<Grid size={12}>
						<Input
							locked={LOCKED}
							readOnly={true}
							label={translate("totalExpense")}
							value={fnInsertComma(totals.expense || "0")}
							startadornment={
								<Img
									max={14}
									hover={true}
									shadow={false}
									radius={false}
									src={"money2.webp"}
								/>
							}
							endadornment={
								localCurrency
							}
						/>
					</Grid>
				</Grid>
			</Grid>
		);
		// 7-3. detail
		const detailSection = () => (
			<Grid container={true} spacing={0} className={`border-0 radius-2 shadow-0`}>
				{OBJECT.money_section?.map((item, i) => {
					// money_record_title을 위한 현재 part의 데이터를 찾기
					const currentPartData = moneyArray.find((f: any) => f.money_record_part === item?.money_record_part);
					const partIndex = moneyArray.findIndex((f: any) => f.money_record_part === item?.money_record_part);

					return (
						<Grid container spacing={2} key={`detail-${i}`}
						className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-2 p-20px`}>
							{/** row 1 **/}
							<Grid container={true} spacing={1}>
								<Grid size={6} className={"d-row-left"}>
									<Bg
										badgeContent={i + 1}
										bgcolor={bgColors?.[partIndexMap.get(item?.money_record_part) ?? 0]}
									/>
								</Grid>
								<Grid size={6} className={"d-row-right"}>
									<Delete
										index={i}
										handleDelete={handleDelete}
										LOCKED={LOCKED}
									/>
								</Grid>
							</Grid>
							{/** /.row 1 **/}

							{/** row 2 **/}
							<Grid container={true} spacing={1}>
								<Grid size={6}>
									<Select
										locked={LOCKED}
										label={translate("part")}
										value={item?.money_record_part || ""}
										inputRef={REFS?.[i]?.money_record_part}
										error={ERRORS?.[i]?.money_record_part}
										onChange={(e: any) => {
											let value = String(e.target.value || "");
											const targetPartData = moneyArray.find((f: any) => f.money_record_part === value);
											setOBJECT((prev) => ({
												...prev,
												money_section: prev.money_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														money_record_part: value,
														money_record_title: targetPartData?.money_record_title?.[0] || "",
													} : section
												))
											}));
										}
									}>
										{moneyArray.map((part: any, idx: number) => (
											<MenuItem
												key={idx}
												value={part.money_record_part}
												className={"fs-0-8rem"}
											>
												{translate(part.money_record_part)}
											</MenuItem>
										))}
									</Select>
								</Grid>
								<Grid size={6}>
									<Select
										locked={LOCKED}
										label={translate("title")}
										value={item?.money_record_title || ""}
										inputRef={REFS?.[i]?.money_record_title}
										error={ERRORS?.[i]?.money_record_title}
										onChange={(e: any) => {
											let value = String(e.target.value || "");
											setOBJECT((prev) => ({
												...prev,
												money_section: prev.money_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														money_record_title: value,
													} : section
												))
											}));
										}}
									>
										{(currentPartData?.money_record_title || []).map((title: any, idx: number) => (
											<MenuItem
												key={idx}
												value={title}
												className={"fs-0-8rem"}
											>
												{translate(title)}
											</MenuItem>
										))}
									</Select>
								</Grid>
							</Grid>
							{/** /.row 2 **/}

							{/** row 3 **/}
							<Grid container={true} spacing={1}>
								<Grid size={12}>
									<Input
										locked={LOCKED}
										label={translate("amount")}
										value={fnInsertComma(item?.money_record_amount || "0")}
										inputRef={REFS?.[i]?.money_record_amount}
										error={ERRORS?.[i]?.money_record_amount}
										startadornment={
											<Img
												max={14}
												hover={true}
												shadow={false}
												radius={false}
												src={"money2.webp"}
											/>
										}
										endadornment={
											localCurrency
										}
										onChange={(e: any) => {
											let value = (e.target?.value === "" ? "0" : String(e.target.value).replace(/,/g, ""));
											if (Number(value) > 999999999 || !/^\d+$/.test(value)) {
												return;
											}
											if (/^0(?!\.)/.test(value)) {
												value = value.replace(/^0+/, "");
												value = value === "" ? "0" : value;
											}
											setOBJECT((prev) => ({
												...prev,
												money_section: prev.money_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														money_record_amount: value,
													} : section
												))
											}));
										}}
									/>
								</Grid>
							</Grid>
							{/** /.row 3 **/}

							{/** row 4 **/}
							<Grid container={true} spacing={1}>
								<Grid size={{ xs: 7, sm: 8 }} className={"d-center"}>
									<Memo
										OBJECT={OBJECT}
										setOBJECT={setOBJECT}
										LOCKED={LOCKED}
										extra={"money_record_content"}
										i={i}
									/>
								</Grid>
								<Grid size={{ xs: 5, sm: 4 }} className={"d-center"}>
									<Div className={"fs-0-7rem fw-500 dark ml-10px"}>
										{translate("includeProperty")}
									</Div>
									<Checkbox
										size={"small"}
										className={"p-0px ml-5px"}
										checked={item?.money_record_include === "Y"}
										disabled={LOCKED === "locked"}
										onChange={(e: any) => {
											setOBJECT((prev) => ({
												...prev,
												money_section: prev.money_section?.map((section: any, idx: number) => (
													idx === i ? {
														...section,
														money_record_include: e.target.checked ? "Y" : "N",
													} : section
												)),
											}));
										}}
									/>
								</Grid>
							</Grid>
							{/** /.row 4 **/}
						</Grid>
					);
				})}
			</Grid>
		);
		// 7-10. return
		return (
			<Paper className={"content-wrapper radius-2 border-1 shadow-1 h-min-75vh"}>
				{dateCountSection()}
				<Br m={20} />
				{totalSection()}
				<Br m={20} />
				{COUNT?.newSectionCnt > 0 && detailSection()}
			</Paper>
		);
	};

	// 8. dialog ----------------------------------------------------------------------------------
	const dialogNode = () => (
		<Dialog
			COUNT={COUNT}
			setCOUNT={setCOUNT}
			LOCKED={LOCKED}
			setLOCKED={setLOCKED}
		/>
	);

	// 9. footer ----------------------------------------------------------------------------------
	const footerNode = () => (
		<Footer
			state={{
				DATE, SEND, COUNT, EXIST, FLOW,
			}}
			setState={{
				setDATE, setSEND, setCOUNT, setEXIST, setFLOW,
			}}
			flow={{
				flowSave, flowDelete
			}}
		/>
	);

	// 10. return ----------------------------------------------------------------------------------
	return (
		<>
			{detailNode()}
			{dialogNode()}
			{footerNode()}
		</>
	);
});