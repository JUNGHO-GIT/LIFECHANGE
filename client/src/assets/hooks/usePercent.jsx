import { useState, useEffect } from "react";
import moment from "moment-timezone";
import axios from "axios";

export const usePercent = () => {
  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || "{}");
  const [percent, setPercent] = useState(JSON.parse(sessionStorage.getItem("percent") || "{}"));
  const [property, setProperty] = useState(JSON.parse(sessionStorage.getItem("property") || "{}"));

  useEffect(() => {
    const fetchPercentData = async () => {
      const URL = process.env.REACT_APP_URL || "";
      const SUBFIX = process.env.REACT_APP_USER || "";
      const URL_OBJECT = URL.trim().toString() + SUBFIX.trim().toString();
      const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");

      try {
        const resList = await axios.get(`${URL_OBJECT}/percent/list`, {
          params: {
            user_id: userId,
            duration: `${today} ~ ${today}`,
          },
        });
        const resProperty = await axios.get(`${URL_OBJECT}/percent/property`, {
          params: {
            user_id: userId
          },
        });

        setPercent(resList.data.result);
        setProperty(resProperty.data.result);
      } catch (error) {
        console.error("Error fetching percent data", error);
      }
    };

    fetchPercentData();
  }, [userId]);

  return { percent, property };
};