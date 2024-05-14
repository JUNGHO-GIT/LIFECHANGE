// FoodFind.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {axios, numeral} from "../../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../../import/ImportHooks.jsx";
import {Header, NavBar, Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper, TableContainer, Table} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodFind = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const navigate = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      query: ""
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
  const [PAGING, setPAGING] = useState({
    page: 0,
    limit: 10,
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    food_title: "",
    food_brand: "",
    food_count: 0,
    food_serv: "",
    food_gram: 0,
    food_kcal: 0,
    food_carb: 0,
    food_protein: 0,
    food_fat: 0,
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  useEffect(() => {
    console.log(JSON.stringify(OBJECT, null, 2));
  }, [OBJECT]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (FILTER?.query === "") {
      return;
    }
    else {
      flowFind();
    }
  }, [PAGING.page]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFind = async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/find`, {
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
      totalCnt: res.data.totalCnt ? res.data.totalCnt : 0,
    }));
    setLOADING(false);
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. table
    const tableFragment = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead>
            <TableRow className={"table-thead-tr"}>
              <TableCell className={"w-max30vw"}>식품명</TableCell>
              <TableCell className={"w-max30vw"}>브랜드</TableCell>
              <TableCell className={"w-max30vw"}>제공량</TableCell>
              <TableCell className={"w-max25vw"}>Kcal</TableCell>
              <TableCell className={"w-max15vw"}>Carb</TableCell>
              <TableCell className={"w-max15vw"}>Protein</TableCell>
              <TableCell className={"w-max15vw"}>Fat</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {OBJECT?.map((item, index) => (
              <>
                <TableRow className={"table-tbody-tr"} key={`title-${index}`}>
                  <TableCell rowSpan={2} className={"pointer w-max30vw"} onClick={() => {
                    sessionStorage.setItem("food_section", JSON.stringify(item));
                    Object.assign(SEND, {
                      id: user_id,
                      startDt: DATE.startDt,
                      endDt: DATE.endDt
                    });
                    navigate(SEND.toSave, {
                      state: SEND
                    });
                  }}>
                    {item.food_title}
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr"} key={`find-${index}`}>
                  <TableCell className={"w-max30vw"}>
                    {item.food_brand}
                  </TableCell>
                  <TableCell className={"w-max30vw"}>
                    {`${item.food_count} ${item.food_serv} (${numeral(item.food_gram).format("0,0")} g)`}
                  </TableCell>
                  <TableCell className={"w-max25vw"}>
                    {`${numeral(item.food_kcal).format("0,0")} Kcal`}
                  </TableCell>
                  <TableCell className={"w-max15vw"}>
                    {`${numeral(item.food_carb).format("0,0")} g`}
                  </TableCell>
                  <TableCell className={"w-max15vw"}>
                    {`${numeral(item.food_protein).format("0,0")} g`}
                  </TableCell>
                  <TableCell className={"w-max15vw"}>
                    {`${numeral(item.food_fat).format("0,0")} g`}
                  </TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min170vw h-min70vh"}>
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
        plan: planStr,
      }}
      objects={{
        DATE, FILTER, SEND, PAGING, COUNT
      }}
      functions={{
        setDATE, setFILTER, setSEND, setPAGING, setCOUNT
      }}
      handlers={{
        navigate, flowFind
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};