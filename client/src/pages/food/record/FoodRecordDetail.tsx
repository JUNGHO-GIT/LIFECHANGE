/**
 * @file FoodRecordDetail.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Bg, Br, Div, Grid, Icons, Img, Paper } from "@exportComponents";
import { Count, Delete, Input, PickerDay, Select } from "@exportContainers";
import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal, useValidateFood as usValFd } from "@exportHooks";
import { Dialog, Footer } from "@exportLayouts";
import { axios } from "@exportLibs";
import { MenuItem } from "@exportMuis";
import {
	memo,
	type React,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "@exportReacts";
import { FoodRecord, type FoodRecordType as FdRecTyp } from "@exportSchemas";
import {
	handleNumberInput as hndlNmbrInpt,
	insertComma,
	setSession,
	sync,
} from "@exportScripts";
import {
	useStoreAlert as usStrAlrt,
	useStoreLanguage as usStrLang,
	useStoreLoading as usStrLoad,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const FdRecDtl = memo(() => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { URL_OBJECT, navigate, toList, sessionId } = usCmmnVal();
	const { foodArray, bgColors, sessionFoodSection: sessFdSec } = usCmmnVal();
	const { location_dateStart: locDtStrt, location_dateEnd: locDtEnd } = usCmmnVal();
	const { getDayFmt, getMonthStartFmt: gtMnStFm, getMonthEndFmt: gtMnthEndFmt } = usCmmnDt();
	const { ERRORS, REFS, validate } = usValFd();
	const { translate } = usStrLang();
	const { setALERT } = usStrAlrt();
	const { setLOADING } = usStrLoad();

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const [LOCKED, setLOCKED] = useState<string>(`unlocked`);
	const [OBJECT, setOBJECT] = useState<FdRecTyp>(FoodRecord);
	const [FAVORITE, setFAVORITE] = useState([]);
	const [EXIST, setEXIST] = useState({
		day: [``],
		week: [``],
		month: [``],
		year: [``],
		select: [``],
	});
	const [FLOW, setFLOW] = useState({
		theme: `food`,
		exist: false,
		itsMe: false,
		itsNew: false,
	});
	const [SEND, setSEND] = useState({
		id: ``,
		dateType: ``,
		dateStart: `0000-00-00`,
		dateEnd: `0000-00-00`,
	});
	const [COUNT, setCOUNT] = useState({
		totalCnt: 0,
		sectionCnt: 0,
		newSectionCnt: 0,
	});
	const [DATE, setDATE] = useState({
		dateType: `day`,
		dateStart: locDtStrt ?? getDayFmt(),
		dateEnd: locDtEnd ?? getDayFmt(),
	});

	// 2-3. useRef ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const objectRef: React.RefObject<FdRecTyp> = useRef(OBJECT);
	const countRef: React.RefObject<{
		totalCnt: number;
		sectionCnt: number;
		newSectionCnt: number;
	}> = useRef(COUNT);
	const dateRef: React.RefObject<{
		dateType: string;
		dateStart: string;
		dateEnd: string;
	}> = useRef(DATE);

	// 2-3. useEffect ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	useEffect(() => {
		COUNT !== countRef.current && (countRef.current = COUNT);
		OBJECT !== objectRef.current && (objectRef.current = OBJECT);
		DATE !== dateRef.current && (dateRef.current = DATE);
	}, [COUNT, OBJECT, DATE]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		if (EXIST?.[DATE?.dateType as keyof typeof EXIST]?.length > 0) {
			const dateRange: string = `${DATE?.dateStart.trim()} - ${DATE?.dateEnd.trim()}`;
			const objectRange: string = `${OBJECT.food_record_dateStart.trim()} - ${OBJECT.food_record_dateEnd.trim()}`;
			const isExist: boolean =
				EXIST?.[DATE?.dateType as keyof typeof EXIST]?.includes(dateRange);
			const itsMe: boolean = dateRange === objectRange;
			const itsNew: boolean =
				OBJECT.food_record_dateStart === `0000-00-00` &&
				OBJECT.food_record_dateEnd === `0000-00-00`;

			setFLOW((prev) => ({
				...prev,
				exist: isExist,
				itsMe: itsMe,
				itsNew: itsNew,
			}));
		}
	}, [EXIST, DATE?.dateEnd, OBJECT.food_record_dateEnd]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		axios
			.get(`${URL_OBJECT}/record/exist`, {
				params: {
					user_id: sessionId,
					DATE: {
						dateType: ``,
						dateStart: gtMnStFm(DATE?.dateStart),
						dateEnd: gtMnthEndFmt(DATE?.dateEnd),
					},
				},
			})
			.then((res: any) => {
				setEXIST(
					!res.data.result || res.data.result?.length === 0
						? [``]
						: res.data.result,
				);
			})
			.catch((error: any) => {
				setALERT({
					open: true,
					msg: translate(error.response.data.msg as string),
					severity: `error`,
				});
			});
	}, [URL_OBJECT, sessionId, DATE?.dateStart, DATE?.dateEnd]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		axios
			.get(`${URL_OBJECT}/favorite/list`, {
				params: {
					user_id: sessionId,
				},
			})
			.then((res: any) => {
				setFAVORITE(
					!res.data.result || res.data.result?.length === 0
						? [``]
						: res.data.result,
				);
			})
			.catch((error: any) => {
				setALERT({
					open: true,
					msg: translate(error.response.data.msg as string),
					severity: `error`,
				});
			});
	}, [URL_OBJECT, sessionId]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		setLOADING(true);
		if (LOCKED === `locked`) {
			setLOADING(false);
			return;
		}
		axios
			.get(`${URL_OBJECT}/record/detail`, {
				params: {
					user_id: sessionId,
					DATE: DATE,
				},
			})
			.then((res: any) => {
				setLOADING(false);
				setOBJECT(res.data.result ?? FoodRecord);

				res.data.sectionCnt <= 0 &&
					setOBJECT((prev) => ({
						...prev,
						food_section: [],
					}));

				res.data.sectionCnt > 0 &&
					setOBJECT((prev) => ({
						...prev,
						food_section: prev.food_section?.sort(
							(a: any, b: any) =>
								foodArray.findIndex(
									(item: any) => item.food_record_part === a.food_record_part,
								) -
								foodArray.findIndex(
									(item: any) => item.food_record_part === b.food_record_part,
								),
						),
					}));

				setCOUNT((prev) => ({
					...prev,
					totalCnt: res.data.totalCnt ?? 0,
					sectionCnt: res.data.sectionCnt ?? 0,
					newSectionCnt: res.data.sectionCnt ?? 0,
				}));

				const sectionArray: typeof sessFdSec =
					sessFdSec?.length > 0 ? sessFdSec : [];

				setOBJECT((prev) => ({
					...prev,
					food_section: prev?.food_section
						? [
								...[...prev.food_section]?.sort(
									(a, b) =>
										Number.parseInt(a.food_record_part) -
										Number.parseInt(b.food_record_part),
								),
								...sectionArray,
							]
						: [...sectionArray],
				}));

				setCOUNT((prev) => ({
					...prev,
					newSectionCnt: prev?.newSectionCnt + sectionArray?.length,
				}));
			})
			.catch((error: any) => {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(error.response.data.msg as string),
					severity: `error`,
				});
			})
			.finally(() => {
				setLOADING(false);
			});
	}, [URL_OBJECT, sessionId, DATE?.dateStart, DATE?.dateEnd]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		const totals = OBJECT?.food_section.reduce(
			(acc: any, cur: any) => {
				return {
					totalKcal: Number(acc.totalKcal) + Number(cur.food_record_kcal),
					totalFat: Number(acc.totalFat) + Number(cur.food_record_fat),
					totalCarb: Number(acc.totalCarb) + Number(cur.food_record_carb),
					totalProtein:
						Number(acc.totalProtein) + Number(cur.food_record_protein),
				};
			},
			{
				totalKcal: 0,
				totalFat: 0,
				totalCarb: 0,
				totalProtein: 0,
			},
		);

		setOBJECT((prev) => ({
			...prev,
			food_record_total_kcal: Number(totals.totalKcal).toString(),
			food_record_total_fat: Number(totals.totalFat.toFixed(1)).toString(),
			food_record_total_carb: Number(totals.totalCarb.toFixed(1)).toString(),
			food_record_total_protein: Number(
				totals.totalProtein.toFixed(1),
			).toString(),
		}));
	}, [OBJECT?.food_section]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		const defSec = {
			food_record_part: foodArray[1]?.food_record_part ?? ``,
			food_record_key: ``,
			food_record_name: ``,
			food_record_brand: ``,
			food_record_count: `1`,
			food_record_serv: `serv`,
			food_record_gram: `0`,
			food_record_kcal: `0`,
			food_record_fat: `0`,
			food_record_carb: `0`,
			food_record_protein: `0`,
		};
		const updtSec = Array.from({ length: COUNT?.newSectionCnt })
			.fill(null)
			.map((_item: any, idx: number) => {
				return idx < OBJECT?.food_section?.length
					? OBJECT?.food_section[idx]
					: defSec;
			});
		setOBJECT((prev) => ({
			...prev,
			food_section: updtSec,
		}));
	}, [COUNT?.newSectionCnt]);

	// 3. flow ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const flowSave = async (type: string) => {
		setLOADING(true);
		if (!(await validate(objectRef.current, countRef.current, `record`))) {
			setLOADING(false);
			return;
		}
		axios({
			method: type === `create` ? `post` : `put`,
			url:
				type === `create`
					? `${URL_OBJECT}/record/create`
					: `${URL_OBJECT}/record/update`,
			data: {
				user_id: sessionId,
				OBJECT: objectRef.current,
				DATE: dateRef.current,
				type: type,
			},
		})
			.then((res: any) => {
				if (res.data.status === `success`) {
					setLOADING(false);
					setALERT({
						open: true,
						msg: translate(res.data.msg as string),
						severity: `success`,
					});
					void navigate(toList, {
						state: {
							dateType: ``,
							dateStart: dateRef.current.dateStart,
							dateEnd: dateRef.current.dateEnd,
						},
					});
					void sync(`nutrition`);
				} else {
					setLOADING(false);
					setALERT({
						open: true,
						msg: translate(res.data.msg as string),
						severity: `error`,
					});
				}
			})
			.catch((error: any) => {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(error.response.data.msg as string),
					severity: `error`,
				});
				console.error(error);
			})
			.finally(() => {
				setLOADING(false);
			});
	};

	// 3. flow ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const flowDelete = async () => {
		setLOADING(true);
		if (!(await validate(objectRef.current, countRef.current, `delete`))) {
			setLOADING(false);
			return;
		}
		axios({
			method: `delete`,
			url: `${URL_OBJECT}/record/delete`,
			data: {
				user_id: sessionId,
				DATE: dateRef.current,
			},
		})
			.then((res: any) => {
				if (res.data.status === `success`) {
					setLOADING(false);
					setALERT({
						open: true,
						msg: translate(res.data.msg as string),
						severity: `success`,
					});
					void navigate(toList, {
						state: {
							dateType: ``,
							dateStart: dateRef.current.dateStart,
							dateEnd: dateRef.current.dateEnd,
						},
					});
					void sync(`nutrition`);
				} else {
					setLOADING(false);
					setALERT({
						open: true,
						msg: translate(res.data.msg as string),
						severity: `error`,
					});
				}
			})
			.catch((error: any) => {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(error.response.data.msg as string),
					severity: `error`,
				});
				console.error(error);
			})
			.finally(() => {
				setLOADING(false);
			});
	};

	// 3. flow ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const flwUpdtFav = useCallback(
		(foodFavorite: any) => {
			(!foodFavorite.food_record_name ||
				foodFavorite.food_record_name.trim() === ``) &&
				(() => {
					setALERT({
						open: true,
						msg: translate(`음식 이름을 입력해주세요.`),
						severity: `error`,
					});
					return;
				})();

			axios
				.put(`${URL_OBJECT}/favorite/update`, {
					user_id: sessionId,
					foodFavorite: foodFavorite,
				})
				.then((res: any) => {
					res.data.status === `success` &&
						(() => {
							setFAVORITE(res.data.result);
							void sync(`favorite`);
						})();
					res.data.status !== `success` &&
						(() => {
							setLOADING(false);
							setALERT({
								open: true,
								msg: translate(res.data.msg as string),
								severity: `error`,
							});
						})();
				})
				.catch((error: any) => {
					setLOADING(false);
					setALERT({
						open: true,
						msg: translate(error.response.data.msg as string),
						severity: `error`,
					});
					console.error(error);
				})
				.finally(() => {
					setLOADING(false);
				});
		},
		[URL_OBJECT, sessionId, setLOADING, setALERT, translate],
	);

	// 4-3. handle ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const handleDelete = useCallback(
		(index: number) => {
			let sectionArray: typeof sessFdSec = [];
			const section: any = sessFdSec;
			section ? (sectionArray = section) : (sectionArray = []);
			sectionArray.splice(index, 1);
			setSession(`section`, `food`, ``, sectionArray);

			setOBJECT((prev) => ({
				...prev,
				food_section: prev?.food_section?.filter(
					(_item: any, idx: number) => idx !== index,
				),
			}));
			setCOUNT((prev) => ({
				...prev,
				newSectionCnt: prev?.newSectionCnt - 1,
			}));
		},
		[sessFdSec],
	);

	// 4-5. handle (favorite 추가) ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const hndlFdFav = useCallback(
		(index: number) => {
			const fdRecNm: string =
				OBJECT?.food_section[index]?.food_record_name;
			const fdRecBrnd: string =
				OBJECT?.food_section[index]?.food_record_brand;
			const fdRecGrm: string =
				OBJECT?.food_section[index]?.food_record_gram;
			const fdRecSrv: string =
				OBJECT?.food_section[index]?.food_record_serv;
			const fdRecCnt: string =
				OBJECT?.food_section[index]?.food_record_count ?? `1`;

			const fdRecKcl: string = (
				Number.parseFloat(OBJECT?.food_section[index]?.food_record_kcal) /
				Number.parseFloat(fdRecCnt)
			).toFixed(0);
			const fdRecCrb: string = (
				Number.parseFloat(OBJECT?.food_section[index]?.food_record_carb) /
				Number.parseFloat(fdRecCnt)
			).toFixed(1);
			const fdRecPrtn: string = (
				Number.parseFloat(OBJECT?.food_section[index]?.food_record_protein) /
				Number.parseFloat(fdRecCnt)
			).toFixed(1);
			const fdRecFt: string = (
				Number.parseFloat(OBJECT?.food_section[index]?.food_record_fat) /
				Number.parseFloat(fdRecCnt)
			).toFixed(1);
			const fdRecKy: string = `${fdRecNm}_${fdRecBrnd}_${fdRecKcl}_${fdRecCrb}_${fdRecPrtn}_${fdRecFt}`;

			return {
				food_record_key: fdRecKy,
				food_record_name: fdRecNm,
				food_record_brand: fdRecBrnd,
				food_record_gram: fdRecGrm,
				food_record_serv: fdRecSrv,
				food_record_count: `1`,
				food_record_kcal: fdRecKcl,
				food_record_carb: fdRecCrb,
				food_record_protein: fdRecPrtn,
				food_record_fat: fdRecFt,
			};
		},
		[OBJECT],
	);

	// 7. detail ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const detailNode = () => {
		// 7-1. date + count
		const dtCntSec = () => (
			<Grid
				container={true}
				spacing={2}
				className={`radius-2 border-1 shadow-1 p-20px`}
			>
				<Grid size={12}>
					<PickerDay DATE={DATE} setDATE={setDATE} EXIST={EXIST} />
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
			<Grid
				container={true}
				spacing={2}
				className={`radius-2 border-1 shadow-1 p-20px`}
			>
				{/** row 1 * */}
				<Grid container={true} spacing={1}>
					<Grid size={6}>
						<Input
							locked={LOCKED}
							readOnly={true}
							label={translate(`totalKcal`)}
							value={insertComma(OBJECT?.food_record_total_kcal ?? `0`)}
							startadornment={
								<Img
									max={14}
									hover={true}
									shadow={false}
									radius={false}
									src={`food2.webp`}
								/>
							}
							endadornment={translate(`kc`)}
						/>
					</Grid>
					<Grid size={6}>
						<Input
							locked={LOCKED}
							readOnly={true}
							label={translate(`totalCarb`)}
							value={insertComma(OBJECT?.food_record_total_carb ?? `0`)}
							startadornment={
								<Img
									max={14}
									hover={true}
									shadow={false}
									radius={false}
									src={`food3.webp`}
								/>
							}
							endadornment={translate(`g`)}
						/>
					</Grid>
				</Grid>

				{/** row 2 * */}
				<Grid container={true} spacing={1}>
					<Grid size={6}>
						<Input
							locked={LOCKED}
							readOnly={true}
							label={translate(`totalProtein`)}
							value={insertComma(OBJECT?.food_record_total_protein ?? `0`)}
							startadornment={
								<Img
									max={14}
									hover={true}
									shadow={false}
									radius={false}
									src={`food4.webp`}
								/>
							}
							endadornment={translate(`g`)}
						/>
					</Grid>
					<Grid size={6}>
						<Input
							locked={LOCKED}
							readOnly={true}
							label={translate(`totalFat`)}
							value={insertComma(OBJECT?.food_record_total_fat ?? `0`)}
							startadornment={
								<Img
									max={14}
									hover={true}
									shadow={false}
									radius={false}
									src={`food5.webp`}
								/>
							}
							endadornment={translate(`g`)}
						/>
					</Grid>
				</Grid>
			</Grid>
		);
		// 7-3. detail
		const dtlSec = () => (
			<>
				{OBJECT.food_section?.map((item, i) => (
					<Grid
						container={true}
						spacing={2}
						key={`detail-${i}`}
						className={`${LOCKED === `locked` ? `locked` : ``} radius-2 border-1 shadow-1 p-20px`}
					>
						{/** row 1 * */}
						<Grid container={true} spacing={1}>
							<Grid size={6} className={`d-row-left`}>
								<Bg
									badgeContent={i + 1}
									bgcolor={
										bgColors?.[
											foodArray.findIndex(
												(f: any) =>
													f.food_record_part === item?.food_record_part,
											)
										]
									}
								/>
								<Div className={`mt-n10px ml-15px`}>
									<Icons
										key={`Star`}
										name={`Star`}
										className={`w-20px h-20px`}
										color={`darkslategrey`}
										fill={
											FAVORITE?.length > 0 &&
											FAVORITE.some(
												(item: any) =>
													item.food_record_key ===
													hndlFdFav(i).food_record_key,
											)
												? `gold`
												: `white`
										}
										onClick={(e: any) => {
											e.stopPropagation();
											flwUpdtFav(hndlFdFav(i));
										}}
									/>
								</Div>
							</Grid>
							<Grid size={6} className={`d-row-right`}>
								<Delete index={i} handleDelete={handleDelete} LOCKED={LOCKED} />
							</Grid>
						</Grid>

						{/** row 2 * */}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Select
									locked={LOCKED}
									label={translate(`part`)}
									value={item?.food_record_part ?? ``}
									inputRef={REFS?.[i]?.food_record_part}
									error={ERRORS?.[i]?.food_record_part}
									onChange={(e: any) => {
										const value: string = String(e.target.value ?? ``);
										setOBJECT((prev: any) => ({
											...prev,
											food_section: prev.food_section?.map(
												(section: any, idx: number) =>
													idx === i
														? {
																...section,
																food_record_part: value,
															}
														: section,
											),
										}));
									}}
								>
									{foodArray.map((part: any, idx: number) => (
										<MenuItem
											key={idx}
											value={part.food_record_part}
											className={`fs-0-8rem`}
										>
											{translate(part.food_record_part as string)}
										</MenuItem>
									))}
								</Select>
							</Grid>
							<Grid size={3}>
								<Input
									locked={LOCKED}
									label={translate(`foodCount`)}
									value={insertComma(item?.food_record_count ?? `0`)}
									inputRef={REFS?.[i]?.food_record_count}
									error={ERRORS?.[i]?.food_record_count}
									onChange={(e: any) => {
										const procdVal: string | null = hndlNmbrInpt(
											e.target.value,
											99,
											1,
										);
										if (procdVal === null) {
											return;
										}
										// 영양소 설정 함수
										const setNutrient = (
											nut: string | number,
											extra: string,
										) => {
											const numericValue: number = Number(procdVal) ?? 1;
											const foodCount: number =
												Number(item?.food_record_count) ?? 1;
											if (
												!Number.isNaN(numericValue) &&
												!Number.isNaN(foodCount)
											) {
												return extra === `kcal`
													? ((numericValue * Number(nut)) / foodCount).toFixed(
															0,
														)
													: ((numericValue * Number(nut)) / foodCount).toFixed(
															1,
														);
											}
											return nut;
										};
										// object 설정
										setOBJECT((prev: any) => ({
											...prev,
											food_section: prev.food_section?.map(
												(section: any, idx: number) =>
													idx === i
														? {
																...section,
																food_record_count: procdVal,
																food_record_kcal: setNutrient(
																	item?.food_record_kcal,
																	`kcal`,
																),
																food_record_fat: setNutrient(
																	item?.food_record_fat,
																	`fat`,
																),
																food_record_carb: setNutrient(
																	item?.food_record_carb,
																	`carb`,
																),
																food_record_protein: setNutrient(
																	item?.food_record_protein,
																	`protein`,
																),
															}
														: section,
											),
										}));
									}}
								/>
							</Grid>
							<Grid size={3}>
								<Input
									locked={LOCKED}
									label={translate(`gram`)}
									value={insertComma(item?.food_record_gram ?? `0`)}
									inputRef={REFS?.[i]?.food_record_gram}
									error={ERRORS?.[i]?.food_record_gram}
									onChange={(e: any) => {
										const procdVal: string | null = hndlNmbrInpt(
											e.target.value,
											999,
										);
										if (procdVal === null) {
											return;
										}
										// object 설정
										setOBJECT((prev: any) => ({
											...prev,
											food_section: prev.food_section?.map(
												(section: any, idx: number) =>
													idx === i
														? {
																...section,
																food_record_gram: procdVal,
															}
														: section,
											),
										}));
									}}
								/>
							</Grid>
						</Grid>

						{/** row 3 * */}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									shrink={`shrink`}
									label={translate(`foodName`)}
									value={item?.food_record_name ?? ``}
									inputRef={REFS?.[i]?.food_record_name}
									error={ERRORS?.[i]?.food_record_name}
									onChange={(e: any) => {
										// 빈값 처리
										const value: string = e.target.value ?? ``;
										// 30 제한
										if (value?.length > 30) {
											return;
										}
										// object 설정
										setOBJECT((prev: any) => ({
											...prev,
											food_section: prev.food_section?.map(
												(section: any, idx: number) =>
													idx === i
														? {
																...section,
																food_record_name: value,
															}
														: section,
											),
										}));
									}}
								/>
							</Grid>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									shrink={`shrink`}
									label={translate(`brand`)}
									value={item?.food_record_brand ?? ``}
									inputRef={REFS?.[i]?.food_record_brand}
									error={ERRORS?.[i]?.food_record_brand}
									onChange={(e: any) => {
										// 빈값 처리
										const value: string = e.target.value ?? ``;
										// 30 제한
										if (value?.length > 30) {
											return;
										}
										// object 설정
										setOBJECT((prev: any) => ({
											...prev,
											food_section: prev.food_section?.map(
												(section: any, idx: number) =>
													idx === i
														? {
																...section,
																food_record_brand: value,
															}
														: section,
											),
										}));
									}}
								/>
							</Grid>
						</Grid>

						{/** row 4 * */}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`kcal`)}
									value={insertComma(item?.food_record_kcal ?? `0`)}
									inputRef={REFS?.[i]?.food_record_kcal}
									error={ERRORS?.[i]?.food_record_kcal}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food2.webp`}
										/>
									}
									endadornment={translate(`kc`)}
									onChange={(e: any) => {
										const procdVal: string | null = hndlNmbrInpt(
											e.target.value,
											9999,
										);
										if (procdVal === null) {
											return;
										}
										// object 설정
										setOBJECT((prev: any) => ({
											...prev,
											food_section: prev.food_section?.map(
												(section: any, idx: number) =>
													idx === i
														? {
																...section,
																food_record_kcal: procdVal,
															}
														: section,
											),
										}));
									}}
								/>
							</Grid>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`carb`)}
									value={insertComma(item?.food_record_carb ?? `0`)}
									inputRef={REFS?.[i]?.food_record_carb}
									error={ERRORS?.[i]?.food_record_carb}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food3.webp`}
										/>
									}
									endadornment={translate(`g`)}
									onChange={(e: any) => {
										const procdVal: string | null = hndlNmbrInpt(
											e.target.value,
											999,
											1,
										);
										if (procdVal === null) {
											return;
										}
										// object 설정
										setOBJECT((prev: any) => ({
											...prev,
											food_section: prev.food_section?.map(
												(section: any, idx: number) =>
													idx === i
														? {
																...section,
																food_record_carb: procdVal,
															}
														: section,
											),
										}));
									}}
								/>
							</Grid>
						</Grid>

						{/** row 5 * */}
						<Grid container={true} spacing={1}>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`protein`)}
									value={insertComma(item?.food_record_protein ?? `0`)}
									inputRef={REFS?.[i]?.food_record_protein}
									error={ERRORS?.[i]?.food_record_protein}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food4.webp`}
										/>
									}
									endadornment={translate(`g`)}
									onChange={(e: any) => {
										const procdVal: string | null = hndlNmbrInpt(
											e.target.value,
											999,
											1,
										);
										if (procdVal === null) {
											return;
										}
										// object 설정
										setOBJECT((prev: any) => ({
											...prev,
											food_section: prev.food_section?.map(
												(section: any, idx: number) =>
													idx === i
														? {
																...section,
																food_record_protein: procdVal,
															}
														: section,
											),
										}));
									}}
								/>
							</Grid>
							<Grid size={6}>
								<Input
									locked={LOCKED}
									label={translate(`fat`)}
									value={insertComma(item?.food_record_fat ?? `0`)}
									inputRef={REFS?.[i]?.food_record_fat}
									error={ERRORS?.[i]?.food_record_fat}
									startadornment={
										<Img
											max={14}
											hover={true}
											shadow={false}
											radius={false}
											src={`food5.webp`}
										/>
									}
									endadornment={translate(`g`)}
									onChange={(e: any) => {
										const procdVal: string | null = hndlNmbrInpt(
											e.target.value,
											999,
											1,
										);
										if (procdVal === null) {
											return;
										}
										// object 설정
										setOBJECT((prev: any) => ({
											...prev,
											food_section: prev.food_section?.map(
												(section: any, idx: number) =>
													idx === i
														? {
																...section,
																food_record_fat: procdVal,
															}
														: section,
											),
										}));
									}}
								/>
							</Grid>
						</Grid>
					</Grid>
				))}
			</>
		);
		// 7-10. return
		return (
			<Paper
				className={`content-wrapper radius-2 border-1 shadow-1 h-min-75vh`}
			>
				{dtCntSec()}
				<Br m={20} />
				{totalSection()}
				<Br m={20} />
				{COUNT?.newSectionCnt > 0 && dtlSec()}
			</Paper>
		);
	};

	// 8. dialog ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const dialogNode = () => (
		<Dialog
			COUNT={COUNT}
			setCOUNT={setCOUNT}
			OBJECT={OBJECT}
			setOBJECT={setOBJECT}
			LOCKED={LOCKED}
			setLOCKED={setLOCKED}
		/>
	);

	// 9. footer ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const footerNode = () => (
		<Footer
			state={{
				DATE,
				SEND,
				COUNT,
				EXIST,
				FLOW,
			}}
			setState={{
				setDATE,
				setSEND,
				setCOUNT,
				setEXIST,
				setFLOW,
			}}
			flow={{
				flowSave,
				flowDelete,
			}}
		/>
	);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return (
		<>
			{detailNode()}
			{dialogNode()}
			{footerNode()}
		</>
	);
});
