/**
 * @file FoodGoalList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div, Grid, Hr, Icons, Img, Paper } from "@exportComponents";
import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal, useStorageLocal as usStrgLcl } from "@exportHooks";
import { Dialog, Empty, Footer } from "@exportLayouts";
import { axios } from "@exportLibs";
import { Accordion, AccordionDetails as AccrDtls, AccordionSummary as AccrSmmr } from "@exportMuis";
import { memo, useEffect, useState } from "@exportReacts";
import { FoodGoal, type FoodGoalType } from "@exportSchemas";
import { insertComma } from "@exportScripts";
import {
	useStoreAlert as usStrAlrt,
	useStoreLanguage as usStrLang,
	useStoreLoading as usStrLoad,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const FoodGoalList = memo(() => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { URL_OBJECT, PATH, sessionId, toDetail } = usCmmnVal();
	const { navigate, location_dateType: locDtTyp, location_dateStart: locDtStrt, location_dateEnd: locDtEnd } =
		usCmmnVal();
	const { getDayFmt, getDayNotFmt, getMonthStartFmt: gtMnStFm, getMonthEndFmt: gtMnthEndFmt } =
		usCmmnDt();
	const { translate } = usStrLang();
	const { setALERT } = usStrAlrt();
	const { setLOADING } = usStrLoad();

	// 2-1. useStorageLocal ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const [DATE, setDATE] = usStrgLcl(`date`, PATH, ``, {
		dateType: locDtTyp ?? ``,
		dateStart: locDtStrt ?? getDayFmt(),
		dateEnd: locDtEnd ?? getDayFmt(),
	});
	const [PAGING, setPAGING] = usStrgLcl(`paging`, PATH, ``, {
		sort: `asc`,
		page: 1,
	});
	const [isExpanded, stIsExpn] = usStrgLcl(`isExpanded`, PATH, ``, [
		{
			expanded: true,
		},
	]);

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const [OBJECT, setOBJECT] = useState<[FoodGoalType]>([FoodGoal]);
	const [EXIST, setEXIST] = useState({
		day: [``],
		week: [``],
		month: [``],
		year: [``],
		select: [``],
	});
	const [SEND, setSEND] = useState({
		id: ``,
		dateType: `day`,
		dateStart: `0000-00-00`,
		dateEnd: `0000-00-00`,
	});
	const [COUNT, setCOUNT] = useState({
		totalCnt: 0,
		sectionCnt: 0,
		newSectionCnt: 0,
	});

	// 2-2. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		console.log(`FoodGoalList DATE: ${JSON.stringify(DATE, null, 2)}`);
	}, [DATE]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	useEffect(() => {
		axios
			.get(`${URL_OBJECT}/goal/exist`, {
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
		setLOADING(true);
		axios
			.get(`${URL_OBJECT}/goal/list`, {
				params: {
					user_id: sessionId,
					PAGING: PAGING,
					DATE: {
						dateType: ``,
						dateStart: DATE?.dateStart,
						dateEnd: DATE?.dateEnd,
					},
				},
			})
			.then((res: any) => {
				setLOADING(false);
				setOBJECT(res.data.result?.length > 0 ? res.data.result : [FoodGoal]);
				setCOUNT((prev) => ({
					...prev,
					totalCnt: res.data.totalCnt ?? 0,
					sectionCnt: res.data.sectionCnt ?? 0,
					newSectionCnt: res.data.sectionCnt ?? 0,
				}));
				// 현재 isExpanded의 길이와 응답 길이가 다를 경우, 응답 길이에 맞춰 초기화
				stIsExpn(() => {
					if (res.data.result?.length !== isExpanded.length) {
						return new Array(res.data.result?.length).fill({ expanded: true });
					}
					return isExpanded;
				});
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
	}, [
		URL_OBJECT,
		sessionId,
		PAGING?.sort,
		PAGING.page,
		DATE?.dateStart,
		DATE?.dateEnd,
	]);

	// 7. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const listNode = () => {
		// 7-1. list
		const listSection = () => (
			<Grid container={true} spacing={0}>
				{OBJECT?.map((item, i) => (
					<Grid
						container={true}
						spacing={0}
						className={`radius-2 border-1 shadow-1 mb-10px`}
						key={`list-${i}`}
					>
						<Grid size={12} className={`p-2px`}>
							<Accordion
								className={`border-0 shadow-0 radius-2`}
								expanded={isExpanded?.[i]?.expanded}
							>
								<AccrSmmr
									expandIcon={
										<Icons
											key={`ChevronDown`}
											name={`ChevronDown`}
											className={`w-16px h-16px`}
											onClick={(e: any) => {
												e.preventDefault();
												e.stopPropagation();
												stIsExpn(
													isExpanded.map((el: any, index: number) =>
														i === index
															? {
																	expanded: !el.expanded,
																}
															: el,
													),
												);
											}}
										/>
									}
									onClick={() => {
										void navigate(toDetail, {
											state: {
												id: item._id,
												dateType: item.food_goal_dateType,
												dateStart: item.food_goal_dateStart,
												dateEnd: item.food_goal_dateEnd,
											},
										});
									}}
								>
									<Grid container={true} spacing={1}>
										<Grid size={2} className={`d-row-center`}>
											<Icons
												key={`Search`}
												name={`Search`}
												className={`w-16px h-16px`}
											/>
										</Grid>
										<Grid size={10} className={`d-row-left`}>
											<Div className={`fs-0-8rem fw-600 black`}>
												{item.food_goal_dateStart?.slice(5, 10)}
											</Div>
											<Div className={`fs-0-9rem fw-500 dark ml-5px`}>
												{translate(
													getDayNotFmt(item.food_goal_dateStart).format(`ddd`),
												)}
											</Div>
											<Div className={`fs-0-8rem fw-500 dark ml-5px mr-5px`}>
												{`-`}
											</Div>
											<Div className={`fs-0-8rem fw-600 black`}>
												{item.food_goal_dateEnd?.slice(5, 10)}
											</Div>
											<Div className={`fs-0-9rem fw-500 dark ml-5px`}>
												{translate(
													getDayNotFmt(item.food_goal_dateEnd).format(`ddd`),
												)}
											</Div>
										</Grid>
									</Grid>
								</AccrSmmr>
								<AccrDtls>
									<Grid container={true} spacing={1}>
										{/** row 1 * */}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={`d-row-center`}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={`food2.webp`}
												/>
											</Grid>
											<Grid size={3} className={`d-row-left`}>
												<Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
													{translate(`kcal`)}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`goal`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_goal_kcal_color}`}
														>
															{insertComma(item.food_goal_kcal ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`kc`)}</Div>
													</Grid>
													{/** record * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`record`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_total_kcal_color}`}
														>
															{insertComma(item.food_record_total_kcal ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`kc`)}</Div>
													</Grid>
													{/** diff * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`diff`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_diff_kcal_color}`}
														>
															{insertComma(item.food_record_diff_kcal ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`kc`)}</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>

										<Hr m={1} className={`bg-light`} />

										{/** row 2 * */}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={`d-row-center`}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={`food3.webp`}
												/>
											</Grid>
											<Grid size={3} className={`d-row-left`}>
												<Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
													{translate(`carb`)}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`goal`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_goal_carb_color}`}
														>
															{insertComma(item.food_goal_carb ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`g`)}</Div>
													</Grid>
													{/** record * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`record`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_total_carb_color}`}
														>
															{insertComma(item.food_record_total_carb ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`g`)}</Div>
													</Grid>
													{/** diff * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`diff`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_diff_carb_color}`}
														>
															{insertComma(item.food_record_diff_carb ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`g`)}</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>

										<Hr m={1} className={`bg-light`} />

										{/** row 3 * */}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={`d-center`}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={`food4.webp`}
												/>
											</Grid>
											<Grid size={3} className={`d-row-left`}>
												<Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
													{translate(`protein`)}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`goal`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_goal_protein_color}`}
														>
															{insertComma(item.food_goal_protein ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`g`)}</Div>
													</Grid>
													{/** record * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`record`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_total_protein_color}`}
														>
															{insertComma(
																item.food_record_total_protein ?? `0`,
															)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`g`)}</Div>
													</Grid>
													{/** diff * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`diff`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_diff_protein_color}`}
														>
															{insertComma(
																item.food_record_diff_protein ?? `0`,
															)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`g`)}</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>

										<Hr m={1} className={`bg-light`} />

										{/** row 4 * */}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={`d-center`}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={`food5.webp`}
												/>
											</Grid>
											<Grid size={3} className={`d-row-left`}>
												<Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
													{translate(`fat`)}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													{/** goal * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`goal`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_goal_fat_color}`}
														>
															{insertComma(item.food_goal_fat ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`g`)}</Div>
													</Grid>
													{/** record * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`record`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_total_fat_color}`}
														>
															{insertComma(item.food_record_total_fat ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`g`)}</Div>
													</Grid>
													{/** diff * */}
													<Grid size={4} className={`d-row-center`}>
														<Div className={`fs-0-7rem fw-500 dark`}>
															{translate(`diff`)}
														</Div>
													</Grid>
													<Grid size={6} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_diff_fat_color}`}
														>
															{insertComma(item.food_record_diff_fat ?? `0`)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>{translate(`g`)}</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
									</Grid>
								</AccrDtls>
							</Accordion>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
		// 7-10. return
		return (
			<Paper
				className={`content-wrapper radius-2 border-1 shadow-1 h-min-75vh`}
			>
				{COUNT.totalCnt === 0 ? (
					<Empty DATE={DATE} extra={`food`} />
				) : (
					listSection()
				)}
			</Paper>
		);
	};

	// 8. dialog ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const dialogNode = () => (
		<Dialog COUNT={COUNT} setCOUNT={setCOUNT} setIsExpanded={stIsExpn} />
	);

	// 9. footer ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const footerNode = () => (
		<Footer
			state={{
				DATE,
				SEND,
				PAGING,
				COUNT,
				EXIST,
			}}
			setState={{
				setDATE,
				setSEND,
				setPAGING,
				setCOUNT,
				setEXIST,
			}}
		/>
	);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return (
		<>
			{listNode()}
			{dialogNode()}
			{footerNode()}
		</>
	);
});
