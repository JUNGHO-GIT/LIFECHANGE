// ExerciseSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTime} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts.jsx";
import {Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents.jsx";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons.jsx";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis.jsx";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis.jsx";
import {Popover, bindPopover} from "../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "";
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();

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
    toList:"/exercise/list"
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
    exercise_number: 0,
    exercise_demo: false,
    exercise_startDt: "0000-00-00",
    exercise_endDt: "0000-00-00",
    exercise_total_volume: 0,
    exercise_total_cardio: "00:00",
    exercise_body_weight: 0,
    exercise_section: [{
      exercise_part_idx: 0,
      exercise_part_val: "전체",
      exercise_title_idx: 0,
      exercise_title_val: "전체",
      exercise_set: 1,
      exercise_rep: 1,
      exercise_kg: 1,
      exercise_rest: 1,
      exercise_volume: 0,
      exercise_cardio: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect ------------------------------------------------------------------------------->
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {

    if (!OBJECT?.exercise_section) {
      return;
    }

    let totalVolume = 0;
    let totalTime = 0;

    const updatedSections = OBJECT?.exercise_section.map((section) => {
      const {exercise_set, exercise_rep, exercise_kg} = section;
      const sectionVolume = exercise_set * exercise_rep * exercise_kg;

      totalVolume += sectionVolume;

      const {exercise_cardio} = section;
      if (exercise_cardio) {
        const [hours, minutes] = exercise_cardio.split(':').map(Number);
        totalTime += hours * 60 + minutes;
      }

      return {
        ...section,
        exercise_volume: sectionVolume
      };
    });

    setOBJECT((prev) => ({
      ...prev,
      exercise_section: updatedSections,
      exercise_total_volume: totalVolume,
      exercise_total_cardio: `${Math.floor(totalTime / 60).toString().padStart(2, '0')}:${(totalTime % 60).toString().padStart(2, '0')}`
    }));

  }, [JSON.stringify(OBJECT?.exercise_section)]);

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
    // 7-1. title
    const titleSection = () => (
      <Typography variant={"h5"} fontWeight={500}>
        운동 Save
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
    // 7-3. count
    const countSection = () => {
      const handlerCount = (e) => {
        const newCount = Number(e);
        const defaultSection = {
          exercise_part_idx: 0,
          exercise_part_val: "전체",
          exercise_title_idx: 0,
          exercise_title_val: "전체",
          exercise_set: 0,
          exercise_rep: 0,
          exercise_kg: 0,
          exercise_rest: 0,
          exercise_volume: 0,
          exercise_cardio: "00:00",
        };
        setCOUNT((prev) => ({
          ...prev,
          sectionCnt: newCount
        }));
        if (newCount > 0) {
          let updatedSection = Array(newCount).fill(null).map((_, idx) =>
            idx < OBJECT?.exercise_section.length ? OBJECT?.exercise_section[idx] : defaultSection
          );
          setOBJECT((prev) => ({
            ...prev,
            exercise_section: updatedSection
          }));
        }
        else {
          setOBJECT((prev) => ({
            ...prev,
            exercise_section: []
          }));
        }
      };
      return (
        <PopUp elementId={"sectionCnt"} contents={
          <Typography variant={"body2"} className={"p-10"}>
            0이상 10이하의 숫자만 입력하세요.
          </Typography>
        }>
          {popProps => (
            <TextField
              type={"text"}
              id={"sectionCnt"}
              label={"항목수"}
              variant={"outlined"}
              size={"small"}
              className={"w-220"}
              value={COUNT?.sectionCnt}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <CustomIcons name={"BiListPlus"} className={"w-18 h-18 dark"} position={"start"} />
                )
              }}
              onChange={(e) => {
                const newValInt = Number(e.target.value);
                const newValStr = String(e.target.value);
                if (newValInt < 0) {
                  popProps.openPopup(e.currentTarget);
                }
                else if (newValInt > 10) {
                  popProps.openPopup(e.currentTarget);
                }
                else if (newValStr === "") {
                  handlerCount("");
                }
                else if (isNaN(newValInt) || newValStr === "NaN") {
                  handlerCount("0");
                }
                else if (newValStr.startsWith("0")) {
                  handlerCount(newValStr.replace(/^0+/, ""));
                }
                else {
                  handlerCount(newValStr);
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          )}
        </PopUp>
      );
    };
    // 7-4. total
    const totalSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 볼륨"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_total_volume).format('0,0')}`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiDumbbell"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 유산소 시간"}
            size={"small"}
            value={OBJECT?.exercise_total_cardio}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiTime"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"체중"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_body_weight).format('0,0')}`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiWeight"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Box>
      </Card>
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
          <Box className={"d-center p-10"}>
            <CustomIcons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"} />
            <Typography variant={"inherit"}>기타</Typography>
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
          {dropdownSection(OBJECT?._id, OBJECT?.exercise_section[i]._id, i)}
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"파트"}
            id={`exercise_part_val-${i}`}
            name={`exercise_part_val-${i}`}
            variant={"outlined"}
            className={"w-100 me-10"}
            value={OBJECT?.exercise_section[i]?.exercise_part_idx}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              const newIndex = Number(e.target.value);
              setOBJECT((prev) => ({
                ...prev,
                exercise_section: prev.exercise_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    exercise_part_idx: newIndex,
                    exercise_part_val: exerciseArray[newIndex]?.exercise_part,
                    exercise_title_idx: 0,
                    exercise_title_val: exerciseArray[newIndex]?.exercise_title[0],
                  } : item
                ))
              }));
            }}
          >
            {exerciseArray.map((item, idx) => (
              <MenuItem key={idx} value={idx}>
                {item.exercise_part}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"타이틀"}
            id={`exercise_title_val-${i}`}
            name={`exercise_title_val-${i}`}
            variant={"outlined"}
            className={"w-100 ms-10"}
            value={OBJECT?.exercise_section[i]?.exercise_title_idx}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              const newTitleIdx = Number(e.target.value);
              const newTitleVal = exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title[newTitleIdx];
              if (newTitleIdx >= 0 && newTitleVal) {
                setOBJECT((prev) => ({
                  ...prev,
                  exercise_section: prev.exercise_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      exercise_title_idx: newTitleIdx,
                      exercise_title_val: newTitleVal,
                    } : item
                  ))
                }));
              }
            }}
          >
            {exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title?.map((title, idx) => (
              <MenuItem key={idx} value={idx}>
                {title}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"세트"}
            size={"small"}
            variant={"outlined"}
            className={"w-220"}
            value={OBJECT?.exercise_section[i]?.exercise_set}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              const newSet = Number(e.target.value);
              setOBJECT((prev) => ({
                ...prev,
                exercise_section: prev.exercise_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    exercise_set: newSet
                  } : item
                ))
              }));
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"횟수"}
            size={"small"}
            variant={"outlined"}
            className={"w-220"}
            value={OBJECT?.exercise_section[i]?.exercise_rep}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              const newRep = Number(e.target.value);
              setOBJECT((prev) => ({
                ...prev,
                exercise_section: prev.exercise_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    exercise_rep: newRep
                  } : item
                ))
              }));
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"무게"}
            size={"small"}
            variant={"outlined"}
            className={"w-220"}
            value={OBJECT?.exercise_section[i]?.exercise_kg}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              const newKg = Number(e.target.value);
              setOBJECT((prev) => ({
                ...prev,
                exercise_section: prev.exercise_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    exercise_kg: newKg
                  } : item
                ))
              }));
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"휴식"}
            size={"small"}
            variant={"outlined"}
            className={"w-220"}
            value={OBJECT?.exercise_section[i]?.exercise_rest}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              const newRest = Number(e.target.value);
              setOBJECT((prev) => ({
                ...prev,
                exercise_section: prev.exercise_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    exercise_rest: newRest
                  } : item
                ))
              }));
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DesktopTimePicker
              label={"유산소 시간"}
              minutesStep={1}
              value={moment(OBJECT?.exercise_section[i]?.exercise_cardio, "HH:mm")}
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
        <Box className={"d-center mb-20"}>
          {countSection()}
        </Box>
        <Box className={"d-column mb-20"}>
          {totalSection()}
        </Box>
        <Box className={"d-column"}>
          {OBJECT?.exercise_section.map((item, i) => tableFragment(i))}
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
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"exercise"} plan={""} type={"save"}
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
