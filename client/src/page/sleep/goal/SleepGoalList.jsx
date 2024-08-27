// SleepGoalList.jsx
// Node -> Section -> Fragment

import { React, useState, useEffect } from "../../../import/ImportReacts.jsx";
import { useCommon, useStorage } from "../../../import/ImportHooks.jsx";
import { axios, moment } from "../../../import/ImportLibs.jsx";
import { Loading, Footer } from "../../../import/ImportLayouts.jsx";
import { Empty, Div, Img, Hr30, Br10, Icons } from "../../../import/ImportComponents.jsx";
import { Accordion, AccordionSummary, AccordionDetails } from "../../../import/ImportMuis.jsx";
import { Paper, Card, Grid } from "../../../import/ImportMuis.jsx";
import { sleep2, sleep3, sleep4 } from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepGoalList = () => {

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
    toSave: "/sleep/goal/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    _id: "",
    sleep_goal_number: 0,
    sleep_goal_dummy: "N",
    sleep_goal_dateType: "",
    sleep_goal_dateStart: "0000-00-00",
    sleep_goal_dateEnd: "0000-00-00",
    sleep_goal_bedTime: "00:00",
    sleep_goal_bedTime_color: "",
    sleep_goal_wakeTime: "00:00",
    sleep_goal_wakeTime_color: "",
    sleep_goal_sleepTime: "00:00",
    sleep_goal_sleepTime_color: "",
    sleep_dateType: "",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_bedTime: "00:00",
    sleep_bedTime_color: "",
    sleep_wakeTime: "00:00",
    sleep_wakeTime_color: "",
    sleep_sleepTime: "00:00",
    sleep_sleepTime_color: "",
    sleep_diff_bedTime: "00:00",
    sleep_diff_bedTime_color: "",
    sleep_diff_wakeTime: "00:00",
    sleep_diff_wakeTime_color: "",
    sleep_diff_sleepTime: "00:00",
    sleep_diff_sleepTime_color: ""
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/goal/list`, {
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
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateStart, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {
    // 1. cardSection
    const cardSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"goal"}
          extra={"sleep"}
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
                <Grid container className={"w-100p"}
                  onClick={(e) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.sleep_goal_dateType,
                      dateStart: item.sleep_goal_dateStart,
                      dateEnd: item.sleep_goal_dateEnd,
                    });
                    navigate(SEND.toSave, {
                      state: SEND
                    });
                  }}
                >
                  <Grid size={2} className={"d-center"}>
                    <Icons
                      name={"TbSearch"}
                      className={"w-18 h-18 black"}
                      onClick={() => {}}
                    />
                  </Grid>
                  <Grid size={10} className={"d-left"}>
                    {item.sleep_goal_dateStart === item.sleep_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_goal_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails><Br10 />
                {/** row 1 **/}
                <Grid container className={"w-100p"}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={sleep2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("bedTime")}
                    </Div>
                  </Grid>
                  <Grid size={3} className={"d-column align-right lh-1-8"}>
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
                  <Grid size={3} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.sleep_goal_bedTime}
                    </Div>
                    <Br10 />
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.sleep_bedTime}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_bedTime_color}`}>
                      {item.sleep_diff_bedTime}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-column align-right lh-2-4"}>
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
                {/** row 2 **/}
                <Grid container className={"w-100p"}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={sleep3} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("wakeTime")}
                    </Div>
                  </Grid>
                  <Grid size={3} className={"d-column align-right lh-1-8"}>
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
                  <Grid size={3} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.sleep_goal_wakeTime}
                    </Div>
                    <Br10 />
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.sleep_wakeTime}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_wakeTime_color}`}>
                      {item.sleep_diff_wakeTime}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-column align-right lh-2-4"}>
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
                {/** row 3 **/}
                <Hr30 />
                <Grid container className={"w-100p"}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={sleep4} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("sleepTime")}
                    </Div>
                  </Grid>
                  <Grid size={3} className={"d-column align-right lh-1-8"}>
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
                  <Grid size={3} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.sleep_goal_sleepTime}
                    </Div>
                    <Br10 />
                    <Div className={"fs-1-0rem fw-600"}>
                      {item.sleep_sleepTime}
                    </Div>
                    <Br10 />
                    <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_sleepTime_color}`}>
                      {item.sleep_diff_sleepTime}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-column align-right lh-2-4"}>
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
        <Grid container className={"w-100p"}>
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
        DATE, SEND, PAGING, COUNT
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT
      }}
      flow={{
        navigate
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {footerNode()}
    </>
  );
};