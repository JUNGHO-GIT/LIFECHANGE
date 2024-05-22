// SleepList.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, moment} from "../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div} from "../../import/ImportComponents.jsx";
import {Paper, TableContainer, Table, Link} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
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
    toSave:"/sleep/save"
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
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/list`, {
      params: {
        user_id: sessionId,
        FILTER: FILTER,
        PAGING: PAGING,
        DATE: DATE,
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
              <TableCell>{translate("sleep-night")}</TableCell>
              <TableCell>{translate("sleep-morning")}</TableCell>
              <TableCell>{translate("sleep-time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={5}>
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
              <TableCell>{translate("sleep-night")}</TableCell>
              <TableCell>{translate("sleep-morning")}</TableCell>
              <TableCell>{translate("sleep-time")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT?.map((item, index) => (
              <>
              <TableRow className={"table-tbody-tr"} key={`date-${index}`}>
                <TableCell rowSpan={2} className={"pointer"} onClick={() => {
                  Object.assign(SEND, {
                    id: item._id,
                    dateType: item.sleep_dateType,
                    dateStart: item.sleep_dateStart,
                    dateEnd: item.sleep_dateEnd
                  });
                  navigate(SEND.toSave, {
                    state: SEND
                  });
                }}>
                  <Link>
                    {item.sleep_dateStart?.substring(5, 10)}
                  </Link>
                </TableCell>
                <TableCell rowSpan={2}>
                  {item.sleep_dateType}
                </TableCell>
              </TableRow>
              <TableRow className={"table-tbody-tr"} key={`real-${index}`}>
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
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min80vh"}>
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