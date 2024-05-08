// SleepPlanSave.jsx

import moment from "moment-timezone";
import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {percent} from "assets/js/percent.js";
import {Header} from "page/architecture/Header";
import {NavBar} from "page/architecture/NavBar";
import {useDate, useStorage} from "import/CustomHooks";
import {useTime} from "assets/hooks/useTime";
import {DaySave, Btn, Loading} from "import/CustomComponents";
import {Grid2} from "import/CustomMuis";
import {Menu, MenuItem} from "import/CustomMuis";
import {TextField, Typography, InputAdornment} from "import/CustomMuis";
import {Container, Card, Paper, Box, Badge, Divider, IconButton, Button} from "import/CustomMuis";
import {AdapterMoment} from "import/CustomMuis";
import {LocalizationProvider} from "import/CustomMuis";
import {DesktopDatePicker, DesktopTimePicker} from "import/CustomMuis";
import {PopupState, bindTrigger, bindMenu } from "import/CustomMuis";
import {CustomIcons} from "import/CustomIcons";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
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
    toList:"/sleep/plan/list"
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
    sleep_plan_number: 0,
    sleep_plan_demo: false,
    sleep_plan_startDt: "0000-00-00",
    sleep_plan_endDt: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "plan");

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
      sectionCnt: res.data.sectionCnt || 0
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

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const adornment = () => (
      <InputAdornment position={"end"}>시간</InputAdornment>
    );
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          수면 계획 Detail
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
    const dropdownSection = (id, sectionId, index) => (
      <PopupState variant={"popover"} popupId={"popup"}>
        {(popupState) => (
          <React.Fragment>
            <IconButton {...bindTrigger(popupState)}>
              <Badge badgeContent={index + 1} color={"primary"} showZero={true}>
              </Badge>
            </IconButton>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={() => {
                setOBJECT(OBJECT_DEF);
              }}>
                <CustomIcons name={"MdOutlineDelete"} className={"w-24 h-24 dark"} />
                초기화
              </MenuItem>
              <MenuItem>
                <CustomIcons name={"MdOutlineAdd"} className={"w-24 h-24 dark"} />
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
          <Card variant={"outlined"} className={"p-20"}>
            <Box className={"d-right mb-20"}>
              {dropdownSection(OBJECT._id, "", 0)}
            </Box>
            <Box className={"d-center mb-20"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DesktopTimePicker
                  label={"취침 계획"}
                  minutesStep={1}
                  value={moment(OBJECT.sleep_plan_night, "HH:mm")}
                  format={"HH:mm"}
                  timezone={"Asia/Seoul"}
                  views={['hours', 'minutes']}
                  onChange={(time) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      sleep_plan_night: moment(time).format("HH:mm")
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
                  value={moment(OBJECT.sleep_plan_morning, "HH:mm")}
                  format={"HH:mm"}
                  timezone={"Asia/Seoul"}
                  views={['hours', 'minutes']}
                  onChange={(time) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      sleep_plan_morning: moment(time).format("HH:mm")
                    }));
                  }}
                ></DesktopTimePicker>
              </LocalizationProvider>
            </Box>
            <Box className={"d-center mb-20"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <TextField
                  label={"수면"}
                  type={"text"}
                  size={"medium"}
                  id={"sleep_time"}
                  name={"sleep_time"}
                  value={OBJECT.sleep_plan_time}
                  InputProps={{
                    readOnly: true,
                    endAdornment: adornment()
                  }}
                ></TextField>
              </LocalizationProvider>
            </Box>
          </Card>
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

  // 11. day -------------------------------------------------------------------------------------->
  const daySaveNode = () => (
    <DaySave DATE={DATE} setDATE={setDATE} DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      part={"sleep"} plan={"plan"} type={"save"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"sleep"} plan={"plan"} type={"save"}
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
