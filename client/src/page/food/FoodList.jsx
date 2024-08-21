// FoodList.jsx

import { React, useState, useEffect } from "../../import/ImportReacts.jsx";
import { useCommon, useStorage } from "../../import/ImportHooks.jsx";
import { axios, numeral, moment } from "../../import/ImportLibs.jsx";
import { Loading, Footer, Empty } from "../../import/ImportLayouts.jsx";
import { Div, Hr30, Br10, Img, Icons } from "../../import/ImportComponents.jsx";
import { Paper, Card, Grid } from "../../import/ImportMuis.jsx";
import { Accordion, AccordionSummary, AccordionDetails } from "../../import/ImportMuis.jsx";
import { food2, food3, food4, food5 } from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, location_dateStart, location_dateEnd,
    PATH, firstStr, secondStr, thirdStr,
    URL_OBJECT, sessionId, translate, koreanDate,
  } = useCommon();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `DATE(${PATH})`, {
      dateType: "",
      dateStart: location_dateStart || koreanDate,
      dateEnd: location_dateEnd || koreanDate,
    }
  );
  const [PAGING, setPAGING] = useStorage(
    `PAGING(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpanded, setIsExpanded] = useState([0]);
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave: "/food/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    _id: "",
    food_number: 0,
    food_dummy: "N",
    food_dateType: "",
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: "0",
    food_total_kcal_color: "",
    food_total_carb: "0",
    food_total_carb_color: "",
    food_total_protein: "0",
    food_total_protein_color: "",
    food_total_fat: "0",
    food_total_fat_color: "",
    food_section: [{
      food_part_idx: 1,
      food_part_val: "breakfast",
      food_name: "",
      food_brand: "",
      food_count: "0",
      food_serv: "회",
      food_gram: "0",
      food_kcal: "0",
      food_carb: "0",
      food_protein: "0",
      food_fat: "0",
    }],
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
      },
    })
    .then((res) => {
      setOBJECT(res.data.result || OBJECT_DEF);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
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
  })()}, [sessionId, PAGING.sort, PAGING.page, DATE.dateStart, DATE.dateEnd]);

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-3. table
    const tableSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"real"}
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
                <Grid container
                  onClick={(e) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.food_dateType,
                      dateStart: item.food_dateStart,
                      dateEnd: item.food_dateEnd,
                    });
                    navigate(SEND.toSave, {
                      state: SEND
                    });
                  }}
                >
                  <Grid item xs={2} className={"d-center"}>
                    <Icons
                      name={"TbSearch"}
                      className={"w-18 h-18 black"}
                      onClick={() => {}}
                    />
                  </Grid>
                  <Grid item xs={10} className={"d-left"}>
                    {item.food_dateStart === item.food_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.food_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.food_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.food_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.food_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
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
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_kcal_color}`}>
                      {numeral(item.food_total_kcal).format("0,0")}
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
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_carb_color}`}>
                      {numeral(item.food_total_carb).format("0,0")}
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
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_protein_color}`}>
                      {numeral(item.food_total_protein).format("0,0")}
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
                    <Div className={`fs-1-0rem fw-600 ${item.food_total_fat_color}`}>
                      {numeral(item.food_total_fat).format("0,0")}
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
        LOADING ? <Loading /> : (
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
        DATE, SEND, PAGING, COUNT
      }}
      functions={{
        setDATE, setSEND, setPAGING, setCOUNT
      }}
      handlers={{
        navigate
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
