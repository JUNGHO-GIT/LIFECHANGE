// SleepGoalList.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { SleepGoal } from "@importSchemas";
import { axios } from "@importLibs";
import { Footer, Empty, Dialog } from "@importLayouts";
import { Div, Img, Hr, Icons, Paper, Grid, Card } from "@importComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const SleepGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, toDetail } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getDayNotFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal ------------------------------------------------------------------------
  const [DATE, setDATE] = useStorageLocal(
    "date", PATH, "", {
      dateType: location_dateType || "",
      dateStart: location_dateStart || getDayFmt(),
      dateEnd: location_dateEnd || getDayFmt(),
    }
  );
  const [PAGING, setPAGING] = useStorageLocal(
    "paging", PATH, "", {
      sort: "asc",
      page: 1,
    }
  );
  const [isExpanded, setIsExpanded] = useStorageLocal(
    "isExpanded", PATH, "", [{
      expanded: true
    }]
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState<any>([SleepGoal]);
  const [EXIST, setEXIST] = useState<any>({
    day: [""],
    week: [""],
    month: [""],
    year: [""],
    select: [""],
  });
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
    axios.get(`${URL_OBJECT}/goal/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: "",
          dateStart: getMonthStartFmt(DATE.dateStart),
          dateEnd: getMonthEndFmt(DATE.dateEnd),
        },
      },
    })
    .then((res: any) => {
      setEXIST(
        !res.data.result || res.data.result.length === 0 ? [""] : res.data.result
      );
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/goal/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd,
        },
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
      // 응답 길이만큼 expanded 초기화
      setIsExpanded(
        Array(res.data.result.length).fill({ expanded: false })
      );
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, PAGING.sort, PAGING.page, DATE.dateStart, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {
    const listSection = () => {
      const listFragment = () => (
        <Grid container={true} spacing={0}>
          {OBJECT.filter((f: any) => f._id).map((item: any, i: number) => (
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
                      navigate(toDetail, {
                        state: {
                          id: item._id,
                          dateType: item.sleep_goal_dateType,
                          dateStart: item.sleep_goal_dateStart,
                          dateEnd: item.sleep_goal_dateEnd,
                        }
                      });
                    }}
                  >
                    <Grid container={true} spacing={2}>
                      <Grid size={2} className={"d-row-center"}>
                        <Icons
                          key={"Search"}
                          name={"Search"}
                          className={"w-18px h-18px"}
                        />
                      </Grid>
                      <Grid size={10} className={"d-row-left"}>
                        <Div className={"fs-1-0rem fw-600 black"}>
                          {item.sleep_goal_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-0-9rem fw-500 dark ml-5px"}>
                          {translate(getDayNotFmt(item.sleep_goal_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-0-8rem fw-500 dark ml-5px mr-5px"}>
                          -
                        </Div>
                        <Div className={"fs-1-0rem fw-600 black"}>
                          {item.sleep_goal_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-0-9rem fw-500 dark ml-5px"}>
                          {translate(getDayNotFmt(item.sleep_goal_dateEnd).format("ddd"))}
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
                            src={"sleep2.webp"}
                          />
                        </Grid>
                        <Grid size={3} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
                            {translate("bedTime")}
                          </Div>
                        </Grid>
                        <Grid size={7}>
                          <Grid container={true} spacing={1}>
                            {/** goal **/}
                            <Grid size={4} className={"d-row-center"}>
                              <Div className={"fs-0-7rem fw-500 dark"}>
                                {translate("goal")}
                              </Div>
                            </Grid>
                            <Grid size={6} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.sleep_goal_bedTime_color}`}>
                                {item.sleep_goal_bedTime}
                              </Div>
                            </Grid>
                            <Grid size={2} className={"d-row-center"}>
                              <Div className={"fs-0-6rem"}>
                                {translate("hm")}
                              </Div>
                            </Grid>
                            {/** real **/}
                            <Grid size={4} className={"d-row-center"}>
                              <Div className={"fs-0-7rem fw-500 dark"}>
                                {translate("real")}
                              </Div>
                            </Grid>
                            <Grid size={6} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.sleep_bedTime_color}`}>
                                {item.sleep_bedTime}
                              </Div>
                            </Grid>
                            <Grid size={2} className={"d-row-center"}>
                              <Div className={"fs-0-6rem"}>
                                {translate("hm")}
                              </Div>
                            </Grid>
                            {/** diff **/}
                            <Grid size={4} className={"d-row-center"}>
                              <Div className={"fs-0-7rem fw-500 dark"}>
                                {translate("diff")}
                              </Div>
                            </Grid>
                            <Grid size={6} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_bedTime_color}`}>
                                {item.sleep_diff_bedTime}
                              </Div>
                            </Grid>
                            <Grid size={2} className={"d-row-center"}>
                              <Div className={"fs-0-6rem"}>
                                {translate("hm")}
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
                            src={"sleep3.webp"}
                          />
                        </Grid>
                        <Grid size={3} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
                            {translate("wakeTime")}
                          </Div>
                        </Grid>
                        <Grid size={7}>
                          <Grid container={true} spacing={1}>
                            {/** goal **/}
                            <Grid size={4} className={"d-row-center"}>
                              <Div className={"fs-0-7rem fw-500 dark"}>
                                {translate("goal")}
                              </Div>
                            </Grid>
                            <Grid size={6} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.sleep_goal_wakeTime_color}`}>
                                {item.sleep_goal_wakeTime}
                              </Div>
                            </Grid>
                            <Grid size={2} className={"d-row-center"}>
                              <Div className={"fs-0-6rem"}>
                                {translate("hm")}
                              </Div>
                            </Grid>
                            {/** real **/}
                            <Grid size={4} className={"d-row-center"}>
                              <Div className={"fs-0-7rem fw-500 dark"}>
                                {translate("real")}
                              </Div>
                            </Grid>
                            <Grid size={6} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.sleep_wakeTime_color}`}>
                                {item.sleep_wakeTime}
                              </Div>
                            </Grid>
                            <Grid size={2} className={"d-row-center"}>
                              <Div className={"fs-0-6rem"}>
                                {translate("hm")}
                              </Div>
                            </Grid>
                            {/** diff **/}
                            <Grid size={4} className={"d-row-center"}>
                              <Div className={"fs-0-7rem fw-500 dark"}>
                                {translate("diff")}
                              </Div>
                            </Grid>
                            <Grid size={6} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_wakeTime_color}`}>
                                {item.sleep_diff_wakeTime}
                              </Div>
                            </Grid>
                            <Grid size={2} className={"d-row-center"}>
                              <Div className={"fs-0-6rem"}>
                                {translate("hm")}
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
                            src={"sleep4.webp"}
                          />
                        </Grid>
                        <Grid size={3} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 dark ml-n15px"}>
                            {translate("sleepTime")}
                          </Div>
                        </Grid>
                        <Grid size={7}>
                          <Grid container={true} spacing={1}>
                            {/** goal **/}
                            <Grid size={4} className={"d-row-center"}>
                              <Div className={"fs-0-7rem fw-500 dark"}>
                                {translate("goal")}
                              </Div>
                            </Grid>
                            <Grid size={6} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.sleep_goal_sleepTime_color}`}>
                                {item.sleep_goal_sleepTime}
                              </Div>
                            </Grid>
                            <Grid size={2} className={"d-row-center"}>
                              <Div className={"fs-0-6rem"}>
                                {translate("hm")}
                              </Div>
                            </Grid>
                            {/** real **/}
                            <Grid size={4} className={"d-row-center"}>
                              <Div className={"fs-0-7rem fw-500 dark"}>
                                {translate("real")}
                              </Div>
                            </Grid>
                            <Grid size={6} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.sleep_sleepTime_color}`}>
                                {item.sleep_sleepTime}
                              </Div>
                            </Grid>
                            <Grid size={2} className={"d-row-center"}>
                              <Div className={"fs-0-6rem"}>
                                {translate("hm")}
                              </Div>
                            </Grid>
                            {/** diff **/}
                            <Grid size={4} className={"d-row-center"}>
                              <Div className={"fs-0-7rem fw-500 dark"}>
                                {translate("diff")}
                              </Div>
                            </Grid>
                            <Grid size={6} className={"d-row-right"}>
                              <Div className={`fs-1-0rem fw-600 ${item.sleep_diff_sleepTime_color}`}>
                                {item.sleep_diff_sleepTime}
                              </Div>
                            </Grid>
                            <Grid size={2} className={"d-row-center"}>
                              <Div className={"fs-0-6rem"}>
                                {translate("hm")}
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
          {COUNT.totalCnt === 0 ? <Empty DATE={DATE} extra={"sleep"} /> : listFragment()}
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
        DATE, SEND, PAGING, COUNT, EXIST
      }}
      setState={{
        setDATE, setSEND, setPAGING, setCOUNT, setEXIST
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {listNode()}
      {dialogNode()}
      {footerNode()}
    </>
  );
};