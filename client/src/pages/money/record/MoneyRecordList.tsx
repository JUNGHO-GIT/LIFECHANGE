/**
 * @file MoneyRecordList.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { Div, Grid, Hr, Icons, Img, Paper } from "@exportComponents";
import { useCommonDate as usCmmnDt, useCommonValue as usCmmnVal, useStorageLocal as usStrgLcl } from "@exportHooks";
import { Dialog, Empty, Footer } from "@exportLayouts";
import { axios } from "@exportLibs";
import { Accordion, AccordionDetails as AccrDtls, AccordionSummary as AccrSmmr } from "@exportMuis";
import { memo, useEffect, useMemo, useState } from "@exportReacts";
import { MoneyRecord, type MoneyRecordType as MnyRecTyp } from "@exportSchemas";
import { insertComma } from "@exportScripts";
import {
	useStoreAlert as usStrAlrt,
	useStoreLanguage as usStrLang,
	useStoreLoading as usStrLoad,
} from "@exportStores";

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const MnyRecLst = memo(() => {
	// 1. common ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const { URL_OBJECT, PATH, sessionId, localCurrency: lclCrrn, toDetail } =
		usCmmnVal();
	const { navigate, location_dateType: locDtTyp, location_dateStart: locDtStrt, location_dateEnd: locDtEnd } =
		usCmmnVal();
	const { getDayNotFmt, getMonthStartFmt: gtMnStFm, getMonthEndFmt: gtMnthEndFmt } = usCmmnDt();
	const { translate } = usStrLang();
	const { setALERT } = usStrAlrt();
	const { setLOADING } = usStrLoad();

	// 2-1. useStorageLocal ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const [DATE, setDATE] = usStrgLcl(`date`, PATH, ``, {
		dateType: locDtTyp ?? ``,
		dateStart: locDtStrt ?? gtMnStFm(),
		dateEnd: locDtEnd ?? gtMnthEndFmt(),
	});
	const [PAGING, setPAGING] = usStrgLcl(`paging`, PATH, ``, {
		sort: `asc`,
		page: 1,
		part: `all`,
		title: `all`,
	});
	const [isExpanded, stIsExpn] = usStrgLcl(`isExpanded`, PATH, ``, [
		{
			expanded: true,
		},
	]);

	// 2-2. useState ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――-
	const [OBJECT, setOBJECT] = useState<[MnyRecTyp]>([MoneyRecord]);
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
		setLOADING(true);
		axios
			.get(`${URL_OBJECT}/record/list`, {
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
				setOBJECT(
					res.data.result?.length > 0 ? res.data.result : [MoneyRecord],
				);
				setCOUNT((prev) => ({
					...prev,
					totalCnt: res.data.totalCnt ?? 0,
					sectionCnt: res.data.sectionCnt ?? 0,
					newSectionCnt: res.data.sectionCnt ?? 0,
				}));
				// 현재 isExpanded의 길이와 응답 길이가 다를 경우, 응답 길이에 맞춰 초기화
				stIsExpn(() => {
					if (res.data.result?.length !== isExpanded.length) {
						return Array.from({ length: res.data.result?.length }).fill({
							expanded: true,
						});
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
		PAGING?.part,
		PAGING?.title,
		DATE?.dateStart,
		DATE?.dateEnd,
	]);

	// 6. useMemo ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const summary = useMemo(() => {
		const totalIncome = OBJECT.reduce((sum, item) => {
			return sum + parseFloat(item.money_record_total_income || `0`);
		}, 0);
		const totalExpense = OBJECT.reduce((sum, item) => {
			return sum + parseFloat(item.money_record_total_expense || `0`);
		}, 0);
		const balance = totalIncome - totalExpense;
		return {
			totalIncome,
			totalExpense,
			balance,
			balanceColor: balance >= 0 ? `primary` : balance < 0 ? `red` : ``,
		};
	}, [OBJECT]);

	// 7. list ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――--
	const listNode = () => {
		// 7-0. summary
		/* const summarySection = () => (
      <Grid container={true} spacing={0} className={`radius-2 border-1 shadow-1 mb-10px`}>
        <Grid size={12} className={`p-10px`}>
          <Grid container={true} spacing={1}>
            <Grid size={12} className={`d-row-left mb-5px`}>
              <Icons
                key={`Calculator`}
                name={`Calculator`}
                className={`w-16px h-16px mr-5px`}
              />
              <Div className={`fs-0-9rem fw-700 black`}>
                {translate(`search_result_summary`)}
              </Div>
            </Grid>

            <Hr m={0} className={`bg-light`} />

            <Grid container={true} spacing={1} className={`mt-5px`}>
              <Grid size={2} className={`d-row-center`}>
                <Img
                  max={14}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={`money2.webp`}
                />
              </Grid>
              <Grid size={3} className={`d-row-left`}>
                <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                  {translate(`income`)}
                </Div>
              </Grid>
              <Grid size={7}>
                <Grid container={true} spacing={1}>
                  <Grid size={10} className={`d-row-right`}>
                    <Div className={`fs-0-8rem fw-600 primary`}>
                      {insertComma(summary.totalIncome.toString())}
                    </Div>
                  </Grid>
                  <Grid size={2} className={`d-row-center`}>
                    <Div className={`fs-0-6rem`}>
                      {translate(localCurrency)}
                    </Div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Hr m={1} className={`bg-light`} />

            <Grid container={true} spacing={1}>
              <Grid size={2} className={`d-row-center`}>
                <Img
                  max={14}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={`money2.webp`}
                />
              </Grid>
              <Grid size={3} className={`d-row-left`}>
                <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                  {translate(`expense`)}
                </Div>
              </Grid>
              <Grid size={7}>
                <Grid container={true} spacing={1}>
                  <Grid size={10} className={`d-row-right`}>
                    <Div className={`fs-0-8rem fw-600 red`}>
                      {insertComma(summary.totalExpense.toString())}
                    </Div>
                  </Grid>
                  <Grid size={2} className={`d-row-center`}>
                    <Div className={`fs-0-6rem`}>
                      {translate(localCurrency)}
                    </Div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Hr m={1} className={`bg-light`} />

            <Grid container={true} spacing={1}>
              <Grid size={2} className={`d-row-center`}>
                <Icons
                  key={`TrendingUp`}
                  name={`TrendingUp`}
                  className={`w-14px h-14px`}
                />
              </Grid>
              <Grid size={3} className={`d-row-left`}>
                <Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
                  {translate(`balance`)}
                </Div>
              </Grid>
              <Grid size={7}>
                <Grid container={true} spacing={1}>
                  <Grid size={10} className={`d-row-right`}>
                    <Div className={`fs-0-8rem fw-700 ${summary.balanceColor}`}>
                      {insertComma(summary.balance.toString())}
                    </Div>
                  </Grid>
                  <Grid size={2} className={`d-row-center`}>
                    <Div className={`fs-0-6rem`}>
                      {translate(localCurrency)}
                    </Div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    ); */
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
												dateType: item.money_record_dateType,
												dateStart: item.money_record_dateStart,
												dateEnd: item.money_record_dateEnd,
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
											<Div className={`fs-0-9rem fw-600 black mr-5px`}>
												{item.money_record_dateStart?.slice(5, 10)}
											</Div>
											<Div className={`fs-0-9rem fw-500 dark ml-5px`}>
												{translate(
													getDayNotFmt(item.money_record_dateStart).format(
														`ddd`,
													),
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
													src={`money2.webp`}
												/>
											</Grid>
											<Grid size={3} className={`d-row-left`}>
												<Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
													{translate(`income`)}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													<Grid size={10} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.money_record_total_income_color}`}
														>
															{insertComma(
																item.money_record_total_income ?? `0`,
															)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>
															{translate(lclCrrn)}
														</Div>
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
													src={`money2.webp`}
												/>
											</Grid>
											<Grid size={3} className={`d-row-left`}>
												<Div className={`fs-0-8rem fw-600 dark ml-n15px`}>
													{translate(`expense`)}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													<Grid size={10} className={`d-row-right`}>
														<Div
															className={`fs-0-8rem fw-600 ${item.money_record_total_expense_color}`}
														>
															{insertComma(
																item.money_record_total_expense ?? `0`,
															)}
														</Div>
													</Grid>
													<Grid size={2} className={`d-row-center`}>
														<Div className={`fs-0-6rem`}>
															{translate(lclCrrn)}
														</Div>
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
					<Empty DATE={DATE} extra={`money`} />
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
