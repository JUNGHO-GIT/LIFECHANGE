// MoneyDetail.jsx

import "moment/locale/ko";
import moment from "moment-timezone";
import axios from "axios";
import numeral from 'numeral';
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {percent} from "../../assets/js/percent.js";
import {useStorage} from "../../hooks/useStorage.jsx";
import {useDate} from "../../hooks/useDate.jsx";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import Grid2 from '@mui/material/Unstable_Grid2';
import {Menu, MenuItem} from "@mui/material";
import {TextField, Typography, InputAdornment} from '@mui/material';
import {Container, Card, Paper, Box, Badge, Divider, IconButton, Button} from "@mui/material";
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment/index';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DesktopDatePicker, DesktopTimePicker} from '@mui/x-date-pickers';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// ------------------------------------------------------------------------------------------------>
export const MoneyDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail: "/money/detail",
    toList: "/money/list",
    toUpdate: "/money/save",
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
        _id: location_id,
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
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const res = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        user_id: user_id,
        _id: id,
        section_id: section_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      if (Object.keys(res.data.result).length > 0) {
        setOBJECT(res.data.result);
      }
      else {
        navParam(SEND.toList);
      }
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const adornment = () => (
      <InputAdornment position={"start"}><i className='bx bx-won'></i></InputAdornment>
    );
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          재무 Detail
        </Typography>
      </React.Fragment>
    );
    const dateSection = () => (
      <React.Fragment>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
          <DesktopDatePicker
            label={"날짜"}
            value={moment(DATE.startDt, "YYYY-MM-DD")}
            format={"YYYY-MM-DD"}
            timezone={"Asia/Seoul"}
            onChange={(day) => {
              setDATE((prev) => ({
                ...prev,
                startDt: moment(day).format("YYYY-MM-DD"),
                endDt: moment(day).format("YYYY-MM-DD")
              }));
            }}
          ></DesktopDatePicker>
        </LocalizationProvider>
      </React.Fragment>
    );
    const totalSection = () => (
      <React.Fragment>
        <Box sx={{display: "grid", placeItems: "center"}}>
          <TextField
            label={"총 수입"}
            size={"small"}
            value={`${numeral(OBJECT.money_total_in).format('0,0')}`}
            variant={"outlined"}
            className={"mt-6 mb-6"}
            InputProps={{
              readOnly: true,
              startAdornment: adornment()
            }}
          ></TextField>
          <TextField
            label={"총 지출"}
            size={"small"}
            value={`${numeral(OBJECT.money_total_out).format('0,0')}`}
            variant={"outlined"}
            className={"mt-6 mb-6"}
            InputProps={{
              readOnly: true,
              startAdornment: adornment()
            }}
          ></TextField>
          <TextField
            label={"총 자산"}
            size={"small"}
            value={`${numeral(OBJECT.money_property).format('0,0')}`}
            variant={"outlined"}
            className={"mt-6 mb-6"}
            InputProps={{
              readOnly: true,
              startAdornment: adornment()
            }}
          ></TextField>
        </Box>
      </React.Fragment>
    );
    const dropdownSection = (id, sectionId, index) => (
      <PopupState variant={"popover"} popupId={"popup"}>
        {(popupState) => (
          <React.Fragment>
            <IconButton {...bindTrigger(popupState)}>
              <Badge badgeContent={index + 1} color={"primary"} showZero={true}></Badge>
            </IconButton>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={() => {
                flowDelete(id, sectionId)
              }}>
                <DeleteIcon fontSize={"small"} color={"error"}></DeleteIcon>
                삭제
              </MenuItem>
              <MenuItem onClick={() => {
                SEND.startDt = DATE.startDt;
                SEND.endDt = DATE.endDt;
                navParam(SEND.toUpdate, {
                  state: SEND,
                });
              }}>
                <EditIcon fontSize={"small"} color={"primary"}></EditIcon>
                수정
              </MenuItem>
              <MenuItem>
                <MoreVertIcon fontSize={"small"} color={"action"}></MoreVertIcon>
                기타
              </MenuItem>
            </Menu>
          </React.Fragment>
        )}
      </PopupState>
    );
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <Box className={"d-center p-10"}>
            {titleSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"}></Divider>
          <Box className={"d-center mb-20"}>
            {dateSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"}></Divider>
          <Box className={"text-center mb-20"}>
            {totalSection()}
          </Box>
          {OBJECT?.money_section?.map((section, index) => (
            <React.Fragment key={index}>
              <Card variant={"outlined"} className={"p-20"}>
                <Box className={"d-right mb-20"}>
                  {dropdownSection(OBJECT._id, section._id, index)}
                </Box>
                <Box className={"d-center mb-20"}>
                  <TextField
                    label={"분류"}
                    size={"small"}
                    value={section.money_part_val}
                    variant={"outlined"}
                    className={"me-5"}
                    InputProps={{
                      readOnly: true
                    }}
                  ></TextField>
                  <TextField
                    label={"항목"}
                    size={"small"}
                    value={section.money_title_val}
                    variant={"outlined"}
                    className={"ms-5"}
                    InputProps={{
                      readOnly: true
                    }}
                  ></TextField>
                </Box>
                <Box className={"d-center mb-20"}>
                  <TextField
                    label={"금액"}
                    size={"small"}
                    value={`${numeral(section.money_amount).format('0,0')}`}
                    variant={"outlined"}
                    className={"w-102"}
                    InputProps={{
                      readOnly: true,
                      startAdornment: adornment()
                    }}
                  ></TextField>
                </Box>
              </Card>
            </React.Fragment>
          ))}
        </Box>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Paper className={"content-wrapper"} variant={"outlined"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Paper>
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

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={""} navParam={navParam}
      part={"money"} plan={""} type={"detail"}
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
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};