// MoneyGoalList.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreAlert } from "@importHooks";
import { MoneyGoal } from "@importSchemas";
import { axios } from "@importLibs";
import { insertComma } from "@importScripts";
import { Loader, Footer, Empty, Dialog } from "@importLayouts";
import { Div, Img, Hr, Icons } from "@importComponents";
import { Paper, Grid, Card } from "@importMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const MoneyGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, localCurrency, toDetail } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getDayNotFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { ALERT, setALERT } = useStoreAlert();

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
  const [OBJECT, setOBJECT] = useState<any>([MoneyGoal]);
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
      setOBJECT(res.data.result.length > 0 ? res.data.result : [MoneyGoal]);
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
          expanded: prev?.[i]?.expanded || true
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
      setTimeout(() => {
        setLOADING(false);
      }, 300);
    });
  }, [URL_OBJECT, sessionId, PAGING.sort, PAGING.page, DATE.dateStart, DATE.dateEnd]);

  // 7. list ---------------------------------------------------------------------------------------
  const listNode = () => {
    const listSection = () => {
      const listFragment = () => (
        <Grid container={true} spacing={0}>
          {OBJECT.filter((f: any) => f._id).map((item: any, i: number) => (
            <Grid size={12} key={`list-${i}`}>
              <Grid container={true} spacing={0} className={"border-1 radius-1"}>
                <Grid size={12} className={"p-2"}>
                  <Accordion
                    expanded={isExpanded[i].expanded}
                    TransitionProps={{
                      mountOnEnter: true,
                      unmountOnExit: true,
                    }}
                  >
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
                            dateType: item.money_goal_dateType,
                            dateStart: item.money_goal_dateStart,
                            dateEnd: item.money_goal_dateEnd,
                          }
                        });
                      }}
                    >
                      <Grid container={true} spacing={2}>
                        <Grid size={2} className={"d-row-center"}>
                          <Icons
                            key={"Search"}
                            name={"Search"}
                            className={"w-18 h-18"}
                          />
                        </Grid>
                        <Grid size={10} className={"d-row-left"}>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.money_goal_dateStart?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                            {translate(getDayNotFmt(item.money_goal_dateStart).format("ddd"))}
                          </Div>
                          <Div className={"fs-0-8rem fw-500 dark ms-5 me-5"}>
                            -
                          </Div>
                          <Div className={"fs-1-0rem fw-600 black"}>
                            {item.money_goal_dateEnd?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                            {translate(getDayNotFmt(item.money_goal_dateEnd).format("ddd"))}
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
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"money2"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
                              {translate("income")}
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
                                <Div className={`fs-1-0rem fw-600 ${item.money_goal_income_color}`}>
                                  {insertComma(item.money_goal_income || "0")}
                                </Div>
                              </Grid>
                              <Grid size={2} className={"d-row-center"}>
                                <Div className={"fs-0-6rem"}>
                                  {translate(localCurrency)}
                                </Div>
                              </Grid>
                              {/** real **/}
                              <Grid size={4} className={"d-row-center"}>
                                <Div className={"fs-0-7rem fw-500 dark"}>
                                  {translate("real")}
                                </Div>
                              </Grid>
                              <Grid size={6} className={"d-row-right"}>
                                <Div className={`fs-1-0rem fw-600 ${item.money_total_income_color}`}>
                                  {insertComma(item.money_total_income || "0")}
                                </Div>
                              </Grid>
                              <Grid size={2} className={"d-row-center"}>
                                <Div className={"fs-0-6rem"}>
                                  {translate(localCurrency)}
                                </Div>
                              </Grid>
                              {/** diff **/}
                              <Grid size={4} className={"d-row-center"}>
                                <Div className={"fs-0-7rem fw-500 dark"}>
                                  {translate("diff")}
                                </Div>
                              </Grid>
                              <Grid size={6} className={"d-row-right"}>
                                <Div className={`fs-1-0rem fw-600 ${item.money_diff_income_color}`}>
                                  {insertComma(item.money_diff_income || "0")}
                                </Div>
                              </Grid>
                              <Grid size={2} className={"d-row-center"}>
                                <Div className={"fs-0-6rem"}>
                                  {translate(localCurrency)}
                                </Div>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        {/** /.row 1 **/}

                        <Hr px={1} />

                        {/** row 2 **/}
                        <Grid container={true} spacing={2}>
                          <Grid size={2} className={"d-row-center"}>
                            <Img
                              max={15}
                              hover={true}
                              shadow={false}
                              radius={false}
                              src={"money2"}
                            />
                          </Grid>
                          <Grid size={3} className={"d-row-left"}>
                            <Div className={"fs-1-0rem fw-600 dark ms-n15"}>
                              {translate("expense")}
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
                                <Div className={`fs-1-0rem fw-600 ${item.money_goal_expense_color}`}>
                                  {insertComma(item.money_goal_expense || "0")}
                                </Div>
                              </Grid>
                              <Grid size={2} className={"d-row-center"}>
                                <Div className={"fs-0-6rem"}>
                                  {translate(localCurrency)}
                                </Div>
                              </Grid>
                              {/** real **/}
                              <Grid size={4} className={"d-row-center"}>
                                <Div className={"fs-0-7rem fw-500 dark"}>
                                  {translate("real")}
                                </Div>
                              </Grid>
                              <Grid size={6} className={"d-row-right"}>
                                <Div className={`fs-1-0rem fw-600 ${item.money_total_expense_color}`}>
                                  {insertComma(item.money_total_expense || "0")}
                                </Div>
                              </Grid>
                              <Grid size={2} className={"d-row-center"}>
                                <Div className={"fs-0-6rem"}>
                                  {translate(localCurrency)}
                                </Div>
                              </Grid>
                              {/** diff **/}
                              <Grid size={4} className={"d-row-center"}>
                                <Div className={"fs-0-7rem fw-500 dark"}>
                                  {translate("diff")}
                                </Div>
                              </Grid>
                              <Grid size={6} className={"d-row-right"}>
                                <Div className={`fs-1-0rem fw-600 ${item.money_diff_expense_color}`}>
                                  {insertComma(item.money_diff_expense || "0")}
                                </Div>
                              </Grid>
                              <Grid size={2} className={"d-row-center"}>
                                <Div className={"fs-0-6rem"}>
                                  {translate(localCurrency)}
                                </Div>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                        {/** /.row 2 **/}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {COUNT.totalCnt === 0 ? <Empty DATE={DATE} extra={"money"} /> : listFragment()}
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        {LOADING ? <Loader /> : listSection()}
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