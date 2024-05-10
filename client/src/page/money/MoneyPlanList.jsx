// MoneyPlanList.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {moment, axios, numeral} from "../../import/ImportLibs";
import {useDate, useStorage} from "../../import/ImportHooks";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Paging, Filter, Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const MoneyPlanList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
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
    toDetail: "/money/plan/detail",
  });
  const [PAGING, setPAGING] = useState({
    page: 1,
    limit: 5
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false,
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
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/list`, {
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
    // 7-1. title
    const titleSection = () => (
      <Typography variant={"h5"} fontWeight={500}>
        재무 계획 List
      </Typography>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>날짜</TableCell>
              <TableCell>분류</TableCell>
              <TableCell>목표</TableCell>
              <TableCell>실제</TableCell>
              <TableCell>비교</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT?.map((item, index) => ([
              <TableRow className={"table-tbody-tr"}>
                <TableCell rowSpan={2} className={"pointer"} onClick={() => {
                  SEND.id = item._id;
                  SEND.startDt = item.money_plan_startDt;
                  SEND.endDt = item.money_plan_endDt;
                  navParam(SEND.toDetail, {
                    state: SEND
                  });
                }}>
                  {item.money_plan_startDt?.substring(5, 10)
                    + " ~ " +
                    item.money_plan_endDt?.substring(5, 10)
                  }
                </TableCell>
                <TableCell>
                  수입
                </TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_plan_in).format('0,0')}`}
                </TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_total_in).format('0,0')}`}
                </TableCell>
                <TableCell className={item.money_diff_in_color}>
                  {`₩ ${numeral(item.money_diff_in).format('0,0')}`}
                </TableCell>
              </TableRow>,
              <TableRow className={"table-tbody-tr"}>
                <TableCell>
                  지출</TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_plan_out).format('0,0')}`}
                </TableCell>
                <TableCell>
                  {`₩ ${numeral(item.money_total_out).format('0,0')}`}
                </TableCell>
                <TableCell className={item.money_diff_out_color}>
                  {`₩ ${numeral(item.money_diff_out).format('0,0')}`}
                </TableCell>
              </TableRow>
            ]))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-7. table
    // list 는 높이 지정
    const tableSection = () => (
      <Box className={"block-wrapper h-min75vh"}>
        <Box className={"d-column"}>
          {tableFragment(0)}
        </Box>
      </Box>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 11. paging ----------------------------------------------------------------------------------->
  const pagingNode = () => (
    <Paging PAGING={PAGING} setPAGING={setPAGING} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"money"} plan={"plan"} type={"list"}
    />
  );

  // 12. filter ----------------------------------------------------------------------------------->
  const filterNode = () => (
    <Filter FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      PART={""} setPART={""} part={"money"} plan={"plan"} type={"list"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      flowSave={""} navParam={navParam}
      part={"sleep"} plan={"plan"} type={"list"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {pagingNode()}
      {filterNode()}
      {btnNode()}
    </React.Fragment>
  );
};