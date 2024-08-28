// FoodFind.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../imports/ImportReacts.jsx";
import { useCommon, useStorage } from "../../imports/ImportHooks.jsx";
import { axios, numeral } from "../../imports/ImportLibs.jsx";
import { Loading, Footer } from "../../imports/ImportLayouts.jsx";
import { Div, Hr30, Br10, Img, Icons } from "../../imports/ImportComponents.jsx";
import { Empty } from "../../imports/ImportContainers.jsx";
import { Paper, Card, Checkbox, Grid } from "../../imports/ImportMuis.jsx";
import { Accordion, AccordionSummary, AccordionDetails } from "../../imports/ImportMuis.jsx";
import { food2, food3, food4, food5 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodFind = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location_dateStart, location_dateEnd, PATH, URL_OBJECT, sessionId, translate, koreanDate } = useCommon();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용 (find 사용금지)
  const [PAGING, setPAGING] = useStorage(
    `PAGING(${PATH})`, {
      sort: "asc",
      query: "",
      page: 0,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [lang, setLang] = useState(sessionStorage.getItem("LANG"));
  const [checkedQueries, setCheckedQueries] = useState({});
  const [isExpanded, setIsExpanded] = useState([0]);
  const [LOADING, setLOADING] = useState(false);
  const [DATE, setDATE] = useState({
    dateType: "day",
    dateStart: location_dateStart || koreanDate,
    dateEnd: location_dateEnd || koreanDate,
  });
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave:"/food/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    food_query: "",
    food_perNumber: 1,
    food_part_idx: 1,
    food_part_val: "breakfast",
    food_name: "",
    food_brand: "",
    food_count: "0",
    food_serv: "",
    food_gram: "0",
    food_kcal: "0",
    food_kcal_color: "",
    food_carb: "0",
    food_carb_color: "",
    food_protein: "0",
    food_protein_color: "",
    food_fat: "0",
    food_fat_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

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
    let section = sessionStorage.getItem("foodSection");

    // sectionArray 초기화
    if (section) {
      sectionArray = JSON.parse(section);
    }
    else {
      sectionArray = [];
    }
    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const newChecked = OBJECT.map((item) => (
      sectionArray.some((sectionItem) => (
        sectionItem.food_name === item.food_name &&
        sectionItem.food_gram === item.food_gram &&
        sectionItem.food_kcal === item.food_kcal &&
        sectionItem.food_carb === item.food_carb &&
        sectionItem.food_protein === item.food_protein &&
        sectionItem.food_fat === item.food_fat
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
    let sectionArray = [];
    let section = sessionStorage.getItem("foodSection");

    // sectionArray 초기화
    if (section) {
      sectionArray = JSON.parse(section);
    }
    else {
      sectionArray = [];
    }

    // 현재 쿼리와 페이지의 체크된 상태
    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const pageChecked = checkedQueries[queryKey] || [];

    // 체크된 항목들만 sectionArray에 추가 또는 제거
    OBJECT.forEach((item, index) => {
      if (pageChecked[index]) {
        if (!sectionArray.some((i) => (
          i.food_name === item.food_name &&
          i.food_gram === item.food_gram &&
          i.food_kcal === item.food_kcal &&
          i.food_carb === item.food_carb &&
          i.food_protein === item.food_protein &&
          i.food_fat === item.food_fat
        ))) {
          sectionArray.push(item);
        }
      }
      else {
        sectionArray = sectionArray.filter((i) => !(
          i.food_name === item.food_name &&
          i.food_gram === item.food_gram &&
          i.food_kcal === item.food_kcal &&
          i.food_carb === item.food_carb &&
          i.food_protein === item.food_protein &&
          i.food_fat === item.food_fat
        ));
      }
    });

    // sessionStorage에 저장
    sessionStorage.setItem("foodSection", JSON.stringify(sectionArray));

  }, [checkedQueries, PAGING.page, OBJECT]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowFind = async () => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/find`, {
      params: {
        PAGING: PAGING,
        lang: lang,
      },
    })
    .then((res) => {
      setOBJECT(res.data.result || []);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt ? res.data.totalCnt : 0,
      }));
      // Accordion 초기값 설정
      setIsExpanded(res.data.result.map((_, index) => (index)));
      // setIsExpanded([]);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 4. handler ------------------------------------------------------------------------------------
  // 체크박스 변경 시
  const handlerCheckboxChange = (index) => {
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
    const cardSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"find"}
          extra={"food"}
        />
      );
      const cardFragment = (i) => (
        OBJECT?.map((item, index) => (
          <Card className={"border radius shadow-none"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpanded.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"TbChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={(e) => {
                    setIsExpanded(isExpanded.includes(index)
                    ? isExpanded.filter((el) => el !== index)
                    : [...isExpanded, index]
                  )}}
                />
              }>
                <Grid container columnSpacing={2}
                  // 체크박스 체크
                  onClick={(e) => {
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
                  <Grid size={6} className={"d-left"}>
                    {/** 1 ~ 5 글자 **/}
                    {item.food_name.length >= 1 && item.food_name.length < 6 && (
                      <Div className={"fs-1-0rem fw-600 dark"}>
                        {item.food_name}
                      </Div>
                    )}
                    {/** 6 ~ 10 글자 **/}
                    {item.food_name.length >= 6 && item.food_name.length < 11 && (
                      <Div className={"fs-0-9rem fw-600 dark"}>
                        {item.food_name}
                      </Div>
                    )}
                    {/** 10 글자 이상 **/}
                    {item.food_name.length >= 11 && (
                      <Div className={"fs-0-8rem fw-600 dark"}>
                        {item.food_name}
                      </Div>
                    )}
                  </Grid>
                  <Grid size={4} className={"d-left"}>
                    {item.food_brand}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails><Br10 />
                {/** row 1 **/}
                <Grid container columnSpacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={food2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("kcal")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_kcal_color}`}>
                      {numeral(item.food_kcal).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("kc")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 2 **/}
                <Grid container columnSpacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={food3} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("carb")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_carb_color}`}>
                      {numeral(item.food_carb).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 3 **/}
                <Grid container columnSpacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={food4} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("protein")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_protein_color}`}>
                      {numeral(item.food_protein).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 4 **/}
                <Grid container columnSpacing={1}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={food5} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("fat")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.food_fat_color}`}>
                      {numeral(item.food_fat).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      return (
        LOADING ? <Loading /> : (
          COUNT.totalCnt === 0 ? emptyFragment() : cardFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min75vh"}>
        <Grid container columnSpacing={1}>
          <Grid size={12}>
            {cardSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

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
        navigate, flowFind
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {findNode()}
      {footerNode()}
    </>
  );
};