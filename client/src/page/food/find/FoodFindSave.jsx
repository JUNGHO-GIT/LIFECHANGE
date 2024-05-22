// FoodFindSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../../import/ImportLibs.jsx";
import {useDate, useTranslate} from "../../../import/ImportHooks.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Icons, Br20} from "../../../import/ImportComponents.jsx";
import {Card, Paper} from "../../../import/ImportMuis.jsx";
import {Badge, MenuItem} from "../../../import/ImportMuis.jsx";
import {TextField, DateCalendar} from "../../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../../import/ImportMuis.jsx";
import {common1, common2, common3, common5} from "../../../import/ImportImages.jsx";
import {food2, food3, food4, food5} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodFindSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataSet") || "{}";
  const foodArray = JSON.parse(session)?.food || [];
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

  // 2-2. useState -------------------------------------------------------------------------------->
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/food/list",
    toFind:"/food/find/list",
    toSave:"/food/find/save",
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

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    food_number: 0,
    food_demo: false,
    food_dateType: "",
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_total_fat: 0,
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
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(DATE, setDATE);

  // 2-3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {
    // 스토리지 데이터 가져오기
    let sectionArray = [];
    let section = sessionStorage.getItem("foodSection");

    // sectionArray 초기화
    if (section) {
      sectionArray = JSON.parse(section);
    }
    else {
      sectionArray = [];
    }

    // OBJECT 설정
    setOBJECT((prev) => ({
      ...prev,
      food_section: sectionArray,
    }));
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: sectionArray.length,
      newSectionCnt: sectionArray.length,
    }));

    setLOADING(false);

  }, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const totals = OBJECT?.food_section?.reduce((acc, current) => {
      return {
        totalKcal: acc.totalKcal + Number(current.food_kcal),
        totalFat: acc.totalFat + Number(current.food_fat),
        totalCarb: acc.totalCarb + Number(current.food_carb),
        totalProtein: acc.totalProtein + Number(current.food_protein),
      };
    }, {
      totalKcal: 0,
      totalFat: 0,
      totalCarb: 0,
      totalProtein: 0
    });

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
    const res = await axios.post(`${URL_OBJECT}/find/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
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
      alert(res.data.msg);
    }
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (index) => {
    // 스토리지 데이터 가져오기
    let sectionArray = [];
    let section = sessionStorage.getItem("foodSection");

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
    sessionStorage.setItem("foodSection", JSON.stringify(sectionArray));

    // OBJECT 설정
    setOBJECT((prev) => ({
      ...prev,
      food_section: prev.food_section.filter((_, idx) => (idx !== index))
    }));

    // COUNT 설정
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: prev.sectionCnt - 1
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Div className={"d-center"}>
        <TextField
          select={true}
          label={translate("common-dateType")}
          size={"small"}
          value={DATE.dateType || "day"}
          variant={"outlined"}
          className={"w-23vw me-3vw"}
          InputProps={{
            readOnly: true,
            startAdornment: null,
            endAdornment: null
          }}
          onChange={(e) => {
            setDATE((prev) => ({
              ...prev,
              dateType: e.target.value
            }));
          }}>
          {["전체", "day", "week", "month", "year"].map((item) => (
            <MenuItem key={item} value={item} selected={item === DATE.dateType}>
              {item}
            </MenuItem>
          ))}
        </TextField>
        <PopUp
          type={"innerCenter"}
          position={"center"}
          direction={"center"}
          contents={({closePopup}) => (
            <Div className={"d-center w-max70vw"}>
              <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                <DateCalendar
                  timezone={"Asia/Seoul"}
                  views={["year", "day"]}
                  readOnly={false}
                  defaultValue={moment(DATE.dateStart)}
                  className={"radius border h-max50vh"}
                  onChange={(date) => {
                    setDATE((prev) => ({
                      ...prev,
                      dateStart: moment(date).format("YYYY-MM-DD"),
                      dateEnd: moment(date).format("YYYY-MM-DD")
                    }));
                  }}
                  sx={{
                    "& .MuiDateCalendar-root": {
                      width: "100%",
                      height: "100%",
                    },
                    "& .MuiYearCalendar-root": {
                      width: "100%",
                      height: "100%",
                    },
                    "& .MuiDayCalendar-slideTransition": {
                      minHeight: "0px",
                    },
                    "& .MuiDayCalendar-weekDayLabel": {
                      fontSize: "0.7rem",
                      width: "5vh",
                      height: "5vh",
                    },
                    '& .MuiPickersDay-root': {
                      fontSize: "0.7rem",
                      width: "5vh",
                      height: "5vh",
                    },
                  }}
                />
              </LocalizationProvider>
            </Div>
          )}>
          {(popTrigger={}) => (
            <TextField
              type={"text"}
              size={"small"}
              label={"날짜"}
              variant={"outlined"}
              value={`${DATE.dateStart}`}
              className={"w-60vw"}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Img src={common1} className={"w-16 h-16"} />
                ),
                endAdornment: null
              }}
              onClick={(e) => {
                popTrigger.openPopup(e.currentTarget);
              }}
            />
          )}
        </PopUp>
      </Div>
    );
    // 7-2. count
    const countSection = () => (
      <Div className={"d-center"}>
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
              label={translate("common-count")}
              variant={"outlined"}
              size={"small"}
              className={"w-86vw"}
              value={COUNT.newSectionCnt}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <Img src={common2} className={"w-16 h-16"} />
                ),
                endAdornment: (
                  <Div className={"d-center me-n10"}>
                    <Icons
                      name={"TbMinus"}
                      className={"w-20 h-20 black"}
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
                      className={"w-20 h-20 black"}
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
      </Div>
    );
    // 7-3. total
    const totalSection = () => (
      <Div className={"d-column"}>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={translate("food-totalKcal")}
            size={"small"}
            value={numeral(OBJECT?.food_total_kcal).format('0,0.00')}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endKcal")
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={translate("food-totalCarb")}
            size={"small"}
            value={numeral(OBJECT?.food_total_carb).format('0,0.00')}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food3} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={translate("food-totalProtein")}
            size={"small"}
            value={numeral(OBJECT?.food_total_protein).format('0,0.00')}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food4} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
          />
        </Div>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("food-totalFat")}
            size={"small"}
            value={numeral(OBJECT?.food_total_fat).format('0,0.00')}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food5} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
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
          <Div className={"d-center"}>
            <Img src={common5} className={"w-16 h-16 pointer"}
              onClick={() => {
                handlerDelete(index);
                closePopup();
              }}
            />
            {translate("common-delete")}
          </Div>
        )}>
        {(popTrigger={}) => (
          <Img src={common3} className={"w-24 h-24 mt-n10 me-n10 pointer"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6. empty (detail, save = empty x)
    // 7-7. fragment
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
            label={translate("food-part")}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            defaultValue={1}
            value={OBJECT?.food_section[i]?.food_part_idx}
            InputProps={{
              readOnly: false,
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
          {(OBJECT?.food_section[i]?.food_gram === 0) ? (
            <TextField
              select={false}
              label={translate("food-count")}
              size={"small"}
              type={"text"}
              value={Math.min(OBJECT?.food_section[i]?.food_count, 9999)}
              variant={"outlined"}
              className={"w-40vw ms-3vw"}
              InputProps={{
                readOnly: false,
                startAdornment: null,
                endAdornment: (
                  translate("food-endCount")
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
                startAdornment: null,
                endAdornment: (
                  translate("food-endGram")
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
            label={translate("food-title")}
            size={"small"}
            value={`${OBJECT?.food_section[i]?.food_title} (${OBJECT?.food_section[i]?.food_brand || ""})`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              startAdornment: null,
              endAdornment: null
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={translate("food-kcal")}
            size={"small"}
            value={numeral(OBJECT?.food_section[i]?.food_kcal).format('0,0.00')}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endKcal")
              )
            }}
          />
          <TextField
            select={false}
            label={translate("food-carb")}
            size={"small"}
            value={numeral(OBJECT?.food_section[i]?.food_carb).format('0,0.00')}
            variant={"outlined"}
            className={"w-40vw ms-3vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food3} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={translate("food-protein")}
            size={"small"}
            value={numeral(OBJECT?.food_section[i]?.food_protein).format('0,0.00')}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food4} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
          />
          <TextField
            select={false}
            label={translate("food-fat")}
            size={"small"}
            value={numeral(OBJECT?.food_section[i]?.food_fat).format('0,0.00')}
            variant={"outlined"}
            className={"w-40vw ms-3vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food5} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
          />
        </Div>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      COUNT?.newSectionCnt > 0 && (OBJECT?.food_section.map((_, i) => (tableFragment(i))))
    );
    // 7-9. first
    const firstSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        {dateSection()}
        <Br20/>
        {countSection()}
      </Card>
    );
    // 7-10. second
    const secondSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        {totalSection()}
      </Card>
    );
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {firstSection()}
          {secondSection()}
          {thirdSection()}
        </Div>
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
      {tableNode()}
      {footerNode()}
    </>
  );
};