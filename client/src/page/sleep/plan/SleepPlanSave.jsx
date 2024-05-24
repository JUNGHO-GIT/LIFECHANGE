// SleepPlanSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, axios} from "../../../import/ImportLibs.jsx";
import {useTime, useDate} from "../../../import/ImportHooks.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Icons, Calendar, Br20} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField, MenuItem} from "../../../import/ImportMuis.jsx";
import {DateCalendar, DigitalClock} from "../../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../../import/ImportMuis.jsx";
import {common1, common2, common3_1} from "../../../import/ImportImages.jsx";
import {common5, sleep2, sleep3, sleep4} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateType = location?.state?.dateType;
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/sleep/plan/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: location_dateType,
    dateStart: location_dateStart,
    dateEnd: location_dateEnd
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

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
  useDate(DATE, setDATE);
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
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date (plan = 유형 o)
    const dateSection = () => (
      <Div className={"d-center"}>
        <TextField
          select={true}
          label={translate("common-dateType")}
          size={"small"}
          value={DATE.dateType || "day"}
          variant={"outlined"}
          className={"w-20vw me-3vw"}
          InputProps={{
            readOnly: false,
            startAdornment: null,
            endAdornment: null
          }}
          onChange={(e) => {
            setDATE((prev) => ({
              ...prev,
              dateType: e.target.value
            }));
          }}>
          {["전체", "day", "week", "month", "year"].map((item) => (
            <MenuItem key={item} value={item} selected={item === DATE.dateType}>
              {item}
            </MenuItem>
          ))}
        </TextField>
        <PopUp
          type={"innerCenter"}
          position={"center"}
          direction={"center"}
          contents={({closePopup}) => (
          <Div className={"d-center w-80vw"}>
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["year", "day"]}
                readOnly={false}
                defaultValue={moment(DATE.dateStart)}
                className={"radius border h-60vh"}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    dateStart: moment(date).format("YYYY-MM-DD"),
                    dateEnd: moment(date).format("YYYY-MM-DD")
                  }));
                }}
              />
            </LocalizationProvider>
          </Div>
        )}>
          {(popTrigger={}) => (
            <TextField
              type={"text"}
              size={"small"}
              label={"기간"}
              variant={"outlined"}
              value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
              className={"w-60vw"}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Img src={common1} className={"w-16 h-16"} />
                ),
                endAdornment: null
              }}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
            />
          )}
        </PopUp>
      </Div>
    );
    // 7-2. count
    const countSection = () => (
      <Div className={"d-center"}>
        <PopUp
          type={"alert"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <Div className={"d-center"}>
              {`${COUNT.sectionCnt}개 이상 1개 이하로 입력해주세요.`}
            </Div>
          )}>
          {(popTrigger={}) => (
            <TextField
              type={"text"}
              label={translate("common-count")}
              variant={"outlined"}
              size={"small"}
              className={"w-86vw"}
              value={COUNT.newSectionCnt}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Img src={common2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"d-center me-n10"}>
                    <Icons
                      name={"TbMinus"}
                      className={"w-20 h-20 black"}
                      onClick={(e) => {
                        COUNT.newSectionCnt > COUNT.sectionCnt ? (
                          setCOUNT((prev) => ({
                            ...prev,
                            newSectionCnt: prev.newSectionCnt - 1
                          }))
                        ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                      }}
                    />
                    <Icons
                      name={"TbPlus"}
                      className={"w-20 h-20 black"}
                      onClick={(e) => {
                        COUNT.newSectionCnt < 1 ? (
                          setCOUNT((prev) => ({
                            ...prev,
                            newSectionCnt: prev.newSectionCnt + 1
                          }))
                        ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                      }}
                    />
                  </Div>
                )
              }}
            />
          )}
        </PopUp>
      </Div>
    );
    // 7-3. total (plan = total x)
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
          <Img src={common5} className={"w-16 h-16 pointer"} onClick={() => {
            handlerDelete(index);
            closePopup();
          }}/>
          {translate("common-delete")}
        </Div>
        )}>
        {(popTrigger={}) => (
          <Img src={common3_1} className={"w-24 h-24 mt-n10 me-n10 pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}/>
        )}
      </PopUp>
    );
    // 7-6. empty (detail, save = empty x)
    // 7-7. fragment
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
                  startAdornment: (
                    <Img src={sleep2} className={"w-16 h-16"} />
                  ),
                  endAdornment: (
                    translate("common-endHour")
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
                  startAdornment: (
                    <Img src={sleep3} className={"w-16 h-16"} />
                  ),
                  endAdornment: (
                    translate("common-endHour")
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
                  startAdornment: (
                    <Img src={sleep4} className={"w-16 h-16"} />
                  ),
                  endAdornment: (
                    translate("common-endHour")
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
    // 7-8. table
    const tableSection = () => (
      COUNT?.newSectionCnt > 0 && tableFragment(0)
    );
    // 7-9. first
    const firstSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        {dateSection()}
        <Br20/>
        {countSection()}
      </Card>
    );
    // 7-10. second (x)
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius shadow"}>
        <Div className={"block-wrapper h-min65vh"}>
          {firstSection()}
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

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
      {tableNode()}
      {footerNode()}
    </>
  );
};
