// SleepList.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../imports/ImportReacts.jsx";
import { useCommon, useStorage } from "../../imports/ImportHooks.jsx";
import { axios, moment } from "../../imports/ImportLibs.jsx";
import { Loading, Footer } from "../../imports/ImportLayouts.jsx";
import { Div, Hr, Img, Icons } from "../../imports/ImportComponents.jsx";
import { Empty } from "../../imports/ImportContainers.jsx";
import { Paper, Card, Grid } from "../../imports/ImportMuis.jsx";
import { Accordion, AccordionSummary, AccordionDetails } from "../../imports/ImportMuis.jsx";
import { sleep2, sleep3, sleep4 } from "../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { navigate, location_dateStart, location_dateEnd, PATH, URL_OBJECT, sessionId, translate, koreanDate } = useCommon();

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
    toSave: "/sleep/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    _id: "",
    sleep_number: 0,
    sleep_dummy: "N",
    sleep_dateType: "",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_section: [{
      sleep_bedTime: "00:00",
      sleep_bedTime_color: "",
      sleep_wakeTime: "00:00",
      sleep_wakeTime_color: "",
      sleep_sleepTime: "00:00",
      sleep_sleepTime_color: "",
    }],
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

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
    const cardSection = () => {
      const emptyFragment = () => (
        <Empty
          DATE={DATE}
          SEND={SEND}
          navigate={navigate}
          type={"real"}
          extra={"sleep"}
        />
      );
      const cardFragment = (i) => (
        OBJECT?.map((item, index) => (
          <Card className={"border radius"} key={`${index}-${i}`}>
            <Accordion className={"shadow-none"} expanded={isExpanded.includes(index)}>
              <AccordionSummary
                className={"pb-10"}
                expandIcon={
                  <Icons
                    name={"TbChevronDown"}
                    className={"w-18 h-18 black"}
                    onClick={(e) => {
                      setIsExpanded(isExpanded.includes(index)
                      ? isExpanded.filter((el) => el !== index)
                      : [...isExpanded, index]
                    )}}
                  />
                }
              >
                <Grid container columnSpacing={2}
                  onClick={(e) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.sleep_dateType,
                      dateStart: item.sleep_dateStart,
                      dateEnd: item.sleep_dateEnd,
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
                    {item.sleep_dateStart === item.sleep_dateEnd ? (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_dateStart).format("ddd"))}
                        </Div>
                      </>
                    ) : (
                      <>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_dateStart?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_dateStart).format("ddd"))}
                        </Div>
                        <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                          ~
                        </Div>
                        <Div className={"fs-1-2rem fw-600"}>
                          {item.sleep_dateEnd?.substring(5, 10)}
                        </Div>
                        <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                          {translate(moment(item.sleep_dateEnd).format("ddd"))}
                        </Div>
                      </>
                    )}
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails>
                {/** row 1 **/}
                <Grid container columnSpacing={1} rowSpacing={2}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={sleep2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("bedTime")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.sleep_section[0]?.sleep_bedTime_color}`}>
                      {item.sleep_section[0]?.sleep_bedTime}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 2 **/}
                <Grid container columnSpacing={1} rowSpacing={2}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={sleep3} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("wakeTime")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.sleep_section[0]?.sleep_wakeTime_color}`}>
                      {item.sleep_section[0]?.sleep_wakeTime}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("hm")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr px={30} />
                {/** row 3 **/}
                <Grid container columnSpacing={1} rowSpacing={2}>
                  <Grid size={2} className={"d-center"}>
                    <Img src={sleep4} className={"w-15 h-15"} />
                  </Grid>
                  <Grid size={3} className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("sleepTime")}
                    </Div>
                  </Grid>
                  <Grid size={6} className={"d-right"}>
                    <Div className={`fs-1-0rem fw-600 ${item.sleep_section[0]?.sleep_sleepTime_color}`}>
                      {item.sleep_section[0]?.sleep_sleepTime}
                    </Div>
                  </Grid>
                  <Grid size={1} className={"d-right lh-2-4"}>
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
        <Grid container columnSpacing={1} rowSpacing={2}>
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