// MoneySave.jsx

import "moment/locale/ko";
import moment from "moment-timezone";
import axios from "axios";
import numeral from 'numeral';
import InputMask from "react-input-mask";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {NumericFormat} from "react-number-format";
import {percent} from "../../assets/js/percent.js";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {useDate} from "../../hooks/useDate.jsx";
import {useStorage} from "../../hooks/useStorage.jsx";
import {DaySave} from "../../fragments/DaySave.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import Grid2 from '@mui/material/Unstable_Grid2';
import {Menu, MenuItem, FormControl, Select, InputLabel} from '@mui/material';
import {TextField, Typography, InputAdornment} from '@mui/material';
import {Container, Card, Paper, Box, Badge, Divider, IconButton, Button} from "@mui/material";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment/index';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker, DesktopTimePicker} from '@mui/x-date-pickers';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput';
import {NumericInput} from "../../fragments/NumericInput.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneySave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "";
  const moneyArray = JSON.parse(session)?.money || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList: "/money/list"
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
    money_number: 0,
    money_demo: false,
    money_startDt: "0000-00-00",
    money_endDt: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
    money_property: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
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
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  useEffect(() => {
    console.log("COUNT", COUNT);
  }, [COUNT]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // money_part_val 가 수입인경우, 지출인 경우
    const totals = OBJECT?.money_section.reduce((acc, cur) => {
      return {
        totalIn: acc.totalIn + (cur.money_part_val === "수입" ? cur.money_amount : 0),
        totalOut: acc.totalOut + (cur.money_part_val === "지출" ? cur.money_amount : 0)
      };
    }, {totalIn: 0, totalOut: 0});

    setOBJECT((prev) => ({
      ...prev,
      money_total_in: Math.round(totals.totalIn),
      money_total_out: Math.round(totals.totalOut)
    }));

  }, [OBJECT?.money_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
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

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const handlerCount = (e) => {
      let newCount = parseInt(e, 10);
      let defaultSection = {
        money_part_idx: 0,
        money_part_val: "전체",
        money_title_idx: 0,
        money_title_val: "전체",
        money_amount: 0,
        money_content: ""
      };
      setCOUNT((prev) => ({
        ...prev,
        sectionCnt: newCount
      }));
      if (newCount > 0) {
        let updatedSection = Array(newCount).fill(null).map((_, idx) => (
          idx < OBJECT.money_section.length ? OBJECT.money_section[idx] : defaultSection
        ));
        setOBJECT((prev) => ({
          ...prev,
          money_section: updatedSection
        }));
      }
      else {
        setOBJECT((prev) => ({
          ...prev,
          money_section: []
        }));
      }
    };
    const countNode = () => (
      <React.Fragment>
        <Box className={"input-group"}>
          <span className={"input-group-text"}>섹션 갯수</span>
          <TextField
            type={"number"}
            id={"sectionCnt"}
            name={"sectionCnt"}
            className={"form-control"}
            value={COUNT.sectionCnt}
            onChange={(e) => {
              if (Number(e.target.value) > 10) {
                alert("최대 10개까지 입력 가능합니다.");
                return;
              }
              else if (Number(e.target.value) < 0) {
                alert("0개 이상 입력 가능합니다.");
                return;
              }
              handlerCount(e.target.value);
            }}
          />
        </Box>
      </React.Fragment>
    );
    const tableFragment = (i) => (
      <React.Fragment key={i}>
        <Grid2 container spacing={3}>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>파트</span>
              <select
                id={`money_part_idx-${i}`}
                name={`money_part_idx-${i}`}
                className={"form-select"}
                value={OBJECT?.money_section[i]?.money_part_idx}
                onChange={(e) => {
                  const newIndex = Number(e.target.value);
                  setOBJECT((prev) => ({
                    ...prev,
                    money_section: prev.money_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        money_part_idx: newIndex,
                        money_part_val: moneyArray[newIndex]?.money_part,
                        money_title_idx: 0,
                        money_title_val: moneyArray[newIndex]?.money_title[0],
                      } : item
                    ))
                  }));
                }}
              >
                {moneyArray?.map((item, idx) => (
                  <option key={idx} value={idx}>
                    {item.money_part}
                  </option>
                ))}
              </select>
            </Box>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>제목</span>
              <select
                id={`money_title_idx-${i}`}
                name={`money_title_idx-${i}`}
                className={"form-select"}
                value={OBJECT?.money_section[i]?.money_title_idx}
                onChange={(e) => {
                  const newTitleIdx = Number(e.target.value);
                  const newTitleVal = moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title[newTitleIdx];
                  if (newTitleIdx >= 0 && newTitleVal) {
                    setOBJECT((prev) => ({
                      ...prev,
                      money_section: prev.money_section.map((item, idx) => (
                        idx === i ? {
                          ...item,
                          money_title_idx: newTitleIdx,
                          money_title_val: newTitleVal,
                        } : item
                      ))
                    }));
                  }
                }}
              >
                {moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title?.map((title, idx) => (
                  <option key={idx} value={idx}>
                    {title}
                  </option>
                ))}
              </select>
            </Box>
          </Grid2>
        </Grid2>
        <Grid2 container spacing={3}>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>금액</span>
              <NumericFormat
                min={0}
                max={9999999999}
                minLength={1}
                maxLength={14}
                prefix={"₩  "}
                datatype={"number"}
                displayType={"input"}
                id={`money_amount-${i}`}
                name={`money_amount-${i}`}
                className={`form-control ${OBJECT?.money_section[i]?.money_part_val === "수입" ? "text-primary" : "text-danger"}`}
                disabled={false}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                value={OBJECT?.money_section[i]?.money_amount}
                onValueChange={(values) => {
                  const limitedValue = Math.min(9999999999, parseInt(values?.value));
                  setOBJECT((prev) => ({
                    ...prev,
                    money_section: prev.money_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        money_amount: limitedValue
                      } : item
                    ))
                  }));
                }}
              ></NumericFormat>
            </Box>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>메모</span>
              <InputMask
                mask={""}
                placeholder={"메모"}
                id={`money_content-${i}`}
                name={`money_content-${i}`}
                className={"form-control"}
                maskChar={null}
                value={OBJECT?.money_section[i]?.money_content}
                onChange={(e) => {
                  const limitedContent = e.target.value.slice(0, 100);
                  setOBJECT((prev) =>({
                    ...prev,
                    money_section: prev.money_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        money_content: limitedContent
                      } : item
                    ))
                  }));
                }}
              ></InputMask>
            </Box>
          </Grid2>
        </Grid2>
      </React.Fragment>
    );
    const tableSection = () => (
      <React.Fragment>
        {Array.from({length: COUNT.sectionCnt}, (_, i) => tableFragment(i))}
      </React.Fragment>
    );
    const tableRemain = () => (
      <React.Fragment>
        <Grid2 container spacing={3}>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>총수입</span>
              <NumericFormat
                min={0}
                max={9999999999}
                minLength={1}
                maxLength={14}
                prefix={"₩  "}
                datatype={"number"}
                displayType={"input"}
                id={"money_total_in"}
                name={"money_total_in"}
                className={`form-control text-primary`}
                readOnly={true}
                disabled={true}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                value={Math.min(9999999999, OBJECT?.money_total_in)}
              ></NumericFormat>
            </Box>
          </Grid2>
          <Grid2 xl={6} lg={6} md={6} sm={6} xs={6}>
            <Box className={"input-group"}>
              <span className={"input-group-text"}>총지출</span>
              <NumericFormat
                min={0}
                max={9999999999}
                minLength={1}
                maxLength={14}
                prefix={"₩  "}
                datatype={"number"}
                displayType={"input"}
                id={"money_total_out"}
                name={"money_total_out"}
                className={`form-control text-danger`}
                readOnly={true}
                disabled={true}
                allowNegative={false}
                thousandSeparator={true}
                fixedDecimalScale={true}
                value={Math.min(9999999999, OBJECT?.money_total_out)}
              ></NumericFormat>
            </Box>
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
                {countNode()}
                {tableSection()}
                {tableRemain()}
              </Grid2>
            </Grid2>
          </Container>
        </Card>
      </React.Fragment>
    );
  };

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
      part={"money"} plan={""} type={"save"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"money"} plan={""} type={"save"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
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
