// FoodDetail.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {useDate} from "../../../assets/hooks/useDate.jsx";
import axios from "axios";
import {ButtonNode} from "../../../assets/fragments/ButtonNode.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
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
      toSave:"/food/save"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:FILTER, set:setFILTER} = useStorage(
    `FILTER(${PATH})`, {
      order: "asc",
      type: "day",
      limit: 5,
      partIdx: 0,
      part: "전체",
      titleIdx: 0,
      title: "전체"
    }
  );
  const {val:PAGING, set:setPAGING} = useStorage(
    `PAGING(${PATH})`, {
      page: 1,
      limit: 5
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
    food_total_kcal: "",
    food_total_fat: "",
    food_total_carb: "",
    food_total_protein: "",
    food_section: [{
      food_part_val: "",
      food_title_val: "",
      food_count: "",
      food_serv: "",
      food_gram: "",
      food_kcal: "",
      food_fat: "",
      food_carb: "",
      food_protein: "",
    }],
  };
  const [FOOD, setFOOD] = useState(FOOD_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/detail`, {
      params: {
        _id: location_id,
        user_id: user_id,
        food_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setFOOD(response.data.result || FOOD_DEFAULT);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: response.data.totalCnt || 0,
      sectionCnt: response.data.sectionCnt || 0,
    }));
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id) => {
    const response = await axios.delete(`${URL_FOOD}/delete`, {
      params: {
        _id: id,
        user_id: user_id,
        food_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (response.data === "success") {
      const updatedData = await axios.get(`${URL_FOOD}/detail`, {
        params: {
          _id: location_id,
          user_id: user_id,
          food_dur: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      alert("삭제되었습니다.");
      setFOOD(updatedData.data.result || FOOD_DEFAULT);
      updatedData.data.result === null && navParam(SEND.toList);
    }
    else {
      alert(`${response.data}`);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <table className="table bg-white table-hover">
        <thead className="table-primary">
          <tr>
            <th>음식명</th>
            <th>브랜드</th>
            <th>분류</th>
            <th>횟수</th>
            <th>서빙</th>
            <th>칼로리</th>
            <th>탄수화물</th>
            <th>단백질</th>
            <th>지방</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {FOOD?.food_section.map((item, index) => (
            <tr key={index}>
              {index === 0 && (
                <React.Fragment>
                  <td className="fs-20 pt-20" rowSpan={FOOD?.food_section?.length}>
                    {FOOD.food_startDt}
                  </td>
                </React.Fragment>
              )}
              <td className="fs-20 pt-20">
                {item.food_title_val}
              </td>
              <td className="fs-20 pt-20">
                {item.food_part_val}
              </td>
              <td className="fs-20 pt-20">
                {item.food_count}
              </td>
              <td className="fs-20 pt-20">
                {item.food_serv}
              </td>
              <td className="fs-20 pt-20">
                {item.food_kcal}
              </td>
              <td className="fs-20 pt-20">
                {item.food_carb}
              </td>
              <td className="fs-20 pt-20">
                {item.food_protein}
              </td>
              <td className="fs-20 pt-20">
                {item.food_fat}
              </td>
              <td className="fs-20 pt-20">
                <button type="button" className="btn btn-sm btn-danger" onClick={() => (
                  flowDelete(item._id)
                )}>
                  x
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} className="text-center">합계</td>
            <td>{FOOD.food_total_kcal}</td>
            <td>{FOOD.food_total_carb}</td>
            <td>{FOOD.food_total_protein}</td>
            <td>{FOOD.food_total_fat}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={""} navParam={navParam}
        type={"detail"} food={"food"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container-wrapper">
        <div className="row d-center">
          <div className="col-12 mb-20">
            <h1>Detail</h1>
          </div>
          <div className="col-12 mb-20">
            {tableNode()}
          </div>
          <div className="col-12 mb-20">
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};
