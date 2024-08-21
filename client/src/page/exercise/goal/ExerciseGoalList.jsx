// ExerciseGoalList.jsx

import { React, useState, useEffect } from "../../../import/ImportReacts.jsx";
import { useCommon, useStorage } from "../../../import/ImportHooks.jsx";
import { axios, numeral, moment } from "../../../import/ImportLibs.jsx";
import { Loading, Footer, Empty } from "../../../import/ImportLayouts.jsx";
import { Div, Img, Hr30, Br10, Icons } from "../../../import/ImportComponents.jsx";
import { Accordion, AccordionSummary, AccordionDetails } from "../../../import/ImportMuis.jsx";
import { Paper, Card, Grid } from "../../../import/ImportMuis.jsx";
import { exercise2, exercise3_1, exercise4, exercise5 } from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalList = () => {

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
    toSave: "/exercise/goal/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    _id: "",
    exercise_goal_number: 0,
    exercise_goal_dummy: "N",
    exercise_goal_dateType: "",
    exercise_goal_dateStart: "0000-00-00",
    exercise_goal_dateEnd: "0000-00-00",
    exercise_goal_count: "0",
    exercise_goal_count_color: "",
    exercise_goal_volume: "0",
    exercise_goal_volume_color: "",
    exercise_goal_weight: "0",
    exercise_goal_weight_color: "",
    exercise_goal_cardio: "00:00",
    exercise_goal_cardio_color: "",
    exercise_dateType: "",
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
    exercise_total_count: "0",
    exercise_total_count_color: "",
    exercise_total_volume: "0",
    exercise_total_volume_color: "",
    exercise_total_weight: "0",
    exercise_total_weight_color: "",
    exercise_total_cardio: "00:00",
    exercise_total_cardio_color: "",
    exercise_diff_count: "0",
    exercise_diff_count_color: "",
    exercise_diff_cardio: "00:00",
    exercise_diff_cardio_color: "",
    exercise_diff_volume: "0",
    exercise_diff_volume_color: "",
    exercise_diff_weight: "0",
    exercise_diff_weight_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/goal/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
      },
    })
    .then((res) => {
      setOBJECT(res.data.result && res.data.result.length > 0 ? res.data.result : OBJECT_DEF);
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
          type={"goal"}
          extra={"exercise"}
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
                      dateType: item.exercise_goal_dateType,
                      dateStart: item.exercise_goal_dateStart,
                      dateEnd: item.exercise_goal_dateEnd,
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
                    {item.exercise_goal_dateStart === item.exercise_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.exercise_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.exercise_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.exercise_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.exercise_goal_dateEnd).format("ddd"))}
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
                    <Img src={exercise2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("exerciseCount")}
                    </Div>
                  </Grid>
                  <Grid item xs={3} className={"d-column align-right lh-1-8"}>
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("goal")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("real")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("diff")}
                    </Div>
                  </Grid>
                  <Grid item xs={3} className={"d-column align-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_goal_count_color}`}>
                      {numeral(item.exercise_goal_count).format("0,0")}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_total_count_color}`}>
                      {numeral(item.exercise_total_count).format("0,0")}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_diff_count_color}`}>
                      {numeral(item.exercise_diff_count).format("+0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("c")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-6rem"}>
                      {translate("c")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-6rem"}>
                      {translate("c")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 2 **/}
                <Grid container>
                  <Grid item xs={2} className={"d-center"}>
                    <Img src={exercise3_1} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("volume")}
                    </Div>
                  </Grid>
                  <Grid item xs={3} className={"d-column align-right lh-1-8"}>
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("goal")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("real")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("diff")}
                    </Div>
                  </Grid>
                  <Grid item xs={3} className={"d-column align-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_goal_volume_color}`}>
                      {numeral(item.exercise_goal_volume).format("0,0")}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_total_volume_color}`}>
                      {numeral(item.exercise_total_volume).format("0,0")}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_diff_volume_color}`}>
                      {numeral(item.exercise_diff_volume).format("+0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("vol")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-6rem"}>
                      {translate("vol")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-6rem"}>
                      {translate("vol")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 3 **/}
                <Grid container>
                  <Grid item xs={2} className={"d-center"}>
                    <Img src={exercise4} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("cardio")}
                    </Div>
                  </Grid>
                  <Grid item xs={3} className={"d-column align-right lh-1-8"}>
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("goal")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("real")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("diff")}
                    </Div>
                  </Grid>
                  <Grid item xs={3} className={"d-column align-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_goal_cardio_color}`}>
                      {item.exercise_goal_cardio}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_total_cardio_color}`}>
                      {item.exercise_total_cardio}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_diff_cardio_color}`}>
                      {item.exercise_diff_cardio}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 4 **/}
                <Grid container>
                  <Grid item xs={2} className={"d-center"}>
                    <Img src={exercise5} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("weight")}
                    </Div>
                  </Grid>
                  <Grid item xs={3} className={"d-column align-right lh-1-8"}>
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("goal")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("real")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-8rem fw-500 dark me-10"}>
                      {translate("diff")}
                    </Div>
                  </Grid>
                  <Grid item xs={3} className={"d-column align-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_goal_weight_color}`}>
                      {item.exercise_goal_weight}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_total_weight_color}`}>
                      {item.exercise_total_weight}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.exercise_diff_weight_color}`}>
                      {item.exercise_diff_weight}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("k")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-6rem"}>
                      {translate("k")}
                    </Div>
                    <Br10 />
                    <Div className={"fs-0-6rem"}>
                      {translate("k")}
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