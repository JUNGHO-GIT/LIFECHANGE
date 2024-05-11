// FoodSearch.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {Header, NavBar} from "../../import/ImportLayouts.jsx";
import {Div, Hr, Br, Btn, Loading, Paging} from "../../import/ImportComponents.jsx";
import {Paper} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodSearch = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
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
      query: "",
      page: 0,
      limit: 10,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toSave:"/food/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
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
    }]
  }];
  const {val:OBJECT, set:setOBJECT} = useStorage(
    `OBJECT(food)`, OBJECT_DEF
  );

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
    // 7-5. handleStorage
    const handleStorage = (param) => {
      sessionStorage.setItem("food_section", JSON.stringify(param));
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toSave, {
        state: SEND
      });
    };
    // 7-6. table
    const tableFragment = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell>식품명</TableCell>
              <TableCell>제공량</TableCell>
              <TableCell>Kcal</TableCell>
              <TableCell>Carb</TableCell>
              <TableCell>Protein</TableCell>
              <TableCell>Fat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT?.food_section?.map((item, sectionIndex) => (
              <TableRow key={sectionIndex} className={"table-tbody-tr"}>
                <TableCell className={"pointer"} onClick={() => {
                  handleStorage(item);
                }}>
                  {`${item.food_title} ${item.food_brand !== "-" ? `${item.food_brand}` : ""}`}
                </TableCell>
                <TableCell>
                  {`${item.food_count}${item.food_serv} (${item.food_gram}g)`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_kcal).format("0,0")} Kcal`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_carb).format("0,0")} g`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_protein).format("0,0")} g`}
                </TableCell>
                <TableCell>
                  {`${numeral(item.food_fat).format("0,0")} g`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min75vh w-min120vw"}>
        <Div className={"d-column"}>
          {tableFragment(0)}
        </Div>
      </Div>
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
    <Paging PAGING={FILTER} setPAGING={setFILTER} COUNT={COUNT} setCOUNT={setCOUNT}
      part={"food"} plan={""} type={"search"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={""} setDAYPICKER={""} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={FILTER} setFILTER={setFILTER} PAGING={""} setPAGING={""}
      flowSave={flowSearch} navParam={navParam}
      part={"food"} plan={""} type={"search"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {pagingNode()}
      {btnNode()}
    </>
  );
};