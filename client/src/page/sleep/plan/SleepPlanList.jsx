// SleepPlanList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper, TableContainer, Table, Link} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
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

  // 2-1. useStorage (리스트에서만 사용) ---------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").startOf("year").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("year").format("YYYY-MM-DD")
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
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave:"/sleep/plan/save"
  });
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 10
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(false);
  const [MORE, setMORE] = useState(true);
  const observer = useRef();

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    sleep_plan_dateType: "",
    sleep_plan_dateStart: "0000-00-00",
    sleep_plan_dateEnd: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00"
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    loadMoreData();
  }, []);

  // 2-4. useCallback ----------------------------------------------------------------------------->
  const loadMoreData = useCallback(async () => {
    if (LOADING || !MORE) {
      return;
    }
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/plan/list`, {
      params: {
        user_id: sessionId,
        FILTER: FILTER,
        PAGING: PAGING,
        DATE: DATE,
      },
    });
    setOBJECT((prev) => [
      ...prev,
      ...(res.data.result || OBJECT_DEF)
    ]);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    if (res.data.result.length < PAGING.limit) {
      setMORE(false);
    }
    setPAGING((prev) => ({
      ...prev,
      page: prev.page + 1
    }));
    setLOADING(false);
  }, [
    sessionId, MORE,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit,
    DATE.dateType, DATE.dateStart, DATE.dateEnd
  ]);

  // 2-4. useCallback ----------------------------------------------------------------------------->
  const lastRowRef = useCallback((node) => {
    if (LOADING || !MORE) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && MORE) {
        loadMoreData();
      }
    });
    if (node) {
      observer.current.observe(node);
    }
  }, [LOADING, MORE]);

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. empty
    const tableEmpty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("sleep-night")}</TableCell>
              <TableCell>{translate("sleep-morning")}</TableCell>
              <TableCell>{translate("sleep-time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={Object.keys(OBJECT_DEF[0]).length}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      <TableContainer key={i} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-dateType")}</TableCell>
              <TableCell>{translate("sleep-night")}</TableCell>
              <TableCell>{translate("sleep-morning")}</TableCell>
              <TableCell>{translate("sleep-time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody-tr"}>
            {OBJECT?.map((item, index) => (
              <>
              <TableRow
                key={`date-${index}`}
                className={"table-tbody-tr"}
                ref={index === OBJECT.length - 1 ? lastRowRef : null}
              >
                <TableCell rowSpan={2} className={"pointer"} onClick={() => {
                  Object.assign(SEND, {
                    id: item._id,
                    dateType: item.sleep_plan_dateType,
                    dateStart: item.sleep_plan_dateStart,
                    dateEnd: item.sleep_plan_dateEnd,
                  });
                  navigate(SEND.toSave, {
                    state: SEND
                  });
                }}>
                  <Link>
                    <Div>{item.sleep_plan_dateStart?.substring(5, 10)}</Div>
                    <Div>~</Div>
                    <Div>{item.sleep_plan_dateEnd?.substring(5, 10)}</Div>
                  </Link>
                </TableCell>
                <TableCell rowSpan={2}>
                  {item.sleep_plan_dateType}
                </TableCell>
              </TableRow>
              <TableRow
                key={`plan-${index}`}
                className={"table-tbody-tr"}
              >
                <TableCell>
                  {item.sleep_plan_night}
                </TableCell>
                <TableCell>
                  {item.sleep_plan_morning}
                </TableCell>
                <TableCell>
                  {item.sleep_plan_time}
                </TableCell>
              </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-8. table
    const tableSection = () => (
      COUNT.totalCnt === 0 ? tableEmpty() : tableFragment(0)
    );
    // 7-9. first (x)
    // 7-10. second (x)
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {thirdSection()}
        </Div>
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
      {tableNode()}
      {footerNode()}
    </>
  );
};