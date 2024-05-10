// FoodSearch.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {moment, axios, numeral, InputMask, NumericFormat} from "../../import/ImportLibs";
import {useDate, useStorage} from "../../import/ImportHooks";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Btn, Loading, DaySave, Paging} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";

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

  // 2-2. useState -------------------------------------------------------------------------------->
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
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
    // 7-1. title
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          음식 List
        </Typography>
      </React.Fragment>
    );
    // 7-5. handleStorage
    const handleStorage = (param) => {
      localStorage.setItem("food_section", JSON.stringify(param));
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toSave, {
        state: SEND
      });
    };
    // 7-6. table
    const tableFragment = (i) => (
      <React.Fragment key={i}>
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
                  <TableCell>
                    {item.food_brand}
                  </TableCell>
                  <TableCell>
                    {item.food_count} {item.food_serv}
                  </TableCell>
                  <TableCell>
                    {item.food_gram}
                  </TableCell>
                  <TableCell>
                    {item.food_kcal}
                  </TableCell>
                  <TableCell>
                    {item.food_fat}
                  </TableCell>
                  <TableCell>
                    {item.food_carb}
                  </TableCell>
                  <TableCell>
                    {item.food_protein}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </React.Fragment>
    );
    // 7-7. table
    // list 는 높이 지정
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-min80vh"}>
          <Box className={"d-center p-10"}>
            {titleSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"} />
          <Box className={"d-column"}>
            {tableFragment()}
          </Box>
        </Box>
      </React.Fragment>
    );
    // 7-8. return
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

  // 11. paging ----------------------------------------------------------------------------------->
  const pagingNode = () => (
    <Paging PAGING={FILTER} setPAGING={setFILTER} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"food"} plan={""} type={"search"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={""} setDAYPICKER={""} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={FILTER} setFILTER={setFILTER} PAGING={""} setPAGING={""}
      flowSave={flowSearch} navParam={navParam}
      part={"food"} plan={""} type={"search"}
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
      {btnNode()}
    </React.Fragment>
  );
};