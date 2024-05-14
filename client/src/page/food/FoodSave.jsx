// FoodSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Adorn, Icons, PopUp, Div} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {Badge, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const session = sessionStorage.getItem("dataset") || "";
  const foodArray = JSON.parse(session)?.food || [];
  const navigate = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const planStr = PATH?.split("/")[3] ? "plan" : "";

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
    toFind:"/food/find",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
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

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleCountChange = (index, newValue) => {

    console.log("index", index);
    console.log("newValue", newValue);

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

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      exercise_section: prev.exercise_section.filter((_, idx) => (idx !== index))
    }));
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: prev.sectionCnt - 1
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <PopUp
        type={"calendar"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              readOnly={false}
              value={moment(DATE.startDt)}
              sx={{
                width: "80vw",
                height: "60vh"
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).format("YYYY-MM-DD"),
                  endDt: moment(date).format("YYYY-MM-DD"),
                }));
                closePopup();
              }}
            />
          </LocalizationProvider>
        )}>
        {(popTrigger={}) => (
          <TextField
            select={false}
            label={"날짜"}
            size={"small"}
            value={DATE.startDt}
            variant={"outlined"}
            className={"w-60vw"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget);
            }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbCalendarEvent"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                null
              )
            }}
          />
        )}
      </PopUp>
    );
    // 7-2. count
    const countSection = () => (
      <PopUp
        type={"alert"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>0이상 10이하의 숫자만 입력하세요</Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            label={"항목수"}
            variant={"outlined"}
            size={"small"}
            className={"w-60vw"}
            value={COUNT?.sectionCnt}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbTextPlus"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                null
              )
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        )}
      </PopUp>
    );
    // 7-3. total
    const totalSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 칼로리"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_in).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbCalculator"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                "Kcal"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 탄수화물"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_carb).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"BiBowlRice"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                "g"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 단백질"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_protein).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbMilk"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                "g"
              )
            }}
          />
        </Div>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={"총 지방"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_fat).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbMeat"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                "g"
              )
            }}
          />
        </Div>
      </Card>
    );
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
        direction={"center"}
        contents={({closePopup}) => (
          <>
            <Icons name={"TbTrash"} className={"w-24 h-24 dark"} onClick={() => {
              handlerDelete(index);
              closePopup();
            }}>
              <Div className={"fsr-0-8"}>삭제</Div>
            </Icons>
          </>
        )}>
        {(popTrigger={}) => (
          <Icons name={"TbDots"} className={"w-24 h-24 dark mt-n10 me-n10"}
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
          {dropdownSection(OBJECT?._id, OBJECT?.food_section[i]._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"분류"}
            variant={"outlined"}
            className={"w-60vw"}
            defaultValue={0}
            value={OBJECT?.food_section[i]?.food_part_idx}
            InputProps={{
              readOnly: false,
              startAdornment: (
                null
              ),
              endAdornment: (
                null
              )
            }}
            onChange={(e) => {
              const newIndex = Number(e.target.value);
              setOBJECT((prev) => ({
                ...prev,
                food_section: prev.food_section.map((item, idx) => (
                  idx === i ? {
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
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"식품명"}
            size={"small"}
            value={`${OBJECT?.food_section[i]?.food_title}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                null
              ),
              endAdornment: (
                null
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"제공량"}
            size={"small"}
            type={"text"}
            value={OBJECT?.food_section[i]?.food_gram}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: false,
              startAdornment: (
                null
              ),
              endAdornment: (
                "g"
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              // 최대 4자리까지 입력 가능
              const limitedValue = rawValue.slice(0, 4);
              handleCountChange(i, limitedValue);
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"kcal"}
            size={"small"}
            value={`${numeral(OBJECT?.food_section[i]?.food_kcal).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbCalculator"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                "Kcal"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"carb"}
            size={"small"}
            value={`${numeral(OBJECT?.food_section[i]?.food_carb).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"BiBowlRice"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                "g"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"protein"}
            size={"small"}
            value={`${numeral(OBJECT?.food_section[i]?.food_protein).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbMilk"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                "g"
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"fat"}
            size={"small"}
            value={`${numeral(OBJECT?.food_section[i]?.food_fat).format('0,0')}`}
            variant={"outlined"}
            className={"w-60vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Adorn name={"TbMeat"} className={"w-16 h-16 dark"} position={"start"}/>
              ),
              endAdornment: (
                "g"
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min70vh"}>
        <Div className={"d-center mb-20"}>
          {dateSection()}
        </Div>
        <Div className={"d-center mb-20"}>
          {countSection()}
        </Div>
        <Div className={"d-column mb-20"}>
          {totalSection()}
        </Div>
        <Div className={"d-column"}>
          {OBJECT?.food_section.map((_, i) => (tableFragment(i)))}
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
        part: partStr,
        type: typeStr,
        plan: planStr,
      }}
      objects={{
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navigate
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