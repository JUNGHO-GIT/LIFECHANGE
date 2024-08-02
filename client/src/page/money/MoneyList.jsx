// MoneyList.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Hr30, Br10, Br20, Img, Icons} from "../../import/ImportComponents.jsx";
import {Paper, Card, Grid} from "../../import/ImportMuis.jsx";
import {Accordion, AccordionSummary, AccordionDetails} from "../../import/ImportMuis.jsx";
import {money2} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const MoneyList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [isExpanded, setIsExpanded] = useState([0]);
  const [LOADING, setLOADING] = useState(false);
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: location_dateStart || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
    dateEnd: location_dateEnd || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
  });
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave: "/money/save",
  });
  const [PAGING, setPAGING] = useState({
    sort: "asc",
    page: 1,
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = [{
    _id: "",
    money_number: 0,
    money_dummy: "N",
    money_dateStart: "0000-00-00",
    money_dateEnd: "0000-00-00",
    money_total_income: 0,
    money_total_expense: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/list`, {
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
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const emptyFragment = () => (
        <Card className={"border radius shadow-none p-10"} key={"empty-money"}>
          <Grid container>
            <Grid item xs={2} className={"d-center"}>
              <Icons
                name={"TbSearch"}
                className={"w-18 h-18 black"}
                onClick={(e) => {
                  e.stopPropagation();
                  Object.assign(SEND, {
                    dateType: "day",
                    dateStart: DATE.dateStart,
                    dateEnd: DATE.dateEnd,
                  });
                  navigate(SEND.toSave, {
                    state: SEND
                  });
                }}
              />
            </Grid>
            <Grid item xs={2} className={"d-left"}>
              <Div className={"fs-1-0rem fw-600 dark"}>
                {translate("money")}
              </Div>
            </Grid>
            <Grid item xs={8} className={"d-left"}>
              <Div className={"fs-1-0rem fw-500 black"}>
                {translate("empty")}
              </Div>
            </Grid>
          </Grid>
        </Card>
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
                <Grid container>
                  <Grid item xs={2} className={"d-column align-center pt-10"}>
                    <Icons
                      name={"TbSearch"}
                      className={"w-18 h-18 black"}
                      onClick={(e) => {
                        e.stopPropagation();
                        Object.assign(SEND, {
                          id: item._id,
                          dateType: item.money_dateType,
                          dateStart: item.money_dateStart,
                          dateEnd: item.money_dateEnd,
                        });
                        navigate(SEND.toSave, {
                          state: SEND
                        });
                      }}
                    />
                  </Grid>
                  <Grid item xs={2} className={"d-column align-left pt-10"}>
                    <Div className={"d-center"}>
                      <Div className={"fs-1-0rem fw-600 dark"}>
                        {translate("money")}
                      </Div>
                    </Div>
                  </Grid>
                  <Grid item xs={8} className={"d-column align-left pt-10"}>
                    <Div className={"d-center"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      {item.money_dateStart === item.money_dateEnd ? (
                        <>
                          <Div className={"fs-1-2rem fw-600"}>
                            {item.money_dateStart?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-1-0rem fw-500 dark ms-10"}>
                            {moment(item.money_dateStart).format("ddd")}
                          </Div>
                        </>
                      ) : (
                        <>
                          <Div className={"fs-1-2rem fw-600"}>
                            {item.money_dateStart?.substring(5, 10)}
                          </Div>
                          <Div className={"fs-1-0rem ms-3vw me-3vw"}>
                            ~
                          </Div>
                          <Div className={"fs-1-2rem fw-600"}>
                            {item.money_dateEnd?.substring(5, 10)}
                          </Div>
                        </>
                      )}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionSummary>
              <AccordionDetails><Br10 />
                {/** row 1 **/}
                <Grid container>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={money2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("income")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.money_total_income).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("currency")}
                    </Div>
                  </Grid>
                </Grid>
                <Hr30 />
                {/** row 2 **/}
                <Grid container>
                  <Grid item xs={2} className={"d-column align-center"}>
                    <Img src={money2} className={"w-15 h-15"} />
                  </Grid>
                  <Grid item xs={3} className={"d-column align-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("expense")}
                    </Div>
                  </Grid>
                  <Grid item xs={6} className={"d-column align-right"}>
                    <Div className={"fs-1-0rem fw-600"}>
                      {numeral(item.money_total_expense).format("0,0")}
                    </Div>
                  </Grid>
                  <Grid item xs={1} className={"d-column align-right lh-2-4"}>
                    <Div className={"fs-0-6rem"}>
                      {translate("currency")}
                    </Div>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      return (
        LOADING ? loadingFragment() : (
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