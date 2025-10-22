// FoodFavoriteList.tsx

import { useState, useEffect, memo } from "@importReacts";
import { useCommonValue, useCommonDate } from "@importHooks";
import { useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { FoodFind, FoodFindType } from "@importSchemas";
import { axios } from "@importLibs";
import { fnSync, fnInsertComma, fnSetSession, fnGetSession } from "@importScripts";
import { Footer, Empty, Dialog } from "@importLayouts";
import { Div, Hr, Img, Icons, Paper, Grid } from "@importComponents";
import { Checkbox,  Accordion, AccordionSummary, AccordionDetails } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const FoodFavoriteList = memo(() => {

	// 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId } = useCommonValue();
  const { location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { sessionFoodSection } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

	// 2-1. useStorageLocal -----------------------------------------------------------------------
  const [PAGING, setPAGING] = useStorageLocal(
    "paging", PATH, "", {
      sort: "asc",
      query: "favorite",
      page: 0,
    }
  );
  const [isExpanded, setIsExpanded] = useStorageLocal(
    "isExpanded", PATH, "", [{
      expanded: true
    }]
  );

	// 2-2. useState -------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState<[FoodFindType]>([FoodFind]);
  const [checkedQueries, setCheckedQueries] = useState<{ [key: string]: boolean[] }>({});
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
	// - 페이지 로드시 체크박스 상태 초기화
  useEffect(() => {
    let sectionArray: typeof sessionFoodSection = [];
    let section = sessionFoodSection;

    // sectionArray 초기화
    if (section) {
      sectionArray = section;
    }

    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const newChecked = OBJECT.map((item: any) => (
      sectionArray.some((sectionItem: any) => (
        sectionItem.food_record_key === item.food_record_key
      ))
    ));
    setCheckedQueries({
      ...checkedQueries,
      [queryKey]: newChecked
    });
  }, [OBJECT]);

	// 3. flow ------------------------------------------------------------------------------------
  const flowFind = async () => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/favorite/list`, {
      params: {
        user_id: sessionId,
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

	// 3. flow ------------------------------------------------------------------------------------
  const flowUpdateFavorite = (foodFavorite: any) => {
    axios.put(`${URL_OBJECT}/favorite/update`, {
      user_id: sessionId,
      foodFavorite: foodFavorite,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setLOADING(false);
        setOBJECT(res.data.result?.length > 0 ? res.data.result : []);
        flowFind();
        fnSync("favorite");
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  };

	// 4. handle ---------------------------------------------------------------------------------
	// - 체크박스 변경 시
  const handleCheckboxChange = (index: number) => {
    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const updatedChecked = [...(checkedQueries[queryKey] || [])];
    updatedChecked[index] = !updatedChecked[index];

    setCheckedQueries((prev) => ({
      ...prev,
      [queryKey]: updatedChecked,
    }));

    // 스토리지 데이터 가져오기 (최신 값을 직접 가져옴)
    const currentSection = fnGetSession("section", "food", "") || [];
    let sectionArray = currentSection?.length > 0 ? [...currentSection] : [];

    const item = OBJECT[index];
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

    if (updatedChecked[index]) {
      if (!sectionArray.some((i: any) => i.food_record_key === item.food_record_key)) {
        sectionArray.push(newItem);
      }
    }
    else {
      sectionArray = sectionArray?.filter((i: any) => (
        i.food_record_key !== item.food_record_key
      ));
    }

    // 스토리지 데이터 설정
    fnSetSession("section", "food", "", sectionArray);
  };

  // 7. favorite ---------------------------------------------------------------------------------------
  const favoriteNode = () => {
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
												checked={
													!! (
														checkedQueries[`${PAGING.query}_${PAGING.page}`] &&
														checkedQueries[`${PAGING.query}_${PAGING.page}`]?.[i]
													)
												}
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
											<Div className={"mt-n3px ml-5px"}>
												<Icons
													key={"Star"}
													name={"Star"}
													className={"w-20px h-20px"}
													color={"darkslategrey"}
													fill={"gold"}
													onClick={(e: any) => {
														e.stopPropagation();
														flowUpdateFavorite(item);
													}}
												/>
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
															{fnInsertComma(item.food_record_kcal || "0")}
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
															{fnInsertComma(item.food_record_carb || "0")}
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
															{fnInsertComma(item.food_record_carb || "0")}
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
															{fnInsertComma(item.food_record_fat || "0")}
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
      {favoriteNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
});