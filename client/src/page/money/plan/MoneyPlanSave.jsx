// MoneyPlanSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../../import/ImportHooks.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Card, Paper} from "../../../import/ImportMuis.jsx";
import {Badge} from "../../../import/ImportMuis.jsx";
import {TextField, Button, DateCalendar} from "../../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../../import/ImportMuis.jsx";
import {common1, common2, common3, money2, setting2} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navigate = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
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
    toList:"/money/plan/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    money_plan_number: 0,
    money_plan_demo: false,
    money_plan_startDt: "0000-00-00",
    money_plan_endDt: "0000-00-00",
    money_plan_in: 0,
    money_plan_out: 0
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
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
    const res = await axios.post(`${URL_OBJECT}/plan/save`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      Object.assign(SEND, {
        startDt: DATE.startDt,
        endDt: DATE.endDt
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
      money_plan_in: 0,
      money_plan_out: 0
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
              className={"w-40vw me-3vw"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
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
              className={"w-40vw ms-3vw"}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
                ),
                endAdornment: null
              }}
            />
          )}
        </PopUp>
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
        direction={"left"}
        contents={({closePopup}) => (
          <>
            <Div className={"d-row"}>
              <img src={setting2} className={"w-16 h-16 icon pointer"} alt={"setting2"}
                onClick={() => {
                  handlerDelete(index);
                  closePopup();
                }}
              />
              <Div className={"fs-0-8rem"}>삭제</Div>
            </Div>
          </>
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
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 수입"}
            variant={"outlined"}
            className={"w-86vw"}
            value={`${numeral(OBJECT?.money_plan_in).format("0,0")}`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
              ),
              endAdornment: "원"
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(Number(rawValue), 9999999999);
              setOBJECT((prev) => ({
                ...prev,
                money_plan_in: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={"목표 지출"}
            variant={"outlined"}
            className={"w-86vw"}
            value={`${numeral(OBJECT?.money_plan_out).format("0,0")}`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
              ),
              endAdornment: "원"
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(Number(rawValue), 9999999999);
              setOBJECT((prev) => ({
                ...prev,
                money_plan_out: limitedValue
              }));
            }}
          />
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
