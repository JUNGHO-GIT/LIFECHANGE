// FoodPlanSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {NumericFormat} from "react-number-format";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD_PLAN = process.env.REACT_APP_URL_FOOD_PLAN;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toList:"/food/plan/list"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const FOOD_PLAN_DEFAULT = {
    _id: "",
    food_plan_number: 0,
    food_plan_startDt: "",
    food_plan_endDt: "",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  };
  const [FOOD_PLAN, setFOOD_PLAN] = useState(FOOD_PLAN_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD_PLAN}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setFOOD_PLAN(response.data.result || FOOD_PLAN_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_FOOD_PLAN}/save`, {
      user_id: user_id,
      FOOD_PLAN: FOOD_PLAN,
      food_plan_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(response.data.msg);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} part={"food"} plan={"plan"} type={"save"} />
    );
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <div className={"row d-center mb-20"}>
        <div className={"col-6"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>칼로리</span>
            <NumericFormat
              min={1}
              max={9999}
              minLength={1}
              maxLength={9}
              suffix={" kcal"}
              id={"food_plan_kcal"}
              name={"food_plan_kcal"}
              datatype={"number"}
              displayType={"input"}
              className={"form-control"}
              disabled={false}
              allowNegative={false}
              fixedDecimalScale={true}
              thousandSeparator={true}
              value={Math.min(9999, FOOD_PLAN?.food_plan_kcal)}
              onValueChange={(values) => {
                const limitedValue = Math.min(9999, parseInt(values.value));
                setFOOD_PLAN((prev) => ({
                  ...prev,
                  food_plan_kcal: limitedValue
                }));
              }}
            ></NumericFormat>
          </div>
        </div>
        <div className={"col-6"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>탄수화물</span>
            <NumericFormat
              min={0}
              max={9999}
              minLength={1}
              maxLength={6}
              suffix={" g"}
              id={"food_plan_carb"}
              name={"food_plan_carb"}
              datatype={"number"}
              displayType={"input"}
              className={"form-control"}
              disabled={false}
              allowNegative={false}
              fixedDecimalScale={true}
              thousandSeparator={true}
              value={Math.min(999, FOOD_PLAN?.food_plan_carb)}
              onValueChange={(values) => {
                const limitedValue = Math.min(999, parseInt(values.value));
                setFOOD_PLAN((prev) => ({
                  ...prev,
                  food_plan_carb: limitedValue
                }));
              }}
            ></NumericFormat>
          </div>
        </div>
        <div className={"col-6"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>단백질</span>
            <NumericFormat
              min={0}
              max={9999}
              minLength={1}
              maxLength={6}
              suffix={" g"}
              id={"food_plan_protein"}
              name={"food_plan_protein"}
              datatype={"number"}
              displayType={"input"}
              className={"form-control"}
              disabled={false}
              allowNegative={false}
              fixedDecimalScale={true}
              thousandSeparator={true}
              value={Math.min(999, FOOD_PLAN?.food_plan_protein)}
              onValueChange={(values) => {
                const limitedValue = Math.min(999, parseInt(values.value));
                setFOOD_PLAN((prev) => ({
                  ...prev,
                  food_plan_protein: limitedValue
                }));
              }}
            ></NumericFormat>
          </div>
        </div>
        <div className={"col-6"}>
          <div className={"input-group"}>
            <span className={"input-group-text"}>지방</span>
            <NumericFormat
              min={0}
              max={9999}
              minLength={1}
              maxLength={6}
              suffix={" g"}
              id={"food_plan_fat"}
              name={"food_plan_fat"}
              datatype={"number"}
              displayType={"input"}
              className={"form-control"}
              disabled={false}
              allowNegative={false}
              fixedDecimalScale={true}
              thousandSeparator={true}
              value={Math.min(999, FOOD_PLAN?.food_plan_fat)}
              onValueChange={(values) => {
                const limitedValue = Math.min(999, parseInt(values.value));
                setFOOD_PLAN((prev) => ({
                  ...prev,
                  food_plan_fat: limitedValue
                }));
              }}
            ></NumericFormat>
          </div>
        </div>
      </div>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"food"} plan={"plan"} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>Save</h1>
          </div>
          <div className={"col-12 mb-20"}>
            {dateNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {tableNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};
