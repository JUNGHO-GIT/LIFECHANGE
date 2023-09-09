// FoodUpdate.tsx
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import axios from "axios";
import moment from "moment-timezone";

// 1. main ---------------------------------------------------------------------------------------->
export const FoodUpdate = () => {

  // title
  const TITLE = "Food Update";
  // url
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  const _id = location.state._id;
  // state
  const [FOOD, setFOOD] = useState<any>({});

  // 2. useEffect --------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const response = await axios.get(`${URL_FOOD}/foodDetail`, {
          params: {
            _id: _id,
          },
        });
        setFOOD(response.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFOOD([]);
      }
    };
    fetchFoodDetail();
  }, [_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowFoodUpdate = async () => {
    try {
      const response = await axios.put (`${URL_FOOD}/foodUpdate`, {
        _id : FOOD._id,
        FOOD : FOOD
      });
      if (response.data === "success") {
        alert("Update success");
        window.location.href = "/foodList";
      }
      else {
        alert("Update failed");
      }
    }
    catch (error: any) {
      alert(`Error fetching food data: ${error.message}`);
    }
  };

  // 4. logic ------------------------------------------------------------------------------------->

  // 5. table ------------------------------------------------------------------------------------->
  const tableFoodUpdate = () => {
    return (
      <div>
        <div className="form-floating">
          <input type="text" className="form-control"  placeholder="User ID"
          value={FOOD.user_id} readOnly />
          <label htmlFor="user_id">User ID</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Title" value={FOOD.food_title} onChange={(e) => setFOOD({...FOOD, food_title: e.target.value})} />
          <label htmlFor="floatingTitle">Title</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Content"
          value={FOOD.food_content}
          onChange={(e) => setFOOD({...FOOD, food_content: e.target.value})} />
          <label htmlFor="floatingContent">Content</label>
        </div>
        <div className="form-floating">
          <input type="text" className="form-control" placeholder="Food Date"
          value={FOOD.food_regdate} readOnly />
          <label htmlFor="food_regdate">Food Date</label>
        </div>
      </div>
    );
  };

  // 6. button ------------------------------------------------------------------------------------>
  const buttonFoodUpdate = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={flowFoodUpdate}>
        Update
      </button>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div className="container">
      <div className="row d-center mt-5">
        <div className="col-12">
          <h1 className="mb-3 fw-9">{TITLE}</h1>
        </div>
      </div>
      <div className="row d-center mt-5">
        <div className="col-10">
          <form className="form-inline">
            {tableFoodUpdate()}
            <br/>
            {buttonFoodUpdate()}
          </form>
        </div>
      </div>
    </div>
  );
};
