// MoneySave.tsx
// Node -> Section -> Fragment

import { useState, useEffect, useRef, createRef } from "@imports/ImportReacts";
import { useCommon } from "@imports/ImportHooks";
import { moment, axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div, Select, Input, Img, Bg } from "@imports/ImportComponents";
import { Picker, Memo, Count, Delete } from "@imports/ImportContainers";
import { Card, Paper, MenuItem, Grid } from "@imports/ImportMuis";
import { money2 } from "@imports/ImportImages";

// -------------------------------------------------------------------------------------------------
export const MoneySave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, moneyArray, koreanDate,
  URL_OBJECT, sessionId, translate
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
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
    dateStart: location_dateStart || koreanDate,
    dateEnd: location_dateEnd || koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF: any = {
    _id: "",
    money_number: 0,
    money_dummy: "N",
    money_dateType: "",
    money_dateStart: "0000-00-00",
    money_dateEnd: "0000-00-00",
    money_total_income: "0",
    money_total_expense: "0",
    money_section: [{
      money_part_idx: 0,
      money_part_val: "all",
      money_title_idx: 0,
      money_title_val: "all",
      money_amount: "0",
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
  const REFS: any = useRef(OBJECT?.money_section?.map(() => ({
    money_part_idx: createRef(),
    money_title_idx: createRef(),
    money_amount: createRef(),
  })));

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
    .then((res: any) => {
      setEXIST(res.data.result || []);
      setLOADING(false);
    })
    .catch((err: any) => {
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
    .then((res: any) => {
      // 첫번째 객체를 제외하고 데이터 추가
      setOBJECT((prev: any) => {
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
      setOBJECT((prev: any) => {
        const mergedFoodSection = prev?.money_section
          ? prev.money_section.sort((a: any, b: any) => (
            a.money_part_idx - b.money_part_idx
          ))
          : [];
        return {
          ...prev,
          money_section: mergedFoodSection,
        };
      });
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const totals = OBJECT?.money_section.reduce((acc: any, cur: any) => {
      return {
        // money_part_val 가 income인경우
        totalIncome:
          acc.totalIncome + (cur.money_part_val === "income" ? Number(cur.money_amount) : 0),

        // money_part_val 가 expense인경우
        totalExpense:
          acc.totalExpense + (cur.money_part_val === "expense" ? Number(cur.money_amount) : 0),
      };
    }, {
      totalIncome: 0,
      totalExpense: 0
    });

    setOBJECT((prev: any) => ({
      ...prev,
      money_total_income: Math.round(totals.totalIncome).toString(),
      money_total_expense: Math.round(totals.totalExpense).toString(),
    }));

  }, [OBJECT?.money_section]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      money_part_idx: 0,
      money_part_val: "all",
      money_title_idx: 0,
      money_title_val: "all",
      money_amount: "0",
      money_content: ""
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((item: any, idx: number) =>
      idx < OBJECT?.money_section.length ? OBJECT?.money_section[idx] : defaultSection
    );
    setOBJECT((prev: any) => ({
      ...prev,
      money_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    REFS.current = OBJECT?.money_section?.map((item: any, idx: number) => ({
      money_part_idx: REFS?.current[idx]?.money_part_idx || createRef(),
      money_title_idx: REFS?.current[idx]?.money_title_idx || createRef(),
      money_amount: REFS?.current[idx]?.money_amount || createRef(),
    }));
  }, [OBJECT?.money_section.length]);

  // 2-4. validate ---------------------------------------------------------------------------------
  const validate = (OBJECT: any) => {
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
      else if (!section.money_amount || section.money_amount === "0") {
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
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res: any) => {
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
    .catch((err: any) => {
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
    .then((res: any) => {
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
    .catch((err: any) => {
      console.error(err);
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerDelete = (index: number) => {
    setOBJECT((prev: any) => ({
      ...prev,
      money_section: prev.money_section.filter((item: any, idx: number) => (idx !== index))
    }));
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. saveNode -----------------------------------------------------------------------------------
  const saveNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Card className={"border radius p-20"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Picker
              DATE={DATE}
              setDATE={setDATE}
              EXIST={EXIST}
              setEXIST={setEXIST}
            />
          </Grid>
          <Grid size={12}>
            <Count
              COUNT={COUNT}
              setCOUNT={setCOUNT}
              limit={10}
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-2. total
    const totalSection = () => (
      <Card className={"border radius p-20"}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Input
              label={translate("totalIncome")}
              value={numeral(OBJECT?.money_total_income).format("0,0")}
              readOnly={true}
              startadornment={
                <Img src={money2} className={"w-16 h-16"} />
              }
              endadornment={
                translate("currency")
              }
            />
          </Grid>
          <Grid size={6}>
            <Input
              label={translate("totalExpense")}
              value={numeral(OBJECT?.money_total_expense).format("0,0")}
              readOnly={true}
              startadornment={
                <Img src={money2} className={"w-16 h-16"} />
              }
              endadornment={
                translate("currency")
              }
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-3. card
    const cardSection = () => {
      const cardFragment = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          <Grid container spacing={2}>
            <Grid size={6} className={"d-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={
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
                  '#9E9E9E'
                }
              />
            </Grid>
            <Grid size={6} className={"d-right"}>
              <Delete
                index={i}
                handlerDelete={handlerDelete}
              />
            </Grid>
            <Grid size={6}>
              <Select
                label={translate("part")}
                value={OBJECT?.money_section[i]?.money_part_idx}
                inputRef={REFS?.current[i]?.money_part_idx}
                error={ERRORS[i]?.money_part_idx}
                onChange={(e: any) => {
                  const newIndex = Number(e.target.value);
                  setOBJECT((prev: any) => ({
                    ...prev,
                    money_section: prev.money_section?.map((item: any, idx: number) => (
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
                {moneyArray?.map((item: any, idx: number) => (
                  <MenuItem key={idx} value={idx} className={"fs-0-8rem"}>
                    {translate(item.money_part)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={6}>
              <Select
                label={translate("title")}
                value={OBJECT?.money_section[i]?.money_title_idx}
                inputRef={REFS?.current[i]?.money_title_idx}
                error={ERRORS[i]?.money_title_idx}
                onChange={(e: any) => {
                  const newTitleIdx = Number(e.target.value);
                  const newTitleVal = moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title[newTitleIdx];
                  if (newTitleIdx >= 0 && newTitleVal) {
                    setOBJECT((prev: any) => ({
                      ...prev,
                      money_section: prev.money_section?.map((item: any, idx: number) => (
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
                {moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title?.map((title: any, idx: number) => (
                  <MenuItem key={idx} value={idx} className={"fs-0-8rem"}>
                    {translate(title)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={12}>
              <Input
                label={translate("amount")}
                value={numeral(OBJECT?.money_section[i]?.money_amount).format("0,0")}
                inputRef={REFS?.current[i]?.money_amount}
                error={ERRORS[i]?.money_amount}
                startadornment={
                  <Img src={money2} className={"w-16 h-16"} />
                }
                endadornment={
                  translate("currency")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        money_section: prev.money_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            money_amount: "0",
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        money_section: prev.money_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            money_amount: value,
                          } : item
                        ))
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={12}>
              <Memo
                OBJECT={OBJECT}
                setOBJECT={setOBJECT}
                extra={"money_content"}
                i={i}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : OBJECT?.money_section?.map((item: any, i: number) => (
            cardFragment(i)
          ))
        )
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min75vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {dateCountSection()}
            {totalSection()}
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