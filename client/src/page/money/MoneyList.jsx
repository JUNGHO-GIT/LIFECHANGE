// MoneyList.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Hr20, Br10, Img, Icons} from "../../import/ImportComponents.jsx";
import {Paper, Card} from "../../import/ImportMuis.jsx";
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
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) -----------------------------------------------------------
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD"),
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
    money_dummy: false,
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
      setOBJECT(res.data.result || OBJECT_DEF);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err) => {
      console.error("err", err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-6. empty
    const tableEmpty = () => (
      <Card className={"border radius p-10"} key={"empty"}>
        <Div className={"d-center"}>
          {translate("empty")}
        </Div>
      </Card>
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      OBJECT?.map((item, index) => (
        <Card className={"border radius p-10"} key={`${index}-${i}`}>
          <Accordion className={"shadow-none"}>
            <AccordionSummary expandIcon={
              <Icons name={"TbChevronDown"} className={"w-18 h-18 black"} onClick={(e) => {
                setIsExpanded(isExpanded.includes(index) ? isExpanded.filter((el) => el !== index) : [...isExpanded, index]);
              }}/>
            }>
              <Div className={"d-column"} onClick={(e) => {e.stopPropagation();}}>
                <Div className={"fs-1-1rem fw-bolder d-left ms-n15"}>
                  <Icons name={"TbSearch"} className={"w-18 h-18 black me-15"} onClick={(e) => {
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
                  }} />
                  {item.money_dateStart === item.money_dateEnd ? (
                    <Div className={"fs-1-2rem fw-bolder d-left"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.money_dateStart?.substring(5, 10)}</Div>
                    </Div>
                  ) : (
                    <Div className={"fs-1-2rem fw-bolder d-left"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.money_dateStart?.substring(5, 10)}</Div>
                      <Div>~</Div>
                      <Div>{item.money_dateEnd?.substring(5, 10)}</Div>
                    </Div>
                  )}
                </Div>
              </Div>
            </AccordionSummary>
            <AccordionDetails>
              <Div className={"d-left dark fw-bold"}>
                <Img src={money2} className={"w-15 h-15"} />
                {translate("income")}
              </Div>
              <Br10 />
              <Div className={"d-left fw-bold"}>
                <Div className={"fs-0-7rem dark fw-normal me-8"}>
                  {translate("currency")}
                </Div>
                {numeral(item.money_total_income).format("0,0")}
              </Div>
              <Hr20 />
              <Div className={"d-left dark fw-bold"}>
                <Img src={money2} className={"w-15 h-15"} />
                {translate("expense")}
              </Div>
              <Br10 />
              <Div className={"d-left fw-bold"}>
                <Div className={"fs-0-7rem dark fw-normal me-8"}>
                  {translate("currency")}
                </Div>
                {numeral(item.money_total_expense).format("0,0")}
              </Div>
            </AccordionDetails>
          </Accordion>
        </Card>
      ))
    );
    // 7-8. loading
    const loadingNode = () => (
      <Loading
        LOADING={LOADING}
        setLOADING={setLOADING}
      />
    );
    // 7-8. table
    const tableSection = () => (
      LOADING ? loadingNode() : (
        COUNT.totalCnt === 0 ? tableEmpty() : tableFragment(0)
      )
    );
    // 7-9. first
    const firstSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min67vh"}>
          {firstSection()}
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