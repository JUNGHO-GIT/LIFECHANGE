// FoodSearch.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import InputMask from "react-input-mask";
import {useDate} from "../../hooks/useDate.jsx";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {Paging} from "../../fragments/Paging.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import Grid2 from '@mui/material/Unstable_Grid2';
import {Menu, MenuItem} from "@mui/material";
import {TextField, Typography, InputAdornment} from '@mui/material';
import {Container, Card, Paper, Box, Badge, Divider, IconButton, Button} from "@mui/material";
import {Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "@mui/material";

// ------------------------------------------------------------------------------------------------>
export const FoodSearch = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toSave:"/food/save",
  });
  const [DATE, setDATE] = useState({
    startDt: location_startDt,
    endDt: location_endDt
  });
  const [FILTER, setFILTER] = useState({
    query: "",
    page: 0,
    limit: 10,
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const [OBJECT, setOBJECT] = useState({
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
  });

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER?.query === "") {
      return;
    }
    else {
      flowSearch();
    }
  }, [FILTER?.page]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSearch = async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/search`, {
      params: {
        user_id: user_id,
        FILTER: FILTER
      }
    });
    setOBJECT((prev) => ({
      ...prev,
      food_section: res.data.result
    }));
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt ? res.data.totalCnt : 0,
    }));
    setLOADING(false);
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const handleStorage = (param) => {
      localStorage.setItem("food_section", JSON.stringify(param));
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toSave, {
        state: SEND
      });
    };
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <TableContainer>
            <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
                  <TableCell>식품명</TableCell>
              <TableCell>브랜드</TableCell>
              <TableCell>1회 제공량</TableCell>
              <TableCell>1회 중량</TableCell>
              <TableCell>칼로리</TableCell>
              <TableCell>지방</TableCell>
              <TableCell>탄수화물</TableCell>
              <TableCell>단백질</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT?.food_section?.map((item, index) => (
              <TableRow key={index}>
                <TableCell className={"pointer"} onClick={() => {
                  handleStorage(item);
                }}>
                  {item.food_title}
                </TableCell>
                <TableCell>{item.food_brand}</TableCell>
                <TableCell>{item.food_count} {item.food_serv}</TableCell>
                <TableCell>{item.food_gram}</TableCell>
                <TableCell>{item.food_kcal}</TableCell>
                <TableCell>{item.food_fat}</TableCell>
                <TableCell>{item.food_carb}</TableCell>
                <TableCell>{item.food_protein}</TableCell>
              </TableRow>
            ))}
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

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 12. paging ----------------------------------------------------------------------------------->
  const pagingNode = () => (
    <Paging PAGING={FILTER} setPAGING={setFILTER} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"food"} plan={""} type={"search"}
    />
  );

  // 14. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Box className={"input-group"}>
      <InputMask
        mask={""}
        id={"food_content"}
        name={"food_content"}
        className={"form-control"}
        readOnly={false}
        disabled={false}
        value={FILTER?.query}
        onChange={(e) => {
          setFILTER((prev) => ({
            ...prev,
            query: e.target.value
          }));
        }}
      ></InputMask>
      <span className={"input-group-text pointer"} onClick={() => {
        setFILTER((prev) => ({
          ...prev,
          page: 0
        }));
        flowSearch();
      }}>
        <i className={"bi bi-search"}></i>
      </span>
    </Box>
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {headerNode()}
      {navBarNode()}
      {LOADING ? loadingNode() : tableNode()}
      {pagingNode()}
      {btnNode()}
    </React.Fragment>
  );
};