// FoodDiff.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {axios, numeral, moment} from "../../../import/ImportLibs.jsx";
import {useStorage} from "../../../import/ImportHooks.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div} from "../../../import/ImportComponents.jsx";
import {Paper, Card} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table, Link, Skeleton} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDiff = () => {

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
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-1. useStorage (리스트에서만 사용) ---------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "day",
      dateStart: moment().tz("Asia/Seoul").startOf("month").format("YYYY-MM-DD"),
      dateEnd: moment().tz("Asia/Seoul").endOf("month").format("YYYY-MM-DD"),
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "day",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toSave:"/food/plan/save"
  });
  const [PAGING, setPAGING] = useState({
    sort: "asc",
    page: 1,
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = [{
    _id: "",
    food_plan_number: 0,
    food_plan_demo: false,
    food_plan_dateStart: "0000-00-00",
    food_plan_dateEnd: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_total_fat: 0,
    food_diff_kcal: 0,
    food_diff_carb: 0,
    food_diff_protein: 0,
    food_diff_fat: 0,
    food_diff_kcal_color: "",
    food_diff_carb_color: "",
    food_diff_protein_color: "",
    food_diff_fat_color: "",
  }];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/diff/list`, {
      params: {
        user_id: sessionId,
        PAGING: PAGING,
        DATE: DATE,
      },
    })
    .then((res) => {
      setOBJECT(res.data.result || OBJECT_DEF);
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err) => {
      console.log("err", err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, PAGING.sort, PAGING.page, DATE.dateEnd]);

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. empty
    const tableEmpty = () => (
      <Card className={"border radius p-0"} key={"empty"}>
        <TableContainer>
        <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-category")}</TableCell>
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
    const tableFragment = (i=0) => (
      <Card className={"border radius p-0"} key={i}>
        <TableContainer>
          <Table>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell>{translate("common-date")}</TableCell>
              <TableCell>{translate("common-category")}</TableCell>
              <TableCell>{translate("food-kcal")}</TableCell>
              <TableCell>{translate("food-carb")}</TableCell>
              <TableCell>{translate("food-protein")}</TableCell>
              <TableCell>{translate("food-fat")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT?.map((item, index) => (
              <TableRow key={`data-${index}`} className={"table-tbody-tr"}>
                <TableCell width={"30%"}>
                  <Link>
                    {item.food_plan_dateStart === item.food_plan_dateEnd ? (
                      <>
                        <Div>{item.food_plan_dateStart?.substring(5, 10)}</Div>
                      </>
                    ) : (
                      <>
                        <Div>{item.food_plan_dateStart?.substring(5, 10)}</Div>
                        <Div>~</Div>
                        <Div>{item.food_plan_dateEnd?.substring(5, 10)}</Div>
                      </>
                    )}
                  </Link>
                </TableCell>
                <TableCell>
                  {translate("common-plan")}
                </TableCell>
                <TableCell>
                  {numeral(item.food_plan_kcal).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.food_plan_carb).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.food_plan_protein).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.food_plan_fat).format('0,0')}
                </TableCell>
                <TableCell>
                  {translate("common-real")}
                </TableCell>
                <TableCell>
                  {numeral(item.food_total_kcal).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.food_total_carb).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.food_total_protein).format('0,0')}
                </TableCell>
                <TableCell>
                  {numeral(item.food_total_fat).format('0,0')}
                </TableCell>
                <TableCell>
                  {translate("common-diff")}
                </TableCell>
                <TableCell className={item.food_diff_kcal_color}>
                  {numeral(item.food_diff_kcal).format('0,0')}
                </TableCell>
                <TableCell className={item.food_diff_carb_color}>
                  {numeral(item.food_diff_carb).format('0,0')}
                </TableCell>
                <TableCell className={item.food_diff_protein_color}>
                  {numeral(item.food_diff_protein).format('0,0')}
                </TableCell>
                <TableCell className={item.food_diff_fat_color}>
                  {numeral(item.food_diff_fat).format('0,0')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </TableContainer>
      </Card>
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
      <Paper className={"content-wrapper"}>
        <Div className={"block-wrapper h-min67vh"}>
          {firstSection()}
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
        DATE, SEND, PAGING, COUNT
      }}
      functions={{
        setDATE, setSEND, setPAGING, setCOUNT
      }}
      handlers={{
        navigate
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