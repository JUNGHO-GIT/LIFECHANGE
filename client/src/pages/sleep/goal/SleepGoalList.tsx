// SleepGoalList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useStorage } from "@imports/ImportHooks";
import { SleepGoal } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportLibs";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div, Img, Hr, Icons } from "@imports/ImportComponents";
import { Empty, Dial } from "@imports/ImportContainers";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";
import { Paper, Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const SleepGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt, getDayNotFmt,
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, PATH, URL_OBJECT, sessionId, TITLE, toDetail
  } = useCommonValue();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `${TITLE}_date_(${PATH})`, {
      dateType: location_dateType || "",
      dateStart: location_dateStart || dayFmt,
      dateEnd: location_dateEnd || dayFmt,
    }
  );
  const [PAGING, setPAGING] = useStorage(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpanded, setIsExpanded] = useState<number[]>([0]);
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>([SleepGoal]);
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
    .then((res: any) => {
      setOBJECT(res.data.result.length > 0 ? res.data.result : [SleepGoal]);
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
      // Accordion 초기값 설정
      setIsExpanded(res.data.result.map((_item: any, index: number) => index));
      // setIsExpanded([]);
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {
    // 1. listSection
    const listSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          extra={"sleep"}
        />
      );
      const listFragment = (i: number) => (
        OBJECT?.map((item: any, index: number) => (
          <Card className={"border-1 radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpanded.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons
                  name={"ChevronDown"}
                  className={"w-18 h-18 black"}
                  onClick={() => {
                    setIsExpanded(isExpanded.includes(index)
                    ? isExpanded.filter((el) => el !== index)
                    : [...isExpanded, index]
                  )}}
                />
              }>
                <Grid container spacing={2}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.sleep_goal_dateType,
                      dateStart: item.sleep_goal_dateStart,
                      dateEnd: item.sleep_goal_dateEnd,
                    });
                    navigate(toDetail, {
                      state: SEND
                    });
                  }}
                >
                  <Grid size={2} className={"d-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18 black"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    {item.sleep_goal_dateStart === item.sleep_goal_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.sleep_goal_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.sleep_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(getDayNotFmt(item.sleep_goal_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {/** row 1 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep2"}
                    	src={"sleep2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("bedTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_goal_bedTime_color}`}>
                          {item.sleep_goal_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_bedTime_color}`}>
                          {item.sleep_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_bedTime_color}`}>
                          {item.sleep_diff_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 2 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep3"}
                    	src={"sleep3"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("wakeTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_goal_wakeTime_color}`}>
                          {item.sleep_goal_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_wakeTime_color}`}>
                          {item.sleep_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_wakeTime_color}`}>
                          {item.sleep_diff_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={20} />
                {/** row 3 **/}
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep4"}
                    	src={"sleep4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("sleepTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container columns={12} spacing={1}>
                      {/** goal **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_goal_sleepTime_color}`}>
                          {item.sleep_goal_sleepTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_sleepTime_color}`}>
                          {item.sleep_sleepTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-8rem fw-500 dark horizontal-text"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={8} className={"d-row-right"}>
                        <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_sleepTime_color}`}>
                          {item.sleep_diff_sleepTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
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
        DATE, SEND, PAGING, COUNT
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT
      }}
      flow={{
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {dialNode()}
      {footerNode()}
    </>
  );
};