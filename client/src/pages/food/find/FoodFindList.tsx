// FoodFindList.tsx

import { useState, useEffect, memo } from "@exportReacts";
import { useCommonValue, useCommonDate } from "@exportHooks";
import { useStorageLocal, useStorageSession } from "@exportHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@exportStores";
import { FoodFind, FoodFindType } from "@exportSchemas";
import { axios } from "@exportLibs";
import { setSession, getSession, insertComma } from "@exportScripts";
import { Footer, Empty, Dialog } from "@exportLayouts";
import { Div, Hr, Img, Icons, Paper, Grid } from "@exportComponents";
import { Checkbox,  Accordion, AccordionSummary, AccordionDetails } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const FoodFindList = memo(() => {

	// 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, localIsoCode } = useCommonValue();
  const { location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { sessionFoodSection } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

	// 2-1. useStorageSession ---------------------------------------------------------------------
  const [PAGING, setPAGING] = useStorageSession(
    "paging", PATH, "", {
      sort: "asc",
      query: "",
      page: 0,
    }
  );

	// 2-1. useStorageLocal -----------------------------------------------------------------------
  const [isExpanded, setIsExpanded] = useStorageLocal(
    "isExpanded", PATH, "", [{
      expanded: true
    }]
  );

	// 2-2. useState -------------------------------------------------------------------------------
	const [OBJECT, setOBJECT] = useState<[FoodFindType]>([FoodFind]);
	const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: location_dateType || "day",
    dateStart: location_dateStart || getDayFmt(),
    dateEnd: location_dateEnd || getDayFmt(),
  });

	// 2-3. useEffect ------------------------------------------------------------------------------
  // - 페이지 번호 변경 시 flowFind 호출
  useEffect(() => {
    if (PAGING?.query === "") {
      return;
    }
    flowFind();
  }, [PAGING.page]);

	// 2-3. useEffect -----------------------------------------------------------------------------
	// - 선택된 항목 키를 세션 스토리지에서 동기화
	useEffect(() => {
		const sectionArray: any[] = sessionFoodSection ? sessionFoodSection : [];
		const keys = new Set<string>(sectionArray.map((s: any) => s.food_record_key));
		setSelectedKeys(keys);
	}, [sessionFoodSection]);

	// 3. flow ------------------------------------------------------------------------------------
  const flowFind = async () => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/find/list`, {
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
        totalCnt: res.data.totalCnt || 0,
      }));
			// 현재 isExpanded의 길이와 응답 길이가 다를 경우, 응답 길이에 맞춰 초기화
      setIsExpanded(() => {
				if (res.data.result?.length !== isExpanded.length) {
					return Array(res.data.result?.length).fill({ expanded: true });
				}
				return isExpanded;
			});
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

	// 4. handle ---------------------------------------------------------------------------------
	// - 체크박스 변경 시
	const handleCheckboxChange = (index: number) => {
		// 스토리지 데이터 가져오기 (최신 값을 직접 가져옴)
		const currentSection = getSession("section", "food", "") || [];
		let sectionArray = currentSection?.length > 0 ? [...currentSection] : [];

		const item = OBJECT[index];
		const key = item.food_record_key;
		const nextSelected = new Set<string>(selectedKeys);

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
		(nextSelected.has(key)) ? (
			nextSelected.delete(key),
			sectionArray = sectionArray.filter((i: any) => i.food_record_key !== key)
		)
		// checked
		: (
			nextSelected.add(key),
			!sectionArray.some((i: any) => i.food_record_key === key) && sectionArray.push(newItem)
		);

		setSelectedKeys(nextSelected);
		setSession("section", "food", "", sectionArray);
	};

  // 7. find ---------------------------------------------------------------------------------------
  const findNode = () => {
    const listSection = () => (
			<Grid container={true} spacing={0}>
				{OBJECT?.map((item, i) => (
					<Grid container={true} spacing={0} className={"radius-2 border-1 shadow-0 mb-10px"} key={`list-${i}`}>
						<Grid size={12} className={"p-2px"}>
							<Accordion
								className={"border-0 shadow-0 radius-2"}
								expanded={isExpanded?.[i]?.expanded}
							>
								<AccordionSummary
									expandIcon={
										<Icons
											key={"ChevronDown"}
											name={"ChevronDown"}
											className={"w-16px h-16px"}
											onClick={(e: any) => {
												e.preventDefault();
												e.stopPropagation();
												setIsExpanded(isExpanded.map((el: any, index: number) => (
													i === index ? {
														expanded: !el.expanded
													} : el
												)));
											}}
										/>
									}
								>
									<Grid container={true} spacing={1}>
										<Grid size={2} className={"d-row-center"}>
											<Checkbox
												key={`check-${i}`}
												color={"primary"}
												size={"small"}
												checked={selectedKeys.has(item.food_record_key)}
												onChange={(e: any) => {
													e.stopPropagation();
													handleCheckboxChange(i);
												}}
											/>
										</Grid>
										<Grid size={6} className={"d-row-left"}>
											<Div className={`fs-0-8rem fw-600 ${item.food_record_name_color}`}>
												{item.food_record_name}
											</Div>
										</Grid>
										<Grid size={4} className={"d-row-right"}>
											<Div className={`fs-0-8rem fw-600 ${item.food_record_count_color}`}>
												<Div className={`fs-0-8rem fw-500 dark mr-10px`}>
													{item.food_record_brand}
												</Div>
											</Div>
										</Grid>
									</Grid>
								</AccordionSummary>
								<AccordionDetails>
									<Grid container={true} spacing={1}>
										{/** row 1 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-row-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"food2.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("kcal")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_kcal_color}`}>
															{insertComma(item.food_record_kcal || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("kc")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 1 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 2 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"food3.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("carb")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_carb_color}`}>
															{insertComma(item.food_record_carb || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 2 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 3 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-center"}>
												<Img
													max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"food4.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("protein")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_protein_color}`}>
															{insertComma(item.food_record_protein || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 2 **/}

										<Hr m={1} className={"bg-light"} />

										{/** row 3 **/}
										<Grid container={true} spacing={1}>
											<Grid size={2} className={"d-center"}>
												<Img
												max={14}
													hover={true}
													shadow={false}
													radius={false}
													src={"food5.webp"}
												/>
											</Grid>
											<Grid size={3} className={"d-row-left"}>
												<Div className={"fs-0-8rem fw-600 dark ml-n15px"}>
													{translate("fat")}
												</Div>
											</Grid>
											<Grid size={7}>
												<Grid container={true} spacing={1}>
													<Grid size={10} className={"d-row-right"}>
														<Div className={`fs-0-8rem fw-600 ${item.food_record_fat_color}`}>
															{insertComma(item.food_record_fat || "0")}
														</Div>
													</Grid>
													<Grid size={2} className={"d-row-center"}>
														<Div className={"fs-0-6rem"}>
															{translate("g")}
														</Div>
													</Grid>
												</Grid>
											</Grid>
										</Grid>
										{/** /.row 3 **/}
									</Grid>
								</AccordionDetails>
							</Accordion>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius-2 border-1 shadow-1 h-min-75vh"}>
      	{COUNT.totalCnt === 0 ? <Empty DATE={DATE} extra={"food"} /> : listSection()}
      </Paper>
    );
  };

	// 8. dialog ----------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      setIsExpanded={setIsExpanded}
    />
  );

	// 9. footer ----------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, PAGING, COUNT,
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT,
      }}
      flow={{
        flowFind
      }}
    />
  );

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {findNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
});