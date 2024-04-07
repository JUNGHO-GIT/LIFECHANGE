// FoodSearchDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/js/useStorage.jsx";
import moment from "moment-timezone";

// ------------------------------------------------------------------------------------------------>
export const FoodSearchDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD");
  const navParam = useNavigate();
  const location = useLocation();
  const PATH = location.pathname;
  const STATE = {
    id: "",
    date: "",
    refresh: 0,
    intoSave:"/food/save",
  };

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:planYn, set:setPlanYn} = useStorage(
    `planYn(${PATH})`, "N"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:FOOD_DEFAULT, set:setFOOD_DEFAULT} = useStorage(
    `FOOD_DEFAULT(${PATH})`, {
      food_plan : {
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
      },
      food_real : {
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
      },
    }
  );
  const {val:FOOD, set:setFOOD} = useStorage(
    `FOOD(${PATH})`, {
      food_plan : {
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
      },
      food_real : {
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
      },
    }
  );

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    const foodType = planYn === "Y" ? "food_plan" : "food_real";
    const getItem = localStorage.getItem("food_section");
    let storageSection = [];

    if (getItem) {
      const storedData = JSON.parse(getItem);
      storageSection = storedData;
    }

    setFOOD((prev) => {
      let newFoodSection = [...prev[foodType].food_section];

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
        [foodType]: {
          ...prev[foodType],
          food_section: newFoodSection,
        },
      };
    })
  }, []);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const foodType = planYn === "Y" ? "food_plan" : "food_real";

    // 초기 영양소 값 설정
    setFOOD_DEFAULT((prev) => ({
      ...prev,
      [foodType]: {
        ...prev[foodType],
        food_section: [...FOOD[foodType].food_section],
      },
    }));
  }, [FOOD]);

  // 4. handle ------------------------------------------------------------------------------------>
  const handleCountChange = (index, newValue) => {
    const foodType = planYn === "Y" ? "food_plan" : "food_real";
    const newCountValue = Number(newValue);

    setFOOD((prev) => {
      const newFoodSection = [...prev[foodType].food_section];
      const section = newFoodSection[index];
      const defaultSection = FOOD_DEFAULT[foodType].food_section[index];
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
        [foodType]: {
          ...prev[foodType],
          food_section: newFoodSection,
        },
      };
    });
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodSave = () => {

    const foodType = planYn === "Y" ? "food_plan" : "food_real";

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
          </tr>
        </thead>
        <tbody>
          {FOOD[foodType].food_section.map((item, index) => (
            <tr key={index}>
              <td>
              <select
                id="food_part"
                name="food_part"
                className="form-select"
                value={item.food_part}
                onChange={(e) => {
                  const newPart = e.target.value;
                  setFOOD((prev) => {
                    const newFoodSection = [...prev[foodType].food_section];
                    newFoodSection[index] = {
                      ...item,
                      food_part: newPart,
                    };
                    return {
                      ...prev,
                      [foodType]: {
                        ...prev[foodType],
                        food_section: newFoodSection,
                      },
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
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonSaveFood = () => {
    return (
      <button type="button" className="btn btn-sm btn-primary ms-2" onClick={() => {
        STATE.date = koreanDate;
        navParam(STATE.intoSave, {
          state: STATE
        });
      }}>
        Save
      </button>
    );
  };
  const buttonRefreshPage = () => {
    return (
      <button type="button" className="btn btn-sm btn-success ms-2" onClick={() => {
        navParam(STATE.refresh);
      }}>
        Refresh
      </button>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row mb-20">
          <div className="col-12 d-center">
            <h1>{planYn === "Y" ? "계획" : "실제"}</h1>
          </div>
        </div>
        <div className="row d-center mt-5 mb-20">
          <div className="col-12">
            {tableFoodSave()}
          </div>
        </div>
        <div className="row d-center mt-5">
          <div className="col-12">
            {buttonSaveFood()}
            {buttonRefreshPage()}
          </div>
        </div>
      </div>
    </div>
  );
};