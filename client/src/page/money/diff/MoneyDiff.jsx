// MoneyDiff.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDiff = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const navigate = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt || moment().format("YYYY-MM-DD"),
      endDt: location_endDt || moment().format("YYYY-MM-DD"),
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail: "/money/detail/plan",
  });
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 5
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    money_startDt: "0000-00-00",
    money_endDt: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
    money_plan_startDt: "0000-00-00",
    money_plan_endDt: "0000-00-00",
    money_plan_in: 0,
    money_plan_out: 0,
    money_diff_in: 0,
    money_diff_out: 0,
    money_diff_in_color: "",
    money_diff_out_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE, FILTER, setFILTER);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/diff`, {
      params: {
        user_id: user_id,
        FILTER: FILTER,
        PAGING: PAGING,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
    }));
    setLOADING(false);
  })()}, [
    user_id,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit,
    DATE.startDt, DATE.endDt
  ]);

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6-1. table
    const tableFragmentEmpty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>수입</TableCell>
              <TableCell>지출</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={4}>
                데이터가 없습니다.
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
          <TableHead>
            <TableRow className="table-thead-tr">
              <TableCell>날짜</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>수입</TableCell>
              <TableCell>지출</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={4} className={"pointer"}>
                  <Div>{item.money_plan_startDt?.substring(5, 10)}</Div>
                  <Div>~</Div>
                  <Div>{item.money_plan_endDt?.substring(5, 10)}</Div>
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`plan-${index}`}>
                <TableCell>
                  목표
                </TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_plan_in).format("0,0")}`}
                </TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_plan_out).format("0,0")}`}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`real-${index}`}>
                <TableCell>
                  실제
                </TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_total_in).format("0,0")}`}
                </TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_total_out).format("0,0")}`}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`diff-${index}`}>
                <TableCell>
                  비교
                </TableCell>
                <TableCell className={item.money_diff_in_color}>
                  {`₩ ${numeral(item.money_diff_in).format("0,0")}`}
                </TableCell>
                <TableCell className={item.money_diff_out_color}>
                  {`₩ ${numeral(item.money_diff_out).format("0,0")}`}
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
      <Div className={"block-wrapper w-min100vw h-min68vh"}>
        <Div className={"d-column"}>
          {COUNT.totalCnt === 0 ? tableFragmentEmpty() : tableFragment(0)}
        </Div>
      </Div>
    );
    // 7-7. return
    return (
      <Paper className={"content-wrapper"}>
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
        part: partStr,
        type: typeStr,
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