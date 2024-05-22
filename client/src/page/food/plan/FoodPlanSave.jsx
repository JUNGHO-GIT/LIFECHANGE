// FoodPlanSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useDate, useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, axios, numeral} from "../../../import/ImportLibs.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Icons, Br20} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem} from "../../../import/ImportMuis.jsx";
import {TextField, DateCalendar} from "../../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../../import/ImportMuis.jsx";
import {common1, common2, common3, common5} from "../../../import/ImportImages.jsx";
import {food2, food3, food4, food5} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const session = sessionStorage.getItem("dataSet") || "{}";
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateType = location?.state?.dateType?.trim()?.toString();
  const location_dateStart = location?.state?.dateStart?.trim()?.toString();
  const location_dateEnd = location?.state?.dateEnd?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/food/plan/list"
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
    food_plan_number: 0,
    food_plan_demo: false,
    food_plan_dateType: "",
    food_plan_dateStart: "0000-00-00",
    food_plan_dateEnd: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
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
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/plan/save`, {
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
    setOBJECT((prev) => ({
      ...prev,
      food_plan_kcal: 0,
      food_plan_carb: 0,
      food_plan_protein: 0,
      food_plan_fat: 0,
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Div className={"d-row"}>
        <Div className={"d-center"}>
          <TextField
            select={true}
            label={translate("common-dateType")}
            size={"small"}
            value={DATE.dateType || "day"}
            variant={"outlined"}
            className={"w-20vw me-3vw"}
            InputProps={{
              readOnly: false,
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
        </Div>
        <Div className={"d-center"}>
          <PopUp
            type={"innerCenter"}
            position={"center"}
            direction={"center"}
            contents={({closePopup}) => (
              <Div className={"d-center w-max86vw"}>
                <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
                  <DateCalendar
                    timezone={"Asia/Seoul"}
                    views={["year", "day"]}
                    readOnly={true}
                    defaultValue={moment(DATE.dateStart)}
                    className={"radius border h-max40vh me-2"}
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
                        width: "3.5vh",
                        height: "3.5vh",
                      },
                      '& .MuiPickersDay-root': {
                        fontSize: "0.7rem",
                        width: "3.5vh",
                        height: "3.5vh",
                      },
                    }}
                  />
                  <DateCalendar
                    timezone={"Asia/Seoul"}
                    views={["year", "day"]}
                    readOnly={true}
                    defaultValue={moment(DATE.dateEnd)}
                    className={"radius border h-max40vh ms-2"}
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
                        width: "3.5vh",
                        height: "3.5vh",
                      },
                      '& .MuiPickersDay-root': {
                        fontSize: "0.7rem",
                        width: "3.5vh",
                        height: "3.5vh",
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
                label={"기간"}
                variant={"outlined"}
                value={`${DATE.dateStart} ~ ${DATE.dateEnd}`}
                className={"w-63vw"}
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
      </Div>
    );
    // 7-2. count
    const countSection = () => (
      <PopUp
        type={"alert"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
          <Div className={"d-center"}>
            {`${COUNT.sectionCnt}개 이상 1개 이하로 입력해주세요.`}
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
                      COUNT.newSectionCnt < 1 ? (
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
    // 7-3. total (plan = total x)
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
          {dropdownSection(OBJECT?._id, "", 0)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planKcal")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.food_plan_kcal).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={food2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endKcal")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(99999, parseInt(rawValue, 10));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_kcal: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planCarb")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.food_plan_carb).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={food3} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(99999, parseInt(rawValue, 10));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_carb: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planProtein")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.food_plan_protein).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={food4} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(99999, parseInt(rawValue, 10));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_protein: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("food-planFat")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.food_plan_fat).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={food5} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("food-endGram")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(99999, parseInt(rawValue, 10));
              setOBJECT((prev) => ({
                ...prev,
                food_plan_fat: limitedValue
              }));
            }}
          />
        </Div>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      COUNT?.newSectionCnt > 0 && tableFragment(0)
    );
    // 7-9. first
    const firstSection = () => (
      <Card variant={"outlined"} className={"p-20"}>
        {dateSection()}
        <Br20/>
        {countSection()}
      </Card>
    );
    // 7-10. second (plan = total x)
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {firstSection()}
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
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};
