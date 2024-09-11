// FoodDetail.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { Food } from "@imports/ImportSchemas";
import { axios, numeral } from "@imports/ImportLibs";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Input, Select, Img, Bg } from "@imports/ImportComponents";
import { Picker, Count, Delete } from "@imports/ImportContainers";
import { Card, Paper, MenuItem,  Grid } from "@imports/ImportMuis";
import { food2, food3, food4, food5 } from "@imports/ImportImages";

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
    navigate, location_dateType, location_dateStart, location_dateEnd, URL_OBJECT, sessionId, foodArray, toSave
  } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);
  const [EXIST, setEXIST] = useState<any[]>([""]);
  const [OBJECT, setOBJECT] = useState<any>(Food);
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
    initDateType: location_dateType || "",
    initDateStart: location_dateStart || dayFmt,
    initDateEnd: location_dateEnd || dayFmt,
    dateType: location_dateType || "",
    dateStart: location_dateStart || dayFmt,
    dateEnd: location_dateEnd || dayFmt,
  });

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
      setEXIST(res.data.result.length > 0 ? res.data.result : [""]);
    })
    .catch((err: any) => {
      console.error(err);
    });
  }, [sessionId, DATE.dateEnd]);

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

      // 카운트 설정
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
  }, [sessionId, DATE.dateEnd]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowNew = () => {
    // 페이지 이동
    Object.assign(SEND, {
      dateType: "day",
      dateStart: dayFmt,
      dateEnd: dayFmt
    });
    navigate(toSave, {
      state: SEND
    });
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
                	src={food2}
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
                	src={food3}
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
                	src={food4}
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
                	src={food5}
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
    const cardSection = () => {
      const cardFragment = (i: number) => (
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
                readonly={true}
              />
            </Grid>
            <Grid size={6}>
              <Select
                label={translate("part")}
                value={OBJECT?.food_section[i]?.food_part_idx}
                readOnly={true}
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
                readOnly={true}
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
                readOnly={true}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("foodName")}
                value={OBJECT?.food_section[i]?.food_name}
                readOnly={true}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("brand")}
                value={OBJECT?.food_section[i]?.food_brand}
                readOnly={true}
              />
            </Grid>
            <Grid size={6}>
              <Input
                label={translate("kcal")}
                value={numeral(OBJECT?.food_section[i]?.food_kcal).format("0,0")}
                readOnly={true}
                startadornment={
                  <Img
                  	src={food2}
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
                label={translate("carb")}
                value={numeral(OBJECT?.food_section[i]?.food_carb).format("0,0")}
                readOnly={true}
                startadornment={
                  <Img
                  	src={food3}
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
                label={translate("protein")}
                value={numeral(OBJECT?.food_section[i]?.food_protein).format("0,0")}
                readOnly={true}
                startadornment={
                  <Img
                  	src={food4}
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
                label={translate("fat")}
                value={numeral(OBJECT?.food_section[i]?.food_fat).format("0,0")}
                readOnly={true}
                startadornment={
                  <Img
                  	src={food5}
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
      return (
        COUNT?.newSectionCnt > 0 && (
          LOADING ? <Loading /> : OBJECT?.food_section?.map((item: any, i: number) => (
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
        flowNew
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