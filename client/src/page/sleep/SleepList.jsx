// SleepList.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../hooks/useStorage.jsx";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {Day} from "../../fragments/Day.jsx";
import {Filter} from "../../fragments/Filter.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import {Container, Card, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, TablePagination} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';

// ------------------------------------------------------------------------------------------------>
export const SleepList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail:"/sleep/detail"
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

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    _id: "",
    sleep_number: 0,
    sleep_demo: false,
    sleep_startDt: "0000-00-00",
    sleep_endDt: "0000-00-00",
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
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [
    user_id,
    FILTER.order, FILTER.partIdx, FILTER.titleIdx,
    PAGING.page, PAGING.limit,
    DATE.startDt, DATE.endDt
  ]);

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const columns = [
      { id: "sleep_startDt", label: "날짜", minWidth: 170, align: "center"},
      { id: "sleep_night", label: "취침", minWidth: 100 },
      { id: "sleep_morning", label: "기상", minWidth: 100 },
      { id: "sleep_time", label: "수면", minWidth: 100 },
    ];
    const rows = OBJECT?.map((item, index) => (
      item.sleep_section?.slice(0, 3)?.map((section, sectionIndex) => ({
        _id: item._id,
        sleep_startDt: item.sleep_startDt,
        sleep_night: section.sleep_night,
        sleep_morning: section.sleep_morning,
        sleep_time: section.sleep_time,
        send: {
          id: item._id,
          startDt: item.sleep_startDt,
          endDt: item.sleep_endDt
        }
      }))
    )).flat().filter((item) => (item !== undefined));
    const tableSection = () => (
      <React.Fragment>
        <TableContainer className={"block-wrapper h-80vh"}>
          <Table className={"border"}>
            <TableHead className={"table-thead"}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    className={"table-th"}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {rows.map((row, index) => (
                <TableRow hover role={"checkbox"} tabIndex={-1} key={index}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        className={"table-td"}
                        onClick={column.id === "sleep_startDt" ? (() => {
                          navParam(SEND.toDetail, {
                            state: row.send
                          });
                        }) : undefined}
                      >
                        {column.format && typeof value === "number"
                          ? column.format(value)
                          : value
                        }
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component={"div"}
          labelRowsPerPage={""}
          count={COUNT.totalCnt}
          rowsPerPage={PAGING.limit}
          page={PAGING.page - 1}
          onPageChange={(event, newPage) => {
            setPAGING((prev) => ({
              ...prev,
              page: newPage + 1
            }));
          }}
          onRowsPerPageChange={(event) => {
            setPAGING((prev) => ({
              ...prev,
              limit: parseInt(event.target.value, 10)
            }));
          }}
        ></TablePagination>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid container spacing={3}>
              <Grid xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableSection()}
              </Grid>
            </Grid>
          </Container>
        </Card>
      </React.Fragment>
    );
  };

  // 6. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 7. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 8. navBar ------------------------------------------------------------------------------------>
  const navBarNode = () => (
    <NavBar />
  );

  // 8. day --------------------------------------------------------------------------------------->
  const dayNode = () => (
    <Day FILTER={FILTER} setFILTER={setFILTER} DATE={DATE} setDATE={setDATE}
      DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
    />
  );

  // 10. filter ----------------------------------------------------------------------------------->
  const filterNode = () => (
    <Filter FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      part={"sleep"} plan={""} type={"list"}
    />
  );

  // 11. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={PAGING} setPAGING={setPAGING}
      flowSave={""} navParam={navParam} part={"sleep"} plan={"plan"} type={"list"}
    />
  );

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {headerNode()}
      {navBarNode()}
      {dayNode()}
      {LOADING ? loadingNode() : tableNode()}
      {filterNode()}
      {btnNode()}
    </React.Fragment>
  );
};