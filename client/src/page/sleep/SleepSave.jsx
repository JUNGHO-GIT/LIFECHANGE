// SleepSave.jsx

import "moment/locale/ko";
import moment from "moment-timezone";
import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {percent} from "../../assets/js/percent.js";
import {useStorage} from "../../hooks/useStorage.jsx";
import {useTime} from "../../hooks/useTime.jsx";
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
export const SleepSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
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
    toList:"/sleep/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    calStartOpen: false,
    calEndOpen: false,
    calOpen: false,
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
    sleep_number: 0,
    sleep_demo: false,
    sleep_startDt: "0000-00-00",
    sleep_endDt: "0000-00-00",
    sleep_section: [{
      sleep_night: "00:00",
      sleep_morning: "00:00",
      sleep_time: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "real");

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
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          수면 Detail
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
            slotProps={{ field: { shouldRespectLeadingZeros: true } }}
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
    const dropdownSection = () => (
      <PopupState variant={"popover"} popupId={"popup"}>
        {(popupState) => (
          <React.Fragment>
            <IconButton {...bindTrigger(popupState)}>
              <Badge badgeContent={COUNT?.sectionCnt} color={"primary"} showZero={true}>
              </Badge>
            </IconButton>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={() => {
                setOBJECT(OBJECT_DEF);
              }}>
                <DeleteIcon fontSize={"small"} color={"action"}></DeleteIcon>
                초기화
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
    const adornment = () => (
      <InputAdornment position={"end"}>시간</InputAdornment>
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
          {OBJECT?.sleep_section?.map((section, index) => (
            <React.Fragment key={index}>
              <Card variant={"outlined"} className={"p-20"}>
                <Box className={"d-right mb-20"}>
                  {dropdownSection()}
                </Box>
                <Box className={"d-center mb-20"}>
                  <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                    <DesktopTimePicker
                      label={"취침"}
                      minutesStep={1}
                      value={moment(section.sleep_night, "HH:mm")}
                      format={"HH:mm"}
                      timezone={"Asia/Seoul"}
                      views={['hours', 'minutes']}
                      onChange={(time) => {
                        setOBJECT((prev) => ({
                          ...prev,
                          sleep_section: [{
                            ...prev?.sleep_section[0],
                            sleep_night: moment(time).format("HH:mm")
                          }],
                        }));
                      }}
                    ></DesktopTimePicker>
                  </LocalizationProvider>
                </Box>
                <Box className={"d-center mb-20"}>
                  <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                    <DesktopTimePicker
                      label={"기상"}
                      minutesStep={1}
                      value={moment(section.sleep_morning, "HH:mm")}
                      format={"HH:mm"}
                      timezone={"Asia/Seoul"}
                      views={['hours', 'minutes']}
                      onChange={(time) => {
                        setOBJECT((prev) => ({
                          ...prev,
                          sleep_section: [{
                            ...prev.sleep_section[0],
                            sleep_morning: moment(time).format("HH:mm")
                          }]
                        }));
                      }}
                    ></DesktopTimePicker>
                  </LocalizationProvider>
                </Box>
                <Box className={"d-center mb-20"}>
                  <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                    <TextField
                      type={"text"}
                      size={"medium"}
                      id={"sleep_time"}
                      name={"sleep_time"}
                      label={"수면"}
                      InputProps={{
                        readOnly: true,
                        endAdornment: adornment()
                      }}
                      value={section.sleep_time}
                    ></TextField>
                  </LocalizationProvider>
                </Box>
                <Box className={"h-3vh"}></Box>
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

  // 8. loading ----------------------------------------------------------------------------------->
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

  // 14. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"sleep"} plan={""} type={"save"}
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
