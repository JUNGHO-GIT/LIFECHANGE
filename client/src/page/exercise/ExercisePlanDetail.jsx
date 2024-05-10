// ExercisePlanDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {moment, axios, numeral, InputMask, NumericFormat} from "../../import/ImportLibs";
import {useDate, useStorage, useTime} from "../../import/ImportHooks";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis";
import {Popover, bindPopover} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const ExercisePlanDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
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
    toDetail: "/exercise/plan/detail",
    toList: "/exercise/plan/list",
    toUpdate: "/exercise/plan/save"
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
    exercise_plan_number: 0,
    exercise_plan_demo: false,
    exercise_plan_startDt: "0000-00-00",
    exercise_plan_endDt: "0000-00-00",
    exercise_plan_count: 0,
    exercise_plan_volume: 0,
    exercise_plan_cardio: "00:00",
    exercise_plan_weight: 0,
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
      setOBJECT(res.data.result);
      navParam(SEND.toList);
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          운동 계획 Detail
        </Typography>
      </React.Fragment>
    );
    // 7-2. date
    const dateSection = () => (
      <React.Fragment>
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
      </React.Fragment>
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <React.Fragment>
        <IconButton size={"small"} color={"primary"}>
          <Badge
            badgeContent={index + 1}
            color={"primary"}
            showZero={true}
          />
        </IconButton>
        <PopDown
          elementId={`pop-${index}`}
          contents={
            <React.Fragment>
              <Box className={"d-block p-10"}>
                <Box className={"d-left mt-10 mb-10"} onClick={() => {
                  flowDelete(id);
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
            </React.Fragment>
          }
        >
        {popProps => (
          <React.Fragment>
            <IconButton size={"small"} color={"primary"} className={"me-n20"} onClick={(e) => {
              popProps.openPopup(e.currentTarget)
            }}>
              <CustomIcons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark"} />
            </IconButton>
          </React.Fragment>
        )}
        </PopDown>
      </React.Fragment>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <React.Fragment>
        <Card variant={"outlined"} className={"p-20"} key={i}>
          <Box className={"d-between mt-n15 mb-20"}>
            {dropdownSection(OBJECT?._id, "", 0)}
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={"목표 운동 횟수"}
              id={"exercise_plan_count"}
              name={"exercise_plan_count"}
              className={"w-220"}
              value={numeral(OBJECT?.exercise_plan_count).format("0,0")}
              InputProps={{
                readOnly: true
              }}
            />
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={"목표 볼륨"}
              id={"exercise_plan_volume"}
              name={"exercise_plan_volume"}
              className={"w-220"}
              value={numeral(OBJECT?.exercise_plan_volume).format("0,0")}
              InputProps={{
                readOnly: true
              }}
            />
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={"목표 유산소"}
              id={"exercise_plan_cardio"}
              name={"exercise_plan_cardio"}
              className={"w-220"}
              value={OBJECT?.exercise_plan_cardio}
              InputProps={{
                readOnly: true
              }}
            />
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={"목표 체중"}
              id={"exercise_plan_weight"}
              name={"exercise_plan_weight"}
              className={"w-220"}
              value={numeral(OBJECT?.exercise_plan_weight).format("0,0")}
              InputProps={{
                readOnly: true
              }}
            />
          </Box>
        </Card>
      </React.Fragment>
    );
    // 7-7. table
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper"}>
          <Box className={"d-center p-10"}>
            {titleSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"} />
          <Box className={"d-center mb-20"}>
            {dateSection()}
          </Box>
          <Box className={"d-column"}>
            {tableFragment()}
          </Box>
        </Box>
      </React.Fragment>
    );
    // 7-8. return
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

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={""} navParam={navParam}
      part={"exercise"} plan={"plan"} type={"detail"}
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
