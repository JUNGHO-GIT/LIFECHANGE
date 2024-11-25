// FoodFavoriteList.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importHooks";
import { FoodFind } from "@importSchemas";
import { axios } from "@importLibs";
import { sync, insertComma, setSession } from "@importScripts";
import { Footer, Empty, Dialog } from "@importLayouts";
import { Div, Hr, Img, Icons, Paper, Card, Grid } from "@importComponents";
import { Checkbox,  Accordion, AccordionSummary, AccordionDetails } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const FoodFavoriteList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId } = useCommonValue();
  const { location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { sessionFoodSection } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
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

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState<any>([FoodFind]);
  const [checkedQueries, setCheckedQueries] = useState<any>({});
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });
  const [COUNT, setCOUNT] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState<any>({
    dateType: location_dateType || "day",
    dateStart: location_dateStart || getDayFmt(),
    dateEnd: location_dateEnd || getDayFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
  }, []);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 페이지 번호 변경 시 flowFind 호출
  useEffect(() => {
    if (PAGING?.query === "") {
      return;
    }
    flowFind();
  }, [PAGING.page]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 페이지 로드 시 체크박스 상태 초기화
  useEffect(() => {
    let sectionArray = [];
    let section = sessionFoodSection;

    // sectionArray 초기화
    if (section) {
      sectionArray = section;
    }

    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const newChecked = OBJECT.map((item: any) => (
      sectionArray.some((sectionItem: any) => (
        sectionItem.food_key === item.food_key
      ))
    ));
    setCheckedQueries({
      ...checkedQueries,
      [queryKey]: newChecked
    });
  }, [OBJECT]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowFind = async () => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/find/listFavorite`, {
      params: {
        user_id: sessionId,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result.length > 0 ? res.data.result : []);
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
      }));
    })
    .catch((err: any) => {
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowUpdateFavorite = (foodFavorite: any) => {
    axios.put(`${URL_OBJECT}/find/updateFavorite`, {
      user_id: sessionId,
      foodFavorite: foodFavorite,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setOBJECT(res.data.result.length > 0 ? res.data.result : []);
        flowFind();
        sync("favorite");
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
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  };

  // 4. handle------------------------------------------------------------------------------------
  // 체크박스 변경 시
  const handleCheckboxChange = (index: number) => {
    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const updatedChecked = [...(checkedQueries[queryKey] || [])];
    updatedChecked[index] = !updatedChecked[index];

    setCheckedQueries((prev: any) => ({
      ...prev,
      [queryKey]: updatedChecked,
    }));

    // 스토리지 데이터 가져오기
    let sectionArray = sessionFoodSection.length > 0 ? sessionFoodSection : [];

    const item = OBJECT[index];
    const newItem = {
      food_perNumber: item.food_perNumber,
      food_part: item.food_part,
      food_key: item.food_key,
      food_query: item.food_query,
      food_name: item.food_name,
      food_brand: item.food_brand,
      food_gram: item.food_gram,
      food_serv: item.food_serv,
      food_count: item.food_count,
      food_kcal: item.food_kcal,
      food_carb: item.food_carb,
      food_protein: item.food_protein,
      food_fat: item.food_fat,
    };

    if (updatedChecked[index]) {
      if (!sectionArray.some((i: any) => i.food_key === item.food_key)) {
        sectionArray.push(newItem);
      }
    }
    else {
      sectionArray = sectionArray.filter((i: any) => (
        i.food_key !== item.food_key
      ));
    }

    // 스토리지 데이터 설정
    setSession("section", "food", "", sectionArray);
  };

  // 7. find ---------------------------------------------------------------------------------------
  const findNode = () => {
    const listSection = () => {
      const listFragment = () => (
        <Grid container={true} spacing={0}>
          {OBJECT.filter((f: any) => f.food_key).map((item: any, i: number) => (
            <Grid container={true} spacing={0} className={"border-1 radius-2"} key={`list-${i}`}>
              <Grid size={12} className={"p-2px"}>
                <Accordion
                  className={"border-0 shadow-0 radius-0"}
                  expanded={isExpanded[i]?.expanded}
                  slotProps={{
                    transition: {
                      mountOnEnter: true,
                      unmountOnExit: true,
                    }
                  }}
                >
                  <AccordionSummary
                    className={"mr-n10px"}
                    expandIcon={
                      <Icons
                        key={"ChevronDown"}
                        name={"ChevronDown"}
                        className={"w-18px h-18px"}
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setIsExpanded(isExpanded.map((el: any, index: number) => (
                            i === index ? {
                              expanded: !el.expanded
                            } : el
                          )));
                        }}
                      />
                    }
                    onClick={() => {
                      handleCheckboxChange(i);
                    }}
                  >
                    <Grid container={true} spacing={2}>
                      <Grid size={2} className={"d-row-center"}>
                        <Checkbox
                          key={`check-${i}`}
                          color={"primary"}
                          size={"small"}
                          checked={
                            !! (
                              checkedQueries[`${item.food_query}_${PAGING.page}`] &&
                              checkedQueries[`${item.food_query}_${PAGING.page}`][i]
                            )
                          }
                          onChange={() => {
                            handleCheckboxChange(i);
                          }}
                        />
                      </Grid>
                      <Grid size={6} className={"d-row-left"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_name_color}`}>
                          {item.food_name}
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
                        <Div className={`fs-1-0rem fw-600 ${item.food_count_color}`}>
                          <Div className={`fs-0-8rem fw-500 dark mr-10px`}>
                            {item.food_brand}
                          </Div>
                        </Div>
                      </Grid>
                    </Grid>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container={true} spacing={2}>
                      {/** row 1 **/}
                      <Grid container={true} spacing={2}>
                        <Grid size={2} className={"d-row-center"}>
                          <Img
                            max={20}
                            hover={true}
                            shadow={false}
                            radius={false}
                            src={"food2.webp"}
                          />
                        </Grid>
                        <Grid size={3} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
                            {translate("kcal")}
                          </Div>
                        </Grid>
                        <Grid size={7}>
                          <Grid container={true} spacing={1}>
                            <Grid size={10} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.food_kcal_color}`}>
                                {insertComma(item.food_kcal || "0")}
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
                      <Grid container={true} spacing={2}>
                        <Grid size={2} className={"d-center"}>
                          <Img
                            max={20}
                            hover={true}
                            shadow={false}
                            radius={false}
                            src={"food3.webp"}
                          />
                        </Grid>
                        <Grid size={3} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
                            {translate("carb")}
                          </Div>
                        </Grid>
                        <Grid size={7}>
                          <Grid container={true} spacing={1}>
                            <Grid size={10} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.food_carb_color}`}>
                                {insertComma(item.food_carb || "0")}
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
                      <Grid container={true} spacing={2}>
                        <Grid size={2} className={"d-center"}>
                          <Img
                            max={20}
                            hover={true}
                            shadow={false}
                            radius={false}
                            src={"food4.webp"}
                          />
                        </Grid>
                        <Grid size={3} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
                            {translate("protein")}
                          </Div>
                        </Grid>
                        <Grid size={7}>
                          <Grid container={true} spacing={1}>
                            <Grid size={10} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.food_protein_color}`}>
                                {insertComma(item.food_carb || "0")}
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
                      <Grid container={true} spacing={2}>
                        <Grid size={2} className={"d-center"}>
                          <Img
                            max={20}
                            hover={true}
                            shadow={false}
                            radius={false}
                            src={"food5.webp"}
                          />
                        </Grid>
                        <Grid size={3} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
                            {translate("fat")}
                          </Div>
                        </Grid>
                        <Grid size={7}>
                          <Grid container={true} spacing={1}>
                            <Grid size={10} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.food_fat_color}`}>
                                {insertComma(item.food_fat || "0")}
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
      return (
        <Card className={"d-col-center border-0 shadow-0 radius-0"}>
          {COUNT.totalCnt === 0 ? <Empty DATE={DATE} extra={"food"} /> : listFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min-75vh"}>
        {listSection()}
      </Paper>
    );
  };

  // 8. dialog -------------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      setIsExpanded={setIsExpanded}
    />
  );

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, PAGING, COUNT,
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT,
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {findNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
};