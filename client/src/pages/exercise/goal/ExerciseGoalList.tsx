// ExerciseGoalList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { ExerciseGoal } from "@imports/ImportSchemas";
import { axios, insertComma } from "@imports/ImportUtils";
import { Loading, Footer, Empty, Dialog } from "@imports/ImportLayouts";
import { Div, Img, Hr, Icons } from "@imports/ImportComponents";
import { Paper, Grid, Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, toDetail, localUnit } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getDayNotFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();

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
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>([ExerciseGoal]);
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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

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
      setOBJECT(res.data.result.length > 0 ? res.data.result : [ExerciseGoal]);
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
      // Accordion 초기값 설정
      // 이전 값이 있으면 유지하고 없으면 true로 설정
      setIsExpanded((prev: any) => (
        Array(res.data.result.length).fill(null).map((_, i) => ({
          expanded: prev?.[i]?.expanded ?? true
        }))
      ));
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, PAGING.sort, PAGING.page, DATE.dateStart, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {
    const listSection = () => {
      const listFragment = (item: any, i: number) => (
        <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
          <Grid size={12} className={"p-2"}>
            <Accordion expanded={isExpanded[i].expanded}>
              <AccordionSummary
                className={"me-n10"}
                expandIcon={
                  <Icons
                    key={"ChevronDown"}
                    name={"ChevronDown"}
                    className={"w-18 h-18"}
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
                      dateType: item.exercise_goal_dateType,
                      dateStart: item.exercise_goal_dateStart,
                      dateEnd: item.exercise_goal_dateEnd,
                    }
                  });
                }}
              >
                <Grid container spacing={2} columns={12}>
                  <Grid size={2} className={"d-row-center"}>
                    <Icons
                      key={"Search"}
                      name={"Search"}
                      className={"w-18 h-18"}
                    />
                  </Grid>
                  <Grid size={10} className={"d-row-left"}>
                    <Div className={"fs-1-0rem fw-600 black"}>
                      {item.exercise_goal_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.exercise_goal_dateStart).format("ddd"))}
                    </Div>
                    <Div className={"fs-0-8rem fw-500 dark ms-5 me-5"}>
                      -
                    </Div>
                    <Div className={"fs-1-0rem fw-600 black"}>
                      {item.exercise_goal_dateEnd?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.exercise_goal_dateEnd).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2} columns={12}>

                  {/** row 1 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                      max={15}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"exercise2"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("exerciseCount")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_goal_count_color}`}>
                          {insertComma(item.exercise_goal_count || "0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("c")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_count_color}`}>
                          {insertComma(item.exercise_total_count || "0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("c")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_diff_count_color}`}>
                          {insertComma(item.exercise_diff_count || "0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("c")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/** /.row 1 **/}

                  <Hr px={1} />

                  {/** row 2 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                      max={15}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"exercise3_1"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("volume")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_goal_volume_color}`}>
                          {insertComma(item.exercise_goal_volume || "0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("vol")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_volume_color}`}>
                          {insertComma(item.exercise_total_volume || "0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("vol")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_diff_volume_color}`}>
                          {insertComma(item.exercise_diff_volume || "0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("vol")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/** /.row 2 **/}

                  <Hr px={1} />

                  {/** row 3 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                      max={15}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"exercise4"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("cardio")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_goal_cardio_color}`}>
                          {item.exercise_goal_cardio}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("min")}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_cardio_color}`}>
                          {item.exercise_total_cardio}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("min")}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_diff_cardio_color}`}>
                          {item.exercise_diff_cardio}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("min")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/** /.row 3 **/}

                  <Hr px={1} />

                  {/** row 4 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                      max={15}
                      hover={true}
                      shadow={false}
                      radius={false}
                      src={"exercise5"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark ms-n15"}>
                      {translate("scale")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      {/** goal **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("goal")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_goal_scale_color}`}>
                          {insertComma(item.exercise_goal_scale || "0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {localUnit}
                        </Div>
                      </Grid>
                      {/** real **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("real")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_total_scale_color}`}>
                          {insertComma(item.exercise_total_scale || "0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {localUnit}
                        </Div>
                      </Grid>
                      {/** diff **/}
                      <Grid size={4} className={"d-row-center"}>
                        <Div className={"fs-0-7rem fw-500 dark"}>
                          {translate("diff")}
                        </Div>
                      </Grid>
                      <Grid size={6} className={"d-row-right"}>
                        <Div className={`${item.exercise_diff_scale_color}`}>
                          {insertComma(item.exercise_diff_scale || "0")}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-center"}>
                        <Div className={"fs-0-6rem"}>
                          {localUnit}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/** /.row 4 **/}

                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          {OBJECT?.map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              {COUNT.totalCnt === 0 ? (
                <Empty DATE={DATE} extra={"exercise"} />
              ) : (
                listFragment(item, i)
              )}
            </Grid>
          ))}
        </Grid>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {LOADING ? <Loading /> : listSection()}
          </Grid>
        </Grid>
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