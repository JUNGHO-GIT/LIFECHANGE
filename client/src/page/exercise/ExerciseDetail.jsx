// ExerciseDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Adorn, Icons, PopUp} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider, MenuItem} from "../../import/ImportMuis.jsx";
import {
  calendar1, calendar2, calendar3,
  exercise1, exercise2, exercise3, exercise4, exercise5, exercise6, exercise9, exercise10, exercise11, exercise12,
  food1, food2, food3, food4, food5, food6, food7, food8,
  money1, money2, money3, money4,
  sleep1, sleep2, sleep3, sleep5, sleep6, sleep7, sleep8, sleep9, sleep10,
  user1, user2, user3, user4, user5, user6, user7, user8, user9, user10, user11, user12,
  setting1, setting2, setting3, setting4, setting5, setting6, setting7, setting8
} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const session = sessionStorage.getItem("dataset") || "{}";
  const exerciseArray = JSON.parse(session)?.exercise || [];
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
    toList:"/exercise/list",
    toDetail:"/exercise/detail",
    toUpdate:"/exercise/save",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
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
    const res = await axios.delete(`${URL_OBJECT}/deletes`, {
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
              value={moment(DATE.startDt)}
              sx={{
                width: "80vw",
                height: "60vh"
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).format("YYYY-MM-DD"),
                  endDt: moment(date).format("YYYY-MM-DD"),
                }));
                closePopup();
              }}
            />
          </LocalizationProvider>
        )}>
        {(popTrigger={}) => (
          <TextField
            select={false}
            label={"날짜"}
            size={"small"}
            value={DATE.startDt}
            variant={"outlined"}
            className={"w-60vw"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget);
            }}
            InputProps={{
              readOnly: true,
              startAdornment: (
              <img src={calendar3} className={"w-16 h-16 me-10"} alt={"calendar3"} />
              ),
              endAdornment: (
                null
              )
            }}
          />
        )}
      </PopUp>
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
                <img src={setting5} className={"w-16 h-16 me-10"} alt={"setting5"}/>
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
    // 7-3. total
    const totalSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 볼륨"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_total_volume).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={exercise2} className={"w-16 h-16 me-10"} alt={"exercise2"}/>
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
            label={"총 유산소 시간"}
            size={"small"}
            value={`${OBJECT?.exercise_total_cardio}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={exercise4} className={"w-16 h-16 me-10"} alt={"exercise4"}/>
              ),
              endAdornment: (
                "h:m"
              )
            }}
          />
        </Div>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={"체중"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_body_weight).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={exercise5} className={"w-16 h-16 me-10"} alt={"exercise5"}/>
              ),
              endAdornment: (
                "kg"
              )
            }}
          />
        </Div>
      </Card>
    );
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
        direction={"left"}
        contents={({closePopup}) => (
          <>
            <Div className={"d-row mb-10"}>
              <img src={setting2} className={"w-16 h-16 icon pointer"} alt={"setting2"}
                onClick={() => {
                  flowDelete(id, sectionId);
                  setTimeout(() => {
                    closePopup();
                  }, 1000);
                }}
              />
              <Div className={"fs-0-8rem"}>삭제</Div>
            </Div>
            <Div className={"d-row"}>
              <img src={setting1} className={"w-16 h-16 icon pointer"} alt={"setting1"}
                onClick={() => {
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
                }}
              />
              <Div className={"fs-0-8rem"}>수정</Div>
            </Div>
          </>
        )}>
        {(popTrigger={}) => (
          <img src={setting4} className={"w-24 h-24 mt-n10 me-n10 pointer"} alt={"setting4"}
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
          {dropdownSection(OBJECT?._id, OBJECT?.exercise_section[i]?._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"파트"}
            variant={"outlined"}
            className={"w-25vw me-10"}
            value={OBJECT?.exercise_section[i]?.exercise_part_idx}
            InputProps={{
              readOnly: false,
              startAdornment: (
                null
              ),
              endAdornment: (
                null
              )
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
            label={"종목"}
            value={OBJECT?.exercise_section[i]?.exercise_title_idx}
            variant={"outlined"}
            className={"w-25vw ms-10"}
            InputProps={{
              readOnly: false,
              startAdornment: (
                null
              ),
              endAdornment: (
                null
              )
            }}
          >
            {exerciseArray[OBJECT?.exercise_section[i]?.exercise_part_idx]?.exercise_title?.map((title, idx) => (
              <MenuItem key={idx} value={idx}>
                {title}
              </MenuItem>
            ))}
          </TextField>
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"세트"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_section[i]?.exercise_set).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={exercise2} className={"w-16 h-16 me-10"} alt={"exercise2"}/>
              ),
              endAdornment: (
                "set"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"횟수"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_section[i]?.exercise_rep).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={exercise2} className={"w-16 h-16 me-10"} alt={"exercise2"}/>
              ),
              endAdornment: (
                "rep"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"무게"}
            size={"small"}
            value={`${numeral(OBJECT?.exercise_section[i]?.exercise_kg).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={exercise2} className={"w-16 h-16 me-10"} alt={"exercise2"}/>
              ),
              endAdornment: (
                "kg"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"유산소"}
            size={"small"}
            value={OBJECT?.exercise_section[i]?.exercise_cardio}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={exercise4} className={"w-16 h-16 me-10"} alt={"exercise4"}/>
              ),
              endAdornment: (
                "h:m"
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min68vh"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-center mb-20"}>
          {countSection()}
        </Div>
        <Div className={"d-column mb-20"}>
          {totalSection()}
        </Div>
        <Div className={"d-column"}>
          {OBJECT?.exercise_section.map((_, i) => (tableFragment(i)))}
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
        navigate, flowDelete
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