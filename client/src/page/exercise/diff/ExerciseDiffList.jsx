// ExerciseDiff.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Img, Hr30, Br10, Icons} from "../../../import/ImportComponents.jsx";
import {Accordion, AccordionSummary, AccordionDetails} from "../../../import/ImportMuis.jsx";
import {Paper, Card, Grid} from "../../../import/ImportMuis.jsx";
import {exercise3, exercise4, exercise5} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseDiff = () => {

  // 1. common -------------------------------------------------------------------------------------
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
    toSave: "/exercise/goal/save",
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
    exercise_goal_number: 0,
    exercise_goal_dummy: false,
    exercise_goal_dateStart: "0000-00-00",
    exercise_goal_dateEnd: "0000-00-00",
    exercise_goal_count: 0,
    exercise_goal_volume: 0,
    exercise_goal_weight: 0,
    exercise_goal_cardio: "00:00",
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
    exercise_total_count: 0,
    exercise_total_volume: 0,
    exercise_body_weight: 0,
    exercise_total_cardio: "00:00",
    exercise_diff_count: 0,
    exercise_diff_cardio: "00:00",
    exercise_diff_volume: 0,
    exercise_diff_weight: 0,
    exercise_diff_count_color: "",
    exercise_diff_cardio_color: "",
    exercise_diff_volume_color: "",
    exercise_diff_weight_color: "",
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
                <Div className={"fs-1-1rem fw-bolder d-left"}>
                  {item.exercise_goal_dateStart === item.exercise_goal_dateEnd ? (
                    <Div className={"fs-1-2rem fw-bolder d-left"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.exercise_goal_dateStart?.substring(5, 10)}</Div>
                    </Div>
                  ) : (
                    <Div className={"fs-1-2rem fw-bolder d-left"} onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <Div>{item.exercise_goal_dateStart?.substring(5, 10)}</Div>
                      <Div>~</Div>
                      <Div>{item.exercise_goal_dateEnd?.substring(5, 10)}</Div>
                    </Div>
                  )}
                </Div>
              </Div>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-bold dark"}>
                      <Img src={exercise3} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-bold dark me-5"}>
                      {translate("volume")}
                    </Div>
                    <Div className={"fs-0-9rem fw-normal dark"}>
                      {translate("diff")}
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Div className={"d-center"}>
                    <Div className={"fs-0-8rem fw-normal dark me-10"}>
                      {translate("goal")}
                    </Div>
                    <Div className={"fs-0-8rem fw-bold"}>
                      {numeral(item.exercise_goal_volume).format("0,0")}
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Div className={"d-center"}>
                    <Div className={"fs-0-8rem fw-normal dark me-10"}>
                      {translate("real")}
                    </Div>
                    <Div className={"fs-0-8rem fw-bold"}>
                      {numeral(item.exercise_total_volume).format("0,0")}
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Div className={"d-center"}>
                    <Div className={"fs-0-8rem fw-normal dark me-10"}>
                      {translate("diff")}
                    </Div>
                    <Div className={`fs-0-8rem fw-bold ${item.exercise_diff_volume_color}`}>
                      {numeral(item.exercise_diff_volume).format("0,0")}
                    </Div>
                  </Div>
                </Grid>

                <Hr30 />

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-bold dark"}>
                      <Img src={exercise4} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-bold dark me-5"}>
                      {translate("cardio")}
                    </Div>
                    <Div className={"fs-0-9rem fw-normal dark"}>
                      {translate("diff")}
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Div className={"d-center"}>
                    <Div className={"fs-0-8rem fw-normal dark me-10"}>
                      {translate("goal")}
                    </Div>
                    <Div className={"fs-0-8rem fw-bold"}>
                      {item.exercise_goal_cardio}
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Div className={"d-center"}>
                    <Div className={"fs-0-8rem fw-normal dark me-10"}>
                      {translate("real")}
                    </Div>
                    <Div className={"fs-0-8rem fw-bold"}>
                      {item.exercise_total_cardio}
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Div className={"d-center"}>
                    <Div className={"fs-0-8rem fw-normal dark me-10"}>
                      {translate("diff")}
                    </Div>
                    <Div className={`fs-0-8rem fw-bold ${item.exercise_diff_cardio_color}`}>
                      {item.exercise_diff_cardio}
                    </Div>
                  </Div>
                </Grid>

                <Hr30 />

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Div className={"d-left"}>
                    <Div className={"fs-1-0rem fw-bold dark"}>
                      <Img src={exercise5} className={"w-15 h-15"} />
                    </Div>
                    <Div className={"fs-1-0rem fw-bold dark me-5"}>
                      {translate("weight")}
                    </Div>
                    <Div className={"fs-0-9rem fw-normal dark"}>
                      {translate("diff")}
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Div className={"d-center"}>
                    <Div className={"fs-0-8rem fw-normal dark me-10"}>
                      {translate("goal")}
                    </Div>
                    <Div className={"fs-0-8rem fw-bold"}>
                      {numeral(item.exercise_goal_weight).format("0,0")}
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Div className={"d-center"}>
                    <Div className={"fs-0-8rem fw-normal dark me-10"}>
                      {translate("real")}
                    </Div>
                    <Div className={"fs-0-8rem fw-bold"}>
                      {numeral(item.exercise_body_weight).format("0,0")}
                    </Div>
                  </Div>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                  <Div className={"d-center"}>
                    <Div className={"fs-0-8rem fw-normal dark me-10"}>
                      {translate("diff")}
                    </Div>
                    <Div className={`fs-0-8rem fw-bold ${item.exercise_diff_weight_color}`}>
                      {numeral(item.exercise_diff_weight).format("0,0")}
                    </Div>
                  </Div>
                </Grid>
              </Grid>
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