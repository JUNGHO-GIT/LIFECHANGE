// FoodSave.jsx

import axios from "axios";
import React, {useState, useEffect, forwardRef} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {NumericFormat} from "react-number-format";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Button, ButtonGroup, Table, Form} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const user_id = window.sessionStorage.getItem("user_id");
  const session = window.sessionStorage.getItem("dataset") || "";
  const foodArray = JSON.parse(session)?.food || [];
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
      refresh:0,
      toList:"/food/list",
      toSave:"/food/save",
      toSearch:"/food/search",
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
  const FOOD_DEFAULT = {
    _id: "",
    food_number: 0,
    food_startDt: "",
    food_endDt: "",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_val: "",
      food_title_val: "",
      food_count: "",
      food_serv: "",
      food_gram: "",
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  };
  const {val:FOOD_BEFORE, set:setFOOD_BEFORE} = useStorage(
    `FOOD_BEFORE(${PATH})`, FOOD_DEFAULT
  );
  const {val:FOOD, set:setFOOD} = useStorage(
    `FOOD(${PATH})`, FOOD_DEFAULT
  );

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {

    // 스토리지 데이터 가져오기
    const getItem = localStorage.getItem("food_section");
    let storageSection = getItem ? JSON.parse(getItem) : null;

    // 상세 데이터 가져오기
    const fetchDetail = async () => {
      const response = await axios.get(`${URL_FOOD}/detail`, {
        params: {
          _id: "",
          user_id: user_id,
          food_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });

      // 결과 있는경우 FOOD 상태 업데이트
      if (response.data.result !== null && !storageSection) {
        setFOOD((prev) => ({
          ...prev,
          ...response.data.result,
        }));
      }

      // 결과가 null or !null 이면서 스토리지 데이터가 있는 경우, FOOD 상태 업데이트
      else if (
        (response.data.result !== null && storageSection) ||
        (response.data.result === null && storageSection)
      ) {
        if (storageSection) {
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
        }
      }

      // 결과가 null 일 경우, FOOD 상태를 명시적으로 초기화
      else {
        setFOOD(FOOD_DEFAULT);
      }

      setCOUNT((prev) => ({
        ...prev,
        totalCnt: response.data.totalCnt || 0,
        sectionCnt: response.data.sectionCnt || 0
      }));
    };

    fetchDetail();
  }, [user_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 초기 영양소 값 설정
    setFOOD_BEFORE((prev) => ({
      ...prev,
      food_section: [...FOOD?.food_section],
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
  }, [FOOD?.food_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_FOOD}/save`, {
      user_id: user_id,
      FOOD: FOOD,
      food_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
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
      <DateNode DATE={DATE} setDATE={setDATE} part={"food"} plan={""} type={"save"} />
    );
  };

  // 4. handle ------------------------------------------------------------------------------------>
  const handleCountChange = (index, newValue) => {
    const newCountValue = Number(newValue);

    setFOOD((prev) => {
      const newFoodSection = [...prev.food_section];
      const section = newFoodSection[index];
      const defaultSection = FOOD_BEFORE.food_section[index];
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
      <Table hover responsive variant={"light"}>
        <thead className={"table-primary"}>
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
                    id={"food_part_val"}
                    name={"food_part_val"}
                    className={"form-select"}
                    value={item.food_part_val}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      setFOOD((prev) => {
                        const newFoodSection = [...prev.food_section];
                        newFoodSection[index] = {
                          ...item,
                          food_part_val: newVal
                        };
                        return {
                          ...prev,
                          food_section: newFoodSection,
                        };
                      });
                    }}
                  >
                    {foodArray?.map((item, idx) => (
                      <option key={idx} value={idx}>
                        {item.food_part}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{item.food_title_val}</td>
                <td>{item.food_brand}</td>
                <td>
                  <div className={"d-flex"}>
                    <NumericFormat
                      min={0}
                      max={99}
                      minLength={1}
                      maxLength={3}
                      id={"food_plan_count"}
                      name={"food_plan_count"}
                      datatype={"number"}
                      displayType={"input"}
                      className={"form-control"}
                      disabled={false}
                      allowNegative={false}
                      fixedDecimalScale={true}
                      thousandSeparator={true}
                      value={Math.min(99, parseInt(item.food_count))}
                      onValueChange={(values) => {
                        const limitedValue = Math.min(999, parseInt(values.value));
                        handleCountChange(index, limitedValue);
                      }}
                    ></NumericFormat>
                    <span>{item.food_serv}</span>
                  </div>
                </td>
                <td>{item.food_gram}</td>
                <td>{item.food_kcal}</td>
                <td>{item.food_fat}</td>
                <td>{item.food_carb}</td>
                <td>{item.food_protein}</td>
                <td><span className={"btn btn-sm btn-danger"} onClick={() => (
                    handlerFoodDelete(index)
                  )}>
                    x
                  </span></td>
              </tr>
            </React.Fragment>
          ))}
          <tr>
            <td>합계</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{FOOD?.food_total_kcal}</td>
            <td>{FOOD?.food_total_fat}</td>
            <td>{FOOD?.food_total_carb}</td>
            <td>{FOOD?.food_total_protein}</td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"food"} plan={""} type={"save"}
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