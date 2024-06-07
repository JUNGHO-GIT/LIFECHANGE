// SleepPlanSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, axios} from "../../../import/ImportLibs.jsx";
import {useTime} from "../../../import/ImportHooks.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Img, Br20, Br40} from "../../../import/ImportComponents.jsx";
import {Picker, Time, Count, DropDown} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Badge} from "../../../import/ImportMuis.jsx";

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
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(false);
  const [EXIST, setEXIST] = useState([""]);
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
  const OBJECT_DEF = {
    _id: "",
    sleep_plan_number: 0,
    sleep_plan_demo: false,
    sleep_plan_dateStart: "0000-00-00",
    sleep_plan_dateEnd: "0000-00-00",
    sleep_plan_night: "00:00",
    sleep_plan_morning: "00:00",
    sleep_plan_time: "00:00",
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useTime(OBJECT, setOBJECT, PATH, "plan");

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: "",
          dateStart: moment(DATE.dateStart).startOf("month").format("YYYY-MM-DD"),
          dateEnd: moment(DATE.dateEnd).endOf("month").format("YYYY-MM-DD")
        },
      },
    });
    setEXIST(res.data.result || []);
    setLOADING(false);
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    });
    // 첫번째 객체를 제외하고 데이터 추가
    setOBJECT((prev) => {
      if (prev.length === 1 && prev[0]._id === "") {
        return res.data.result;
      }
      else {
        return {...prev, ...res.data.result};
      }
    });
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
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Picker
        DATE={DATE}
        setDATE={setDATE}
        EXIST={EXIST}
        setEXIST={setEXIST}
      />
    );
    // 7-2. count
    const countSection = () => (
      <Count
        COUNT={COUNT}
        setCOUNT={setCOUNT}
        limit={1}
      />
    );
    // 7-3. badge
    const badgeSection = (index) => (
      <Badge
        badgeContent={index + 1}
        color={"primary"}
        showZero={true}
      />
    );
    // 7-4. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <DropDown
        id={id}
        sectionId={sectionId}
        index={index}
        handlerDelete={handlerDelete}
      />
    );
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Card className={"border p-20"} key={i}>
        <Div className={"d-between"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, "", i)}
        </Div>
        <Br40/>
        <Div className={"d-center"}>
          <Time
            OBJECT={OBJECT}
            setOBJECT={setOBJECT}
            extra={"sleep_plan_night"}
            i={i}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <Time
            OBJECT={OBJECT}
            setOBJECT={setOBJECT}
            extra={"sleep_plan_morning"}
            i={i}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <Time
            OBJECT={OBJECT}
            setOBJECT={setOBJECT}
            extra={"sleep_plan_time"}
            i={i}
          />
        </Div>
        <Br20/>
      </Card>
    );
    // 7-8. loading
    const loadingNode = () => (
      <Loading
        LOADING={LOADING}
        setLOADING={setLOADING}
      />
    );
    // 7-8. table
    const tableSection = () => (
      COUNT?.newSectionCnt > 0 && (
        LOADING ? loadingNode() : tableFragment(0)
      )
    );
    // 7-9. first
    const firstSection = () => (
      <Card className={"p-20"}>
        {dateSection()}
        <Br20/>
        {countSection()}
      </Card>
    );
    // 7-9. second
    const secondSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min67vh"}>
          {firstSection()}
          {secondSection()}
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
        DATE, SEND, COUNT, EXIST
      }}
      functions={{
        setDATE, setSEND, setCOUNT, setEXIST
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
