// FoodPlanSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, axios, numeral} from "../../../import/ImportLibs.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Br20, Br40} from "../../../import/ImportComponents.jsx";
import {PopUp, Img, Calendar, Time, Count, DropDown} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField} from "../../../import/ImportMuis.jsx";
import {food2, food3, food4, food5} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCustom") || "{}";
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateType = location?.state?.dateType;
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
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

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/food/plan/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: location_dateType,
    dateStart: location_dateStart,
    dateEnd: location_dateEnd
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    food_plan_number: 0,
    food_plan_demo: false,
    food_plan_dateType: "",
    food_plan_dateStart: "0000-00-00",
    food_plan_dateEnd: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: DATE.dateType,
          dateStart: moment(DATE.dateStart).startOf("month").format("YYYY-MM-DD"),
          dateEnd: moment(DATE.dateEnd).endOf("month").format("YYYY-MM-DD")
        },
      },
    });
    setIsExist(res.data.result || []);
    setLOADING(false);
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    });
    // 첫번째 객체를 제외하고 데이터 추가
    setOBJECT((prev) => {
      if (prev.length === 1 && prev[0]._id === "") {
        return res.data.result;
      }
      else {
        return {...prev, ...res.data.result};
      }
    });
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/plan/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      Object.assign(SEND, {
        dateStart: DATE.dateStart,
        dateEnd: DATE.dateEnd
      });
      navigate(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      food_plan_kcal: 0,
      food_plan_carb: 0,
      food_plan_protein: 0,
      food_plan_fat: 0,
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Calendar
        DATE={DATE}
        setDATE={setDATE}
        isExist={isExist}
        setIsExist={setIsExist}
      />
    );
    // 7-2. count
    const countSection = () => (
      <Count
        COUNT={COUNT}
        setCOUNT={setCOUNT}
        limit={1}
      />
    );
    // 7-3. badge
    const badgeSection = (index) => (
      <Badge
        badgeContent={index + 1}
        color={"primary"}
        showZero={true}
      />
    );
    // 7-4. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <DropDown
        id={id}
        sectionId={sectionId}
        index={index}
        handlerDelete={handlerDelete}
      />
    );
    // 7-5. total
    // 7-6. empty
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Card className={"p-20"} key={i}>
        <Div className={"d-between"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, "", i)}
        </Div>
        <Br40/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planKcal")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.food_plan_kcal).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={food2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endKcal")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(99999, parseInt(rawValue, 10));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_kcal: limitedValue
              }));
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planCarb")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.food_plan_carb).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={food3} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(99999, parseInt(rawValue, 10));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_carb: limitedValue
              }));
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planProtein")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.food_plan_protein).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={food4} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(99999, parseInt(rawValue, 10));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_protein: limitedValue
              }));
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planFat")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.food_plan_fat).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={food5} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(99999, parseInt(rawValue, 10));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_fat: limitedValue
              }));
            }}
          />
        </Div>
        <Br20/>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      COUNT?.newSectionCnt > 0 && tableFragment(0)
    );
    // 7-9. first
    const firstSection = () => (
      <Card className={"p-20"}>
        {dateSection()}
        <Br20/>
        {countSection()}
      </Card>
    );
    // 7-9. second
    const secondSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper d-column h-min65vh"}>
          {firstSection()}
          {secondSection()}
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
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navigate, flowSave
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
