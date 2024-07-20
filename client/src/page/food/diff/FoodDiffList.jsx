// FoodDiffList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../../import/ImportHooks.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Img, Hr30, Br10, Icons} from "../../../import/ImportComponents.jsx";
import {Accordion, AccordionSummary, AccordionDetails} from "../../../import/ImportMuis.jsx";
import {Paper, Card} from "../../../import/ImportMuis.jsx";
import {food2, food3, food4, food5} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodDiff = () => {

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
    toSave: "/food/goal/save",
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
    food_goal_number: 0,
    food_goal_dummy: false,
    food_goal_dateStart: "0000-00-00",
    food_goal_dateEnd: "0000-00-00",
    food_goal_kcal: 0,
    food_goal_carb: 0,
    food_goal_protein: 0,
    food_goal_fat: 0,
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_total_fat: 0,
    food_diff_kcal: 0,
    food_diff_carb: 0,
    food_diff_protein: 0,
    food_diff_fat: 0,
    food_diff_kcal_color: "",
    food_diff_carb_color: "",
    food_diff_protein_color: "",
    food_diff_fat_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/diff/list`, {
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
      }));// Accordion 초기값 설정
      // setIsExpanded(res.data.result.map((_, index) => (index)));
      setIsExpanded([]);
    })
    .catch((err) => {
      console.error(err);
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
      const emptyFragment = () => (
        <Card className={"border radius shadow-none p-10"} key={"empty"}>
          <Div className={"d-center"}>
            {translate("empty")}
          </Div>
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
                <Div className={"d-center"}>
                  <Div className={"fs-1-1rem fw-600 d-left"}>
                    {item.food_goal_dateStart === item.food_goal_dateEnd ? (
                      <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                        e.stopPropagation();
                      }}>
                        <Div>{item.food_goal_dateStart?.substring(5, 10)}</Div>
                      </Div>
                    ) : (
                      <Div className={"d-left fs-1-2rem fw-600"} onClick={(e) => {
                        e.stopPropagation();
                      }}>
                        <Div>{item.food_goal_dateStart?.substring(5, 10)}</Div>
                        <Div className={"ms-1vw me-1vw"}> ~ </Div>
                        <Div>{item.food_goal_dateEnd?.substring(5, 10)}</Div>
                      </Div>
                    )}
                  </Div>
                </Div>
              </AccordionSummary>
              <AccordionDetails>
                <Div className={"d-between"}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      <Img src={food2} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("kcal")}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-10"}>
                      {translate("diff")}
                    </Div>
                  </Div>
                  <Div className={"d-column"}>
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("goal")}
                      </Div>
                      <Div className={"fs-1-0rem fw-600"}>
                        {numeral(item.food_goal_kcal).format("0,0")}
                      </Div>
                    </Div>
                    <Br10 />
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("real")}
                      </Div>
                      <Div className={"fs-1-0rem fw-600"}>
                        {numeral(item.food_total_kcal).format("0,0")}
                      </Div>
                    </Div>
                    <Br10 />
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("diff")}
                      </Div>
                      <Div className={`fs-1-0rem fw-600 ${item.food_diff_kcal_color}`}>
                        {numeral(item.food_diff_kcal).format("0,0")}
                      </Div>
                    </Div>
                  </Div>
                </Div>
                <Hr30 />
                <Div className={"d-between"}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      <Img src={food3} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("carb")}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-10"}>
                      {translate("diff")}
                    </Div>
                  </Div>
                  <Div className={"d-column"}>
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("goal")}
                      </Div>
                      <Div className={"fs-1-0rem fw-600"}>
                        {numeral(item.food_goal_carb).format("0,0")}
                      </Div>
                    </Div>
                    <Br10 />
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("real")}
                      </Div>
                      <Div className={"fs-1-0rem fw-600"}>
                        {numeral(item.food_total_carb).format("0,0")}
                      </Div>
                    </Div>
                    <Br10 />
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("diff")}
                      </Div>
                      <Div className={`fs-1-0rem fw-600 ${item.food_diff_carb_color}`}>
                        {numeral(item.food_diff_carb).format("0,0")}
                      </Div>
                    </Div>
                  </Div>
                </Div>
                <Hr30 />
                <Div className={"d-between"}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      <Img src={food4} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("protein")}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-10"}>
                      {translate("diff")}
                    </Div>
                  </Div>
                  <Div className={"d-column"}>
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("goal")}
                      </Div>
                      <Div className={"fs-1-0rem fw-600"}>
                        {numeral(item.food_goal_protein).format("0,0")}
                      </Div>
                    </Div>
                    <Br10 />
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("real")}
                      </Div>
                      <Div className={"fs-1-0rem fw-600"}>
                        {numeral(item.food_total_protein).format("0,0")}
                      </Div>
                    </Div>
                    <Br10 />
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("diff")}
                      </Div>
                      <Div className={`fs-1-0rem fw-600 ${item.food_diff_protein_color}`}>
                        {numeral(item.food_diff_protein).format("0,0")}
                      </Div>
                    </Div>
                  </Div>
                </Div>
                <Hr30 />
                <Div className={"d-between"}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      <Img src={food5} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-600 dark"}>
                      {translate("fat")}
                    </Div>
                    <Div className={"fs-0-9rem fw-500 dark ms-10"}>
                      {translate("diff")}
                    </Div>
                  </Div>
                  <Div className={"d-column"}>
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("goal")}
                      </Div>
                      <Div className={"fs-1-0rem fw-600"}>
                        {numeral(item.food_goal_fat).format("0,0")}
                      </Div>
                    </Div>
                    <Br10 />
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("real")}
                      </Div>
                      <Div className={"fs-1-0rem fw-600"}>
                        {numeral(item.food_total_fat).format("0,0")}
                      </Div>
                    </Div>
                    <Br10 />
                    <Div className={"d-right"}>
                      <Div className={"fs-0-8rem fw-500 dark me-10"}>
                        {translate("diff")}
                      </Div>
                      <Div className={`fs-1-0rem fw-600 ${item.food_diff_fat_color}`}>
                        {numeral(item.food_diff_fat).format("0,0")}
                      </Div>
                    </Div>
                  </Div>
                </Div>
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
      <Paper className={"content-wrapper radius border shadow-none pb-30"}>
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