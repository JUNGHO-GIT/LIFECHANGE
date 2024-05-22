// ExerciseDiff.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {useDate, useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper, TableContainer, Table, Link} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDiff = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-1. useStorage (리스트에서만 사용) ---------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD")
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave: "/exercise/plan/save"
  });
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 5
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    exercise_dateType: "",
    exercise_dateStart: "0000-00-00",
    exercise_dateEnd: "0000-00-00",
    exercise_total_count: 0,
    exercise_total_volume: 0,
    exercise_body_weight: 0,
    exercise_total_cardio: "00:00",
    exercise_plan_dateType: "",
    exercise_plan_dateStart: "0000-00-00",
    exercise_plan_dateEnd: "0000-00-00",
    exercise_plan_count: 0,
    exercise_plan_volume: 0,
    exercise_plan_weight: 0,
    exercise_plan_cardio: "00:00",
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
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/diff/list`, {
      params: {
        user_id: sessionId,
        FILTER: FILTER,
        PAGING: PAGING,
        DATE: DATE
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [
    sessionId,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit,
    DATE.dateType, DATE.dateStart, DATE.dateEnd
  ]);

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6-1. table
    const tableFragmentEmpty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("common-category")}</TableCell>
              <TableCell>{translate("exercise-count")}</TableCell>
              <TableCell>{translate("exercise-volume")}</TableCell>
              <TableCell>{translate("exercise-cardio")}</TableCell>
              <TableCell>{translate("exercise-weight")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={7}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-2. table
    const tableFragment = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("common-category")}</TableCell>
              <TableCell>{translate("exercise-count")}</TableCell>
              <TableCell>{translate("exercise-volume")}</TableCell>
              <TableCell>{translate("exercise-cardio")}</TableCell>
              <TableCell>{translate("exercise-weight")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={4} className={"pointer"}>
                  <Link>
                    <Div>{item.exercise_plan_dateStart?.substring(5, 10)}</Div>
                    <Div>~</Div>
                    <Div>{item.exercise_plan_dateEnd?.substring(5, 10)}</Div>
                  </Link>
                </TableCell>
                <TableCell rowSpan={4}>
                  {item.exercise_plan_dateType}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`plan-${index}`}>
                <TableCell>
                  {translate("common-plan")}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_plan_count).format("0,0")} 회`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_plan_volume).format("0,0")} vol`}
                </TableCell>
                <TableCell>
                  {item.exercise_plan_cardio}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_plan_weight).format("0,0")} kg`}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`real-${index}`}>
                <TableCell>
                  {translate("common-real")}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_total_count).format("0,0")} 회`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_total_volume).format("0,0")} vol`}
                </TableCell>
                <TableCell>
                  {item.exercise_total_cardio}
                </TableCell>
                <TableCell>
                  {`${numeral(item.exercise_body_weight).format("0,0")} kg`}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`diff-${index}`}>
                <TableCell>
                  {translate("common-diff")}
                </TableCell>
                <TableCell className={item.exercise_diff_count_color}>
                  {`${numeral(item.exercise_diff_count).format("0,0")} 회`}
                </TableCell>
                <TableCell className={item.exercise_diff_volume_color}>
                  {`${numeral(item.exercise_diff_volume).format("0,0")} vol`}
                </TableCell>
                <TableCell className={item.exercise_diff_cardio_color}>
                  {item.exercise_diff_cardio}
                </TableCell>
                <TableCell className={item.exercise_diff_weight_color}>
                  {`${numeral(item.exercise_diff_weight).format("0,0")} kg`}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min100vw h-min67vh"}>
        <Div className={"d-column"}>
          {COUNT.totalCnt === 0 ? tableFragmentEmpty() : tableFragment(0)}
        </Div>
      </Div>
    );
    // 7-7. return
    return (
      <Paper className={"content-wrapper border radius"}>
        {tableSection()}
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, FILTER, SEND, PAGING, COUNT
      }}
      functions={{
        setDATE, setFILTER, setSEND, setPAGING, setCOUNT
      }}
      handlers={{
        navigate
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};