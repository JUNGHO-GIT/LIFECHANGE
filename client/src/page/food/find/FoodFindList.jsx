// FoodFindList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {useDate, useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper, Card, TableContainer, Table, Checkbox, Skeleton} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodFindList = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-2. useState -------------------------------------------------------------------------------->
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [isExist, setIsExist] = useState([""]);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");
  const [checkedQueries, setCheckedQueries] = useState({});

  // 2-1. useStorage (리스트에서만 사용) ---------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").startOf("year").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("year").format("YYYY-MM-DD")
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      query: ""
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
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
    // 첫번째 객체를 제외하고 데이터 추가
    setOBJECT((prev) => {
      if (prev.length === 1 && Object.keys(prev[0]).length === 0) {
        return res.data.result;
      }
      else {
        return {...prev, ...res.data.result};
      }
    });
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
    // 7-6. empty
    const tableEmpty = () => (
      <Card variant={"outlined"} className={"border radius p-0"} key={"empty"}>
        <TableContainer>
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
                <TableCell colSpan={Object.keys(OBJECT_DEF[0]).length}>
                  {translate("common-empty")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"border radius p-0"} key={`${PAGING.page}-${i}`}>
        <TableContainer>
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
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {OBJECT?.map((item, index) => (
                <TableRow className={"table-tbody-tr"} key={`data-${index}`}>
                  <TableCell className={"w-max30vw"}>
                    {item.food_title}
                  </TableCell>
                  <TableCell className={"w-max20vw"}>
                    {item.food_brand}
                  </TableCell>
                  <TableCell>
                    {`${item.food_count} ${item.food_serv} (${numeral(item.food_gram).format("0,0")})`}
                  </TableCell>
                  <TableCell>
                    {numeral(item.food_kcal).format("0,0")}
                  </TableCell>
                  <TableCell>
                    {numeral(item.food_carb).format("0,0")}
                  </TableCell>
                  <TableCell>
                    {numeral(item.food_protein).format("0,0")}
                  </TableCell>
                  <TableCell>
                    {numeral(item.food_fat).format("0,0")}
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
              ))}
              {LOADING && Array.from({length: Object.keys(OBJECT_DEF[0]).length}, (_, index) => (
                <TableRow key={`skeleton-${index}`} className={"table-tbody-tr"}>
                  <TableCell colSpan={Object.keys(OBJECT_DEF[0]).length}>
                    <Skeleton className={"animation"}/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      COUNT.totalCnt === 0 ? tableEmpty() : tableFragment(0)
    );
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

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
      {tableNode()}
      {footerNode()}
    </>
  );
};