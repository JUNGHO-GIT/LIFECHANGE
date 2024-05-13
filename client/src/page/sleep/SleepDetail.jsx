// SleepDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, moment} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar, Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Adornment, Icons, PopAlert, PopUp, PopDown} from "../../import/ImportComponents.jsx";
import {Div, Hr10, Br10} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {Badge} from "../../import/ImportMuis.jsx";
import {TextField} from "../../import/ImportMuis.jsx";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis.jsx";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";

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
    // 7-1. date
    const dateSection = () => (
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
        <DesktopDatePicker
          label={"날짜"}
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
              "& .MuiPickersDay-root": {
                width: "28px",
                height: "28px",
              },
            }},
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
      <Div className={"d-center"}>
        <Badge
          badgeContent={index + 1}
          color={"primary"}
          showZero={true}
        />
      </Div>
      <PopDown elementId={`pop-${index}`} contents={
        <>
        <Div className={"d-row align-center"} onClick={() => {
          flowDelete(id, sectionId);
        }}>
          <Icons name={"MdOutlineDelete"} className={"w-24 h-24 dark pointer"} />
          <p className={"fs-14"}>삭제</p>
        </Div>
        <Div className={"d-row align-center"} onClick={() => {
          SEND.startDt = DATE.startDt;
          SEND.endDt = DATE.endDt;
          navParam(SEND.toUpdate, {
            state: SEND,
          });
        }}>
          <Icons name={"MdOutlineEdit"} className={"w-24 h-24 dark pointer"} />
          <p className={"fs-14"}>수정</p>
        </Div>
        </>
      }>
        {(popTrigger) => (
          <Icons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark me-n10"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
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
          {dropdownSection(OBJECT?._id, OBJECT?.sleep_section[i]._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DesktopTimePicker
              label={"취침"}
              minutesStep={1}
              value={moment(OBJECT?.sleep_section[0].sleep_night, "HH:mm")}
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
              readOnly={true}
            />
          </LocalizationProvider>
        </Div>
        <Div className={"d-center mb-20"}>
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DesktopTimePicker
              label={"기상"}
              minutesStep={1}
              value={moment(OBJECT?.sleep_section[0].sleep_morning, "HH:mm")}
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
              readOnly={true}
            />
          </LocalizationProvider>
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            type={"text"}
            size={"small"}
            id={"sleep_time"}
            name={"sleep_time"}
            label={"수면"}
            variant={"outlined"}
            className={"w-220"}
            value={OBJECT?.sleep_section[0].sleep_time}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <Adornment name={"TbMoon"} className={"w-24 h-24 dark me-n5"} position={"end"} />
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min500"}>
        <Div className={"d-column mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-column"}>
          {OBJECT?.sleep_section.map((item, i) => tableFragment(i))}
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

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 9. footer ------------------------------------------------------------------------------------>
  const footerNode = () => (
    <Footer
      strings={{
        part: partStr,
        type: typeStr,
        plan: planStr,
      }}
      objects={{
        DATE, SEND, COUNT, DAYPICKER
      }}
      functions={{
        setDATE, setSEND, setCOUNT, setDAYPICKER
      }}
      handlers={{
        navParam
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};