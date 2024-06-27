// FoodList.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Hr30, Br10, Img, Icons} from "../../import/ImportComponents.jsx";
import {Paper, Card} from "../../import/ImportMuis.jsx";
import {Accordion, AccordionSummary, AccordionDetails} from "../../import/ImportMuis.jsx";
import {food2, food3, food4, food5} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodList = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
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
    toSave: "/food/save",
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
    food_number: 0,
    food_dummy: false,
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "breakfast",
      food_title: "",
      food_count: 0,
      food_serv: "회",
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
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
      // Accordion 초기값 열림 설정
      setIsExpanded(res.data.result.map((_, index) => (index)));
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
    // 7-3. table
    const tableSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const tableEmpty = () => (
        <Card className={"border shadow-none p-10"} key={"empty"}>
          <Div className={"d-center"}>
            {translate("empty")}
          </Div>
        </Card>
      );
      const tableFragment = (i) => (
        OBJECT?.map((item, index) => (
          <Card className={"border shadow-none p-10"} key={`${index}-${i}`}>
            <Accordion expanded={isExpanded.includes(index)}>
              <AccordionSummary expandIcon={
                <Icons name={"TbChevronDown"} className={"w-18 h-18 black"} onClick={(e) => {
                  setIsExpanded(isExpanded.includes(index) ? isExpanded.filter((el) => el !== index) : [...isExpanded, index]);
                }}/>
              }>
                <Div className={"d-center"}>
                  <Icons name={"TbSearch"} className={"w-18 h-18 black ms-n10 me-15"} onClick={(e) => {
                    e.stopPropagation();
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.food_dateType,
                      dateStart: item.food_dateStart,
                      dateEnd: item.food_dateEnd,
                    });
                    navigate(SEND.toSave, {
                      state: SEND
                    });
                  }} />
                  {item.food_dateStart === item.food_dateEnd ? (
                    <Div className={"d-left fs-1-4rem fw-bolder"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.food_dateStart?.substring(5, 10)}</Div>
                    </Div>
                  ) : (
                    <Div className={"d-left fs-1-4rem fw-bolder"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.food_dateStart?.substring(5, 10)}</Div>
                      <Div>~</Div>
                      <Div>{item.food_dateEnd?.substring(5, 10)}</Div>
                    </Div>
                  )}
                </Div>
              </AccordionSummary>
              <AccordionDetails>
                <Div className={"d-left"}>
                  <Div className={"fs-1-0rem fw-bold dark"}>
                    <Img src={food2} className={"w-15 h-15"} />
                  </Div>
                  <Div className={"fs-1-0rem fw-bold dark me-5"}>
                    {translate("kcal")}
                  </Div>
                </Div>
                <Br10 />
                <Div className={"d-left"}>
                  <Div className={"fs-1-0rem fw-bold"}>
                    {numeral(item.food_total_kcal).format("0,0")}
                  </Div>
                  <Div className={"fs-0-7rem dark fw-normal ms-10"}>
                    {translate("k")}
                  </Div>
                </Div>
                <Hr30 />
                <Div className={"d-left"}>
                  <Div className={"fs-1-0rem fw-bold dark"}>
                    <Img src={food3} className={"w-15 h-15"} />
                  </Div>
                  <Div className={"fs-1-0rem fw-bold dark me-5"}>
                    {translate("carb")}
                  </Div>
                </Div>
                <Br10 />
                <Div className={"d-left"}>
                  <Div className={"fs-1-0rem fw-bold"}>
                    {numeral(item.food_total_carb).format("0,0")}
                  </Div>
                  <Div className={"fs-0-7rem dark fw-normal ms-10"}>
                    {translate("g")}
                  </Div>
                </Div>
                <Hr30 />
                <Div className={"d-left"}>
                  <Div className={"fs-1-0rem fw-bold dark"}>
                    <Img src={food4} className={"w-15 h-15"} />
                  </Div>
                  <Div className={"fs-1-0rem fw-bold dark me-5"}>
                    {translate("protein")}
                  </Div>
                </Div>
                <Br10 />
                <Div className={"d-left"}>
                  <Div className={"fs-1-0rem fw-bold"}>
                    {numeral(item.food_total_protein).format("0,0")}
                  </Div>
                  <Div className={"fs-0-7rem dark fw-normal ms-10"}>
                    {translate("g")}
                  </Div>
                </Div>
                <Hr30 />
                <Div className={"d-left"}>
                  <Div className={"fs-1-0rem fw-bold dark"}>
                    <Img src={food5} className={"w-15 h-15"} />
                  </Div>
                  <Div className={"fs-1-0rem fw-bold dark me-5"}>
                    {translate("fat")}
                  </Div>
                </Div>
                <Br10 />
                <Div className={"d-left"}>
                  <Div className={"fs-1-0rem fw-bold"}>
                    {numeral(item.food_total_fat).format("0,0")}
                  </Div>
                  <Div className={"fs-0-7rem dark fw-normal ms-10"}>
                    {translate("g")}
                  </Div>
                </Div>
              </AccordionDetails>
            </Accordion>
          </Card>
        ))
      );
      return (
        LOADING ? loadingFragment() : (
          COUNT.totalCnt === 0 ? tableEmpty() : tableFragment(0)
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min67vh"}>
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
