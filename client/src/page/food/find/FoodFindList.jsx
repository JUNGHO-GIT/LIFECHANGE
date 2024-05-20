// FoodFindList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {useDate, useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper, TableContainer, Table, Checkbox} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodFindList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart?.trim()?.toString();
  const location_dateEnd = location?.state?.dateEnd?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "day",
      dateStart: location_dateStart || moment().format("YYYY-MM-DD"),
      dateEnd: location_dateEnd || moment().format("YYYY-MM-DD"),
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      query: ""
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(false);
  const [checkedQueries, setCheckedQueries] = useState({});
  const [SEND, setSEND] = useState({
    id: "",
   dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave:"/food/find/save",
  });
  const [PAGING, setPAGING] = useState({
    page: 0,
    limit: 10,
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    food_perNumber: 1,
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
  useDate(location_dateStart, location_dateEnd, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  // 페이지 번호 변경 시 flowFind 호출
  useEffect(() => {
    if (FILTER?.query === "") {
      return;
    }
    flowFind();
  }, [PAGING.page]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  // 페이지 로드 시 체크박스 상태 초기화
  useEffect(() => {
    let sectionArray = [];
    let section = sessionStorage.getItem("foodSection");

    // sectionArray 초기화
    if (section) {
      sectionArray = JSON.parse(section);
    }
    else {
      sectionArray = [];
    }
    const queryKey = `${FILTER.query}_${PAGING.page}`;
    const newChecked = OBJECT.map((item) => (
      sectionArray.some(sectionItem => sectionItem.food_title === item.food_title)
    ));
    setCheckedQueries({
      ...checkedQueries,
      [queryKey]: newChecked
    });
  }, [OBJECT]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  // 체크박스 상태 변경 시 sessionStorage에 저장
  useEffect(() => {
    let sectionArray = [];
    let section = sessionStorage.getItem("foodSection");

    // sectionArray 초기화
    if (section) {
      sectionArray = JSON.parse(section);
    }
    else {
      sectionArray = [];
    }

    // 현재 쿼리와 페이지의 체크된 상태
    const queryKey = `${FILTER.query}_${PAGING.page}`;
    const pageChecked = checkedQueries[queryKey] || [];

    // 체크된 항목들 sectionArray에 추가 또는 제거
    pageChecked.forEach((el, index) => {
      if (el) {
        sectionArray.push(OBJECT[index]);
      }
      else {
        sectionArray = sectionArray.filter(item => item.food_title !== OBJECT[index].food_title);
      }
    });

    // sectionArray 중복 제거
    sectionArray = sectionArray.filter((el, index, self) => {
      return index === self.findIndex((t) => (
        t.food_title === el.food_title
      ));
    });

    // sessionStorage에 저장
    sessionStorage.setItem("foodSection", JSON.stringify(sectionArray));
  }, [checkedQueries, PAGING.page, FILTER.query, OBJECT]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFind = async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/find/list`, {
      params: {
        user_id: sessionId,
        FILTER: FILTER,
        PAGING: PAGING,
        DATE: DATE
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt ? res.data.totalCnt : 0,
    }));
    setLOADING(false);
  };

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCheckboxChange = (index) => {
    const queryKey = `${FILTER.query}_${PAGING.page}`;
    const updatedChecked = [...(checkedQueries[queryKey] || [])];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedQueries({
      ...checkedQueries,
      [queryKey]: updatedChecked
    });
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6-1. table
    const tableFragmentEmpty = () => (
      <TableContainer key={"empty"} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell className={"w-max30vw"}>{translate("food-title")}</TableCell>
              <TableCell className={"w-max20vw"}>{translate("food-brand")}</TableCell>
              <TableCell>{translate("food-serv")}</TableCell>
              <TableCell>{translate("food-kcal")}</TableCell>
              <TableCell>{translate("food-carb")}</TableCell>
              <TableCell>{translate("food-protein")}</TableCell>
              <TableCell>{translate("food-fat")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            <TableRow className={"table-tbody-tr"}>
              <TableCell colSpan={7}>
                {translate("common-empty")}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
    // 7-6-2. table
    const tableFragment = (i) => (
      <TableContainer key={`${PAGING.page}-${i}`} className={"border radius"}>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell className={"w-max30vw"}>{translate("food-title")}</TableCell>
              <TableCell className={"w-max20vw"}>{translate("food-brand")}</TableCell>
              <TableCell>{translate("food-serv")}</TableCell>
              <TableCell>{translate("food-kcal")}</TableCell>
              <TableCell>{translate("food-carb")}</TableCell>
              <TableCell>{translate("food-protein")}</TableCell>
              <TableCell>{translate("food-fat")}</TableCell>
              <TableCell>o</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT?.map((item, index) => (
              <>
                <TableRow className={"table-tbody-tr"} key={`find-${index}`}>
                  <TableCell className={"w-max30vw"}>
                    {item.food_title}
                  </TableCell>
                  <TableCell className={"w-max20vw"}>
                    {item.food_brand}
                  </TableCell>
                  <TableCell>
                    {`${item.food_count} ${item.food_serv} (${numeral(item.food_gram).format("0,0")} g)`}
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
                  <TableCell>
                    <Checkbox
                      key={`check-${index}`}
                      color={"primary"}
                      size={"small"}
                      checked={
                        !! (
                          checkedQueries[`${FILTER.query}_${PAGING.page}`] &&
                          checkedQueries[`${FILTER.query}_${PAGING.page}`][index]
                        )
                      }
                      onChange={() => {
                        handlerCheckboxChange(index);
                      }}
                    />
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
      <Div className={"block-wrapper w-min150vw h-min67vh"}>
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
        navigate, flowFind
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