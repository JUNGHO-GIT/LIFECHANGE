// FoodUpdate.tsx
import React, {useEffect, useState} from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

// ------------------------------------------------------------------------------------------------>
export const FoodUpdate = () => {

  const [FOOD, setFOOD] = useState<any>({});
  const _id = useLocation().state._id;
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const TITLE = "Food Update";

  // ---------------------------------------------------------------------------------------------->
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

  // ---------------------------------------------------------------------------------------------->
  const foodUpdateFlow = async () => {
    try {
      const response = await axios.put (`${URL_FOOD}/foodUpdate`, {
        data : {
          _id : _id,
          FOOD : FOOD
        }
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

  // ---------------------------------------------------------------------------------------------->
  const foodUpdateTable = () => {
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

  // ---------------------------------------------------------------------------------------------->
  const buttonFoodUpdate = () => {
    return (
      <button className="btn btn-primary ms-2" type="button" onClick={foodUpdateFlow}>
        Update
      </button>
    );
  };

  // ---------------------------------------------------------------------------------------------->
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
            {foodUpdateTable()}
            <br/>
            {buttonFoodUpdate()}
          </form>
        </div>
      </div>
    </div>
  );
};