// FoodSave.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {useDateReal} from "../../assets/hooks/useDateReal.jsx";
import DatePicker from "react-datepicker";
import axios from "axios";
import moment from "moment-timezone";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {CalendarNode} from "../../assets/fragments/CalendarNode.jsx";
import {PagingNode} from "../../assets/fragments/PagingNode.jsx";
import {FilterNode} from "../../assets/fragments/FilterNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const navParam = useNavigate();
  const location = useLocation();
  const location_date = location?.state?.date;
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname;

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:STATE, set:setSTATE} = useStorage(
    `STATE(${PATH})`, {
      id: "",
      date: "",
      refresh:0,
      toList:"/food/list",
      toSave:"/food/save",
      toSearch:"/food/search",
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      strDur: `${location_date} ~ ${location_date}`,
      strStartDt: location_date,
      strEndDt: location_date,
      strDt: location_date
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );
  const {val:COUNT, set: setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:FOOD_DEFAULT, set:setFOOD_DEFAULT} = useStorage(
    `FOOD_DEFAULT(${PATH})`, {
      _id: "",
      food_number: 0,
      food_date: "",
      food_total_kcal: "",
      food_total_fat: "",
      food_total_carb: "",
      food_total_protein: "",
      food_section: [{
        food_part: "",
        food_title: "",
        food_count: "",
        food_serv: "",
        food_gram: "",
        food_kcal: "",
        food_fat: "",
        food_carb: "",
        food_protein: "",
      }],
    }
  );
  const {val:FOOD, set:setFOOD} = useStorage(
    `FOOD(${PATH})`, {
      _id: "",
      food_number: 0,
      food_date: "",
      food_total_kcal: "",
      food_total_fat: "",
      food_total_carb: "",
      food_total_protein: "",
      food_section: [{
        food_part: "",
        food_title: "",
        food_count: "",
        food_serv: "",
        food_gram: "",
        food_kcal: "",
        food_fat: "",
        food_carb: "",
        food_protein: "",
      }],
    }
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDateReal(FOOD, setFOOD, PATH, DATE, setDATE, location_date);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  /* useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/detail`, {
      params: {
        _id: "",
        user_id: user_id,
        food_dur: DATE.strDur
      },
    });

    setFOOD(response.data.result ? response.data.result : FOOD_DEFAULT);

  })()}, [DATE.strDur]); */

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const getItem = localStorage.getItem("food_section");
    let storageSection = [];

    if (getItem) {
      const storedData = JSON.parse(getItem);
      storageSection = storedData;
    }

    setFOOD((prev) => {
      let newFoodSection = [...prev.food_section];

      // 첫 번째 항목이 빈 값 객체인지 확인하고, 조건에 맞으면 제거
      if (
        newFoodSection.length > 0 &&
        Object.values(newFoodSection[0]).every((value) => (value === ""))
      ) {
        newFoodSection.shift();
      }

      // 새로운 데이터가 배열인 경우 배열, 단일 객체인 경우 단일 객체를 추가
      Array.isArray(storageSection)
      ? newFoodSection.push(...storageSection)
      : newFoodSection.push(storageSection);

      return {
        ...prev,
        food_section: newFoodSection,
      };
    })
  }, []);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    // 초기 영양소 값 설정
    setFOOD_DEFAULT((prev) => ({
      ...prev,
      food_section: [...FOOD.food_section],
    }));
  }, [FOOD]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const totals = FOOD?.food_section?.reduce((acc, current) => {
      return {
        totalKcal: acc.totalKcal + Number(current.food_kcal),
        totalFat: acc.totalFat + Number(current.food_fat),
        totalCarb: acc.totalCarb + Number(current.food_carb),
        totalProtein: acc.totalProtein + Number(current.food_protein),
      };
    }, { totalKcal: 0, totalFat: 0, totalCarb: 0, totalProtein: 0 });

    setFOOD(prev => ({
      ...prev,
      food_total_kcal: totals.totalKcal.toFixed(1),
      food_total_fat: totals.totalFat.toFixed(1),
      food_total_carb: totals.totalCarb.toFixed(1),
      food_total_protein: totals.totalProtein.toFixed(1),
    }));
  }, [FOOD.food_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {

    const response = await axios.post(`${URL_FOOD}/save`, {
      user_id: user_id,
      FOOD: FOOD,
      food_dur: DATE.strDur
    });
    if (response.data === "success") {
      alert("Save successfully");
      STATE.date = DATE.strDt;
      navParam(STATE.toList, {
        state: STATE
      });
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} type="save" />
    );
  };

  // 4. handle ------------------------------------------------------------------------------------>
  const handleCountChange = (index, newValue) => {
    const newCountValue = Number(newValue);

    setFOOD((prev) => {
      const newFoodSection = [...prev.food_section];
      const section = newFoodSection[index];
      const defaultSection = FOOD_DEFAULT.food_section[index];
      const ratio = newCountValue / (defaultSection.food_count || 1);

      if (defaultSection) {
        newFoodSection[index] = {
          ...section,
          food_count: newCountValue,
          food_gram: (Number(defaultSection?.food_gram) * ratio).toFixed(1),
          food_kcal: (Number(defaultSection?.food_kcal) * ratio).toFixed(1),
          food_fat: (Number(defaultSection?.food_fat) * ratio).toFixed(1),
          food_carb: (Number(defaultSection?.food_carb) * ratio).toFixed(1),
          food_protein: (Number(defaultSection?.food_protein) * ratio).toFixed(1),
        };
      }

      return {
        ...prev,
        food_section: newFoodSection,
      };
    });
  };

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerFoodDelete = (index) => {
    setFOOD((prev) => {
      const newFoodSection = [...prev.food_section];
      newFoodSection.splice(index, 1);
      return {
        ...prev,
        food_section: newFoodSection,
      };
    });
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>part</th>
            <th>title</th>
            <th>brand</th>
            <th>serving</th>
            <th>gram</th>
            <th>kcal</th>
            <th>fat</th>
            <th>carb</th>
            <th>protein</th>
            <th>x</th>
          </tr>
        </thead>
        <tbody>
          {FOOD?.food_section?.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>
                  <select
                    id="food_part"
                    name="food_part"
                    className="form-select"
                    value={item.food_part}
                    onChange={(e) => {
                      const newPart = e.target.value;
                      setFOOD((prev) => {
                        const newFoodSection = [...prev.food_section];
                        newFoodSection[index] = {
                          ...item,
                          food_part: newPart,
                        };
                        return {
                          ...prev,
                          food_section: newFoodSection,
                        };
                      });
                    }}
                  >
                    <option value="">선택</option>
                    <option value="아침">아침</option>
                    <option value="점심">점심</option>
                    <option value="저녁">저녁</option>
                    <option value="간식">간식</option>
                  </select>
                </td>
                <td>{item.food_title}</td>
                <td>{item.food_brand}</td>
                <td>
                  <div className="d-flex">
                    <input
                      type="number"
                      className="form-control"
                      value={item.food_count}
                      min="1"
                      max="100"
                      onChange={(e) => handleCountChange(index, e.target.value)}
                    />
                    <span>{item.food_serv}</span>
                  </div>
                </td>
                <td>{item.food_gram}</td>
                <td>{item.food_kcal}</td>
                <td>{item.food_fat}</td>
                <td>{item.food_carb}</td>
                <td>{item.food_protein}</td>
                <td>
                  <span className="btn btn-sm btn-danger" onClick={() => (
                    handlerFoodDelete(index)
                  )}>
                    x
                  </span>
                </td>
              </tr>
            </React.Fragment>
          ))}
          <tr>
            <td>합계</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{FOOD.food_total_kcal}</td>
            <td>{FOOD.food_total_fat}</td>
            <td>{FOOD.food_total_carb}</td>
            <td>{FOOD.food_total_protein}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR}
        DATE={DATE} setDATE={setDATE}
        STATE={STATE} setSTATE={setSTATE}
        flowSave={flowSave} navParam={navParam}
        type="save"
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20 d-center">
          <div className="col-12">
            <h1>Save</h1>
          </div>
        </div>
        <div className="row d-center mb-20">
          <div className="col-12">
            {dateNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {tableNode()}
          </div>
        </div>
        <div className="row mb-20 d-center">
          <div className="col-12">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};