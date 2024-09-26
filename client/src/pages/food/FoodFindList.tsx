// FoodFindList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useStorage } from "@imports/ImportHooks";
import { FoodFind } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportLibs";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div, Hr, Img, Icons } from "@imports/ImportComponents";
import { Empty, Dial } from "@imports/ImportContainers";
import { Paper, Card, Checkbox, Grid } from "@imports/ImportMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const FoodFindList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt,
  } = useCommonDate();
  const {
    location_dateStart, location_dateEnd, PATH, URL_OBJECT, TITLE, localIsoCode
  } = useCommonValue();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용 (find 사용금지)
  const [PAGING, setPAGING] = useStorage(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      query: "",
      page: 0,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [checkedQueries, setCheckedQueries] = useState<any>({});
  const [isExpanded, setIsExpanded] = useState<number[]>([0]);
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>([FoodFind]);
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
    dateType: "day",
    dateStart: location_dateStart || dayFmt,
    dateEnd: location_dateEnd || dayFmt,
  });

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
    let section = sessionStorage.getItem(`${TITLE}_foodSection`);

    // sectionArray 초기화
    if (section) {
      sectionArray = JSON.parse(section);
    }

    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const newChecked = OBJECT.map((item: any) => (
      sectionArray.some((sectionItem: any) => (
        sectionItem.food_name === item.food_name &&
        sectionItem.food_brand === item.food_brand &&
        sectionItem.food_gram === item.food_gram
      ))
    ));
    setCheckedQueries({
      ...checkedQueries,
      [queryKey]: newChecked
    });
  }, [OBJECT]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 체크박스 상태 변경 시 sessionStorage에 저장
  useEffect(() => {
    let sectionArray: any[] = [];
    let section: any = sessionStorage.getItem(`${TITLE}_foodSection`);

    // sectionArray 초기화
    if (section) {
      sectionArray = JSON.parse(section);
    }

    // 현재 쿼리와 페이지의 체크된 상태
    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const pageChecked = checkedQueries[queryKey] || [];

    // 체크된 항목들만 sectionArray에 추가 또는 제거
    OBJECT.forEach((item: any, index: number) => {
      if (pageChecked[index]) {
        if (!sectionArray.some((i) => (
          i.food_name === item.food_name &&
          i.food_brand === item.food_brand &&
          i.food_gram === item.food_gram
        ))) {
          sectionArray.push(item);
        }
      }
      else {
        sectionArray = sectionArray.filter((i) => !(
          i.food_name === item.food_name &&
          i.food_brand === item.food_brand &&
          i.food_gram === item.food_gram
        ));
      }
    });

    // sessionStorage에 저장
    sessionStorage.setItem(`${TITLE}_foodSection`, JSON.stringify(sectionArray));

  }, [checkedQueries, PAGING.page, OBJECT]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowFind = () => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/find/list`, {
      params: {
        PAGING: PAGING,
        isoCode: localIsoCode,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result.length > 0 ? res.data.result : []);
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt ? res.data.totalCnt : 0,
      }));
      // Accordion 초기값 설정
      setIsExpanded(res.data.result.map((_item: any, index: number) => index));
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 4. handler ------------------------------------------------------------------------------------
  // 체크박스 변경 시
  const handlerCheckboxChange = (index: number) => {
    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const updatedChecked = [...(checkedQueries[queryKey] || [])];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedQueries({
      ...checkedQueries,
      [queryKey]: updatedChecked
    });
  };

  // 7. find ---------------------------------------------------------------------------------------
  const findNode = () => {
    const listSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          extra={"food"}
        />
      );
      const listFragment = (i: number) => (
        OBJECT?.map((item: any, index: number) => (
          <Card className={"border-1 radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpanded.includes(index)}>
              <AccordionSummary
                expandIcon={
                  <Icons
                    name={"ChevronDown"}
                    className={"w-18 h-18 black z-1000"}
                    onClick={() => {
                      setIsExpanded(isExpanded.includes(index)
                      ? isExpanded.filter((el) => el !== index)
                      : [...isExpanded, index]
                    )}}
                  />
                }
              >
                <Grid container spacing={2}
                  onClick={() => {
                    handlerCheckboxChange(index);
                  }}
                >
                  <Grid size={2} className={"d-center"}>
                    <Checkbox
                      key={`check-${index}`}
                      color={"primary"}
                      size={"small"}
                      checked={
                        !! (
                          checkedQueries[`${OBJECT[index].food_query}_${PAGING.page}`] &&
                          checkedQueries[`${OBJECT[index].food_query}_${PAGING.page}`][index]
                        )
                      }
                      onChange={() => {
                        handlerCheckboxChange(index);
                      }}
                    />
                  </Grid>
                  <Grid size={6} className={"d-row-left"}>
                    {/** 1 ~ 5 글자 **/}
                    {item.food_name.length >= 1 && item.food_name.length < 6 && (
                      <Div className={"fs-1-0rem fw-600 black"}>
                        {item.food_name}
                      </Div>
                    )}
                    {/** 6 ~ 10 글자 **/}
                    {item.food_name.length >= 6 && item.food_name.length < 11 && (
                      <Div className={"fs-0-9rem fw-600 black"}>
                        {item.food_name}
                      </Div>
                    )}
                    {/** 10 글자 이상 **/}
                    {item.food_name.length >= 11 && (
                      <Div className={"fs-0-8rem fw-600 black"}>
                        {item.food_name}
                      </Div>
                    )}
                  </Grid>
                  <Grid size={4} className={"d-row-right"}>
                    <Div className={"fs-0-9rem fw-500 dark me-10"}>
                      {item.food_brand}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {/** row 1 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food2"}
                    	src={"food2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("kcal")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_kcal_color}`}>
                          {numeral(item.food_kcal).format("0,0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("kc")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 2 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food3"}
                    	src={"food3"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("carb")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_carb_color}`}>
                          {item.food_carb}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 3 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food4"}
                    	src={"food4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("protein")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_protein_color}`}>
                          {item.food_protein}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 4 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"food5"}
                    	src={"food5"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("fat")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.food_fat_color}`}>
                          {item.food_fat}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right lh-2-4"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("g")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      return (
        LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : listFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius h-min75vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {listSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 8. dial ---------------------------------------------------------------------------------------
  const dialNode = () => (
    <Dial
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
    />
  );

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, PAGING, SEND, COUNT
      }}
      setState={{
        setDATE, setPAGING, setSEND, setCOUNT
      }}
      flow={{
        flowFind
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {findNode()}
      {dialNode()}
      {footerNode()}
    </>
  );
};