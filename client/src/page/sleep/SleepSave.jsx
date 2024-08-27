// SleepSave.jsx
// Node -> Section -> Fragment

import { React, useState, useEffect, useRef, createRef } from "../../import/ImportReacts.jsx";
import { useCommon, useTime } from "../../import/ImportHooks.jsx";
import { moment, axios } from "../../import/ImportLibs.jsx";
import { sync } from "../../import/ImportUtils.jsx";
import { Loading, Footer } from "../../import/ImportLayouts.jsx";
import { Empty, Div, Br20 } from "../../import/ImportComponents.jsx";
import { Picker, Time, Count, Delete } from "../../import/ImportComponents.jsx";
import { Card, Paper, Badge, Grid } from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd,
    PATH, firstStr, secondStr, thirdStr, koreanDate,
    URL_OBJECT, sessionId, translate
  } = useCommon();

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
    dateStart: location_dateStart || koreanDate,
    dateEnd: location_dateEnd || koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    sleep_number: 0,
    sleep_dummy: "N",
    sleep_dateType: "",
    sleep_dateStart: "0000-00-00",
    sleep_dateEnd: "0000-00-00",
    sleep_section: [{
      sleep_bedTime: "00:00",
      sleep_wakeTime: "00:00",
      sleep_sleepTime: "00:00",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState(OBJECT?.sleep_section?.map(() => ({
    sleep_bedTime: false,
    sleep_wakeTime: false,
  })));
  const REFS = useRef(OBJECT?.sleep_section?.map(() => ({
    sleep_bedTime: createRef(),
    sleep_wakeTime: createRef(),
  })));

  // 2-3. useEffect --------------------------------------------------------------------------------
  useTime(OBJECT, setOBJECT, PATH, "real");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/exist`, {
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
      setLOADING(false);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    })
    .then((res) => {
      // 첫번째 객체를 제외하고 데이터 추가
      setOBJECT((prev) => {
        if (prev.length === 1 && prev[0]?._id === "") {
          return res.data.result;
        }
        else {
          return {
            ...prev,
            ...res.data.result
          };
        }
      });
      // section 내부 part_idx 값에 따라 재정렬
      setOBJECT((prev) => {
        const mergedFoodSection = prev?.sleep_section
          ? prev.sleep_section.sort((a, b) => a.sleep_part_idx - b.sleep_part_idx)
          : [];
        return {
          ...prev,
          sleep_section: mergedFoodSection,
        };
      });
      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

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

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    REFS.current = OBJECT?.sleep_section?.map((_, idx) => ({
      sleep_bedTime: REFS?.current[idx]?.sleep_bedTime || createRef(),
      sleep_wakeTime: REFS?.current[idx]?.sleep_wakeTime || createRef(),
    }));
  }, [OBJECT?.sleep_section.length]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT) => {
    let foundError = false;
    const initialErrors = OBJECT?.sleep_section?.map(() => ({
      sleep_bedTime: false,
      sleep_wakeTime: false,
    }));

    if (COUNT.newSectionCnt === 0) {
      alert(translate("errorCount"));
      foundError = true;
      return;
    }

    for (let idx = 0; idx < OBJECT?.sleep_section.length; idx++) {
      const section = OBJECT?.sleep_section[idx];
      const refsCurrentIdx = REFS?.current[idx];
      if (!refsCurrentIdx) {
        console.warn('Ref is undefined, skipping validation for index:', idx);
        continue;
      }
      else if (!section.sleep_bedTime || section.sleep_bedTime === "00:00") {
        alert(translate("errorSleepBedTime"));
        REFS?.current[idx]?.sleep_bedTime?.current &&
        REFS?.current[idx]?.sleep_bedTime?.current?.focus();
        initialErrors[idx].sleep_bedTime = true;
        foundError = true;
        break;
      }
      else if (!section.sleep_wakeTime || section.sleep_wakeTime === "00:00") {
        alert(translate("errorSleepWakeTime"));
        REFS?.current[idx]?.sleep_wakeTime?.current &&
        REFS?.current[idx]?.sleep_wakeTime?.current?.focus();
        initialErrors[idx].sleep_wakeTime = true;
        foundError = true;
        break;
      }
    }
    setERRORS(initialErrors);
    return !foundError;
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    if (!validate(OBJECT)) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(SEND.toList, {
          state: SEND
        });
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err) => {
      console.error(err);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDeletes = async () => {
    if (OBJECT?._id === "") {
      alert(translate("noData"));
      return;
    }
    axios.post(`${URL_OBJECT}/deletes`, {
      user_id: sessionId,
      _id: OBJECT?._id,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
        Object.assign(SEND, {
          dateType: "",
          dateStart: DATE.dateStart,
          dateEnd: DATE.dateEnd
        });
        navigate(SEND.toList, {
          state: SEND
        });
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err) => {
      console.error(err);
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
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. save --------------------------------------------------------------------------------------
  const saveNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border radius p-20"}>
        <Picker
          DATE={DATE}
          setDATE={setDATE}
          EXIST={EXIST}
          setEXIST={setEXIST}
        />
        <Br20 />
        <Count
          COUNT={COUNT}
          setCOUNT={setCOUNT}
          limit={1}
        />
      </Card>
    );
    // 7-3. card
    const cardSection = () => {
      const cardFragment = (i) => (
        <Card className={"border radius p-20"} key={i}>
          <Div className={"d-between"}>
            <Badge
              badgeContent={i + 1}
              showZero={true}
              sx={{
                '& .MuiBadge-badge': {
                  color: '#ffffff',
                  backgroundColor: "#1976d2",
                }
              }}
            />
            <Delete
              id={OBJECT?._id}
              sectionId={OBJECT?.sleep_section[i]?._id}
              index={i}
              handlerDelete={handlerDelete}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Time
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              REFS={REFS}
              ERRORS={ERRORS}
              DATE={DATE}
              extra={"sleep_bedTime"}
              i={i}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Time
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              REFS={REFS}
              ERRORS={ERRORS}
              DATE={DATE}
              extra={"sleep_wakeTime"}
              i={i}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Time
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              REFS={REFS}
              ERRORS={ERRORS}
              DATE={DATE}
              extra={"sleep_sleepTime"}
              i={i}
            />
          </Div>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : OBJECT?.sleep_section?.map((_, i) => (cardFragment(i)))
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min75vh"}>
        <Grid container className={"w-100p"}>
          <Grid size={12}>
            {dateCountSection()}
            {cardSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, COUNT, EXIST
      }}
      setState={{
        setDATE, setSEND, setCOUNT, setEXIST
      }}
      flow={{
        navigate, flowSave, flowDeletes
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {saveNode()}
      {footerNode()}
    </>
  );
};
