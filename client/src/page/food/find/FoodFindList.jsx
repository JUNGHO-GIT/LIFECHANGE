// FoodFindList.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Img, Icons} from "../../../import/ImportComponents.jsx";
import {Paper, Card, TableContainer, Table, Checkbox} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";
import {food2, food3, food4, food5} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodFindList = () => {

  // 1. common -------------------------------------------------------------------------------------
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
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) -----------------------------------------------------------
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "",
      dateStart: moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD"),
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
    sort: "asc",
    query: "",
    page: 1,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const [checkedQueries, setCheckedQueries] = useState({});
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave:"/food/find/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState ---------------------------------------------------------------------------------
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

  // 2-3. useEffect --------------------------------------------------------------------------------
  // 페이지 번호 변경 시 flowFind 호출
  useEffect(() => {
    if (PAGING?.query === "") {
      return;
    }
    flowFind();
  }, [PAGING.page]);

  // 2-3. useEffect --------------------------------------------------------------------------------
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
    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const newChecked = OBJECT.map((item) => (
      sectionArray.some(sectionItem => sectionItem.food_title === item.food_title)
    ));
    setCheckedQueries({
      ...checkedQueries,
      [queryKey]: newChecked
    });
  }, [OBJECT]);

  // 2-3. useEffect --------------------------------------------------------------------------------
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
    const queryKey = `${PAGING.query}_${PAGING.page}`;
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
  }, [checkedQueries, PAGING.page, PAGING.query, OBJECT]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowFind = async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/find/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE
      },
    });
    setOBJECT(res.data.result || []);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt ? res.data.totalCnt : 0,
    }));
    setLOADING(false);
  };

  // 4. handler ------------------------------------------------------------------------------------
  const handlerCheckboxChange = (index) => {
    const queryKey = `${PAGING.query}_${PAGING.page}`;
    const updatedChecked = [...(checkedQueries[queryKey] || [])];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedQueries({
      ...checkedQueries,
      [queryKey]: updatedChecked
    });
  };

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-6. empty
    const tableEmpty = () => (
      <Card className={"border radius p-10"} key={"empty"}>
        <Div className={"d-center"}>
          {translate("empty")}
        </Div>
      </Card>
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      OBJECT?.map((item, index) => (
        <Card className={"border radius p-10"} key={`${index}-${i}`}>
          <TableContainer>
            <Table>
              <TableHead className={"table-thead"}>
                <TableRow className={"table-tbody-tr"}>
                  <TableCell colSpan={2}>
                    <Div className={"fs-1-1rem fw-bolder d-left"}>
                      {item.food_title}
                    </Div>
                    <Div className={"fs-0-9rem d-left"}>
                      {item.food_brand}
                    </Div>
                  </TableCell>
                  <TableCell colSpan={1}>
                    <Div className={"fs-1-1rem fw-bolder d-right"}>
                      <Checkbox
                        key={`check-${index}`}
                        color={"primary"}
                        size={"small"}
                        checked={
                          !! (
                            checkedQueries[`${PAGING.query}_${PAGING.page}`] &&
                            checkedQueries[`${PAGING.query}_${PAGING.page}`][index]
                          )
                        }
                        onChange={() => {
                          handlerCheckboxChange(index);
                        }}
                      />
                    </Div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                <TableRow className={"table-tbody-tr border-top"}>
                  <TableCell colSpan={3}>
                    <Div className={"d-left dark fw-bold"}>
                      <Img src={food2} className={"w-15 h-15"} />
                      {translate("kcal")}
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr"}>
                  <TableCell colSpan={3}>
                    <Div className={"d-left fw-bold"}>
                      {numeral(item.food_kcal).format("0,0")}
                      <Div className={"fs-0-7rem dark fw-normal ms-8"}>
                        kcal
                      </Div>
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr border-top"}>
                  <TableCell colSpan={3}>
                    <Div className={"d-left dark fw-bold"}>
                      <Img src={food3} className={"w-15 h-15"} />
                      {translate("carb")}
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr"}>
                  <TableCell colSpan={3}>
                    <Div className={"d-left fw-bold"}>
                      {numeral(item.food_carb).format("0,0")}
                      <Div className={"fs-0-7rem dark fw-normal ms-8"}>
                        g
                      </Div>
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr border-top"}>
                  <TableCell colSpan={3}>
                    <Div className={"d-left dark fw-bold"}>
                      <Img src={food4} className={"w-15 h-15"} />
                      {translate("protein")}
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr"}>
                  <TableCell colSpan={3}>
                    <Div className={"d-left fw-bold"}>
                      {numeral(item.food_protein).format("0,0")}
                      <Div className={"fs-0-7rem dark fw-normal ms-8"}>
                        g
                      </Div>
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr border-top"}>
                  <TableCell colSpan={3}>
                    <Div className={"d-left dark fw-bold"}>
                      <Img src={food5} className={"w-15 h-15"} />
                      {translate("fat")}
                    </Div>
                  </TableCell>
                </TableRow>
                <TableRow className={"table-tbody-tr"}>
                  <TableCell colSpan={3}>
                    <Div className={"d-left fw-bold"}>
                      {numeral(item.food_fat).format("0,0")}
                      <Div className={"fs-0-7rem dark fw-normal ms-8"}>
                        g
                      </Div>
                    </Div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ))
    );
    // 7-8. loading
    const loadingNode = () => (
      <Loading
        LOADING={LOADING}
        setLOADING={setLOADING}
      />
    );
    // 7-8. table
    const tableSection = () => (
      LOADING ? loadingNode() : (
        COUNT.totalCnt === 0 ? tableEmpty() : tableFragment(0)
      )
    );
    // 7-9. first
    const firstSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min67vh"}>
          {firstSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, PAGING, SEND, COUNT
      }}
      functions={{
        setDATE, setPAGING, setSEND, setCOUNT
      }}
      handlers={{
        navigate, flowFind
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};