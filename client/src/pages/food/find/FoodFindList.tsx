/**
 * @file FoodFindList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div, Grid, Hr, Icons, Img, Paper } from "@exportComponents";
import {
	useCommonDate as usCmmnDt,
	useCommonValue as usCmmnVal,
	useStorageLocal as usStrgLcl,
	useStorageSession as usStrgSess,
} from "@exportHooks";
import { Dialog, Empty, Footer } from "@exportLayouts";
import { axios } from "@exportLibs";
import {
	Accordion,
	AccordionDetails as AccrDtls,
	AccordionSummary as AccrSmmr,
	Checkbox,
} from "@exportMuis";
import { memo, useEffect, useState } from "@exportReacts";
import { FoodFind, type FoodFindType } from "@exportSchemas";
import { getSession, insertComma, setSession } from "@exportScripts";
import {
	useStoreAlert as usStrAlrt,
	useStoreLanguage as usStrLang,
	useStoreLoading as usStrLoad,
} from "@exportStores";

// ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
export const FoodFindList = memo(() => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { URL_OBJECT, PATH, localIsoCode } = usCmmnVal();
	const { location_dateType: locDtTyp, location_dateStart: locDtStrt, location_dateEnd: locDtEnd } =
		usCmmnVal();
	const { sessionFoodSection: sessFdSec } = usCmmnVal();
	const { getDayFmt } = usCmmnDt();
	const { translate } = usStrLang();
	const { setALERT } = usStrAlrt();
	const { setLOADING } = usStrLoad();

	// 2-1. useStorageSession ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const [PAGING, setPAGING] = usStrgSess(`paging`, PATH, ``, {
		sort: `asc`,
		query: ``,
		page: 0,
	});

	// 2-1. useStorageLocal ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const [isExpanded, stIsExpn] = usStrgLcl(`isExpanded`, PATH, ``, [
		{
			expanded: true,
		},
	]);

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const [OBJECT, setOBJECT] = useState<[FoodFindType]>([FoodFind]);
	const [selectedKeys, stSelKys] = useState<Set<string>>(new Set());
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
	const [DATE, setDATE] = useState({
		dateType: locDtTyp ?? `day`,
		dateStart: locDtStrt ?? getDayFmt(),
		dateEnd: locDtEnd ?? getDayFmt(),
	});

	// 2-3. useEffect ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	// - 페이지 번호 변경 시 flowFind 호출
	useEffect(() => {
		if (PAGING?.query === ``) {
			return;
		}
		void flowFind();
	}, [PAGING.page]);

	// 2-3. useEffect ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	// - 선택된 항목 키를 세션 스토리지에서 동기화
	useEffect(() => {
		const sectionArray: any[] = sessFdSec ?? [];
		const keys: Set<string> = new Set<string>(
			sectionArray.map((s: any) => s.food_record_key),
		);
		stSelKys(keys);
	}, [sessFdSec]);

	// 3. flow ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	async function flowFind() {
		setLOADING(true);
		axios
			.get(`${URL_OBJECT}/find/list`, {
				params: {
					PAGING: PAGING,
					isoCode: localIsoCode,
				},
			})
			.then((res: any) => {
				setLOADING(false);
				setOBJECT(res.data.result?.length > 0 ? res.data.result : []);
				setCOUNT((prev) => ({
					...prev,
					totalCnt: res.data.totalCnt ?? 0,
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
				console.error(error);
			})
			.finally(() => {
				setLOADING(false);
			});
	}

	// 4. handle ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	// - 체크박스 변경 시
	const hndlChckChg = (index: number) => {
		// 스토리지 데이터 가져오기 (최신 값을 직접 가져옴)
		const curSec: any = getSession(`section`, `food`, ``) ?? [];
		let sectionArray: any[] =
			curSec?.length > 0 ? [...curSec] : [];

		const item: FoodFindType = OBJECT[index];
		const key: string = item.food_record_key;
		const nextSelected: Set<string> = new Set<string>(selectedKeys);

		const newItem = {
			food_record_perNumber: item.food_record_perNumber,
			food_record_part: item.food_record_part,
			food_record_key: item.food_record_key,
			food_record_query: item.food_record_query,
			food_record_name: item.food_record_name,
			food_record_brand: item.food_record_brand,
			food_record_gram: item.food_record_gram,
			food_record_serv: item.food_record_serv,
			food_record_count: item.food_record_count,
			food_record_kcal: item.food_record_kcal,
			food_record_carb: item.food_record_carb,
			food_record_protein: item.food_record_protein,
			food_record_fat: item.food_record_fat,
		};

		// uncheck
		nextSelected.has(key)
			? (() => {
					nextSelected.delete(key);
					sectionArray = sectionArray.filter(
						(i: any) => i.food_record_key !== key,
					);
				})()
			: // checked
				(() => {
					nextSelected.add(key);
					!sectionArray.some((i: any) => i.food_record_key === key) &&
						sectionArray.push(newItem);
				})();

		stSelKys(nextSelected);
		setSession(`section`, `food`, ``, sectionArray);
	};

	// 7. find ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
	const findNode = () => {
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
								>
									<Grid container={true} spacing={1}>
										<Grid size={2} className={`d-row-center`}>
											<Checkbox
												key={`check-${i}`}
												color={`primary`}
												size={`small`}
												checked={selectedKeys.has(item.food_record_key)}
												onChange={(e: any) => {
													e.stopPropagation();
													hndlChckChg(i);
												}}
											/>
										</Grid>
										<Grid size={6} className={`d-row-left`}>
											<Div
												className={`fs-0-8rem fw-600 ${item.food_record_name_color}`}
											>
												{item.food_record_name}
											</Div>
										</Grid>
										<Grid size={4} className={`d-row-right`}>
											<Div
												className={`fs-0-8rem fw-600 ${item.food_record_count_color}`}
											>
												<Div className={`fs-0-8rem fw-500 dark mr-10px`}>
													{item.food_record_brand}
												</Div>
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
													<Grid size={10} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_kcal_color}`}
														>
															{insertComma(item.food_record_kcal ?? `0`)}
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
											<Grid size={2} className={`d-center`}>
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
													<Grid size={10} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_carb_color}`}
														>
															{insertComma(item.food_record_carb ?? `0`)}
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
													<Grid size={10} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_protein_color}`}
														>
															{insertComma(item.food_record_protein ?? `0`)}
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
													<Grid size={10} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.food_record_fat_color}`}
														>
															{insertComma(item.food_record_fat ?? `0`)}
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
			}}
			setState={{
				setDATE,
				setSEND,
				setPAGING,
				setCOUNT,
			}}
			flow={{
				flowFind,
			}}
		/>
	);

	// 10. return ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	return (
		<>
			{findNode()}
			{dialogNode()}
			{footerNode()}
		</>
	);
});
