// SleepDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {axios, moment} from "../../import/ImportLibs";
import {useDate, useStorage} from "../../import/ImportHooks";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Btn, Loading} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, InputAdornment} from "../../import/ImportMuis";
import {IconButton, Button, Divider} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

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

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail:"/sleep/detail",
    toList:"/sleep/list",
    toUpdate:"/sleep/save",
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
    // 7-1. title
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          수면 Save
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
            readOnly={true}
          />
        </LocalizationProvider>
      </React.Fragment>
    );
    const badgeSection = (i) => (
      <React.Fragment>
        <Badge
          badgeContent={i + 1}
          color={"primary"}
          showZero={true}
        />
      </React.Fragment>
    );
    const dropdownSection = (id, sectionId, index) => (
      <React.Fragment>
        <PopupState variant={"popover"} popupId={"popup"}>
          {(popupState) => (
            <Box className={"mt-n10 me-n10"}>
              <CustomIcons name={"MdOutlineMoreVert"} className={"w-24 h-24 dark"} {...bindTrigger(popupState)} />
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={() => {
                  flowDelete(id, sectionId)
                }}>
                  <CustomIcons name={"MdOutlineDelete"} className={"w-24 h-24 dark"} />
                  삭제
                </MenuItem>
                <MenuItem onClick={() => {
                  SEND.startDt = DATE.startDt;
                  SEND.endDt = DATE.endDt;
                  navParam(SEND.toUpdate, {
                    state: SEND,
                  });
                }}>
                  <CustomIcons name={"MdOutlineEdit"} className={"w-24 h-24 dark"} />
                  수정
                </MenuItem>
                <MenuItem>
                  <CustomIcons name={"MdOutlineMoreHoriz"} className={"w-24 h-24 dark"} />
                  기타
                </MenuItem>
              </Menu>
            </Box>
          )}
        </PopupState>
      </React.Fragment>
    );
    const tableFragment = (i) => (
      <React.Fragment key={i}>
        <Card variant={"outlined"} className={"p-20"}>
          <Box className={"d-between mb-20"}>
            {badgeSection(i)}
            {dropdownSection(OBJECT?._id, OBJECT?.sleep_section[i]._id, i)}
          </Box>
          <Box className={"d-center mb-20"}>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DesktopTimePicker
                label={"취침"}
                minutesStep={1}
                value={moment(OBJECT?.sleep_section[0].sleep_night, "HH:mm")}
                format={"HH:mm"}
                timezone={"Asia/Seoul"}
                views={['hours', 'minutes']}
                readOnly={true}
              />
            </LocalizationProvider>
          </Box>
          <Box className={"d-center mb-20"}>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DesktopTimePicker
                label={"기상"}
                minutesStep={1}
                value={moment(OBJECT?.sleep_section[0].sleep_morning, "HH:mm")}
                format={"HH:mm"}
                timezone={"Asia/Seoul"}
                views={['hours', 'minutes']}
                readOnly={true}
              />
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
                value={OBJECT?.sleep_section[0].sleep_time}
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
      </React.Fragment>
    );
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <Box className={"d-center p-10"}>
            {titleSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"} />
          <Box className={"d-center mb-20"}>
            {dateSection()}
          </Box>
          <Box className={"d-column"}>
            {OBJECT?.sleep_section.map((item, i) => tableFragment(i))}
          </Box>
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
      part={"sleep"} plan={""} type={"detail"}
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