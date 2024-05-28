// MoneyPlanList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useTranslate, useStorage} from "../../../import/ImportHooks.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {log} from "../../../import/ImportLogics";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper, Card} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table, Link, Skeleton} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";
import { csCZ } from "@mui/x-date-pickers/locales";

// ------------------------------------------------------------------------------------------------>
export const MoneyPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
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
    toSave: "/money/plan/save",
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
    money_plan_number: 0,
    money_plan_demo: false,
    money_plan_dateType: "",
    money_plan_dateStart: "0000-00-00",
    money_plan_dateEnd: "0000-00-00",
    money_plan_in: 0,
    money_plan_out: 0
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-4. useCallback ----------------------------------------------------------------------------->
  const loadMoreData = useCallback(async () => {
    if (LOADING || !MORE) {
      return;
    }
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/plan/list`, {
      params: {
        user_id: sessionId,
        FILTER: FILTER,
        PAGING: PAGING,
        DATE: DATE,
      },
    })
    .then((res) => {
      if (res.data.result.length < PAGING.limit) {
        setMORE(false);
      }
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
      setPAGING((prev) => ({
        ...prev,
        page: prev.page + 1
      }));
      setLOADING(false);
    })
    .catch((err) => {
      log("err", err);
      setLOADING(false);
    });
  }, [
    sessionId, MORE,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit,
    DATE.dateStart, DATE.dateEnd
  ]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    console.log("===================================");
    log("DATE", DATE);
    console.log("===================================");
    setPAGING((prev) => ({
      ...prev,
      page: 1
    }));
    loadMoreData();
  }, [DATE, loadMoreData]);

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
  }, [MORE, loadMoreData]);

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
                <TableCell>{translate("money-in")}</TableCell>
                <TableCell>{translate("money-out")}</TableCell>
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
              <TableRow className="table-thead-tr">
                <TableCell>{translate("common-date")}</TableCell>
                <TableCell>{translate("common-dateType")}</TableCell>
                <TableCell>{translate("money-in")}</TableCell>
                <TableCell>{translate("money-out")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {OBJECT?.map((item, index) => (
                <TableRow
                  ref={index === OBJECT.length - 1 ? lastRowRef : null}
                  key={`data-${index}`}
                  className={"table-tbody-tr"}>
                  <TableCell>
                    <Link onClick={() => {
                      Object.assign(SEND, {
                        id: item._id,
                        dateType: item.money_plan_dateType,
                        dateStart: item.money_plan_dateStart,
                        dateEnd: item.money_plan_dateEnd
                      });
                      navigate(SEND.toSave, {
                        state: SEND
                      });
                    }}>
                      <Div>{item.money_plan_dateStart?.substring(5, 10)}</Div>
                      <Div>~</Div>
                      <Div>{item.money_plan_dateEnd?.substring(5, 10)}</Div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    {item.money_plan_dateType}
                  </TableCell>
                  <TableCell>
                    {numeral(item.money_plan_in).format("0,0")}
                  </TableCell>
                  <TableCell>
                    {numeral(item.money_plan_out).format("0,0")}
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
    // 7-9. first
    const firstSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper"}>
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