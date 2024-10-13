// ExerciseList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { Exercise } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportUtils";
import { Loading, Footer, Empty, Dialog } from "@imports/ImportLayouts";
import { Div, Hr, Icons, Img } from "@imports/ImportComponents";
import { Paper, Card, Grid } from "@imports/ImportMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const ExerciseList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, TITLE, sessionId, toDetail } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getDayNotFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();

  // 2-1. useStorageLocal ------------------------------------------------------------------------
  const [DATE, setDATE] = useStorageLocal(
    `${TITLE}_date_(${PATH})`, {
      dateType: location_dateType || "",
      dateStart: location_dateStart || getDayFmt(),
      dateEnd: location_dateEnd || getDayFmt(),
    }
  );
  const [PAGING, setPAGING] = useStorageLocal(
    `${TITLE}_paging_(${PATH})`, {
      sort: "asc",
      page: 1,
    }
  );
  const [isExpanded, setIsExpanded] = useStorageLocal(
    `${TITLE}_isExpanded_(${PATH})`, [{
      expanded: true
    }]
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>([Exercise]);
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
    axios.get(`${URL_OBJECT}/exist`, {
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
    axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      setOBJECT(res.data.result.length > 0 ? res.data.result : [Exercise]);
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
                    dateType: item.exercise_dateType,
                    dateStart: item.exercise_dateStart,
                    dateEnd: item.exercise_dateEnd,
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
                    {item.exercise_dateStart?.substring(5, 10)}
                  </Div>
                  <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                    {translate(getDayNotFmt(item.exercise_dateStart).format("ddd"))}
                  </Div>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1} columns={12}>
                {/** row 1 **/}
                <Grid size={2} className={"d-row-center"}>
                  <Img
                    key={"exercise3_1"}
                    src={"exercise3_1"}
                    className={"w-15 h-15"}
                  />
                </Grid>
                <Grid size={3} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate("volume")}
                  </Div>
                </Grid>
                <Grid size={7}>
                  <Grid container spacing={1} columns={12}>
                    <Grid size={10} className={"d-row-right"}>
                      <Div className={`${item.exercise_total_volume_color}`}>
                        {numeral(item.exercise_total_volume).format("0,0")}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate("vol")}
                      </Div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Hr px={30} />
              {/** row 2 **/}
              <Grid container spacing={1} columns={12}>
                <Grid size={2} className={"d-center"}>
                  <Img
                    key={"exercise4"}
                    src={"exercise4"}
                    className={"w-15 h-15"}
                  />
                </Grid>
                <Grid size={3} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate("cardio")}
                  </Div>
                </Grid>
                <Grid size={7}>
                  <Grid container spacing={1} columns={12}>
                    <Grid size={10} className={"d-row-right"}>
                      <Div className={`${item.exercise_total_cardio_color}`}>
                        {item.exercise_total_cardio}
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
              <Hr px={30} />
              {/** row 3 **/}
              <Grid container spacing={1} columns={12}>
                <Grid size={2} className={"d-center"}>
                  <Img
                    key={"exercise5"}
                    src={"exercise5"}
                    className={"w-15 h-15"}
                  />
                </Grid>
                <Grid size={3} className={"d-row-left"}>
                  <Div className={"fs-0-9rem fw-600 dark"}>
                    {translate("weight")}
                  </Div>
                </Grid>
                <Grid size={7}>
                  <Grid container spacing={1} columns={12}>
                    <Grid size={10} className={"d-row-right"}>
                      <Div className={`${item.exercise_total_weight_color}`}>
                        {item.exercise_total_weight}
                      </Div>
                    </Grid>
                    <Grid size={2} className={"d-row-right"}>
                      <Div className={"fs-0-6rem"}>
                        {translate("k")}
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
                  <Empty extra={"exercise"} />
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
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-column-center"}>
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