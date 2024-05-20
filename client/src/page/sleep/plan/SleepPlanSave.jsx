// SleepPlanSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, axios} from "../../../import/ImportLibs.jsx";
import {useDate, useStorage, useTime} from "../../../import/ImportHooks.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField, MenuItem} from "../../../import/ImportMuis.jsx";
import {DateCalendar, DigitalClock} from "../../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../../import/ImportMuis.jsx";
import {common1, common3} from "../../../import/ImportImages.jsx";
import {common5, sleep2, sleep3, sleep4} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const session = sessionStorage.getItem("dataSet") || "{}";
  const dateType = JSON.parse(session)?.dateType || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart?.trim()?.toString();
  const location_dateEnd = location?.state?.dateEnd?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      dateType: "day",
      dateStart: location_dateStart || moment().format("YYYY-MM-DD"),
      dateEnd: location_dateEnd || moment().format("YYYY-MM-DD"),
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
   dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/sleep/plan/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    sleep_plan_number: 0,
    sleep_plan_demo: false,
    sleep_plan_dateType: "",
    sleep_plan_dateStart: "0000-00-00",
    sleep_plan_dateEnd: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_dateStart, location_dateEnd, DATE, setDATE);
  useTime(OBJECT, setOBJECT, PATH, "plan");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/plan/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      Object.assign(SEND, {
        dateStart: DATE.dateStart,
        dateEnd: DATE.dateEnd
      });
      navigate(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      sleep_plan_night: "00:00",
      sleep_plan_morning: "00:00",
      sleep_plan_time: "00:00",
    }));
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: 1
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Div className={"d-row"}>
        <Div className={"d-center"}>
          <TextField
            select={true}
            label={translate("common-dateType")}
            size={"small"}
            value={DATE.dateType}
            variant={"outlined"}
            className={"w-20vw me-3vw"}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: null,
              endAdornment: null
            }}
            onChange={(e) => {
              setDATE((prev) => ({
                ...prev,
                dateType: e.target.value
              }));
            }}>
            {dateType.map((item, idx) => (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Div>
        <Div className={"d-row"}>
          <PopUp
            type={"calendar"}
            position={"bottom"}
            direction={"center"}
            contents={({closePopup}) => (
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DateCalendar
                  timezone={"Asia/Seoul"}
                  views={["day"]}
                  readOnly={false}
                  value={moment(DATE.dateStart)}
                  sx={{
                    width: "80vw",
                    height: "60vh"
                  }}
                  onChange={(date) => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(date).format("YYYY-MM-DD")
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={translate("common-dateStart")}
                size={"small"}
                value={DATE.dateStart}
                variant={"outlined"}
                className={"w-30vw me-3vw"}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget);
                }}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
                  ),
                  endAdornment: null
                }}
              />
            )}
          </PopUp>
          <PopUp
            type={"calendar"}
            position={"bottom"}
            direction={"center"}
            contents={({closePopup}) => (
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DateCalendar
                  timezone={"Asia/Seoul"}
                  views={["day"]}
                  readOnly={false}
                  value={moment(DATE.dateEnd)}
                  sx={{
                    width: "80vw",
                    height: "60vh"
                  }}
                  onChange={(date) => {
                    setDATE((prev) => ({
                      ...prev,
                      dateEnd: moment(date).format("YYYY-MM-DD")
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={translate("common-dateEnd")}
                size={"small"}
                value={DATE.dateEnd}
                variant={"outlined"}
                className={"w-30vw"}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget);
                }}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
                  ),
                  endAdornment: null
                }}
              />
            )}
          </PopUp>
        </Div>
      </Div>
    );
    // 7-2. count (plan 은 total x)
    // 7-3. total (plan 은 total x)
    // 7-4. badge
    const badgeSection = (index) => (
      <Badge
        badgeContent={index + 1}
        color={"primary"}
        showZero={true}
      />
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <PopUp
        key={index}
        type={"dropdown"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
        <Div className={"d-row"}>
          <img src={common5} className={"w-16 h-16 icon pointer"} alt={"common5"}
            onClick={() => {
              handlerDelete(index);
              closePopup();
            }}
          />
          <Div className={"fs-0-8rem"}>{translate("common-delete")}</Div>
        </Div>
        )}>
        {(popTrigger={}) => (
          <img src={common3} className={"w-24 h-24 mt-n10 me-n10 pointer"} alt={"common3"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6-1. table (detail, save 는 empty x)
    // 7-6-2. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mb-40"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, "", 0)}
        </Div>
        <Div className={"d-center mb-20"}>
          <PopUp
            key={i}
            position={"bottom"}
            direction={"center"}
            contents={({closePopup}) => (
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={"Asia/Seoul"}
                  value={moment(OBJECT?.sleep_plan_night, "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      sleep_plan_night: moment(e).format("HH:mm")
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={translate("sleep-planNight")}
                size={"small"}
                variant={"outlined"}
                className={"w-86vw"}
                value={OBJECT?.sleep_plan_night}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={sleep2} className={"w-16 h-16 me-10"} alt={"sleep2"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>h:m</Div>
                  )
                }}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget)
                }}
              />
            )}
          </PopUp>
        </Div>
        <Div className={"d-center mb-20"}>
          <PopUp
            key={i}
            type={"timePicker"}
            position={"bottom"}
            direction={"center"}
            contents={({closePopup}) => (
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={"Asia/Seoul"}
                  value={moment(OBJECT?.sleep_plan_morning, "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      sleep_plan_morning: moment(e).format("HH:mm")
                    }));
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={translate("sleep-planMorning")}
                size={"small"}
                variant={"outlined"}
                className={"w-86vw"}
                value={OBJECT?.sleep_plan_morning}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={sleep3} className={"w-16 h-16 me-10"} alt={"sleep3"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>h:m</Div>
                  )
                }}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget)
                }}
              />
            )}
          </PopUp>
        </Div>
        <Div className={"d-center mb-20"}>
          <PopUp
            key={i}
            type={"timePicker"}
            position={"bottom"}
            direction={"center"}
            contents={({closePopup}) => (
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DigitalClock
                  timeStep={10}
                  ampm={false}
                  timezone={"Asia/Seoul"}
                  value={moment(OBJECT?.sleep_plan_time, "HH:mm")}
                  sx={{
                    width: "40vw",
                    height: "40vh"
                  }}
                  onChange={(e) => {
                    closePopup();
                  }}
                />
              </LocalizationProvider>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={translate("sleep-planTime")}
                size={"small"}
                variant={"outlined"}
                className={"w-86vw"}
                value={OBJECT?.sleep_plan_time}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={sleep4} className={"w-16 h-16 me-10"} alt={"sleep4"}/>
                  ),
                  endAdornment: (
                    <Div className={"fw-normal"}>h:m</Div>
                  )
                }}
                onClick={(e) => {
                  popTrigger.openPopup(e.currentTarget)
                }}
              />
            )}
          </PopUp>
        </Div>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min90vw h-min67vh"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-column"}>
          {tableFragment(0)}
        </Div>
      </Div>
    );
    // 7-7. return
    return (
      <Paper className={"content-wrapper"}>
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
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navigate, flowSave
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};
