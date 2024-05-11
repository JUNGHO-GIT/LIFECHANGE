// FoodSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts.jsx";
import {Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents.jsx";
import {Paper, Typography} from "../../import/ImportMuis.jsx";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell, TableFooter} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "";
  const foodArray = JSON.parse(session)?.food || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toList:"/food/list",
    toSave:"/food/save",
    toSearch:"/food/search",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    food_number: 0,
    food_demo: false,
    food_startDt: "0000-00-00",
    food_endDt: "0000-00-00",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "아침",
      food_title: "",
      food_count: 0,
      food_serv: "회",
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  };
  const [OBJECT_BEFORE, setOBJECT_BEFORE] = useState(OBJECT_DEF);
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {

    // 스토리지 데이터 가져오기
    const getItem = sessionStorage.getItem("food_section");
    let storageSection = getItem ? JSON.parse(getItem) : null;

    // 상세 데이터 가져오기
    setLOADING(true);
    const fetchDetail = async () => {
      const res = await axios.get(`${URL_OBJECT}/detail`, {
        params: {
          _id: "",
          user_id: user_id,
          duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });

      // 결과 있는경우 OBJECT 상태 업데이트
      if (res.data.result !== null && !storageSection) {
        setOBJECT((prev) => ({
          ...prev,
          ...res.data.result,
        }));
      }

      // 결과가 null or !null 이면서 스토리지 데이터가 있는 경우, OBJECT 상태 업데이트
      else if (
        (res.data.result !== null && storageSection) ||
        (res.data.result === null && storageSection)
      ) {
        if (storageSection) {
          setOBJECT((prev) => {
            let newFoodSection = [...prev.food_section];

            // 첫 번째 항목이 빈 값 객체인지 확인하고, 조건에 맞으면 제거
            if (
              newFoodSection.length > 0 &&
              Object.values(newFoodSection[0]).every((value) => (value === ""))
            ) {
              newFoodSection.shift();
            }

            // 새로운 데이터가 배열인 경우 배열, 단일 객체인 경우 단일 객체를 추가
            Array.isArray(storageSection)
            ? newFoodSection.push(...storageSection)
            : newFoodSection.push(storageSection);

            return {
              ...prev,
              food_section: newFoodSection,
            };
          })
        }
      }

      // 결과가 null 일 경우, OBJECT 상태를 명시적으로 초기화
      else {
        setOBJECT(OBJECT_DEF);
      }

      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0
      }));
    };
    fetchDetail();
    setLOADING(false);
  }, [user_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 초기 영양소 값 설정
    setOBJECT_BEFORE((prev) => ({
      ...prev,
      food_section: [...OBJECT?.food_section],
    }));
  }, [OBJECT]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const totals = OBJECT?.food_section?.reduce((acc, current) => {
      return {
        totalKcal: acc.totalKcal + Number(current.food_kcal),
        totalFat: acc.totalFat + Number(current.food_fat),
        totalCarb: acc.totalCarb + Number(current.food_carb),
        totalProtein: acc.totalProtein + Number(current.food_protein),
      };
    }, { totalKcal: 0, totalFat: 0, totalCarb: 0, totalProtein: 0 });

    setOBJECT((prev) => ({
      ...prev,
      food_total_kcal: Number(totals.totalKcal.toFixed(1)),
      food_total_fat: Number(totals.totalFat.toFixed(1)),
      food_total_carb: Number(totals.totalCarb.toFixed(1)),
      food_total_protein: Number(totals.totalProtein.toFixed(1)),
    }));
  }, [OBJECT?.food_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleCountChange = (index, newValue) => {
    const newCountValue = Number(newValue);

    setOBJECT((prev) => {
      const newFoodSection = [...prev.food_section];
      const section = newFoodSection[index];
      const defaultSection = OBJECT_BEFORE.food_section[index];
      const ratio = newCountValue / (defaultSection.food_count || 1);

      if (defaultSection) {
        newFoodSection[index] = {
          ...section,
          food_count: newCountValue,
          food_gram: Number(((defaultSection?.food_gram) * ratio).toFixed(1)),
          food_kcal: Number(((defaultSection?.food_kcal) * ratio).toFixed(1)),
          food_carb: Number(((defaultSection?.food_carb) * ratio).toFixed(1)),
          food_protein: Number(((defaultSection?.food_protein) * ratio).toFixed(1)),
          food_fat: Number(((defaultSection?.food_fat) * ratio).toFixed(1)),
        };
      }
      return {
        ...prev,
        food_section: newFoodSection,
      };
    });
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handlerFoodDelete = (index) => {
    setOBJECT((prev) => {
      const newFoodSection = [...prev.food_section];
      newFoodSection.splice(index, 1);
      return {
        ...prev,
        food_section: newFoodSection,
      };
    });
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Typography variant={"h5"} fontWeight={500}>
        음식 Save
      </Typography>
    );
    // 7-7. table
    const tableFragment = (i) => (
      <TableContainer key={i}>
        <Table className={"border"}>
          <TableHead className={"table-thead"}>
            <TableRow className={"table-thead-tr"}>
              <TableCell width={"10%"}>파트</TableCell>
              <TableCell width={"20%"}>식품명</TableCell>
              <TableCell width={"10%"}>수량</TableCell>
              <TableCell width={"10%"}>g</TableCell>
              <TableCell width={"10%"}>Kcal</TableCell>
              <TableCell width={"10%"}>Fat</TableCell>
              <TableCell width={"10%"}>Carb</TableCell>
              <TableCell width={"10%"}>Protein</TableCell>
              <TableCell width={"10%"}>x</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={"table-tbody"}>
            {OBJECT?.food_section?.map((item, sectionIndex) => (
              <TableRow className={"table-tbody-tr"}>
                <TableCell width={"10%"}>
                  <TextField
                    select={true}
                    type={"text"}
                    size={"small"}
                    label={""}
                    id={"food_part_idx"}
                    name={"food_part_idx"}
                    variant={"outlined"}
                    value={item.food_part_idx}
                    defaultValue={0}
                    InputProps={{
                      readOnly: false
                    }}
                    onChange={(e) => {
                      const newIndex = Number(e.target.value);
                      setOBJECT((prev) => ({
                        ...prev,
                        food_section: prev.food_section.map((item, idx) => (
                          idx === sectionIndex ? {
                            ...item,
                            food_part_idx: newIndex,
                            food_part_val: foodArray[newIndex]?.food_part
                          } : item
                        ))
                      }));
                    }}
                  >
                    {foodArray?.map((item, idx) => (
                      <MenuItem key={idx} value={idx}>
                        {item.food_part}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell width={"20%"}>
                  {`${item.food_title} ${item.food_brand !== "-" ? `${item.food_brand}` : ""}`}
                </TableCell>
                <TableCell width={"10%"}>
                  <TextField
                    select={false}
                    label={""}
                    type={"text"}
                    variant={"outlined"}
                    id={"food_count"}
                    name={"food_count"}
                    size={"small"}
                    value={Math.min(99, Number(item.food_count))}
                    InputProps={{
                      readOnly: false
                    }}
                    onChange={(e) => {
                      const limitedValue = Math.min(99, parseInt(e.target.value));
                      handleCountChange(sectionIndex, limitedValue);
                    }}
                  />
                </TableCell>
                <TableCell width={"10%"}>
                  {item.food_gram}
                </TableCell>
                <TableCell width={"10%"}>
                  {item.food_kcal}
                </TableCell>
                <TableCell width={"10%"}>
                  {item.food_fat}
                </TableCell>
                <TableCell width={"10%"}>
                  {item.food_carb}
                </TableCell>
                <TableCell width={"10%"}>
                  {item.food_protein}
                </TableCell>
                <TableCell width={"10%"}>
                  <span className={"del-btn"} onClick={() => (
                    handlerFoodDelete(sectionIndex)
                  )}>
                    x
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className={"table-tfoot"}>
            <TableRow className={"table-tfoot-tr"}>
              <TableCell width={"10%"}></TableCell>
              <TableCell width={"20%"}>합계</TableCell>
              <TableCell width={"10%"}></TableCell>
              <TableCell width={"10%"}></TableCell>
              <TableCell width={"10%"}>{OBJECT?.food_total_kcal}</TableCell>
              <TableCell width={"10%"}>{OBJECT?.food_total_fat}</TableCell>
              <TableCell width={"10%"}>{OBJECT?.food_total_carb}</TableCell>
              <TableCell width={"10%"}>{OBJECT?.food_total_protein}</TableCell>
              <TableCell width={"10%"}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    );
    // 7-7. table
    // list 는 높이 지정
    const tableSection = () => (
      <Box className={"block-wrapper h-min75vh"}>
        <Box className={"d-center"}>
          {titleSection()}
        </Box>
        <Box className={"d-column"}>
          {tableFragment(0)}
        </Box>
      </Box>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"food"} plan={""} type={"save"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </>
  );
};