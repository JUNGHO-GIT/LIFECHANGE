// ExercisePlanList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Br20, Br10, Img, Icons} from "../../../import/ImportComponents.jsx";
import {Paper, Card, Link} from "../../../import/ImportMuis.jsx";
import {exercise3, exercise4, exercise5} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExercisePlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) ---------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "day",
      dateStart: moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD"),
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave: "/exercise/plan/save",
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

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    _id: "",
    exercise_plan_plan_number: 0,
    exercise_plan_plan_demo: false,
    exercise_plan_plan_dateStart: "0000-00-00",
    exercise_plan_plan_dateEnd: "0000-00-00",
    exercise_plan_plan_count: 0,
    exercise_plan_plan_volume: 0,
    exercise_plan_plan_weight: 0,
    exercise_plan_plan_cardio: "00:00"
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/plan/list`, {
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
      console.log("err", err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. empty
    const tableEmpty = () => (
      <Card className={"border radius p-0"} key={"empty"}>
        <Div className={"d-center"}>
          {translate("common-empty")}
        </Div>
      </Card>
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      OBJECT?.map((item, index) => (
        <Card className={"border radius p-20"} key={`${index}-${i}`}>
          <Div className={"align-left"}>
            <Div className={"d-between w-100p"}>
              <Link className={"black fs-1-2rem"}>
                {item.exercise_plan_dateStart === item.exercise_plan_dateEnd ? (
                  <>
                    <Div>{item.exercise_plan_dateStart?.substring(5, 10)}</Div>
                  </>
                ) : (
                  <>
                    <Div>{item.exercise_plan_dateStart?.substring(5, 10)}</Div>
                    <Div>~</Div>
                    <Div>{item.exercise_plan_dateEnd?.substring(5, 10)}</Div>
                  </>
                )}
              </Link>
              <Icons name={"TbSearch"} className={"black w-18 h-18"} onClick={() => {
                Object.assign(SEND, {
                  id: item._id,
                  dateType: item.exercise_plan_dateType,
                  dateStart: item.exercise_plan_dateStart,
                  dateEnd: item.exercise_plan_dateEnd,
                });
                navigate(SEND.toSave, {
                  state: SEND
                });
              }} />
            </Div>
          </Div>
          <Br20/>
          <Div className={"align-left"}>
            <Div className={"d-center"}>
              <Img src={exercise3} className={"w-15 h-15"} />
              <Div className={"dark me-10"}>
                {translate("exercise-planVolume")}
              </Div>
              {numeral(item.exercise_plan_volume).format('0,0')}
            </Div>
          </Div>
          <Br10/>
          <Div className={"align-left"}>
            <Div className={"d-center"}>
              <Img src={exercise4} className={"w-15 h-15"} />
              <Div className={"dark me-10"}>
                {translate("exercise-planCardio")}
              </Div>
              {item.exercise_plan_cardio}
            </Div>
          </Div>
          <Br10/>
          <Div className={"align-left"}>
            <Div className={"d-center"}>
              <Img src={exercise5} className={"w-15 h-15"} />
              <Div className={"dark me-10"}>
                {translate("exercise-planWeight")}
              </Div>
              {numeral(item.exercise_plan_weight).format('0,0')}
            </Div>
          </Div>
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

  // 9. footer ------------------------------------------------------------------------------------>
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

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};