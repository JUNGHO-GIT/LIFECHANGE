// ExerciseDiff.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Img} from "../../../import/ImportComponents.jsx";
import {Paper, Card, TableContainer, Table} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";
import {exercise3, exercise4, exercise5} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDiff = () => {

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
    exercise_plan_number: 0,
    exercise_plan_demo: false,
    exercise_plan_dateStart: "0000-00-00",
    exercise_plan_dateEnd: "0000-00-00",
    exercise_plan_count: 0,
    exercise_plan_volume: 0,
    exercise_plan_weight: 0,
    exercise_plan_cardio: "00:00",
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
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
      <Card className={"border radius p-10"} key={"empty"}>
        <Div className={"d-center"}>
          {translate("common-empty")}
        </Div>
      </Card>
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      OBJECT?.map((item, index) => (
        <Card className={"border radius p-10"} key={`${index}-${i}`}>
          <TableContainer>
            <Table>
              <TableHead className={"table-thead"}>
                <TableRow className={"table-tbody-tr"}>
                  <TableCell colSpan={5}>
                    {item.exercise_plan_dateStart === item.exercise_plan_dateEnd ? (
                      <Div className={"fs-1-2rem fw-bolder d-left"}>
                        <Div>{item.exercise_plan_dateStart?.substring(5, 10)}</Div>
                      </Div>
                    ) : (
                      <Div className={"fs-1-2rem fw-bolder d-left"}>
                        <Div>{item.exercise_plan_dateStart?.substring(5, 10)}</Div>
                        <Div>~</Div>
                        <Div>{item.exercise_plan_dateEnd?.substring(5, 10)}</Div>
                      </Div>
                    )}
                  </TableCell>
                  <TableCell colSpan={1}>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                <TableRow className={"table-tbody-tr border-top"}>
                  <TableCell colSpan={6}>
                    <Div className={"d-left dark fw-bold"}>
                      <Img src={exercise3} className={"w-15 h-15"} />
                      {translate("exercise-volume")}
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr"}>
                  <TableCell>
                    <Div className={"d-left dark fs-0-8rem"}>
                      {translate("common-plan")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left fw-bold"}>
                      {numeral(item.exercise_plan_volume).format("0,0")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left dark fs-0-8rem"}>
                      {translate("common-real")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left fw-bold"}>
                      {numeral(item.exercise_total_volume).format("0,0")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left dark fs-0-8rem"}>
                      {translate("common-diff")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={`d-left fw-bold ${item.exercise_diff_volume_color}`}>
                      {numeral(item.exercise_diff_volume).format("0,0")}
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr border-top"}>
                  <TableCell colSpan={6}>
                    <Div className={"d-left dark fw-bold"}>
                      <Img src={exercise4} className={"w-15 h-15"} />
                      {translate("exercise-cardio")}
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr"}>
                  <TableCell>
                    <Div className={"d-left dark fs-0-8rem"}>
                      {translate("common-plan")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left fw-bold"}>
                      {item.exercise_plan_cardio}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left dark fs-0-8rem"}>
                      {translate("common-real")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left fw-bold"}>
                      {item.exercise_total_cardio}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left dark fs-0-8rem"}>
                      {translate("common-diff")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={`d-left fw-bold ${item.exercise_diff_cardio_color}`}>
                      {item.exercise_diff_cardio}
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr border-top"}>
                  <TableCell colSpan={6}>
                    <Div className={"d-left dark fw-bold"}>
                      <Img src={exercise5} className={"w-15 h-15"} />
                      {translate("exercise-weight")}
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr"}>
                  <TableCell>
                    <Div className={"d-left dark fs-0-8rem"}>
                      {translate("common-plan")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left fw-bold"}>
                      {numeral(item.exercise_plan_weight).format("0,0")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left dark fs-0-8rem"}>
                      {translate("common-real")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left fw-bold"}>
                      {numeral(item.exercise_body_weight).format("0,0")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={"d-left dark fs-0-8rem"}>
                      {translate("common-diff")}
                    </Div>
                  </TableCell>
                  <TableCell>
                    <Div className={`d-left fw-bold ${item.exercise_diff_weight_color}`}>
                      {numeral(item.exercise_diff_weight).format("0,0")}
                    </Div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
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