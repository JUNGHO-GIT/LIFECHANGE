// FoodSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {Badge, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1, common2, common3, setting2} from "../../import/ImportImages.jsx";
import {food2, food3, food4, food5} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const session = sessionStorage.getItem("dataSet") || "{}";
  const foodArray = JSON.parse(session)?.food || [];
  const navigate = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const secondStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";

  // 2-1. useStorage ------------------------------------------------------------------------------>
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt || moment().format("YYYY-MM-DD"),
      endDt: location_endDt || moment().format("YYYY-MM-DD"),
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
    toFind:"/food/find/list",
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
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
      food_gram: 0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
      params: {
        user_id: user_id,
        _id: "",
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
      newSectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

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

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (index) => {
    setOBJECT((prev) => ({
      ...prev,
      food_section: prev.food_section.filter((_, idx) => (idx !== index))
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
            className={"w-86vw"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget);
            }}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
              ),
              endAdornment: null
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
          <Div className={"d-center"}>
            {`${COUNT.sectionCnt}개 이상 10개 이하로 입력해주세요.`}
          </Div>
        )}>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            label={"항목수"}
            variant={"outlined"}
            size={"small"}
            className={"w-86vw"}
            value={COUNT.newSectionCnt}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <img src={common2} className={"w-16 h-16 me-10"} alt={"common2"}/>
              ),
              endAdornment: (
                <Div className={"d-center me-n10"}>
                  <Icons
                    name={"TbMinus"}
                    className={"w-14 h-14 black"}
                    onClick={(e) => {
                      COUNT.newSectionCnt > COUNT.sectionCnt ? (
                        setCOUNT((prev) => ({
                          ...prev,
                          newSectionCnt: prev.newSectionCnt - 1
                        }))
                      ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    }}
                  />
                  <Icons
                    name={"TbPlus"}
                    className={"w-14 h-14 black"}
                    onClick={(e) => {
                      COUNT.newSectionCnt < 10 ? (
                        setCOUNT((prev) => ({
                          ...prev,
                          newSectionCnt: prev.newSectionCnt + 1
                        }))
                      ) : popTrigger.openPopup(e.currentTarget.closest('.MuiInputBase-root'))
                    }}
                  />
                </Div>
              )
            }}
          />
        )}
      </PopUp>
    );
    // 7-3. total
    const totalSection = () => (
      <Div className={"d-column"}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 칼로리"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_in).format('0,0.00')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={food2} className={"w-16 h-16 me-10"} alt={"food2"}/>
              ),
              endAdornment: (
                <div className={"fw-normal"}>Kcal</div>
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 탄수화물"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_carb).format('0,0.00')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={food3} className={"w-16 h-16 me-10"} alt={"food3"}/>
              ),
              endAdornment: (
                <div className={"fw-normal"}>g</div>
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 단백질"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_protein).format('0,0.00')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={food4} className={"w-16 h-16 me-10"} alt={"food4"}/>
              ),
              endAdornment: (
                <div className={"fw-normal"}>g</div>
              )
            }}
          />
        </Div>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={"총 지방"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_fat).format('0,0.00')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={food5} className={"w-16 h-16 me-10"} alt={"food5"}/>
              ),
              endAdornment: (
                <div className={"fw-normal"}>g</div>
              )
            }}
          />
        </Div>
      </Div>
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
        <Div className={"d-row"}>
          <img src={setting2} className={"w-16 h-16 icon pointer"} alt={"setting2"}
            onClick={() => {
              handlerDelete(index);
              closePopup();
            }}
          />
          <Div className={"fs-0-8rem"}>삭제</Div>
        </Div>
        )}>
        {(popTrigger={}) => (
          <img src={common3} className={"w-24 h-24 mt-n10 me-n10 pointer"} alt={"common3"}
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
            className={"w-40vw me-3vw"}
            defaultValue={1}
            value={OBJECT?.food_section[i]?.food_part_idx}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: null,
              endAdornment: null
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
            {foodArray.map((item, idx) => (
              <MenuItem key={idx} value={idx}>
                {item.food_part}
              </MenuItem>
            ))}
          </TextField>
          {(OBJECT?.food_section[i]?.food_gram === "-" ||
            OBJECT?.food_section[i]?.food_gram === "0" ||
            OBJECT?.food_section[i]?.food_gram === "00" ||
            OBJECT?.food_section[i]?.food_gram === 0
          ) ? (
            <TextField
              select={false}
              label={"회"}
              size={"small"}
              type={"text"}
              value={Math.min(OBJECT?.food_section[i]?.food_count, 9999)}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              InputProps={{
                readOnly: false,
                className: "fw-bold",
                startAdornment: null,
                endAdornment: (
                <div className={"fw-normal"}>회</div>
              )
              }}
              onChange={(e) => {
                const newCount = Number(e.target.value);
                if (isNaN(newCount) || newCount < 0) {
                  return;
                }
                else if (newCount === 0) {
                  return;
                }
                setOBJECT((prev) => ({
                  ...prev,
                  food_section: prev.food_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      food_count: newCount,
                      food_kcal: Number(((newCount * item.food_kcal) / item.food_count).toFixed(2)),
                      food_fat: Number(((newCount * item.food_fat) / item.food_count).toFixed(2)),
                      food_carb: Number(((newCount * item.food_carb) / item.food_count).toFixed(2)),
                      food_protein: Number(((newCount * item.food_protein) / item.food_count).toFixed(2)),
                    } : item
                  ))
                }));
              }}
            />
          ) : (
            <TextField
              select={false}
              label={"gram"}
              size={"small"}
              type={"text"}
              value={Math.min(OBJECT?.food_section[i]?.food_gram, 9999)}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              InputProps={{
                readOnly: false,
                className: "fw-bold",
                startAdornment: null,
                endAdornment: (
                  <div className={"fw-normal"}>g</div>
                )
              }}
              onChange={(e) => {
                const newGram = Number(e.target.value);
                if (isNaN(newGram) || newGram < 0) {
                  return;
                }
                else if (newGram === 0) {
                  return;
                }
                setOBJECT((prev) => ({
                  ...prev,
                  food_section: prev.food_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      food_gram: newGram,
                      food_kcal: Number(((newGram * item.food_kcal) / item.food_gram).toFixed(2)),
                      food_fat: Number(((newGram * item.food_fat) / item.food_gram).toFixed(2)),
                      food_carb: Number(((newGram * item.food_carb) / item.food_gram).toFixed(2)),
                      food_protein: Number(((newGram * item.food_protein) / item.food_gram).toFixed(2)),
                    } : item
                  ))
                }));
              }}
            />
          )}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"식품명"}
            size={"small"}
            value={`${OBJECT?.food_section[i]?.food_title} (${OBJECT?.food_section[i]?.food_brand || ""})`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: null,
              endAdornment: null
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"kcal"}
            size={"small"}
            value={numeral(OBJECT?.food_section[i]?.food_kcal).format('0,0')}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={food2} className={"w-16 h-16 me-10"} alt={"food2"}/>
              ),
              endAdornment: (
                <div className={"fw-normal"}>Kcal</div>
              )
            }}
          />
          <TextField
            select={false}
            label={"carb"}
            size={"small"}
            value={numeral(OBJECT?.food_section[i]?.food_carb).format('0,0')}
            variant={"outlined"}
            className={"w-40vw ms-3vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={food3} className={"w-16 h-16 me-10"} alt={"food3"}/>
              ),
              endAdornment: (
                <div className={"fw-normal"}>g</div>
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"protein"}
            size={"small"}
            value={numeral(OBJECT?.food_section[i]?.food_protein).format('0,0')}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={food4} className={"w-16 h-16 me-10"} alt={"food4"}/>
              ),
              endAdornment: (
                <div className={"fw-normal"}>g</div>
              )
            }}
          />
          <TextField
            select={false}
            label={"fat"}
            size={"small"}
            value={numeral(OBJECT?.food_section[i]?.food_fat).format('0,0')}
            variant={"outlined"}
            className={"w-40vw ms-3vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={food5} className={"w-16 h-16 me-10"} alt={"food5"}/>
              ),
              endAdornment: (
                <div className={"fw-normal"}>g</div>
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min90vw h-min67vh"}>
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
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT
      }}
      functions={{
        setDATE, setSEND, setCOUNT
      }}
      handlers={{
        navigate, flowSave
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