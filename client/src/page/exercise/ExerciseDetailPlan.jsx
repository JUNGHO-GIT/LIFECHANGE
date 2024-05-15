// ExerciseDetailPlan.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTime} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Adorn, Icons, PopUp, Div} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDetailPlan = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const navigate = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt || moment().format("YYYY-MM-DD"),
      endDt: location_endDt || moment().format("YYYY-MM-DD"),
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail: "/exercise/detail/plan",
    toList: "/exercise/list/plan",
    toUpdate: "/exercise/save/plan"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
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
    const res = await axios.get(`${URL_OBJECT}/detail/plan`, {
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
    const res = await axios.delete(`${URL_OBJECT}/plan/deletes`, {
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
        navigate(SEND.toList);
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
      <Div className={"d-column"}>
        <PopUp
          type={"calendar"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
              <DateCalendar
                timezone={"Asia/Seoul"}
                views={["day"]}
                className={""}
                readOnly={false}
                value={moment(DATE.startDt)}
                sx={{
                  width: "80vw",
                  height: "60vh"
                }}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    startDt: moment(date).format("YYYY-MM-DD")
                  }));
                  closePopup();
                }}
              />
            </LocalizationProvider>
          )}>
          {(popTrigger={}) => (
            <TextField
              select={false}
              label={"시작일"}
              size={"small"}
              value={DATE.startDt}
              variant={"outlined"}
              className={"w-60vw mb-20"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Adorn name={"TbCalendarEvent"} className={"w-16 h-16 icon"} position={"start"}/>
                )
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
                className={""}
                readOnly={false}
                value={moment(DATE.endDt)}
                sx={{
                  width: "80vw",
                  height: "60vh"
                }}
                onChange={(date) => {
                  setDATE((prev) => ({
                    ...prev,
                    endDt: moment(date).format("YYYY-MM-DD")
                  }));
                  closePopup();
                }}
              />
            </LocalizationProvider>
          )}>
          {(popTrigger={}) => (
            <TextField
              select={false}
              label={"종료일"}
              size={"small"}
              value={DATE.endDt}
              variant={"outlined"}
              className={"w-60vw"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Adorn name={"TbCalendarEvent"} className={"w-16 h-16 icon"} position={"start"}/>
                )
              }}
            />
          )}
        </PopUp>
      </Div>
    );
    // 7-2. count
    const countSection = () => (
      <PopUp
        type={"alert"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>0이상 10이하의 숫자만 입력하세요</Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            label={"항목수"}
            variant={"outlined"}
            size={"small"}
            className={"w-60vw"}
            value={COUNT?.sectionCnt}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbTextPlus"} className={"w-16 h-16 icon"} position={"start"}/>
              ),
              endAdornment: (
                null
              )
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
      </PopUp>
    );
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
          <>
            <Icons name={"TbTrash"} className={"w-24 h-24 icon"} onClick={() => {
              flowDelete(id);
              setTimeout(() => {
                closePopup();
              }, 1000);
            }}>
              <Div className={"fs-0-8rem"}>삭제</Div>
            </Icons>
            <Div className={"h-10"}/>
            <Icons name={"TbEdit"} className={"w-24 h-24 icon"} onClick={() => {
              Object.assign(SEND, {
                startDt: DATE.startDt,
                endDt: DATE.endDt
              });
              navigate(SEND.toUpdate, {
                state: SEND
              });
              setTimeout(() => {
                closePopup();
              }, 1000);
            }}>
              <Div className={"fs-0-8rem"}>수정</Div>
            </Icons>
          </>
        )}>
        {(popTrigger={}) => (
          <Icons name={"TbDots"} className={"w-24 h-24 icon mt-n10 me-n10"}
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
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 운동 횟수"}
            className={"w-60vw"}
            value={numeral(OBJECT?.exercise_plan_count).format("0,0")}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"MdOutlineFitnessCenter"} className={"w-16 h-16 icon"} position={"start"}/>
              ),
              endAdornment: (
                "회"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 볼륨"}
            className={"w-60vw"}
            value={numeral(OBJECT?.exercise_plan_volume).format("0,0")}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"LiaDumbbellSolid"} className={"w-16 h-16 icon"} position={"start"}/>
              ),
              endAdornment: (
                "vol"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 유산소"}
            className={"w-60vw"}
            value={OBJECT?.exercise_plan_cardio}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbRun"} className={"w-16 h-16 icon"} position={"start"}/>
              ),
              endAdornment: (
                "h:m"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 체중"}
            className={"w-60vw"}
            value={numeral(OBJECT?.exercise_plan_weight).format("0,0")}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbScaleOutline"} className={"w-16 h-16 icon"} position={"start"}/>
              ),
              endAdornment: (
                "kg"
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min70vh"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-center mb-20"}>
          {countSection()}
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
        part: partStr,
        type: typeStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navigate
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
