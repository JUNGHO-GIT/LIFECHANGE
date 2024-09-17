// FoodDetail.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { useValidateFood } from "@imports/ImportValidates";
import { Food } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Input, Select, Img, Bg } from "@imports/ImportComponents";
import { Picker, Count, Delete } from "@imports/ImportContainers";
import { Card, Paper, MenuItem,  Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const FoodDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt, getMonthStartFmt, getMonthEndFmt
  } = useCommonDate();
  const {
    navigate, location_dateType, location_dateStart, location_dateEnd, URL_OBJECT, sessionId, TITLE, foodArray, toList, location
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateFood();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(Food);
  const [EXIST, setEXIST] = useState<any>({
    day: [""],
    week: [""],
    month: [""],
    year: [""],
    select: [""],
  });
  const [FLOW, setFLOW] = useState<any>({
    exist: "",
    itsMe: "",
    itsNew: "",
  });
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });
  const [COUNT, setCOUNT] = useState<any>({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState<any>({
    dateType: location_dateType || "",
    dateStart: location_dateStart || dayFmt,
    dateEnd: location_dateEnd || dayFmt,
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart} ~ ${DATE.dateEnd}`;
      const objectRange = `${OBJECT.food_dateStart} ~ ${OBJECT.food_dateEnd}`;

      const isExist = (
        EXIST[DATE.dateType].some((item: any) => item === dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.food_dateStart === "0000-00-00" &&
        OBJECT.food_dateEnd === "0000-00-00"
      );

      setFLOW({
        exist: isExist ? "true" : "false",
        itsMe: itsMe ? "true" : "false",
        itsNew: itsNew ? "true" : "false",
      });
    }
  }, [EXIST]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: "",
          dateStart: getMonthStartFmt(DATE.dateStart),
          dateEnd: getMonthEndFmt(DATE.dateEnd),
        },
      },
    })
    .then((res: any) => {
      setEXIST(
        !res.data.result || res.data.result.length === 0 ? [""] : res.data.result
      );
    })
    .catch((err: any) => {
      console.error(err);
    });
  }, [sessionId, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (LOCKED === "locked") {
      return;
    }
    setLOADING(true);
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
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

      // 카운트 설정
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));

      // 스토리지 데이터 가져오기
      let sectionArray = [];
      let section = sessionStorage.getItem(`${TITLE}_foodSection`);

      // sectionArray 설정
      if (section) {
        sectionArray = JSON.parse(section);
      }
      else {
        sectionArray = [];
      }

      // 기존 food_section 데이터와 병합하여 OBJECT 재설정
      setOBJECT((prev: any) => {
        // 기존의 food_section만 정렬
        let sortedFoodSection = prev?.food_section
          ? [...prev.food_section].sort((a, b) => a.food_part_idx - b.food_part_idx)
          : [];

        // sectionArray를 마지막에 추가
        let mergedSection = [...sortedFoodSection, ...sectionArray];

        return {
          ...prev,
          food_section: mergedSection
        };
      });

      // 병합된 데이터를 바탕으로 COUNT 재설정
      setCOUNT((prev: any) => ({
        ...prev,
        newSectionCnt: prev?.newSectionCnt + sectionArray.length
      }));
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const totals = OBJECT?.food_section?.reduce((acc: any, cur: any) => {
      return {
        totalKcal: acc.totalKcal + Number(cur.food_kcal),
        totalFat: acc.totalFat + Number(cur.food_fat),
        totalCarb: acc.totalCarb + Number(cur.food_carb),
        totalProtein: acc.totalProtein + Number(cur.food_protein),
      };
    }, {
      totalKcal: 0,
      totalFat: 0,
      totalCarb: 0,
      totalProtein: 0
    });

    setOBJECT((prev: any) => ({
      ...prev,
      food_total_kcal: Number(totals.totalKcal).toString(),
      food_total_fat: Number(totals.totalFat.toFixed(1)).toString(),
      food_total_carb: Number(totals.totalCarb.toFixed(1)).toString(),
      food_total_protein: Number(totals.totalProtein.toFixed(1)).toString(),
    }));
  }, [OBJECT?.food_section]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const defaultSection = {
      food_part_idx: 1,
      food_part_val: "breakfast",
      food_name: "",
      food_brand: "",
      food_count: "1",
      food_serv: "회",
      food_gram: "0",
      food_kcal: "0",
      food_fat: "0",
      food_carb: "0",
      food_protein: "0",
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_item: any, idx: number) =>
      idx < OBJECT?.food_section.length ? OBJECT?.food_section[idx] : defaultSection
    );
    setOBJECT((prev: any) => ({
      ...prev,
      food_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async (type: string) => {
    if (!validate(OBJECT, COUNT)) {
      setLOADING(false);
      return;
    }
    axios.post(`${URL_OBJECT}/${type}`, {
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
        navigate(toList, {
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
  const flowDelete = async () => {
    if (OBJECT?._id === "") {
      alert(translate("noData"));
      return;
    }
    axios.delete(`${URL_OBJECT}/delete`, {
      data: {
        user_id: sessionId,
        DATE: DATE,
      }
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
        navigate(toList, {
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
    // 스토리지 데이터 가져오기
    let sectionArray = [];
    let section = sessionStorage.getItem(`${TITLE}_foodSection`);

    // sectionArray 초기화
    if (section) {
      sectionArray = JSON.parse(section);
    }
    else {
      sectionArray = [];
    }

    // sectionArray 삭제
    sectionArray.splice(index, 1);

    // 스토리지 데이터 설정
    sessionStorage.setItem(`${TITLE}_foodSection`, JSON.stringify(sectionArray));

    // OBJECT 설정
    setOBJECT((prev: any) => ({
      ...prev,
      food_section: prev?.food_section.filter((_item: any, idx: number) => (idx !== index))
    }));

    // COUNT 설정
    setCOUNT((prev: any) => ({
      ...prev,
      newSectionCnt: prev?.newSectionCnt - 1,
    }));
  };

  // 7. detail -------------------------------------------------------------------------------------
  const detailNode = () => {
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
              LOCKED={LOCKED}
              setLOCKED={setLOCKED}
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
              label={translate("totalKcal")}
              value={numeral(OBJECT?.food_total_kcal).format('0,0')}
              readOnly={true}
              startadornment={
                <Img
                	key={"food2"}
                	src={"food2"}
                	className={"w-16 h-16"}
                />
              }
              endadornment={
                translate("kc")
              }
            />
          </Grid>
          <Grid size={6}>
            <Input
              label={translate("totalCarb")}
              value={numeral(OBJECT?.food_total_carb).format('0,0.0')}
              readOnly={true}
              startadornment={
                <Img
                	key={"food3"}
                	src={"food3"}
                	className={"w-16 h-16"}
                />
              }
              endadornment={
                translate("g")
              }
            />
          </Grid>
          <Grid size={6}>
            <Input
              label={translate("totalProtein")}
              value={numeral(OBJECT?.food_total_protein).format('0,0.0')}
              readOnly={true}
              startadornment={
                <Img
                	key={"food4"}
                	src={"food4"}
                	className={"w-16 h-16"}
                />
              }
              endadornment={
                translate("g")
              }
            />
          </Grid>
          <Grid size={6}>
            <Input
              label={translate("totalFat")}
              value={numeral(OBJECT?.food_total_fat).format('0,0.0')}
              readOnly={true}
              startadornment={
                <Img
                	key={"food5"}
                	src={"food5"}
                	className={"w-16 h-16"}
                />
              }
              endadornment={
                translate("g")
              }
            />
          </Grid>
        </Grid>
      </Card>
    );
    // 7-3. card
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          <Grid container spacing={2}>
            <Grid size={6} className={"d-left"}>
              <Bg
                badgeContent={i + 1}
                bgcolor={
                  OBJECT?.food_section[i]?.food_part_idx === 0 ? '#1976d2' :
                  OBJECT?.food_section[i]?.food_part_idx === 1 ? '#4CAF50' :
                  OBJECT?.food_section[i]?.food_part_idx === 2 ? '#FFC107' :
                  OBJECT?.food_section[i]?.food_part_idx === 3 ? '#FF5722' :
                  OBJECT?.food_section[i]?.food_part_idx === 4 ? '#673AB7' :
                  OBJECT?.food_section[i]?.food_part_idx === 5 ? '#3F51B5' :
                  OBJECT?.food_section[i]?.food_part_idx === 6 ? '#2196F3' :
                  OBJECT?.food_section[i]?.food_part_idx === 7 ? '#009688' :
                  OBJECT?.food_section[i]?.food_part_idx === 8 ? '#CDDC39' :
                  OBJECT?.food_section[i]?.food_part_idx === 9 ? '#FFEB3B' :
                  '#9E9E9E'
                }
              />
            </Grid>
            <Grid size={6} className={"d-right"}>
              <Delete
                index={i}
                handlerDelete={handlerDelete}
                LOCKED={LOCKED}
              />
            </Grid>
            <Grid size={6}>
              <Select
                label={translate("part")}
                value={OBJECT?.food_section[i]?.food_part_idx}
                inputRef={REFS[i]?.food_part_idx}
                error={ERRORS[i]?.food_part_idx}
                onChange={(e: any) => {
                  const newPart = Number(e.target.value);
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev?.food_section?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        food_part_idx: newPart,
                        food_part_val: foodArray[newPart]?.food_part,
                      } : item
                    ))
                  }));
                }}
              >
                {foodArray?.map((item: any, idx: number) => (
                  <MenuItem key={idx} value={idx} className={"fs-0-8rem"}>
                    {translate(item.food_part)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={3}>
              <Select
                label={translate("foodCount")}
                value={Math.min(Number(OBJECT?.food_section[i]?.food_count), 100)}
                onChange={(e: any) => {
                  const newCount = Number(e.target.value);
                  if (newCount > 100) {
                    return;
                  }
                  else if (isNaN(newCount) || newCount <= 0) {
                    return;
                  }
                  const newVal = (value: any) => {
                    return (
                      Number(((newCount * value) /
                      Number(OBJECT?.food_section[i]?.food_count)).toFixed(2)).toString()
                    );
                  }
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev?.food_section?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        food_count: newCount.toString(),
                        food_kcal: newVal(item.food_kcal),
                        food_fat: newVal(item.food_fat),
                        food_carb: newVal(item.food_carb),
                        food_protein: newVal(item.food_protein),
                      } : item
                    ))
                  }));
                }}
              >
                {Array.from({ length: 100 }, (_, index) => (
                  <MenuItem key={index + 1} value={index + 1}>
                    {index + 1}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={3}>
              <Input
                label={translate("gram")}
                value={numeral(OBJECT?.food_section[i]?.food_gram).format("0,0")}
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_gram: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_gram: value,
                          } : item
                        ))
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("foodName")}
                value={OBJECT?.food_section[i]?.food_name}
                inputRef={REFS[i]?.food_name}
                error={ERRORS[i]?.food_name}
                shrink={"shrink"}
                onChange={(e: any) => {
                  const newVal = e.target.value;
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev?.food_section?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        food_name: newVal,
                      } : item
                    ))
                  }));
                }}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("brand")}
                value={OBJECT?.food_section[i]?.food_brand}
                shrink={"shrink"}
                onChange={(e: any) => {
                  const newVal = e.target.value;
                  setOBJECT((prev: any) => ({
                    ...prev,
                    food_section: prev?.food_section?.map((item: any, idx: number) => (
                      idx === i ? {
                        ...item,
                        food_brand: newVal,
                      } : item
                    ))
                  }));
                }}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("kcal")}
                value={numeral(OBJECT?.food_section[i]?.food_kcal).format("0,0")}
                inputRef={REFS[i]?.food_kcal}
                error={ERRORS[i]?.food_kcal}
                startadornment={
                  <Img
                  	key={"food2"}
                  	src={"food2"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("kc")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_kcal: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 9999999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_kcal: value,
                          } : item
                        ))
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("carb")}
                value={numeral(OBJECT?.food_section[i]?.food_carb).format("0,0")}
                inputRef={REFS[i]?.food_carb}
                error={ERRORS[i]?.food_carb}
                startadornment={
                  <Img
                  	key={"food3"}
                  	src={"food3"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_carb: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 99999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_carb: value,
                          } : item
                        ))
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("protein")}
                value={numeral(OBJECT?.food_section[i]?.food_protein).format("0,0")}
                inputRef={REFS[i]?.food_protein}
                error={ERRORS[i]?.food_protein}
                startadornment={
                  <Img
                  	key={"food4"}
                  	src={"food4"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_protein: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 99999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_protein: value,
                          } : item
                        ))
                      }));
                    }
                  }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("fat")}
                value={numeral(OBJECT?.food_section[i]?.food_fat).format("0,0")}
                inputRef={REFS[i]?.food_fat}
                error={ERRORS[i]?.food_fat}
                startadornment={
                  <Img
                  	key={"food5"}
                  	src={"food5"}
                  	className={"w-16 h-16"}
                  />
                }
                endadornment={
                  translate("g")
                }
                onChange={(e: any) => {
                  const value = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(value) || value === "") {
                    const newValue = Number(value);
                    if (value === "") {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_fat: "0"
                          } : item
                        ))
                      }));
                    }
                    else if (!isNaN(newValue) && newValue <= 99999) {
                      setOBJECT((prev: any) => ({
                        ...prev,
                        food_section: prev.food_section?.map((item: any, idx: number) => (
                          idx === i ? {
                            ...item,
                            food_fat: value,
                          } : item
                        ))
                      }));
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Card>
      );
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : OBJECT?.food_section?.map((item: any, i: number) => (
            detailFragment(i)
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
            {detailSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND, COUNT, EXIST, FLOW,
      }}
      setState={{
        setDATE, setSEND, setCOUNT, setEXIST, setFLOW,
      }}
      flow={{
        flowSave, flowDelete
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {detailNode()}
      {footerNode()}
    </>
  );
};