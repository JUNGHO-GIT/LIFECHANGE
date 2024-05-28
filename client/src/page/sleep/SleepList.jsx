// SleepList.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../import/ImportReacts.jsx";
import {axios, moment} from "../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper, Card, TableContainer, Table, Link, Skeleton} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {

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

  // 2-2. useState -------------------------------------------------------------------------------->
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [EXIST, setEXIST] = useState([""]);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) ---------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "day",
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
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave:"/sleep/save"
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
  const OBJECT_DEF = [{
    _id: "",
    sleep_number: 0,
    sleep_demo: false,
    sleep_dateType: "",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_section: [{
      sleep_night: "00:00",
      sleep_morning: "00:00",
      sleep_time: "00:00",
    }],
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    loadMoreData();
  }, []);

  // 2-4. useCallback ----------------------------------------------------------------------------->
  const loadMoreData = useCallback(async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        FILTER: FILTER,
        PAGING: PAGING,
        DATE: DATE,
      },
    });
    // 첫번째 객체를 제외하고 데이터 추가
    setOBJECT((prev) => {
      if (prev.length === 1 && prev[0]._id === "") {
        return [...res.data.result];
      }
      else {
        return [...prev, ...res.data.result];
      }
    });
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
    DATE.dateStart, DATE.dateEnd
  ]);

  // 2-4. useCallback ----------------------------------------------------------------------------->
  const lastRowRef = useCallback((node) => {
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
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
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
      </Card>
    );
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
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
            {OBJECT?.map((item, index) => (
              <TableRow ref={index === OBJECT.length - 1 ? lastRowRef : null}
              key={`data-${index}`}
              className={"table-tbody-tr"}>
                <TableCell>
                  <Link onClick={() => {
                    Object.assign(SEND, {
                      id: item._id,
                      dateType: item.sleep_dateType,
                      dateStart: item.sleep_dateStart,
                      dateEnd: item.sleep_dateEnd,
                    });
                    navigate(SEND.toSave, {
                      state: SEND
                    });
                  }}>
                    <Div>{item.sleep_dateStart?.substring(5, 10)}</Div>
                  </Link>
                </TableCell>
                <TableCell>
                  {item.sleep_dateType}
                </TableCell>
                <TableCell>
                  {item.sleep_section[0]?.sleep_night}
                </TableCell>
                <TableCell>
                  {item.sleep_section[0]?.sleep_morning}
                </TableCell>
                <TableCell>
                  {item.sleep_section[0]?.sleep_time}
                </TableCell>
              </TableRow>
            ))}
            {LOADING && Array.from({length: Object.keys(OBJECT_DEF[0]).length}, (_, index) => (
              <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                <TableCell colSpan={Object.keys(OBJECT_DEF[0]).length}>
                  <Skeleton className={"animation"}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      COUNT.totalCnt === 0 ? tableEmpty() : tableFragment(0)
    );
    // 7-9. third
    const thirdSection = () => (
      tableSection()
    );

    // 7-10. return
    return (
      <Paper className={"content-wrapper"}>
        <Div className={"block-wrapper h-min67vh"}>
          {thirdSection()}
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
        DATE, FILTER, SEND, PAGING, COUNT, EXIST
      }}
      functions={{
        setDATE, setFILTER, setSEND, setPAGING, setCOUNT, setEXIST
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