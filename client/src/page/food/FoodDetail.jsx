// FoodDetail.jsx

import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {percent} from "../../assets/js/percent";
import {Header} from "../architecture/Header";
import {NavBar} from "../architecture/NavBar";
import {useDate, useStorage} from "../../import/CustomHooks";
import {Btn, Loading} from "../../import/CustomComponents";
import {Grid2, Menu, MenuItem, TextField, Typography, InputAdornment, Container, Card, Paper, Box, Badge, Divider, IconButton, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "../../import/CustomMuis";

// ------------------------------------------------------------------------------------------------>
export const FoodDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/food/list",
    toDetail:"/food/detail",
    toUpdate:"/food/save",
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

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    food_number: 0,
    food_demo: false,
    food_startDt: "0000-00-00",
    food_endDt: "0000-00-00",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "아침",
      food_title: "",
      food_count: 0,
      food_serv: "회",
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: user_id,
        _id: location_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
    }));
    setLOADING(false);
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const res = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        user_id: user_id,
        _id: id,
        section_id: section_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      if (Object.keys(res.data.result).length > 0) {
        setOBJECT(res.data.result);
      }
      else {
        navParam(SEND.toList);
      }
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
            <Table className={"border"}>
              <TableHead>
                <TableRow className={"table-thead-tr"}>
                  <TableCell>날짜</TableCell>
                  <TableCell>분류</TableCell>
                  <TableCell>식품</TableCell>
                  <TableCell>kcal</TableCell>
                  <TableCell>carb</TableCell>
                  <TableCell>protein</TableCell>
                  <TableCell>fat</TableCell>
                  <TableCell>x</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {OBJECT?.food_section?.map((section, index) => (
                  <TableRow key={index}>
                    {index === 0 && (
                      <TableCell rowSpan={OBJECT?.food_section?.length}>
                        {OBJECT?.food_startDt?.substring(5, 10)}
                      </TableCell>
                    )}
                    <TableCell>{section.food_part_val}</TableCell>
                    <TableCell>
                      <p>{`${section.food_title} (${section.food_brand || ""})`}</p>
                      <p>{`${numeral(section.food_gram * section.food_count).format('0,0')} g`}</p>
                    </TableCell>
                    <TableCell>{`${numeral(section.food_kcal).format('0,0')}`}</TableCell>
                    <TableCell>{`${numeral(section.food_carb).format('0,0')}`}</TableCell>
                    <TableCell>{`${numeral(section.food_protein).format('0,0')}`}</TableCell>
                    <TableCell>{`${numeral(section.food_fat).format('0,0')}`}</TableCell>
                    <TableCell><p className={"del-btn"} onClick={() => (
                      flowDelete(OBJECT._id, section._id)
                    )}>x</p></TableCell>
                  </TableRow>
                ))}
                <TableRow className={"table-tbody-tr"}>
                  <TableCell colSpan={3}>합계</TableCell>
                  <TableCell>{`${numeral(OBJECT?.food_total_kcal).format('0,0')} kcal`}</TableCell>
                  <TableCell>{`${numeral(OBJECT?.food_total_carb).format('0,0')} g`}</TableCell>
                  <TableCell>{`${numeral(OBJECT?.food_total_protein).format('0,0')} g`}</TableCell>
                  <TableCell>{`${numeral(OBJECT?.food_total_fat).format('0,0')} g`}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Paper className={"content-wrapper"} variant={"outlined"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Paper>
      </React.Fragment>
    );
  };

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={""} navParam={navParam}
      part={"food"} plan={""} type={"detail"}
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
      {headerNode()}
      {navBarNode()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};
