// SleepPlanSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, moment} from "../../import/ImportLibs.jsx";
import {useStorage, useTime, useDate} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts.jsx";
import {Btn, Loading, PopDown} from "../../import/ImportComponents.jsx";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons.jsx";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis.jsx";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis.jsx";

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

  // 2-3. useEffect ------------------------------------------------------------------------------->
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
    // 7-1. title
    const titleSection = () => (
      <Typography variant={"h5"} fontWeight={500}>
        수면 계획 Save
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
          views={["day"]}
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
                  height: "280px",
                },
                "& .MuiDateCalendar-root": {
                  width: "210px",
                  height: "270px",
                },
                "& .MuiDayCalendar-slideTransition": {
                  width: "210px",
                  height: "270px",
                },
                "& .MuiPickersDay-root": {
                  width: "30px",
                  height: "28px",
                },
              },
            },
          }}
          onChange={(day) => {
            setDATE((prev) => ({
              ...prev,
              startDt: moment(day).format("YYYY-MM-DD"),
              endDt: moment(day).format("YYYY-MM-DD")
            }));
          }}
        />
      </LocalizationProvider>
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <>
        <IconButton size={"small"} color={"primary"}>
          <Badge
            badgeContent={index + 1}
            color={"primary"}
            showZero={true}
          />
        </IconButton>
        <PopDown elementId={`pop-${index}`} contents={
          <Box className={"d-block p-10"}>
            <Box className={"d-left mt-10 mb-10"}>
              <CustomIcons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"} />
              <Typography variant={"inherit"}>기타</Typography>
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
      </>
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
              label={"취침 계획"}
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
              onChange={(time) => {
                setOBJECT((prev) => ({
                  ...prev,
                  sleep_plan_night: moment(time).format("HH:mm")
                }));
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box className={"d-center mb-20"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DesktopTimePicker
              label={"기상"}
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
              onChange={(time) => {
                setOBJECT((prev) => ({
                  ...prev,
                  sleep_plan_morning: moment(time).format("HH:mm")
                }));
              }}
            />
          </LocalizationProvider>
        </Box>
        <Box className={"d-center mb-20"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <TextField
              label={"수면"}
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
          </LocalizationProvider>
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
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"sleep"} plan={"plan"} type={"save"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </>
  );
};
