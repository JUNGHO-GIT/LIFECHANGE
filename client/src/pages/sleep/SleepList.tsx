// SleepList.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useStorage } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { Sleep } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { Loading, Footer, Empty, Dialog } from "@imports/ImportLayouts";
import { Div, Hr, Img, Icons } from "@imports/ImportComponents";
import { Paper, Card, Grid } from "@imports/ImportMuis";
import { Accordion, AccordionSummary, AccordionDetails } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const SleepList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, TITLE, sessionId, toDetail } = useCommonValue();
  const { navigate, location_dateType, location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt, getDayNotFmt, getMonthStartFmt, getMonthEndFmt } = useCommonDate();
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

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpanded, setIsExpanded] = useState<number[]>([0]);
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [OBJECT, setOBJECT] = useState<any>([Sleep]);
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
      setOBJECT(res.data.result.length > 0 ? res.data.result : [Sleep]);
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
      // Accordion 초기값 설정
      setIsExpanded(res.data.result.map((_item: any, index: number) => index));
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
      const listFragment = (i: number) => (
        OBJECT?.map((item: any, index: number) => (
          <Card className={"border-1 radius-1"} key={`${index}-${i}`}>
            <Accordion className={"shadow-0"} expanded={isExpanded.includes(index)}>
              <AccordionSummary className={"me-n10"} expandIcon={
                <Icons
                  key={"ChevronDown"}
                  name={"ChevronDown"}
                  className={"w-18 h-18"}
                  onClick={() => {
                    setIsExpanded(isExpanded.includes(index)
                    ? isExpanded.filter((el: number) => el !== index)
                    : [...isExpanded, index]
                  )}}
                />
              }>
                <Grid container spacing={1} columns={12} onClick={(e: any) => {
                  e.stopPropagation();
                  navigate(toDetail, {
                    state: {
                      id: item._id,
                      dateType: item.sleep_dateType,
                      dateStart: item.sleep_dateStart,
                      dateEnd: item.sleep_dateEnd,
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
                      {item.sleep_dateStart?.substring(5, 10)}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-5"}>
                      {translate(getDayNotFmt(item.sleep_dateStart).format("ddd"))}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1} columns={12}>
                  {/** row 1 **/}
                  <Grid size={2} className={"d-row-center"}>
                    <Img
                    	key={"sleep2"}
                    	src={"sleep2"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("bedTime")}
                    </Div>
                  </Grid>
                  <Grid size={7}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.sleep_section[0]?.sleep_bedTime_color}`}>
                          {item.sleep_section[0]?.sleep_bedTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={10} />
                  {/** row 2 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep3"}
                    	src={"sleep3"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("wakeTime")}
                    </Div>
                  </Grid>
                  <Grid size={7} className={"d-row-right"}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.sleep_section[0]?.sleep_wakeTime_color}`}>
                          {item.sleep_section[0]?.sleep_wakeTime}
                        </Div>
                      </Grid>
                      <Grid size={2} className={"d-row-right"}>
                        <Div className={"fs-0-6rem"}>
                          {translate("hm")}
                        </Div>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Hr px={10} />
                  {/** row 3 **/}
                  <Grid size={2} className={"d-center"}>
                    <Img
                    	key={"sleep4"}
                    	src={"sleep4"}
                    	className={"w-15 h-15"}
                    />
                  </Grid>
                  <Grid size={3} className={"d-row-left"}>
                    <Div className={"fs-0-9rem fw-600 dark"}>
                      {translate("sleepTime")}
                    </Div>
                  </Grid>
                  <Grid size={7} className={"d-row-right"}>
                    <Grid container spacing={1} columns={12}>
                      <Grid size={10} className={"d-row-right"}>
                        <Div className={`${item.sleep_section[0]?.sleep_sleepTime_color}`}>
                          {item.sleep_section[0]?.sleep_sleepTime}
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
      const emptyFragment = () => (
        <Empty
          SEND={SEND}
          extra={"sleep"}
        />
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={1} columns={12}>
            <Grid size={12}>
              {COUNT.totalCnt === 0 ? emptyFragment() : listFragment(0)}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
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
        DATE, SEND, PAGING, COUNT, EXIST,
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