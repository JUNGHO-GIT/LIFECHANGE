// SleepSave.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios} from "../../import/ImportLibs.jsx";
import {useTime, useTranslate} from "../../import/ImportHooks.jsx";
import {percent, log} from "../../import/ImportLogics";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Br20, Br40} from "../../import/ImportComponents.jsx";
import {Picker, Time, Count, Delete} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepSave = () => {

  // 1. common -------------------------------------------------------------------------------------
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

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [EXIST, setEXIST] = useState([""]);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/sleep/list"
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

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    sleep_number: 0,
    sleep_dummy: false,
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_section: [{
      sleep_bedTime: "00:00",
      sleep_wakeTime: "00:00",
      sleep_sleepTime: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: "",
          dateStart: moment(DATE.dateStart).startOf("month").format("YYYY-MM-DD"),
          dateEnd: moment(DATE.dateEnd).endOf("month").format("YYYY-MM-DD")
        },
      },
    })
    .then((res) => {
      setEXIST(res.data.result || []);
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    })
    .then((res) => {
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
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      sleep_bedTime: "00:00",
      sleep_wakeTime: "00:00",
      sleep_sleepTime: "00:00",
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_, idx) =>
      idx < OBJECT?.sleep_section.length ? OBJECT?.sleep_section[idx] : defaultSection
    );
    setOBJECT((prev) => ({
      ...prev,
      sleep_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(JSON.stringify(res.data.msg).replace(/\"/g, ""));
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
        alert(JSON.stringify(res.data.msg).replace(/\"/g, ""));
      }
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDeletes = async () => {
    if (OBJECT._id === "") {
      alert(JSON.stringify("삭제할 데이터가 없습니다."));
      return;
    }
    await axios.post(`${URL_OBJECT}/deletes`, {
      user_id: sessionId,
      _id: OBJECT._id,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(JSON.stringify(res.data.msg).replace(/\"/g, ""));
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
        alert(JSON.stringify(res.data.msg).replace(/\"/g, ""));
      }
    })
    .catch((err) => {
      console.log(JSON.stringify(err, null, 2));
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      sleep_section: prev.sleep_section.filter((_, idx) => (idx !== index))
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. table --------------------------------------------------------------------------------------
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
    // 7-4. delete
    const deleteSection = (id, sectionId, index) => (
      <Delete
        id={id}
        sectionId={sectionId}
        index={index}
        handlerDelete={handlerDelete}
      />
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      <Card className={"border p-20"} key={i}>
        <Div className={"d-column"}>
          <Div className={"d-between"}>
            {badgeSection(i)}
            {deleteSection(OBJECT?._id, OBJECT?.sleep_section[i]._id, i)}
          </Div>
          <Br40 />
          <Div className={"d-center"}>
            <Time
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              extra={"sleep_bedTime"}
              i={i}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Time
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              extra={"sleep_wakeTime"}
              i={i}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Time
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              extra={"sleep_sleepTime"}
              i={i}
            />
          </Div>
          <Br20 />
        </Div>
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
        LOADING ? loadingNode() : OBJECT?.sleep_section.map((_, i) => tableFragment(i))
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

  // 9. footer -------------------------------------------------------------------------------------
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
        navigate, flowSave, flowDeletes
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};
