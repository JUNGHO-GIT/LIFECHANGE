// MoneySave.jsx

import {React, useState, useEffect, useRef, createRef} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {percent, log} from "../../import/ImportUtils.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Div, Br20, Br40} from "../../import/ImportComponents.jsx";
import {Img, Picker, Memo, Count, Delete} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem, TextField} from "../../import/ImportMuis.jsx";
import {money2} from "../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const MoneySave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCategory") || "{}";
  const moneyArray = JSON.parse(session)?.money || [];
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
    toList: "/money/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: location_dateType,
    dateStart: location_dateStart || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
    dateEnd: location_dateEnd || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    money_number: 0,
    money_dummy: "N",
    money_dateStart: "0000-00-00",
    money_dateEnd: "0000-00-00",
    money_total_income: 0,
    money_total_expense: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [ERRORS, setERRORS] = useState(OBJECT?.money_section?.map(() => ({
    money_part_idx: false,
    money_title_idx: false,
    money_amount: false
  })));
  const REFS = useRef(OBJECT?.money_section?.map(() => ({
    money_part_idx: createRef(),
    money_title_idx: createRef(),
    money_amount: createRef(),
  })));

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
      setLOADING(false);
    })
    .catch((err) => {
      console.error(err);
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
        if (prev.length === 1 && prev[0]?._id === "") {
          return res.data.result;
        }
        else {
          return {...prev, ...res.data.result};
        }
      });
      // section 내부 part_idx 값에 따라 재정렬
      setOBJECT((prev) => {
        const mergedFoodSection = prev?.money_section
          ? prev.money_section.sort((a, b) => a.money_part_idx - b.money_part_idx)
          : [];
        return {
          ...prev,
          money_section: mergedFoodSection,
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
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const totals = OBJECT?.money_section.reduce((acc, cur) => {
      return {
        // money_part_val 가 income인경우
        totalIncome: acc.totalIncome + (cur.money_part_val === "income" ? cur.money_amount : 0),

        // money_part_val 가 expense인경우
        totalExpense: acc.totalExpense + (cur.money_part_val === "expense" ? cur.money_amount : 0)
      };
    }, {totalIncome: 0, totalExpense: 0});

    setOBJECT((prev) => ({
      ...prev,
      money_total_income: Math.round(totals.totalIncome),
      money_total_expense: Math.round(totals.totalExpense)
    }));

  }, [OBJECT?.money_section]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: ""
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_, idx) =>
      idx < OBJECT?.money_section.length ? OBJECT?.money_section[idx] : defaultSection
    );
    setOBJECT((prev) => ({
      ...prev,
      money_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    REFS.current = OBJECT?.money_section?.map((_, idx) => ({
      money_part_idx: REFS?.current[idx]?.money_part_idx || createRef(),
      money_title_idx: REFS?.current[idx]?.money_title_idx || createRef(),
      money_amount: REFS?.current[idx]?.money_amount || createRef(),
    }));
  }, [OBJECT?.money_section.length]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT) => {
    let foundError = false;
    const initialErrors = OBJECT?.money_section?.map(() => ({
      money_part_idx: false,
      money_title_idx: false,
      money_amount: false,
    }));

    if (COUNT.newSectionCnt === 0) {
      alert(translate("errorCount"));
      foundError = true;
      return;
    }

    for (let idx = 0; idx < OBJECT?.money_section.length; idx++) {
      const section = OBJECT?.money_section[idx];
      const refsCurrentIdx = REFS?.current[idx];
      if (!refsCurrentIdx) {
        console.warn('Ref is undefined, skipping validation for index:', idx);
        continue;
      }
      else if (!section.money_part_idx || section.money_part_idx === 0) {
        alert(translate("errorMoneyPart"));
        refsCurrentIdx.money_part_idx.current &&
        refsCurrentIdx.money_part_idx?.current?.focus();
        initialErrors[idx].money_part_idx = true;
        foundError = true;
        break;
      }
      else if (!section.money_title_idx || section.money_title_idx === 0) {
        alert(translate("errorMoneyTitle"));
        refsCurrentIdx.money_title_idx.current &&
        refsCurrentIdx.money_title_idx?.current?.focus();
        initialErrors[idx].money_title_idx = true;
        foundError = true;
        break;
      }
      else if (!section.money_amount || section.money_amount === 0) {
        alert(translate("errorMoneyAmount"));
        refsCurrentIdx.money_amount.current &&
        refsCurrentIdx.money_amount?.current?.focus();
        initialErrors[idx].money_amount = true;
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
      return;
    }
    await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        percent();
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
        alert(res.data.msg);
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
    await axios.post(`${URL_OBJECT}/deletes`, {
      user_id: sessionId,
      _id: OBJECT?._id,
      DATE: DATE,
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        percent();
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
        alert(res.data.msg);
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
      money_section: prev.money_section.filter((_, idx) => (idx !== index))
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border radius shadow-none p-20"}>
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
          limit={10}
        />
      </Card>
    );
    // 7-2. total
    const totalSection = () => (
      <Card className={"border radius shadow-none p-20"}>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalIncome")}
            size={"small"}
            value={numeral(OBJECT?.money_total_income).format("0,0")}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={money2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("currency")}
                </Div>
              )
            }}
          />
          <TextField
            select={false}
            label={translate("totalExpense")}
            size={"small"}
            value={numeral(OBJECT?.money_total_expense).format("0,0")}
            variant={"outlined"}
            className={"w-40vw ms-3vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={money2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("currency")}
                </Div>
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-3. table
    const tableSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const tableFragment = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          <Div className={"d-between"}><Badge
              badgeContent={i + 1}
              showZero={true}
              sx={{
                '& .MuiBadge-badge': {
                  color: '#ffffff',
                  backgroundColor:
                    OBJECT?.money_section[i]?.money_part_idx === 0 ? '#1976d2' :
                    OBJECT?.money_section[i]?.money_part_idx === 1 ? '#4CAF50' :
                    OBJECT?.money_section[i]?.money_part_idx === 2 ? '#FFC107' :
                    OBJECT?.money_section[i]?.money_part_idx === 3 ? '#FF5722' :
                    OBJECT?.money_section[i]?.money_part_idx === 4 ? '#673AB7' :
                    OBJECT?.money_section[i]?.money_part_idx === 5 ? '#3F51B5' :
                    OBJECT?.money_section[i]?.money_part_idx === 6 ? '#2196F3' :
                    OBJECT?.money_section[i]?.money_part_idx === 7 ? '#009688' :
                    OBJECT?.money_section[i]?.money_part_idx === 8 ? '#CDDC39' :
                    OBJECT?.money_section[i]?.money_part_idx === 9 ? '#FFEB3B' :
                    '#9E9E9E',
                }
              }}
            />
            <Delete
              id={OBJECT?._id}
              sectionId={OBJECT?.money_section[i]?._id}
              index={i}
              handlerDelete={handlerDelete}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              label={translate("part")}
              value={OBJECT?.money_section[i]?.money_part_idx}
              inputRef={REFS?.current[i]?.money_part_idx}
              error={ERRORS[i]?.money_part_idx}
              onChange={(e) => {
                const newIndex = Number(e.target.value);
                setOBJECT((prev) => ({
                  ...prev,
                  money_section: prev.money_section?.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      money_part_idx: newIndex,
                      money_part_val: moneyArray[newIndex]?.money_part,
                      money_title_idx: 0,
                      money_title_val: moneyArray[newIndex]?.money_title[0],
                    } : item
                  ))
                }));
              }}
            >
              {moneyArray?.map((item, idx) => (
                <MenuItem key={idx} value={idx}>
                  <Div className={"fs-0-8rem"}>
                    {translate(item.money_part)}
                  </Div>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              label={translate("title")}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              value={OBJECT?.money_section[i]?.money_title_idx}
              inputRef={REFS?.current[i]?.money_title_idx}
              error={ERRORS[i]?.money_title_idx}
              onChange={(e) => {
                const newTitleIdx = Number(e.target.value);
                const newTitleVal = moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title[newTitleIdx];
                if (newTitleIdx >= 0 && newTitleVal) {
                  setOBJECT((prev) => ({
                    ...prev,
                    money_section: prev.money_section?.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        money_title_idx: newTitleIdx,
                        money_title_val: newTitleVal,
                      } : item
                    ))
                  }));
                }
              }}
            >
              {moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title?.map((title, idx) => (
                <MenuItem key={idx} value={idx}>
                  <Div className={"fs-0-8rem"}>
                    {translate(title)}
                  </Div>
                </MenuItem>
              ))}
            </TextField>
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("amount")}
              size={"small"}
              variant={"outlined"}
              className={"w-86vw"}
              value={numeral(OBJECT?.money_section[i]?.money_amount).format("0,0")}
              inputRef={REFS?.current[i]?.money_amount}
              error={ERRORS[i]?.money_amount}
              InputProps={{
                startAdornment: (
                  <Img src={money2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"fs-0-6rem"}>
                    {translate("currency")}
                  </Div>
                )
              }}
              onChange={(e) => {
                const regex = /,/g;
                const match = e.target.value.match(regex);
                const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
                const limitedValue = Math.min(Number(rawValue), 9999999999);
                setOBJECT((prev) => ({
                  ...prev,
                  money_section: prev.money_section?.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      money_amount: limitedValue
                    } : item
                  ))
                }));
              }}
            />
          </Div>
          <Br20 />
          <Div className={"d-center"}>
            <Memo
              OBJECT={OBJECT}
              setOBJECT={setOBJECT}
              extra={"money_content"}
              i={i}
            />
          </Div>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? loadingFragment() : OBJECT?.money_section?.map((_, i) => (tableFragment(i)))
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none pb-80"}>
        <Div className={"block-wrapper h-min75vh"}>
          {dateCountSection()}
          {totalSection()}
          {tableSection()}
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