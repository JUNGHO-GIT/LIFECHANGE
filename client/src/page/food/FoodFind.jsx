// FoodFind.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../import/ImportLibs.jsx";
import {log} from "../../import/ImportUtils.jsx";
import {useStorage, useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer, Empty} from "../../import/ImportLayouts.jsx";
import {Div, Hr30, Br10, Img, Icons} from "../../import/ImportComponents.jsx";
import {Paper, Card, Checkbox, Grid} from "../../import/ImportMuis.jsx";
import {Accordion, AccordionSummary, AccordionDetails} from "../../import/ImportMuis.jsx";
import {food2, food3, food4, food5} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodFind = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) -----------------------------------------------------------
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
    sort: "asc",
    query: "",
    page: 0,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const [checkedQueries, setCheckedQueries] = useState({});
  const [isExpanded, setIsExpanded] = useState([0]);
  const [LOADING, setLOADING] = useState(false);
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: location_dateStart || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
    dateEnd: location_dateEnd || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
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
    food_count: 0,
    food_serv: "",
    food_gram: 0,
    food_kcal: 0,
    food_carb: 0,
    food_protein: 0,
    food_fat: 0,
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
    await axios.get(`${URL_OBJECT}/find`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
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

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-3. table
    const tableSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"find"}
          extra={"food"}
        />
      );
      const tableFragment = (i) => (
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
                <Grid container>
                  <Grid item xs={2} className={"d-center"}>
                    <Checkbox
                      key={`check-${index}`}
                      color={"primary"}
                      size={"small"}
                      checked={
                        !! (
                          checkedQueries[`${PAGING.query}_${PAGING.page}`] &&
                          checkedQueries[`${PAGING.query}_${PAGING.page}`][index]
                        )
                      }
                      onChange={() => {
                        handlerCheckboxChange(index);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} className={"d-left"}>
                    {/** 15자 넘어가면 ... 처리 */}
                    {isExpanded.includes(index) ? (
                      <Div className={"fs-1-0rem fw-600 dark"}>
                        {item.food_name}
                      </Div>
                    ) : (
                      <Div className={"fs-1-0rem fw-600 dark"}>
                        {item.food_name.length > 15 ? (
                          `${item.food_name.substring(0, 15)}...`
                        ) : item.food_name}
                      </Div>
                    )}
                  </Grid>
                  <Grid item xs={4} className={"d-left"}>
                    {item.food_brand}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails><Br10 />
                {/** row 1 **/}
                <Grid container>
                  <Grid item xs={2} className={"d-center"}>
                    <Img src={food2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("kcal")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.food_kcal).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("kc")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 2 **/}
                <Grid container>
                  <Grid item xs={2} className={"d-center"}>
                    <Img src={food3} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("carb")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.food_carb).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 3 **/}
                <Grid container>
                  <Grid item xs={2} className={"d-center"}>
                    <Img src={food4} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("protein")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.food_protein).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("g")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 4 **/}
                <Grid container>
                  <Grid item xs={2} className={"d-center"}>
                    <Img src={food5} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("fat")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.food_fat).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-right lh-2-4"}>
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
        LOADING ? loadingFragment() : (
          COUNT.totalCnt === 0 ? emptyFragment() : tableFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min75vh"}>
          {tableSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, PAGING, SEND, COUNT
      }}
      functions={{
        setDATE, setPAGING, setSEND, setCOUNT
      }}
      handlers={{
        navigate, flowFind
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};