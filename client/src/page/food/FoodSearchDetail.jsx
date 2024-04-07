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
    `planYn(${PATH})`, localStorage.getItem("planYn")
  );
  const {val:initValues, set:setInitValues} = useStorage(
    `initValues(${PATH})`, {}
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
          food_part_idx: 0,
          food_part_val: "",
          food_title_idx: 0,
          food_title_val: "",
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
          food_part_idx: 0,
          food_part_val: "",
          food_title_idx: 0,
          food_title_val: "",
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
          food_part_idx: 0,
          food_part_val: "",
          food_title_idx: 0,
          food_title_val: "",
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
          food_part_idx: 0,
          food_part_val: "",
          food_title_idx: 0,
          food_title_val: "",
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
        Object.values(newFoodSection[0]).every((value) => (value === 0 || value === ""))
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
    setFOOD_DEFAULT((prev) => {
      const newFoodSection = [...prev[foodType].food_section];
      newFoodSection.forEach((item, index) => {
        item.food_part_val = FOOD[foodType].food_section[index].food_part_val;
        item.food_title_val = FOOD[foodType].food_section[index].food_title_val;
        item.food_brand = FOOD[foodType].food_section[index].food_brand;
        item.food_count = FOOD[foodType].food_section[index].food_count;
        item.food_serv = FOOD[foodType].food_section[index].food_serv;
        item.food_gram = FOOD[foodType].food_section[index].food_gram;
        item.food_kcal = FOOD[foodType].food_section[index].food_kcal;
        item.food_fat = FOOD[foodType].food_section[index].food_fat;
        item.food_carb = FOOD[foodType].food_section[index].food_carb;
        item.food_protein = FOOD[foodType].food_section[index].food_protein;
      });
      return {
        ...prev,
        [foodType]: {
          ...prev[foodType],
          food_section: newFoodSection,
        },
      };
    });
  }, [FOOD, planYn]);

  // 4. handle ------------------------------------------------------------------------------------>
  const handleCountChange = (index, newValue) => {
    const foodType = planYn === "Y" ? "food_plan" : "food_real";
    const newCountValue = Number(newValue);

    setFOOD((prev) => {
      const newFoodSection = [...prev[foodType].food_section];
      const section = newFoodSection[index];
      const defaultSection = FOOD_DEFAULT[foodType]?.food_section[index];
      const ratio = newCountValue / (section.food_count || 1);

      newFoodSection[index] = {
        ...section,
        food_count: newCountValue,
        food_gram: (Number(defaultSection.food_gram) * ratio).toFixed(1),
        food_kcal: (Number(defaultSection.food_kcal) * ratio).toFixed(1),
        food_fat: (Number(defaultSection.food_fat) * ratio).toFixed(1),
        food_carb: (Number(defaultSection.food_carb) * ratio).toFixed(1),
        food_protein: (Number(defaultSection.food_protein) * ratio).toFixed(1),
      };

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
  const tableFoodDetail = () => {

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
              <td>{item.food_part_val}</td>
              <td>{item.food_title_val}</td>
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
            {tableFoodDetail()}
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