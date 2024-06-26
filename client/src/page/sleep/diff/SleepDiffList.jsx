// SleepDiffList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../../import/ImportHooks.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Img, Hr30, Br10, Icons} from "../../../import/ImportComponents.jsx";
import {Accordion, AccordionSummary, AccordionDetails} from "../../../import/ImportMuis.jsx";
import {Paper, Card} from "../../../import/ImportMuis.jsx";
import {sleep2, sleep3, sleep4} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepDiff = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
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
    toSave: "/sleep/goal/save",
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
    sleep_goal_number: 0,
    sleep_goal_dummy: false,
    sleep_goal_dateStart: "0000-00-00",
    sleep_goal_dateEnd: "0000-00-00",
    sleep_goal_bedTime: "00:00",
    sleep_goal_wakeTime: "00:00",
    sleep_goal_sleepTime: "00:00",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_bedTime: "00:00",
    sleep_wakeTime: "00:00",
    sleep_sleepTime: "00:00",
    sleep_diff_bedTime: "00:00",
    sleep_diff_wakeTime: "00:00",
    sleep_diff_time: "00:00",
    sleep_diff_bedTime_color: "",
    sleep_diff_wakeTime_color: "",
    sleep_diff_time_color: ""
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
          <Accordion className={"shadow-none"} expanded={isExpanded.includes(index)}>
            <AccordionSummary expandIcon={
              <Icons name={"TbChevronDown"} className={"w-18 h-18 black"} onClick={(e) => {
                setIsExpanded(isExpanded.includes(index) ? isExpanded.filter((el) => el !== index) : [...isExpanded, index]);
              }}/>
            }>
              <Div className={"d-column"} onClick={(e) => {e.stopPropagation();}}>
                {item.sleep_goal_dateStart === item.sleep_goal_dateEnd ? (
                  <Div className={"d-left fs-1-4rem fw-bolder"} onClick={(e) => {
                    e.stopPropagation();
                  }}>
                    <Div>{item.sleep_goal_dateStart?.substring(5, 10)}</Div>
                  </Div>
                ) : (
                  <Div className={"d-left fs-1-4rem fw-bolder"} onClick={(e) => {
                    e.stopPropagation();
                  }}>
                    <Div>{item.sleep_goal_dateStart?.substring(5, 10)}</Div>
                    <Div>~</Div>
                    <Div>{item.sleep_goal_dateEnd?.substring(5, 10)}</Div>
                  </Div>
                )}
              </Div>
            </AccordionSummary>
            <AccordionDetails>
              <Div className={"d-left"}>
                <Div className={"fs-1-0rem fw-bold dark"}>
                  <Img src={sleep2} className={"w-15 h-15"} />
                </Div>
                <Div className={"fs-1-0rem fw-bold dark me-5"}>
                  {translate("bedTime")}
                </Div>
                <Div className={"fs-0-9rem fw-normal dark"}>
                  {translate("diff")}
                </Div>
              </Div>

              <Br10 />

              <Div className={"d-left"}>
                <Div className={"fs-0-8rem fw-normal dark me-10"}>
                  {translate("goal")}
                </Div>
                <Div className={"fs-1-0rem fw-bold"}>
                  {item.sleep_goal_bedTime}
                </Div>
              </Div>

              <Br10 />

              <Div className={"d-left"}>
                <Div className={"fs-0-8rem fw-normal dark me-10"}>
                  {translate("real")}
                </Div>
                <Div className={"fs-1-0rem fw-bold"}>
                  {item.sleep_bedTime}
                </Div>
              </Div>

              <Br10 />

              <Div className={"d-left"}>
                <Div className={"fs-0-8rem fw-normal dark me-10"}>
                  {translate("diff")}
                </Div>
                <Div className={`fs-1-0rem fw-bold ${item.sleep_diff_bedTime_color}`}>
                  {item.sleep_diff_bedTime}
                </Div>
              </Div>

              <Hr30 />

              <Div className={"d-left"}>
                <Div className={"fs-1-0rem fw-bold dark"}>
                  <Img src={sleep3} className={"w-15 h-15"} />
                </Div>
                <Div className={"fs-1-0rem fw-bold dark me-5"}>
                  {translate("wakeTime")}
                </Div>
                <Div className={"fs-0-9rem fw-normal dark"}>
                  {translate("diff")}
                </Div>
              </Div>

              <Br10 />

              <Div className={"d-left"}>
                <Div className={"fs-0-8rem fw-normal dark me-10"}>
                  {translate("goal")}
                </Div>
                <Div className={"fs-1-0rem fw-bold"}>
                  {item.sleep_goal_wakeTime}
                </Div>
              </Div>

              <Br10 />

              <Div className={"d-left"}>
                <Div className={"fs-0-8rem fw-normal dark me-10"}>
                  {translate("real")}
                </Div>
                <Div className={"fs-1-0rem fw-bold"}>
                  {item.sleep_wakeTime}
                </Div>
              </Div>

              <Br10 />

              <Div className={"d-left"}>
                <Div className={"fs-0-8rem fw-normal dark me-10"}>
                  {translate("diff")}
                </Div>
                <Div className={`fs-1-0rem fw-bold ${item.sleep_diff_wakeTime_color}`}>
                  {item.sleep_diff_wakeTime}
                </Div>
              </Div>

              <Hr30 />

              <Div className={"d-left"}>
                <Div className={"fs-1-0rem fw-bold dark"}>
                  <Img src={sleep4} className={"w-15 h-15"} />
                </Div>
                <Div className={"fs-1-0rem fw-bold dark me-5"}>
                  {translate("sleepTime")}
                </Div>
                <Div className={"fs-0-9rem fw-normal dark"}>
                  {translate("diff")}
                </Div>
              </Div>

              <Br10 />

              <Div className={"d-left"}>
                <Div className={"fs-0-8rem fw-normal dark me-10"}>
                  {translate("goal")}
                </Div>
                <Div className={"fs-1-0rem fw-bold"}>
                  {item.sleep_goal_sleepTime}
                </Div>
              </Div>

              <Br10 />

              <Div className={"d-left"}>
                <Div className={"fs-0-8rem fw-normal dark me-10"}>
                  {translate("real")}
                </Div>
                <Div className={"fs-1-0rem fw-bold"}>
                  {item.sleep_sleepTime}
                </Div>
              </Div>

              <Br10 />

              <Div className={"d-left"}>
                <Div className={"fs-0-8rem fw-normal dark me-10"}>
                  {translate("diff")}
                </Div>
                <Div className={`fs-1-0rem fw-bold ${item.sleep_diff_time_color}`}>
                  {item.sleep_diff_time}
                </Div>
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