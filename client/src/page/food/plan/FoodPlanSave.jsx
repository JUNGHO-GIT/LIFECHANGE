// FoodPlanSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, axios, numeral} from "../../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../../import/ImportHooks.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Badge} from "../../../import/ImportMuis.jsx";
import {TextField, Button, DateCalendar} from "../../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../../import/ImportMuis.jsx";
import {common1, common2, common3, common5} from "../../../import/ImportImages.jsx";
import {food2, food3, food4, food5} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanSave = () => {

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

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
   dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/food/plan/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
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
  useDate(location_dateStart, location_dateEnd, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
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
      sectionCnt: 1
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Div className={"d-row"}>
        <PopUp
          type={"calendar"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["day"]}
                readOnly={false}
                value={moment(DATE.dateStart)}
                sx={{
                  width: "80vw",
                  height: "60vh"
                }}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    dateStart: moment(date).format("YYYY-MM-DD")
                  }));
                  closePopup();
                }}
              />
            </LocalizationProvider>
          )}>
          {(popTrigger={}) => (
            <TextField
              select={false}
              label={translate("common-dateStart")}
              size={"small"}
              value={DATE.dateStart}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
                className: "fw-bold",
                startAdornment: (
                  <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
                ),
                endAdornment: null
              }}
            />
          )}
        </PopUp>
        <PopUp
          type={"calendar"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["day"]}
                readOnly={false}
                value={moment(DATE.dateEnd)}
                sx={{
                  width: "80vw",
                  height: "60vh"
                }}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    dateEnd: moment(date).format("YYYY-MM-DD")
                  }));
                  closePopup();
                }}
              />
            </LocalizationProvider>
          )}>
          {(popTrigger={}) => (
            <TextField
              select={false}
              label={translate("common-dateEnd")}
              size={"small"}
              value={DATE.dateEnd}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
                className: "fw-bold",
                startAdornment: (
                  <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
                ),
                endAdornment: null
              }}
            />
          )}
        </PopUp>
      </Div>
    );
    // 7-2. count (plan 은 total x)
    // 7-3. total (plan 은 total x)
    // 7-4. badge
    const badgeSection = (index) => (
      <Badge
        badgeContent={index + 1}
        color={"primary"}
        showZero={true}
      />
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <PopUp
        key={index}
        type={"dropdown"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-row"}>
            <img src={common5} className={"w-16 h-16 icon pointer"} alt={"common5"}
              onClick={() => {
                handlerDelete(index);
                closePopup();
              }}
            />
            <Div className={"fs-0-8rem"}>{translate("common-delete")}</Div>
          </Div>
        )}>
        {(popTrigger={}) => (
          <img src={common3} className={"w-24 h-24 mt-n10 me-n10 pointer"} alt={"common3"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6-1. table (detail, save 는 empty x)
    // 7-6-2. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mb-40"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, "", 0)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planKcal")}
            variant={"outlined"}
            className={"w-86vw"}
            value={`${numeral(OBJECT?.food_plan_kcal).format("0,0")}`}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: (
                <img src={food2} className={"w-16 h-16 me-10"} alt={"food2"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>{translate("food-endKcal")}</Div>
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
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planCarb")}
            variant={"outlined"}
            className={"w-86vw"}
            value={`${numeral(OBJECT?.food_plan_carb).format("0,0")}`}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: (
                <img src={food3} className={"w-16 h-16 me-10"} alt={"food3"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>{translate("food-endGram")}</Div>
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
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planProtein")}
            variant={"outlined"}
            className={"w-86vw"}
            value={`${numeral(OBJECT?.food_plan_protein).format("0,0")}`}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: (
                <img src={food4} className={"w-16 h-16 me-10"} alt={"food4"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>{translate("food-endGram")}</Div>
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
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planFat")}
            variant={"outlined"}
            className={"w-86vw"}
            value={`${numeral(OBJECT?.food_plan_fat).format("0,0")}`}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: (
                <img src={food5} className={"w-16 h-16 me-10"} alt={"food5"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>{translate("food-endGram")}</Div>
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
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min90vw h-min67vh"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-column"}>
          {tableFragment(0)}
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
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};
