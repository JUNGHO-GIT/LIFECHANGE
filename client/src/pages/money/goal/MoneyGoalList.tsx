// MoneyGoalList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorage } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { MoneyGoal } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportUtils";
import { Loading, Footer, Empty, Dialog } from "@imports/ImportLayouts";
import { Div, Img, Hr, Br, Icons } from "@imports/ImportComponents";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";
import { Paper, Card, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const MoneyGoalList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, TITLE, sessionId, localCurrency, toDetail } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getDayNotFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `${TITLE}_date_(${PATH})`, {
      dateType: location_dateType || "",
      dateStart: location_dateStart || getDayFmt(),
      dateEnd: location_dateEnd || getDayFmt(),
    }
  );
  const [PAGING, setPAGING] = useStorage(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );
  const [isExpanded, setIsExpanded] = useStorage(
    `${TITLE}_isExpanded_(${PATH})`, [{
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
          expanded: prev?.[i]?.expanded ?? true
        }))
      ));
    })
    .catch((err: any) => {
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
        <Card className={"border-1 radius-1"}>
          <Accordion className={"shadow-0"} expanded={isExpanded[i].expanded}>
            <AccordionSummary className={"me-n10"} expandIcon={
              <Icons
                key={"ChevronDown"}
                name={"ChevronDown"}
                className={"w-18 h-18"}
                onClick={() => {
                  setIsExpanded(isExpanded.map((el: any, index: number) => (
                    i === index ? {
                      expanded: !el.expanded
                    } : el
                  )));
                }}
              />
            }>
              <Grid container spacing={1} columns={12} onClick={(e: any) => {
                e.stopPropagation();
                navigate(toDetail, {
                  state: {
                    id: item._id,
                    dateType: item.money_goal_dateType,
                    dateStart: item.money_goal_dateStart,
                    dateEnd: item.money_goal_dateEnd,
                  }
                });
              }}>
                <Grid size={2} className={"d-row-center"}>
                  <Icons
                    key={"Search"}
                    name={"Search"}
                    className={"w-18 h-18"}
                  />
                </Grid>
                <Grid size={10} className={"d-row-left"}>
                  <Div className={"fs-1-1rem fw-600 black me-5"}>
                    {item.money_goal_dateStart?.substring(5, 10)}
                  </Div>
                  <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                    {translate(getDayNotFmt(item.money_goal_dateStart).format("ddd"))}
                  </Div>
                  <Div className={"fs-1-0rem fw-500 dark ms-10 me-10"}>
                    ~
                  </Div>
                  <Div className={"fs-1-1rem fw-600 black me-5"}>
                    {item.money_goal_dateEnd?.substring(5, 10)}
                  </Div>
                  <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                    {translate(getDayNotFmt(item.money_goal_dateEnd).format("ddd"))}
                  </Div>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} columns={12}>
                {/** row 1 **/}
                <Grid size={2} className={"d-row-center"}>
                  <Img
                    key={"money2"}
                    src={"money2"}
                    className={"w-15 h-15"}
                  />
                </Grid>
                <Grid size={3} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate("income")}
                  </Div>
                </Grid>
                <Grid size={7}>
                  <Grid container spacing={1} columns={12}>
                    {/** goal **/}
                    <Grid size={3} className={"d-row-right"}>
                      <Div className={"fs-0-7rem fw-500 dark"}>
                        {translate("goal")}
                      </Div>
                    </Grid>
                    <Grid size={7} className={"d-row-right"}>
                      <Div className={`${item.money_goal_income_color}`}>
                        {numeral(item.money_goal_income).format("0,0")}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate(localCurrency)}
                      </Div>
                    </Grid>
                    <Br px={1} />
                    {/** real **/}
                    <Grid size={3} className={"d-row-right"}>
                      <Div className={"fs-0-7rem fw-500 dark"}>
                        {translate("real")}
                      </Div>
                    </Grid>
                    <Grid size={7} className={"d-row-right"}>
                      <Div className={`${item.money_total_income_color}`}>
                        {numeral(item.money_total_income).format("0,0")}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate(localCurrency)}
                      </Div>
                    </Grid>
                    <Br px={1} />
                    {/** diff **/}
                    <Grid size={3} className={"d-row-right"}>
                      <Div className={"fs-0-7rem fw-500 dark"}>
                        {translate("diff")}
                      </Div>
                    </Grid>
                    <Grid size={7} className={"d-row-right"}>
                      <Div className={`${item.money_diff_income_color}`}>
                        {numeral(item.money_diff_income).format("+0,0")}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate(localCurrency)}
                      </Div>
                    </Grid>
                  </Grid>
                </Grid>
                <Hr px={10} />
                {/** row 2 **/}
                <Grid size={2} className={"d-row-center"}>
                  <Img
                    key={"money2"}
                    src={"money2"}
                    className={"w-15 h-15"}
                  />
                </Grid>
                <Grid size={3} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate("expense")}
                  </Div>
                </Grid>
                <Grid size={7}>
                  <Grid container spacing={1} columns={12}>
                    {/** goal **/}
                    <Grid size={3} className={"d-row-right"}>
                      <Div className={"fs-0-7rem fw-500 dark"}>
                        {translate("goal")}
                      </Div>
                    </Grid>
                    <Grid size={7} className={"d-row-right"}>
                      <Div className={`${item.money_goal_expense_color}`}>
                        {numeral(item.money_goal_expense).format("0,0")}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate(localCurrency)}
                      </Div>
                    </Grid>
                    <Br px={1} />
                    {/** real **/}
                    <Grid size={3} className={"d-row-right"}>
                      <Div className={"fs-0-7rem fw-500 dark"}>
                        {translate("real")}
                      </Div>
                    </Grid>
                    <Grid size={7} className={"d-row-right"}>
                      <Div className={`${item.money_total_expense_color}`}>
                        {numeral(item.money_total_expense).format("0,0")}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate(localCurrency)}
                      </Div>
                    </Grid>
                    <Br px={1} />
                    {/** diff **/}
                    <Grid size={3} className={"d-row-right"}>
                      <Div className={"fs-0-7rem fw-500 dark"}>
                        {translate("diff")}
                      </Div>
                    </Grid>
                    <Grid size={7} className={"d-row-right"}>
                      <Div className={`${item.money_diff_expense_color}`}>
                        {numeral(item.money_diff_expense).format("+0,0")}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate(localCurrency)}
                      </Div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Card>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            {OBJECT?.map((item: any, i: number) => (
              <Grid size={12} key={`list-${i}`}>
                {COUNT.totalCnt === 0 ? (
                  <Empty extra={"money"} />
                ) : (
                  listFragment(item, i)
                )}
              </Grid>
            ))}
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
            {LOADING ? (
              <>
                <Loading />
              </>
            ) : (
              <>
                {listSection()}
              </>
            )}
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