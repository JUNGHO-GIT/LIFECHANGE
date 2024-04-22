// DiaryDetail.jsx

import React, {useState, useEffect} from "react";
import axios from "axios";
import InputMask from "react-input-mask";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DiaryDetail = ({ popupNumber, setPopupNumber, isOpen, setIsOpen, startDt, endDt }) => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_DIARY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const customer_id = window.sessionStorage.getItem("customer_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList: "/diary/list",
      toDetail: "/diary/detail"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: startDt,
      endDt: endDt
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    customer_id: customer_id,
    diary_number: 0,
    diary_startDt: "0000-00-00",
    diary_endDt: "0000-00-00",
    diary_category: "",
    diary_title: "",
    diary_detail: ""
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(startDt, endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {
    setOBJECT((prev) => ({
      ...prev,
      diary_category: popupNumber.toString()
    }));
  }, [popupNumber]);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {
    if (popupNumber > 0 && isOpen) {(async () => {
      const response = await axios.get(`${URL_OBJECT}/detail`, {
        params: {
          _id: location_id,
          customer_id: customer_id,
          duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });
      setOBJECT(response.data.result || OBJECT_DEFAULT);
    })();
    } else {
      setOBJECT(OBJECT_DEFAULT);
    }
  }, [popupNumber, isOpen, location_id, customer_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      customer_id: customer_id,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      OBJECT: OBJECT
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
    if (response.data.status === "success") {
      alert(response.data.msg);
      navParam(SEND.toList);
    }
    else {
      alert(response.data.msg);
    }
  };

  // 5-1. popup ----------------------------------------------------------------------------------->
  const popupNode = () => {
    return (
      <React.Fragment>
        <div className={`popup ${isOpen ? "" : "d-none"}`}>
          <span className={"d-right fw-700 x-button"} onClick={() => (
            setIsOpen(false),
            setPopupNumber(0)
          )}>
            X
          </span>
          <div className={"form-group mt-20"}>
            {startDt} ~ {endDt}
          </div>
          <InputMask
            mask={""}
            placeholder={"카테고리"}
            id={`diary_category`}
            name={`diary_category`}
            className={"form-control"}
            maskChar={null}
            value={popupNumber}
            disabled={true}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                diary_category: e.target.value
              }))
            )}
          ></InputMask>
          <InputMask
            mask={""}
            placeholder={"메모"}
            id={`diary_title`}
            name={`diary_title`}
            className={"form-control"}
            maskChar={null}
            value={OBJECT?.diary_title}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                diary_title: e.target.value
              }))
            )}
          ></InputMask>
          <InputMask
            mask={""}
            placeholder={"내용"}
            id={`diary_detail`}
            name={`diary_detail`}
            className={"form-control"}
            maskChar={null}
            value={OBJECT?.diary_detail}
            onChange={(e) => (
              setOBJECT((prev) => ({
                ...prev,
                diary_detail: e.target.value
              }))
            )}
          ></InputMask>
          <Button variant={"primary"} className={"mt-20"} onClick={() => {
            flowSave();
          }}>
            저장
          </Button>
        </div>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {popupNode()}
    </React.Fragment>
  );
};