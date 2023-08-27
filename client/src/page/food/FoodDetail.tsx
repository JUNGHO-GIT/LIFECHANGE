// FoodDetail.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// ------------------------------------------------------------------------------------------------>
export const FoodDetail = () => {

  const [foodDetail, setFoodDetail] = useState<any>({});
  const user_id = sessionStorage.getItem("user_id");
  const URL = "http://127.0.0.1:4000/food";
  const TITLE = "Food Detail";

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const fetchFoodDetail = async () => {
      try {
        const res = await axios.get (`${URL}/foodDetail/${user_id}`);
        setFoodDetail(res.data);
      }
      catch (error: any) {
        alert(`Error fetching food data: ${error.message}`);
        setFoodDetail([]);
      }
    };
    fetchBoardDetail();
  }, [_id]);

  return (
    <>
    </>
  );
};