/**
 * @file UserCategory.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div, Grid, Icons, Paper } from "@exportComponents";
import { Input, PopUp } from "@exportContainers";
import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal, useStorageLocal as usStrgLcl } from "@exportHooks";
import { Footer } from "@exportLayouts";
import { axios } from "@exportLibs";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer as TblCntn,
	TableFooter,
	TableHead,
	TableRow,
} from "@exportMuis";
import {
	createRef,
	memo,
	type React,
	useEffect,
	useRef,
	useState,
} from "@exportReacts";
import { Category, type CategoryType } from "@exportSchemas";
import { sync } from "@exportScripts";
import {
	useStoreAlert as usStrAlrt,
	useStoreLanguage as usStrLang,
	useStoreLoading as usStrLoad,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const UserCategory = memo(() => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { URL_OBJECT, PATH, sessionId } = usCmmnVal();
	const { location_dateStart: locDtStrt, location_dateEnd: locDtEnd, location_dateType: locDtTyp } =
		usCmmnVal();
	const { getDayFmt } = usCmmnDt();
	const { setALERT } = usStrAlrt();
	const { setLOADING } = usStrLoad();
	const { translate } = usStrLang();

	// 2-1. useStorageLocal ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const [DATE, setDATE] = usStrgLcl(`date`, PATH, ``, {
		dateType: locDtTyp ?? `day`,
		dateStart: locDtStrt ?? getDayFmt(),
		dateEnd: locDtEnd ?? getDayFmt(),
	});

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const REFS: React.RefObject<any> = useRef<any>({});
	const [OBJECT, setOBJECT] = useState<CategoryType>(Category);
	const [dataType, setDataType] = useState<keyof CategoryType>(`exercise`);
	const [isEditable, stIsEdtb] = useState<string>(``);
	const [selectedIdx, stSelIdx] = useState({
		category1Idx: 0,
		category2Idx: 1,
		category3Idx: 1,
	});
	const [SEND, setSEND] = useState({
		id: ``,
		dateType: ``,
		dateStart: `0000-00-00`,
		dateEnd: `0000-00-00`,
	});

	// 2-3. useRef ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const objectRef: React.RefObject<CategoryType> = useRef(OBJECT);

	// 2-3. useEffect ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	useEffect(() => {
		OBJECT !== objectRef.current && (objectRef.current = OBJECT);
	}, [OBJECT]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		setLOADING(true);
		axios
			.get(`${URL_OBJECT}/category/detail`, {
				params: {
					user_id: sessionId,
				},
			})
			.then((res: any) => {
				setLOADING(false);
				setOBJECT(res.data.result ?? Category);
				Object.keys(res.data.result).forEach((dtTypPrm: string) => {
					REFS.current = {
						...REFS.current,
						[dtTypPrm]: res.data.result[dtTypPrm].map((item: any) => {
							const partRefs: any = {
								[`${dtTypPrm}_record_part`]: createRef(),
								[`${dtTypPrm}_record_title`]:
									item[`${dtTypPrm}_record_title`]?.map(() =>
										createRef(),
									) ?? [],
							};
							return partRefs;
						}),
					};
				});
			})
			.catch((error: any) => {
				setLOADING(false);
				setALERT({
					open: true,
					msg: translate(error?.response?.data?.msg as string),
					severity: `error`,
				});
			})
			.finally(() => {
				setLOADING(false);
			});
	}, [URL_OBJECT, sessionId]);

	// 3. flow ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	async function flowSave() {
		setLOADING(true);
		axios
			.post(`${URL_OBJECT}/category/update`, {
				user_id: sessionId,
				OBJECT: objectRef.current,
			})
			.then((res: any) => {
				if (res.data.status === `success`) {
					setLOADING(false);
					setALERT({
						open: true,
						msg: translate(res.data.msg as string),
						severity: `success`,
					});
					void sync(`category`);
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
					msg: translate(error?.response?.data?.msg as string),
					severity: `error`,
				});
				console.error(error);
			})
			.finally(() => {
				setLOADING(false);
			});
	}

	// 4-1. handle―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const handleAdd = (type: string) => {
		if (type === `part`) {
			setOBJECT((prev) => {
				const updtObjc = {
					...prev,
					[dataType]: [
						...prev[dataType],
						{
							[`${dataType}_record_part`]: ``,
							[`${dataType}_record_title`]: [],
						},
					],
				};
				REFS.current = {
					...REFS.current,
					[dataType]: updtObjc[dataType].map(
						(_: any, idx: number) =>
							REFS.current[dataType]?.[idx] ?? {
								[`${dataType}_record_part`]: createRef(),
								[`${dataType}_record_title`]: [],
							},
					),
				};
				return updtObjc;
			});
		} else if (type === `title`) {
			setOBJECT((prev) => {
				const updtObjc: any = {
					...prev,
					[dataType]: prev[dataType].map((part: any, idx: number) => {
						if (idx === selectedIdx.category2Idx) {
							return {
								...part,
								[`${dataType}_record_title`]: [
									...part[`${dataType}_record_title`],
									``,
								],
							};
						}
						return part;
					}),
				};
				REFS.current = {
					...REFS.current,
					[dataType]: updtObjc[dataType].map((part: any, idx: number) => {
						if (idx === selectedIdx.category2Idx) {
							return {
								...REFS.current[dataType]?.[idx],
								[`${dataType}_record_title`]: part[
									`${dataType}_record_title`
								].map(
									(_: any, titleIdx: number) =>
										REFS.current[dataType]?.[idx]?.[
											`${dataType}_record_title`
										]?.[titleIdx] ?? createRef(),
								),
							};
						}
						return REFS.current[dataType]?.[idx] ?? {};
					}),
				};

				return updtObjc;
			});
		}
	};

	// 4-2. handle―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const handleRename = (type: string, index: number) => {
		stIsEdtb(`${dataType}_${type}_${index}`);
		if (type === `record_part`) {
			setTimeout(() => {
				REFS?.current?.[dataType]?.[index]?.[
					`${dataType}_record_part`
				]?.current?.focus();
			}, 10);
		} else if (type === `record_title`) {
			setTimeout(() => {
				REFS?.current?.[dataType]?.[selectedIdx.category2Idx]?.[
					`${dataType}_record_title`
				]?.[index]?.current?.focus();
			}, 10);
		}
	};

	// 4-3. handle ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const handleRemove = (type: string, index: number) => {
		if (type === `record_part`) {
			if (OBJECT?.[dataType]?.length <= 1) {
				setALERT({
					open: true,
					msg: translate(`cantBeDeletedLastItem`),
					severity: `error`,
				});
				return;
			}
			setOBJECT((prev) => {
				const updtObjc = {
					...prev,
					[dataType]: [
						...prev[dataType]?.slice(0, index),
						...prev[dataType]?.slice(index + 1),
					],
				};
				REFS.current = {
					...REFS.current,
					[dataType]: updtObjc[dataType].map(
						(_: any, idx: number) => REFS.current[dataType]?.[idx] ?? {},
					),
				};
				return updtObjc;
			});
		} else if (type === `record_title`) {
			// @ts-expect-error
			if (
				OBJECT?.[dataType]?.[selectedIdx?.category2Idx]?.[
					`${dataType}_record_title`
				]?.length <= 2
			) {
				setALERT({
					open: true,
					msg: translate(`cantBeDeletedLastItem`),
					severity: `error`,
				});
				return;
			}
			setOBJECT((prev: any) => {
				const updtObjc = {
					...prev,
					[dataType]: [
						...prev[dataType]?.slice(0, selectedIdx.category2Idx),
						{
							...prev[dataType]?.[selectedIdx.category2Idx],
							[`${dataType}_record_title`]: [
								...prev[dataType]?.[selectedIdx.category2Idx]?.[
									`${dataType}_record_title`
								]?.slice(0, index),
								...prev[dataType]?.[selectedIdx.category2Idx]?.[
									`${dataType}_record_title`
								]?.slice(index + 1),
							],
						},
						...prev[dataType]?.slice(selectedIdx.category2Idx + 1),
					],
				};
				REFS.current = {
					...REFS.current,
					[dataType]: updtObjc[dataType].map((part: any, idx: number) => ({
						...REFS.current[dataType]?.[idx],
						[`${dataType}_record_title`]: part[`${dataType}_record_title`].map(
							(_: any, titleIdx: number) =>
								REFS.current[dataType]?.[idx]?.[`${dataType}_record_title`]?.[
									titleIdx
								] ?? {},
						),
					})),
				};
				return updtObjc;
			});
		}
	};

	// 7. userCategory ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const usrCatNd = () => {
		// 7-1. popup
		const popupSection = () => (
			<Grid container={true} spacing={0}>
				<Grid size={12} className={`w-85vw h-60vh d-row`}>
					<TblCntn
						className={`border-1 radius-2 over-x-hidden over-y-auto`}
					>
						<Table>
							<TableHead className={`table-thead`}>
								<TableRow className={`table-thead-tr p-sticky top-0px z-900`}>
									<TableCell>{translate(`dataCategory2`)}</TableCell>
								</TableRow>
							</TableHead>
							<TableBody className={`table-tbody`}>
								{OBJECT[dataType]?.map(
									(item: any, index: number) =>
										index > 0 && (
											<TableRow
												className={`table-tbody-tr border-bottom-1`}
												key={index}
											>
												<TableCell
													className={
														selectedIdx.category2Idx === index ? `bg-light` : ``
													}
												>
													<Div className={`d-center`}>
														<Div className={`fs-0-9rem mr-auto`}>
															<Input
																variant={`standard`}
																value={
																	translate(
																		item[`${dataType}_record_part`] as string,
																	) ?? ``
																}
																readOnly={
																	isEditable !==
																	`${dataType}_record_part_${index}`
																}
																inputclass={`fs-0-9rem`}
																inputRef={
																	REFS?.current?.[dataType]?.[index]?.[
																		`${dataType}_record_part`
																	]
																}
																sx={{
																	"& .MuiInput-root::before": {
																		borderBottom: `none`,
																	},
																	"& .MuiInput-root::after": {
																		borderBottom:
																			isEditable ===
																			`${dataType}_record_part_${index}`
																				? `2px solid #1976d2`
																				: `2px solid #000000`,
																	},
																}}
																onClick={(e: any) => {
																	if (
																		isEditable !==
																		`${dataType}_record_part_${index}`
																	) {
																		e.preventDefault();
																		e.stopPropagation();
																		const target: any = e.currentTarget;
																		target.classList.add(`shake`);
																		setTimeout(() => {
																			target.classList.remove(`shake`);
																		}, 700);
																	}
																}}
																onChange={(e: any) => {
																	setOBJECT((prev) => ({
																		...prev,
																		[dataType]: [
																			...prev[dataType]?.slice(0, index),
																			{
																				...prev[dataType]?.[index],
																				[`${dataType}_record_part`]:
																					e.target.value,
																			},
																			...prev[dataType]?.slice(index + 1),
																		],
																	}));
																}}
															/>
														</Div>
														<Div className={`fs-0-9rem ml-auto d-row-right`}>
															<Icons
																name={`Search`}
																className={`w-12px h-12px`}
																onClick={() => {
																	stSelIdx((prev) => ({
																		...prev,
																		category2Idx: index,
																	}));
																}}
															/>
															<Icons
																name={`Pencil`}
																className={`w-12px h-12px navy`}
																onClick={() => {
																	stSelIdx((prev) => ({
																		...prev,
																		category2Idx: index,
																	}));
																	handleRename(`record_part`, index);
																}}
															/>
															<Icons
																name={`Trash`}
																className={`w-12px h-12px burgundy`}
																onClick={() => {
																	stSelIdx((prev) => ({
																		...prev,
																		category2Idx: index,
																	}));
																	handleRemove(`record_part`, index);
																}}
															/>
														</Div>
													</Div>
												</TableCell>
											</TableRow>
										),
								)}
							</TableBody>
							<TableFooter className={`table-tfoot`}>
								<TableRow className={`table-tfoot-tr`}>
									<TableCell>
										<Div className={`d-center`}>
											<Icons
												key={`Plus`}
												name={`Plus`}
												className={`w-12px h-12px`}
												onClick={() => {
													handleAdd(`part`);
												}}
											/>
										</Div>
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</TblCntn>
					{(dataType === `exercise` || dataType === `money`) && (
						<TblCntn className={`border-1 radius-2 over-x-hidden`}>
							<Table>
								<TableHead className={`table-thead`}>
									<TableRow className={`table-thead-tr p-sticky top-0px z-900`}>
										<TableCell>{translate(`dataCategory3`)}</TableCell>
									</TableRow>
								</TableHead>
								<TableBody className={`table-tbody`}>
									{(dataType === `exercise`
										? OBJECT?.exercise?.[selectedIdx?.category2Idx]
												?.exercise_record_title
										: OBJECT?.money?.[selectedIdx?.category2Idx]
												?.money_record_title
									)?.map(
										(item: any, index: number) =>
											index > 0 && (
												<TableRow
													key={index}
													className={`table-tbody-tr border-bottom-1`}
												>
													<TableCell>
														<Div className={`d-center`}>
															<Div className={`fs-0-9rem mr-auto`}>
																<Input
																	variant={`standard`}
																	value={translate(item as string) ?? ``}
																	readOnly={
																		isEditable !==
																		`${dataType}_record_title_${index}`
																	}
																	inputclass={`fs-0-9rem`}
																	inputRef={
																		REFS?.current?.[dataType]?.[
																			selectedIdx?.category2Idx
																		]?.[`${dataType}_record_title`]?.[index]
																	}
																	sx={{
																		"& .MuiInput-root::before": {
																			borderBottom: `none`,
																		},
																		"& .MuiInput-root::after": {
																			borderBottom:
																				isEditable ===
																				`${dataType}_record_title_${index}`
																					? `2px solid #1976d2`
																					: `2px solid #000000`,
																		},
																	}}
																	onClick={(e: any) => {
																		if (
																			isEditable !==
																			`${dataType}_record_title_${index}`
																		) {
																			e.preventDefault();
																			e.stopPropagation();
																			const target: any = e.currentTarget;
																			target.classList.add(`shake`);
																			setTimeout(() => {
																				target.classList.remove(`shake`);
																			}, 700);
																		}
																	}}
																	onChange={(e: any) => {
																		setOBJECT((prev: any) => ({
																			...prev,
																			[dataType]: [
																				...prev[dataType]?.slice(
																					0,
																					selectedIdx.category2Idx,
																				),
																				{
																					...prev[dataType]?.[
																						selectedIdx.category2Idx
																					],
																					[`${dataType}_record_title`]: [
																						...prev[dataType]?.[
																							selectedIdx.category2Idx
																						]?.[
																							`${dataType}_record_title`
																						]?.slice(0, index),
																						e.target.value,
																						...prev[dataType]?.[
																							selectedIdx.category2Idx
																						]?.[
																							`${dataType}_record_title`
																						]?.slice(index + 1),
																					],
																				},
																				...prev[dataType]?.slice(
																					selectedIdx.category2Idx + 1,
																				),
																			],
																		}));
																	}}
																/>
															</Div>
															<Div className={`fs-0-9rem ml-auto d-row-right`}>
																<Icons
																	name={`Pencil`}
																	className={`w-12px h-12px navy`}
																	onClick={() => {
																		stSelIdx((prev) => ({
																			...prev,
																			category3Idx: index,
																		}));
																		handleRename(`record_title`, index);
																	}}
																/>
																<Icons
																	name={`Trash`}
																	className={`w-12px h-12px burgundy`}
																	onClick={() => {
																		stSelIdx((prev) => ({
																			...prev,
																			category3Idx: index,
																		}));
																		handleRemove(`record_title`, index);
																	}}
																/>
															</Div>
														</Div>
													</TableCell>
												</TableRow>
											),
									)}
								</TableBody>
								<TableFooter className={`table-tfoot`}>
									<TableRow className={`table-tfoot-tr`}>
										<TableCell>
											<Div className={`d-center`}>
												<Icons
													key={`Plus`}
													name={`Plus`}
													className={`w-12px h-12px`}
													onClick={() => {
														handleAdd(`title`);
													}}
												/>
											</Div>
										</TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						</TblCntn>
					)}
				</Grid>
			</Grid>
		);
		// 7-2. detail
		const dtlSec = () => (
			<Grid
				container={true}
				spacing={2}
				className={`radius-2 border-1 shadow-1`}
			>
				{[OBJECT]?.map((item, i) => (
					<Grid size={12} key={`detail-${i}`}>
						<Grid container={true} spacing={1}>
							<TblCntn className={`border-1 radius-2 over-x-hidden`}>
								<Table>
									<TableHead className={`table-thead`}>
										<TableRow className={`table-thead-tr`}>
											<TableCell className={`fs-0-95rem`}>
												{translate(`dataCategory1`)}
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody className={`table-tbody`}>
										{Object.keys(item).map((item: any, idx: number) => (
											<TableRow
												className={`table-tbody-tr border-top-1`}
												key={idx}
											>
												<TableCell
													className={dataType === item ? `bg-light` : ``}
												>
													<Div className={`d-center`}>
														<Div className={`fs-0-95rem ml-0px`}>
															{translate(item as string)}
														</Div>
														<Div className={`fs-0-95rem ml-auto`}>
															<PopUp
																type={`innerCenter`}
																position={`center`}
																direction={`center`}
																contents={popupSection()}
																children={(popTrigger: any) => (
																	<Icons
																		key={`Search`}
																		name={`Search`}
																		className={`w-18px h-18px black ml-auto`}
																		onClick={(e: any) => {
																			setDataType(item);
																			stSelIdx((prev) => ({
																				...prev,
																				category1Idx: idx,
																				category2Idx: 1,
																				category3Idx: 1,
																			}));
																			popTrigger.openPopup(e.currentTarget);
																		}}
																	/>
																)}
															/>
														</Div>
													</Div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TblCntn>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
		// 7-10. return
		return (
			<Paper
				className={`content-wrapper radius-2 border-1 shadow-1 h-min-90vh`}
			>
				{dtlSec()}
			</Paper>
		);
	};

	// 9. footer ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const footerNode = () => (
		<Footer
			state={{
				DATE,
				SEND,
			}}
			setState={{
				setDATE,
				setSEND,
			}}
			flow={{
				flowSave,
			}}
		/>
	);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return (
		<>
			{usrCatNd()}
			{footerNode()}
		</>
	);
});
