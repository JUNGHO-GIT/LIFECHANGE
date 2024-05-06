// FoodPlanSave.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {NumericFormat} from "react-number-format";
import {percent} from "../../assets/js/percent.js";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {useDate} from "../../hooks/useDate.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import {DaySave} from "../../fragments/DaySave.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Container, Card, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Grid, TextField, Typography} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';

// ------------------------------------------------------------------------------------------------>
export const FoodPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/food/plan/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    food_plan_number: 0,
    food_plan_demo: false,
    food_plan_startDt: "0000-00-00",
    food_plan_endDt: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
      params: {
        user_id: user_id,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/plan/save`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const tableSection = () => (
      <React.Fragment>
        <Grid2 container spacing={3}>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>칼로리</span>
              <NumericFormat
                min={1}
                max={9999}
                minLength={1}
                maxLength={9}
                suffix={" kcal"}
                id={"food_plan_kcal"}
                name={"food_plan_kcal"}
                datatype={"number"}
                displayType={"input"}
                className={"form-control"}
                disabled={false}
                allowNegative={false}
                fixedDecimalScale={true}
                thousandSeparator={true}
                value={Math.min(9999, OBJECT?.food_plan_kcal)}
                onValueChange={(values) => {
                  const limitedValue = Math.min(9999, parseInt(values.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    food_plan_kcal: limitedValue
                  }));
                }}
              ></NumericFormat>
            </div>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>탄수화물</span>
              <NumericFormat
                min={0}
                max={9999}
                minLength={1}
                maxLength={6}
                suffix={" g"}
                id={"food_plan_carb"}
                name={"food_plan_carb"}
                datatype={"number"}
                displayType={"input"}
                className={"form-control"}
                disabled={false}
                allowNegative={false}
                fixedDecimalScale={true}
                thousandSeparator={true}
                value={Math.min(999, OBJECT?.food_plan_carb)}
                onValueChange={(values) => {
                  const limitedValue = Math.min(999, parseInt(values.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    food_plan_carb: limitedValue
                  }));
                }}
              ></NumericFormat>
            </div>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>단백질</span>
              <NumericFormat
                min={0}
                max={9999}
                minLength={1}
                maxLength={6}
                suffix={" g"}
                id={"food_plan_protein"}
                name={"food_plan_protein"}
                datatype={"number"}
                displayType={"input"}
                className={"form-control"}
                disabled={false}
                allowNegative={false}
                fixedDecimalScale={true}
                thousandSeparator={true}
                value={Math.min(999, OBJECT?.food_plan_protein)}
                onValueChange={(values) => {
                  const limitedValue = Math.min(999, parseInt(values.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    food_plan_protein: limitedValue
                  }));
                }}
              ></NumericFormat>
            </div>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <div className={"input-group"}>
              <span className={"input-group-text"}>지방</span>
              <NumericFormat
                min={0}
                max={9999}
                minLength={1}
                maxLength={6}
                suffix={" g"}
                id={"food_plan_fat"}
                name={"food_plan_fat"}
                datatype={"number"}
                displayType={"input"}
                className={"form-control"}
                disabled={false}
                allowNegative={false}
                fixedDecimalScale={true}
                thousandSeparator={true}
                value={Math.min(999, OBJECT?.food_plan_fat)}
                onValueChange={(values) => {
                  const limitedValue = Math.min(999, parseInt(values.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    food_plan_fat: limitedValue
                  }));
                }}
              ></NumericFormat>
            </div>
          </Grid2>
        </Grid2>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Card>
      </React.Fragment>
    );
  };

  // 9. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 11. day -------------------------------------------------------------------------------------->
  const daySaveNode = () => (
    <DaySave DATE={DATE} setDATE={setDATE} DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      part={"food"} plan={"plan"} type={"save"}
    />
  );

  // 14. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam} part={"food"} plan={"plan"} type={"save"}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {headerNode()}
      {navBarNode()}
      {daySaveNode()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};
