// FoodDetail.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useValidateFood } from "@imports/ImportHooks";
import { useLanguageStore, useAlertStore } from "@imports/ImportStores";
import { Food } from "@imports/ImportSchemas";
import { axios, sync, setSession, insertComma } from "@imports/ImportUtils";
import { Loading, Footer, Dialog } from "@imports/ImportLayouts";
import { PickerDay, Count, Delete, Input, Select } from "@imports/ImportContainers";
import { Img, Bg, Icons, Div } from "@imports/ImportComponents";
import { Paper, MenuItem, Grid } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const FoodDetail = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, navigate, toToday, toList, sessionId } = useCommonValue();
  const { foodArray, bgColors, sessionFoodSection } = useCommonValue();
  const { location_from, location_dateType } = useCommonValue();
  const { location_dateStart, location_dateEnd } = useCommonValue();
  const { getDayFmt,getMonthStartFmt, getMonthEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();
  const { ALERT, setALERT } = useAlertStore();
  const { ERRORS, REFS, validate } = useValidateFood();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [LOCKED, setLOCKED] = useState<string>("unlocked");
  const [OBJECT, setOBJECT] = useState<any>(Food);
  const [FAVORITE, setFAVORITE] = useState<any>([]);
  const [EXIST, setEXIST] = useState<any>({
    day: [""],
    week: [""],
    month: [""],
    year: [""],
    select: [""],
  });
  const [FLOW, setFLOW] = useState<any>({
    exist: false,
    itsMe: false,
    itsNew: false,
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
    dateType: location_dateType || "day",
    dateStart: location_dateStart || getDayFmt(),
    dateEnd: location_dateEnd || getDayFmt(),
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (EXIST?.[DATE.dateType]?.length > 0) {

      const dateRange = `${DATE.dateStart.trim()} - ${DATE.dateEnd.trim()}`;
      const objectRange = `${OBJECT.food_dateStart.trim()} - ${OBJECT.food_dateEnd.trim()}`;

      const isExist = (
        EXIST[DATE.dateType].includes(dateRange)
      );
      const itsMe = (
        dateRange === objectRange
      );
      const itsNew = (
        OBJECT.food_dateStart === "0000-00-00" &&
        OBJECT.food_dateEnd === "0000-00-00"
      );

      setFLOW((prev: any) => ({
        ...prev,
        exist: isExist,
        itsMe: itsMe,
        itsNew: itsNew
      }));
    }
  }, [EXIST, DATE.dateEnd, OBJECT.food_dateEnd]);

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
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    axios.get(`${URL_OBJECT}/find/listFavorite`, {
      params: {
        user_id: sessionId,
      },
    })
    .then((res: any) => {
      setFAVORITE(
        !res.data.result || res.data.result.length === 0 ? [""] : res.data.result
      );
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  }, [URL_OBJECT, sessionId]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    if (LOCKED === "locked") {
      setLOADING(false);
      return;
    }
    axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: sessionId,
        DATE: DATE,
      },
    })
    .then((res: any) => {
      // 기본값 설정
      setOBJECT(res.data.result || Food);

      // sectionCnt가 0이면 section 초기화
      if (res.data.sectionCnt <= 0) {
        setOBJECT((prev: any) => ({
          ...prev,
          food_section: []
        }));
      }
      // sectionCnt가 0이 아니면 section 내부 part_idx 값에 따라 재정렬
      else {
        setOBJECT((prev: any) => ({
          ...prev,
          food_section: prev?.food_section.sort((a: any, b: any) => (
            a.food_part_idx - b.food_part_idx
          )),
        }));
      }

      // count 설정
      setCOUNT((prev: any) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0,
        newSectionCnt: res.data.sectionCnt || 0
      }));

      // 스토리지 데이터 가져오기
      let sectionArray = sessionFoodSection.length > 0 ? sessionFoodSection : [];

      // 기존 food_section 데이터와 병합하여 OBJECT 재설정
      setOBJECT((prev: any) => ({
        ...prev,
        // 기존의 food_section만 정렬
        food_section: prev?.food_section ? (
          [...prev.food_section].sort((a, b) => a.food_part_idx - b.food_part_idx).concat(sectionArray)
        ) : [...sectionArray]
      }));

      // 병합된 데이터를 바탕으로 COUNT 재설정
      setCOUNT((prev: any) => ({
        ...prev,
        newSectionCnt: prev?.newSectionCnt + sectionArray.length
      }));
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const totals = OBJECT?.food_section.reduce((acc: any, cur: any) => {
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
      food_part_idx: 0,
      food_part_val: "breakfast",
      food_key: "",
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
    setLOADING(true);
    if (!await validate(OBJECT, COUNT, "real")) {
      setLOADING(false);
      return;
    }
    axios({
      method: type === "create" ? "post" : "put",
      url: type === "create" ? `${URL_OBJECT}/create` : `${URL_OBJECT}/update`,
      data: {
        user_id: sessionId,
        OBJECT: OBJECT,
        DATE: DATE,
        type: type,
      }
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate(location_from === "today" ? toToday : toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
        sync("nutrition");
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowDelete = async () => {
    setLOADING(true);
    if (!await validate(OBJECT, COUNT, "delete")) {
      setLOADING(false);
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
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "success",
        });
        navigate(location_from === "today" ? toToday : toList, {
          state: {
            dateType: "",
            dateStart: DATE.dateStart,
            dateEnd: DATE.dateEnd
          }
        });
        sync("nutrition");
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 3. flow ---------------------------------------------------------------------------------------
  const flowUpdateFavorite = (foodFavorite: any) => {
    axios.put(`${URL_OBJECT}/find/updateFavorite`, {
      user_id: sessionId,
      foodFavorite: foodFavorite,
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setFAVORITE(res.data.result);
        sync("favorite");
      }
      else {
        setALERT({
          open: !ALERT.open,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setALERT({
        open: !ALERT.open,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
      console.error(err);
    });
  };

  // 4-3. handle----------------------------------------------------------------------------------
  const handleDelete = (index: number) => {

    // 스토리지 데이터 가져오기
    let sectionArray = [];
    let section = sessionFoodSection;

    // sectionArray 초기화
    if (section) {
      sectionArray = section;
    }
    else {
      sectionArray = [];
    }

    // sectionArray 삭제
    sectionArray.splice(index, 1);

    // 스토리지 데이터 설정
    setSession("section", "food", "", sectionArray);

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

  // 4-5. handle (favorite 추가) -------------------------------------------------------------------
  const handleFoodFavorite = (index: number) => {

    const food_name = OBJECT?.food_section[index]?.food_name;
    const food_brand = OBJECT?.food_section[index]?.food_brand;
    const food_gram = OBJECT?.food_section[index]?.food_gram;
    const food_serv = OBJECT?.food_section[index]?.food_serv;
    const food_count = OBJECT?.food_section[index]?.food_count || 1;

    const food_kcal = (
      parseFloat(OBJECT?.food_section[index]?.food_kcal) / parseFloat(food_count)
    ).toFixed(0);
    const food_carb = (
      parseFloat(OBJECT?.food_section[index]?.food_carb) / parseFloat(food_count)
    ).toFixed(1);
    const food_protein = (
      parseFloat(OBJECT?.food_section[index]?.food_protein) / parseFloat(food_count)
    ).toFixed(1);
    const food_fat = (
      parseFloat(OBJECT?.food_section[index]?.food_fat) / parseFloat(food_count)
    ).toFixed(1);
    const food_key = (
      `${food_name}_${food_brand}_${food_kcal}_${food_carb}_${food_protein}_${food_fat}`
    );

    return {
      food_key: food_key,
      food_name: food_name,
      food_brand: food_brand,
      food_gram: food_gram,
      food_serv: food_serv,
      food_count: "1",
      food_kcal: food_kcal,
      food_carb: food_carb,
      food_protein: food_protein,
      food_fat: food_fat,
    };
  };

  // 7. detail -------------------------------------------------------------------------------------
  const detailNode = () => {
    // 7-1. date + count
    const dateCountSection = () => (
      <Grid container spacing={2} columns={12} className={"border-1 radius-1 p-20"}>
        <Grid size={12}>
          <PickerDay
            DATE={DATE}
            setDATE={setDATE}
            EXIST={EXIST}
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
    );
    // 7-2. total
    const totalSection = () => (
      <Grid container spacing={2} columns={12} className={"border-1 radius-1 p-20"}>
        <Grid size={6}>
          <Input
            readOnly={true}
            label={translate("totalKcal")}
            value={insertComma(OBJECT?.food_total_kcal || "0")}
            startadornment={
              <Img
                max={15}
                hover={true}
                shadow={false}
                radius={false}
                src={"food2"}
              />
            }
            endadornment={
              translate("kc")
            }
          />
        </Grid>
        <Grid size={6}>
          <Input
            readOnly={true}
            label={translate("totalCarb")}
            value={insertComma(OBJECT?.food_total_carb || "0")}
            startadornment={
              <Img
                max={15}
                hover={true}
                shadow={false}
                radius={false}
                src={"food3"}
              />
            }
            endadornment={
              translate("g")
            }
          />
        </Grid>
        <Grid size={6}>
          <Input
            readOnly={true}
            label={translate("totalProtein")}
            value={insertComma(OBJECT?.food_total_protein || "0")}
            startadornment={
              <Img
                max={15}
                hover={true}
                shadow={false}
                radius={false}
                src={"food4"}
              />
            }
            endadornment={
              translate("g")
            }
          />
        </Grid>
        <Grid size={6}>
          <Input
            readOnly={true}
            label={translate("totalFat")}
            value={insertComma(OBJECT?.food_total_fat || "0")}
            startadornment={
              <Img
                max={15}
                hover={true}
                shadow={false}
                radius={false}
                src={"food5"}
              />
            }
            endadornment={
              translate("g")
            }
          />
        </Grid>
      </Grid>
    );
    // 7-3. card
    const detailSection = () => {
      const detailFragment = (item: any, i: number) => (
        <Grid container spacing={2} columns={12}
        className={`${LOCKED === "locked" ? "locked" : ""} border-1 radius-1 p-20`}>
          <Grid size={6} className={"d-row-left"}>
            <Bg
              badgeContent={i + 1}
              bgcolor={bgColors?.[item?.food_part_idx]}
            />
            <Div className={"mt-n10 ms-15"}>
              <Icons
                key={"Star"}
                name={"Star"}
                className={"w-20 h-20"}
                color={"darkslategrey"}
                fill={
                  FAVORITE.length > 0 && FAVORITE.some((item: any) => (
                    item.food_key === handleFoodFavorite(i).food_key
                  )) ? "gold" : "white"
                }
                onClick={(e: any) => {
                  e.stopPropagation();
                  flowUpdateFavorite(handleFoodFavorite(i));
                }}
              />
            </Div>
          </Grid>
          <Grid size={6} className={"d-row-right"}>
            <Delete
              index={i}
              handleDelete={handleDelete}
              LOCKED={LOCKED}
            />
          </Grid>
          <Grid size={6}>
            <Select
              locked={LOCKED}
              label={translate("part")}
              value={item?.food_part_idx || 0}
              inputRef={REFS?.[i]?.food_part_idx}
              error={ERRORS?.[i]?.food_part_idx}
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? 0 : Number(e.target.value);
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_part_idx: value,
                      food_part_val: foodArray[value]?.food_part,
                    } : section
                  ))
                }));
              }}
            >
              {foodArray?.map((part: any, idx: number) => (
                <MenuItem
                  key={idx}
                  value={idx}
                  className={"fs-0-8rem"}
                >
                  {translate(part.food_part)}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid size={3}>
            <Input
              locked={LOCKED}
              label={translate("foodCount")}
              value={insertComma(item?.food_count || "0")}
              inputRef={REFS?.[i]?.food_count}
              error={ERRORS?.[i]?.food_count}
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 99 제한 + 소수점 첫째 자리
                if (Number(value) > 99 || !/^\d*\.?\d{0,1}$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // 영양소 설정 함수
                const setNutrient = (nut: string | number, extra: string) => {
                  const numericValue = Number(value) || 1;
                  const foodCount = Number(item?.food_count) || 1;
                  if (!isNaN(numericValue) && !isNaN(foodCount)) {
                    return (
                      extra === "kcal"
                      ? (numericValue * Number(nut) / foodCount).toFixed(0)
                      : (numericValue * Number(nut) / foodCount).toFixed(1)
                    );
                  }
                  return nut;
                };
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_count: value,
                      food_kcal: setNutrient(item?.food_kcal, "kcal"),
                      food_fat: setNutrient(item?.food_fat, "fat"),
                      food_carb: setNutrient(item?.food_carb, "carb"),
                      food_protein: setNutrient(item?.food_protein, "protein"),
                    } : section
                  ))
                }));
              }}
            />
          </Grid>
          <Grid size={3}>
            <Input
              locked={LOCKED}
              label={translate("gram")}
              value={insertComma(item?.food_gram || "0")}
              inputRef={REFS?.[i]?.food_gram}
              error={ERRORS?.[i]?.food_gram}
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 999 제한 + 정수
                if (Number(value) > 999 || !/^\d+$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_gram: value,
                    } : section
                  ))
                }));
              }}
            />
          </Grid>
          <Grid size={6}>
            <Input
              locked={LOCKED}
              shrink={"shrink"}
              label={translate("foodName")}
              value={item?.food_name || ""}
              inputRef={REFS?.[i]?.food_name}
              error={ERRORS?.[i]?.food_name}
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "" : e.target.value;
                // 30 제한
                if (value.length > 30) {
                  return;
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_name: value,
                    } : section
                  ))
                }));
              }}
            />
          </Grid>
          <Grid size={6}>
            <Input
              locked={LOCKED}
              shrink={"shrink"}
              label={translate("brand")}
              value={item?.food_brand || ""}
              inputRef={REFS?.[i]?.food_brand}
              error={ERRORS?.[i]?.food_brand}
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "" : e.target.value;
                // 30 제한
                if (value.length > 30) {
                  return;
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_brand: value,
                    } : section
                  ))
                }));
              }}
            />
          </Grid>
          <Grid size={6}>
            <Input
              locked={LOCKED}
              label={translate("kcal")}
              value={insertComma(item?.food_kcal || "0")}
              inputRef={REFS?.[i]?.food_kcal}
              error={ERRORS?.[i]?.food_kcal}
              startadornment={
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"food2"}
                />
              }
              endadornment={
                translate("kc")
              }
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 9999 제한 + 정수
                if (Number(value) > 9999 || !/^\d+$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_kcal: value,
                    } : section
                  ))
                }));
              }}
            />
          </Grid>
          <Grid size={6}>
            <Input
              locked={LOCKED}
              label={translate("carb")}
              value={insertComma(item?.food_carb || "0")}
              inputRef={REFS?.[i]?.food_carb}
              error={ERRORS?.[i]?.food_carb}
              startadornment={
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"food3"}
                />
              }
              endadornment={
                translate("g")
              }
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 999 제한 + 소수점 첫째 자리
                if (Number(value) > 999 || !/^\d*\.?\d{0,1}$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_carb: value,
                    } : section
                  ))
                }));
              }}
            />
          </Grid>
          <Grid size={6}>
            <Input
              locked={LOCKED}
              label={translate("protein")}
              value={insertComma(item?.food_protein || "0")}
              inputRef={REFS?.[i]?.food_protein}
              error={ERRORS?.[i]?.food_protein}
              startadornment={
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"food4"}
                />
              }
              endadornment={
                translate("g")
              }
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 999 제한 + 소수점 첫째 자리
                if (Number(value) > 999 || !/^\d*\.?\d{0,1}$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_protein: value,
                    } : section
                  ))
                }));
              }}
            />
          </Grid>
          <Grid size={6}>
            <Input
              locked={LOCKED}
              label={translate("fat")}
              value={insertComma(item?.food_fat || "0")}
              inputRef={REFS?.[i]?.food_fat}
              error={ERRORS?.[i]?.food_fat}
              startadornment={
                <Img
                  max={15}
                  hover={true}
                  shadow={false}
                  radius={false}
                  src={"food5"}
                />
              }
              endadornment={
                translate("g")
              }
              onChange={(e: any) => {
                // 빈값 처리
                let value = e.target.value === "" ? "0" : e.target.value.replace(/,/g, '');
                // 999 제한 + 소수점 첫째 자리
                if (Number(value) > 999 || !/^\d*\.?\d{0,1}$/.test(value)) {
                  return;
                }
                // 01, 05 같은 숫자는 1, 5로 변경
                if (/^0(?!\.)/.test(value)) {
                  value = value.replace(/^0+/, '');
                }
                // object 설정
                setOBJECT((prev: any) => ({
                  ...prev,
                  food_section: prev.food_section?.map((section: any, idx: number) => (
                    idx === i ? {
                      ...section,
                      food_fat: value,
                    } : section
                  ))
                }));
              }}
            />
          </Grid>
        </Grid>
      );
      return (
        <Grid container spacing={0} columns={12}>
          {OBJECT?.food_section?.map((item: any, i: number) => (
            <Grid size={12} key={`detail-${i}`}>
              {COUNT?.newSectionCnt > 0 && detailFragment(item, i)}
            </Grid>
          ))}
        </Grid>
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min75vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {dateCountSection()}
            {totalSection()}
            {LOADING ? <Loading /> : detailSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 8. dialog -------------------------------------------------------------------------------------
  const dialogNode = () => (
    <Dialog
      COUNT={COUNT}
      setCOUNT={setCOUNT}
      LOCKED={LOCKED}
      setLOCKED={setLOCKED}
    />
  );

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
      {dialogNode()}
      {footerNode()}
    </>
  );
};