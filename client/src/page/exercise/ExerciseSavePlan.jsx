// ExerciseSavePlan.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTime} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics.jsx";
import {Header, NavBar} from "../../import/ImportLayouts.jsx";
import {Div, Hr, Br, Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents.jsx";
import {Icons, Adornment} from "../../import/ImportIcons.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {Badge, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, Button} from "../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseSavePlan = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
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
    toList:"/exercise/list/plan"
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
    exercise_plan_cardio: "00:00",
    exercise_plan_volume: 0,
    exercise_plan_weight: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail/plan`, {
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
    const res = await axios.post(`${URL_OBJECT}/save/plan`, {
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
      <p className={"fs-15"}>
        운동 계획 Save
      </p>
    );
    // 7-2. date
    const dateSection = () => (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DesktopDatePicker
          label={"시작일"}
          value={moment(DATE.startDt, "YYYY-MM-DD")}
          format={"YYYY-MM-DD"}
          timezone={"Asia/Seoul"}
          views={["day"]}
          className={"m-auto"}
          readOnly={false}
          slotProps={{
            textField: {sx: {
              width: "220px",
            }},
            layout: {sx: {
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
            }},
          }}
          onChange={(day) => {
            setDATE((prev) => ({
              ...prev,
              startDt: moment(day).format("YYYY-MM-DD")
            }));
          }}
        />
        <DesktopDatePicker
          label={"종료일"}
          value={moment(DATE.endDt, "YYYY-MM-DD")}
          format={"YYYY-MM-DD"}
          timezone={"Asia/Seoul"}
          views={["day"]}
          className={"m-auto mt-20"}
          readOnly={false}
          slotProps={{
            textField: {sx: {
              width: "220px",
            }},
            layout: {sx: {
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
            }},
          }}
          onChange={(day) => {
            setDATE((prev) => ({
              ...prev,
              endDt: moment(day).format("YYYY-MM-DD")
            }));
          }}
        />
      </LocalizationProvider>
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <>
      <Div className={"d-center"}>
        <Badge
          badgeContent={index + 1}
          color={"primary"}
          showZero={true}
        />
      </Div>
      <PopDown elementId={`pop-${index}`} contents={
        <>
          <Div className={"d-row align-center"}>
            <Icons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"} />
            <p className={"fs-14"}>복사</p>
          </Div>
          <Div className={"d-row align-center"}>
            <Icons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"} />
            <p className={"fs-14"}>복사</p>
          </Div>
        </>
      }>
        {popProps => (
          <Icons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark me-n10"}
            onClick={(e) => {
              popProps.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopDown>
      </>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mt-n15 mb-20"}>
          {dropdownSection(OBJECT?._id, "", 0)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 볼륨"}
            id={"exercise_plan_volume"}
            name={"exercise_plan_volume"}
            className={"w-220"}
            value={`${numeral(OBJECT?.exercise_plan_volume).format("0,0")}`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"LiaDumbbellSolid"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const limitedValue = Math.min(Number(rawValue), 999);
              setOBJECT((prev) => ({
                ...prev,
                exercise_plan_volume: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DesktopTimePicker
              label={"목표 유산소 시간"}
              minutesStep={1}
              value={moment(OBJECT?.exercise_plan_cardio, "HH:mm")}
              format={"HH:mm"}
              timezone={"Asia/Seoul"}
              views={['hours', 'minutes']}
              slotProps={{
                textField: {sx: {
                  width: "220px",
                }},
                layout: {sx: {
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
                }},
              }}
              onChange={(time) => {
                setOBJECT((prev) => ({
                  ...prev,
                  sleep_plan_morning: moment(time).format("HH:mm")
                }));
              }}
            />
          </LocalizationProvider>
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 횟수"}
            id={"exercise_plan_count"}
            name={"exercise_plan_count"}
            className={"w-220"}
            value={`${numeral(OBJECT?.exercise_plan_count).format("0,0")}`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"TbCalculator"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const limitedValue = Math.min(Number(rawValue), 999);
              setOBJECT((prev) => ({
                ...prev,
                exercise_plan_count: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 체중"}
            id={"exercise_plan_weight"}
            name={"exercise_plan_weight"}
            className={"w-220"}
            value={`${numeral(OBJECT?.exercise_plan_weight).format("0,0")}`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"TbScaleOutline"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const limitedValue = Math.min(Number(rawValue), 999);
              setOBJECT((prev) => ({
                ...prev,
                exercise_plan_weight: limitedValue
              }));
            }}
          />
        </Div>
      </Card>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min75vh"}>
        <Div className={"d-center p-10"}>
          {titleSection()}
        </Div>
        <Hr className={"mb-20"} />
        <Div className={"d-column mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-column"}>
          {tableFragment(0)}
        </Div>
      </Div>
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
      part={"exercise"} plan={"plan"} type={"save"}
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
