// SleepPlanDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {axios, moment} from "../../import/ImportLibs";
import {useDate, useStorage} from "../../import/ImportHooks";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/sleep/plan/list",
    toUpdate:"/sleep/plan/save"
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
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
  const flowDelete = async (id) => {
    const res = await axios.delete(`${URL_OBJECT}/plan/delete`, {
      params: {
        user_id: user_id,
        _id: id,
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
    // 7-1. title
    const titleSection = () => (
      <Typography variant={"h5"} fontWeight={500}>
        수면 계획 Detail
      </Typography>
    );
    // 7-2. date
    const dateSection = () => (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DesktopDatePicker
          label={"날짜"}
          value={moment(DATE.startDt, "YYYY-MM-DD")}
          format={"YYYY-MM-DD"}
          timezone={"Asia/Seoul"}
          readOnly={true}
        />
      </LocalizationProvider>
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <Box className={"d-flex"}>
        <IconButton size={"small"} color={"primary"}>
          <Badge
            badgeContent={index + 1}
            color={"primary"}
            showZero={true}
          />
        </IconButton>
        <PopDown elementId={`pop-${index}`} contents={
          <Box className={"d-block p-10"}>
            <Box className={"d-left mt-10 mb-10"} onClick={() => {
              flowDelete(id)
            }}>
              <CustomIcons name={"MdOutlineDelete"} className={"w-24 h-24 dark"} />
              <Typography variant={"inherit"}>삭제</Typography>
            </Box>
            <Box className={"d-left mt-10 mb-10"} onClick={() => {
              SEND.startDt = DATE.startDt;
              SEND.endDt = DATE.endDt;
              navParam(SEND.toUpdate, {
                state: SEND,
              });
            }}>
              <CustomIcons name={"MdOutlineEdit"} className={"w-24 h-24 dark"} />
              <Typography variant={"inherit"}>수정</Typography>
            </Box>
            <Box className={"d-left mt-10 mb-10"}>
              <CustomIcons name={"MdOutlineMoreHoriz"} className={"w-24 h-24 dark"} />
              <Typography variant={"inherit"}>더보기</Typography>
            </Box>
          </Box>
        }>
          {popProps => (
            <IconButton size={"small"} color={"primary"} className={"me-n20"} onClick={(e) => {
              popProps.openPopup(e.currentTarget)
            }}>
              <CustomIcons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark"} />
            </IconButton>
          )}
        </PopDown>
      </Box>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Box className={"d-between mt-n15 mb-20"}>
          {dropdownSection(OBJECT?._id, "", 0)}
        </Box>
        <Box className={"d-center mb-20"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DesktopTimePicker
              label={"취침 목표"}
              minutesStep={1}
              value={moment(OBJECT?.sleep_plan_night, "HH:mm")}
              format={"HH:mm"}
              timezone={"Asia/Seoul"}
              views={['hours', 'minutes']}
              slotProps={{
                textField: {
                  sx: {
                    width: "220px",
                  },
                },
                layout: {
                  sx: {
                    "& .MuiPickersLayout-contentWrapper": {
                      width: "220px",
                      height: "180px",
                    },
                    "& .MuiMultiSectionDigitalClockSection-root": {
                      width: "77px",
                      height: "180px",
                    },
                    "& .MuiMultiSectionDigitalClockSection-item": {
                      fontSize: "0.8rem",
                      width: "65px",
                      minHeight: "20px",
                      borderRadius: "8px",
                    },
                    "& .MuiMultiSectionDigitalClockSection-item .Mui-selected": {
                      color: "#fff",
                      backgroundColor: "#164a60",
                    },
                  },
                },
              }}
              readOnly={true}
            />
          </LocalizationProvider>
        </Box>
        <Box className={"d-center mb-20"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DesktopTimePicker
              label={"기상 목표"}
              minutesStep={1}
              value={moment(OBJECT?.sleep_plan_morning, "HH:mm")}
              format={"HH:mm"}
              timezone={"Asia/Seoul"}
              views={['hours', 'minutes']}
              slotProps={{
                textField: {
                  sx: {
                    width: "220px",
                  },
                },
                layout: {
                  sx: {
                    "& .MuiPickersLayout-contentWrapper": {
                      width: "220px",
                      height: "180px",
                    },
                    "& .MuiMultiSectionDigitalClockSection-root": {
                      width: "77px",
                      height: "180px",
                    },
                    "& .MuiMultiSectionDigitalClockSection-item": {
                      fontSize: "0.8rem",
                      width: "65px",
                      minHeight: "20px",
                      borderRadius: "8px",
                    },
                    "& .MuiMultiSectionDigitalClockSection-item .Mui-selected": {
                      color: "#fff",
                      backgroundColor: "#164a60",
                    },
                  },
                },
              }}
              readOnly={true}
            />
          </LocalizationProvider>
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            label={"수면 목표"}
            type={"text"}
            size={"small"}
            id={"sleep_time"}
            name={"sleep_time"}
            variant={"outlined"}
            className={"w-220"}
            value={OBJECT?.sleep_plan_time}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <CustomAdornment name={"BiMoon"} className={"w-18 h-18 dark"} position={"end"}/>
              )
            }}
          />
        </Box>
      </Card>
    );
    // 7-7. table
    const tableSection = () => (
      <Box className={"block-wrapper h-min75vh"}>
        <Box className={"d-center p-10"}>
          {titleSection()}
        </Box>
        <Divider variant={"middle"} className={"mb-20"} />
        <Box className={"d-center mb-20"}>
          {dateSection()}
        </Box>
        <Box className={"d-column"}>
          {tableFragment(0)}
        </Box>
      </Box>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={""} navParam={navParam}
      part={"sleep"} plan={"plan"} type={"detail"}
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
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};