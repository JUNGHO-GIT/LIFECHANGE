// ExerciseDetail.jsx

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
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDetail = () => {

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
    toList:"/exercise/list",
    toDetail:"/exercise/detail",
    toUpdate:"/exercise/save",
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
      exercise_set: 0,
      exercise_rep: 0,
      exercise_kg: 0,
      exercise_rest: 0,
      exercise_cardio: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
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
      sectionCnt: res.data.sectionCnt || 0
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
    // 7-1. title
    const titleSection = () => (
      <Typography variant={"h5"} fontWeight={500}>
        운동 Detail
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
    const countSection = () => (
      <TextField
        type={"text"}
        id={"sectionCnt"}
        label={"항목수"}
        variant={"outlined"}
        size={"small"}
        className={"w-220"}
        value={COUNT?.sectionCnt}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <CustomIcons name={"BiListPlus"} className={"w-18 h-18 dark"} position={"start"} />
          )
        }}
      />
    );
    // 7-4. total
    const totalSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 볼륨"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_total_volume).format('0,0')} vol`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiDumbbell"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 유산소 시간"}
            size={"small"}
            value={`${OBJECT?.exercise_total_cardio}`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiRun"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"체중"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_body_weight).format('0,0')} kg`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiWeight"} className={"w-16 h-16 dark"} position={"start"}/>
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
          <Box className={"d-block p-10"}>
            <Box className={"d-left mt-10 mb-10"} onClick={() => {
              flowDelete(id, sectionId);
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
          {dropdownSection(OBJECT?._id, OBJECT?.exercise_section[i]._id, i)}
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"부위"}
            size={"small"}
            value={OBJECT?.exercise_section[i]?.exercise_part_val}
            variant={"outlined"}
            className={"w-100 me-10"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiBody"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
          />
          <TextField
            select={false}
            label={"종목"}
            size={"small"}
            value={OBJECT?.exercise_section[i]?.exercise_title_val}
            variant={"outlined"}
            className={"w-100 ms-10"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiDumbbell"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"세트"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_section[i]?.exercise_set).format('0,0')} set`}
            variant={"outlined"}
            className={""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiDumbbell"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
          />
          <TextField
            select={false}
            label={"횟수"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_section[i]?.exercise_rep).format('0,0')} rep`}
            variant={"outlined"}
            className={""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiDumbbell"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
          />
          <TextField
            select={false}
            label={"무게"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_section[i]?.exercise_kg).format('0,0')} kg`}
            variant={"outlined"}
            className={""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiDumbbell"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
          />
          <TextField
            select={false}
            label={"휴식"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_section[i]?.exercise_rest).format('0,0')} sec`}
            variant={"outlined"}
            className={""}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiDumbbell"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"유산소"}
            size={"small"}
            value={OBJECT?.exercise_section[i]?.exercise_cardio}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiDumbbell"} className={"w-16 h-16 dark"} position={"start"}/>
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
      SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={""} navParam={navParam}
      part={"exercise"} plan={""} type={"detail"}
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