// MoneyPlanSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useDate, useTranslate} from "../../../import/ImportHooks.jsx";
import {moment, axios, numeral} from "../../../import/ImportLibs.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Icons, Br20, Calendar} from "../../../import/ImportComponents.jsx";
import {Card, Paper} from "../../../import/ImportMuis.jsx";
import {Badge, MenuItem} from "../../../import/ImportMuis.jsx";
import {TextField, DateCalendar} from "../../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider, PickersDay} from "../../../import/ImportMuis.jsx";
import {common1, common2, common3_1} from "../../../import/ImportImages.jsx";
import {money2, common5} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL + SUBFIX;
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
  const [isExist, setIsExist] = useState([""]);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "전체",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList:"/money/plan/list"
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
    money_plan_number: 0,
    money_plan_demo: false,
    money_plan_dateType: "",
    money_plan_dateStart: "0000-00-00",
    money_plan_dateEnd: "0000-00-00",
    money_plan_in: 0,
    money_plan_out: 0
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: DATE.dateType,
          dateStart: moment(DATE.dateStart).startOf("month").format("YYYY-MM-DD"),
          dateEnd: moment(DATE.dateEnd).endOf("month").format("YYYY-MM-DD")
        },
      },
    });
    setIsExist(res.data.result || []);
    setLOADING(false);
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
      params: {
        user_id: sessionId,
        _id: "",
        DATE: DATE,
      },
    });
    // 첫번째 객체를 제외하고 데이터 추가
    setOBJECT((prev) => {
      if (prev.length === 1 && prev[0]._id === "") {
        return res.data.result;
      }
      else {
        return {...prev, ...res.data.result};
      }
    });
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
      money_plan_in: 0,
      money_plan_out: 0
    }));
    setCOUNT((prev) => ({
      ...prev,
      newSectionCnt: prev.newSectionCnt - 1
    }));
  };


  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date (plan = 유형 o)
    const dateSection = () => (
      <Calendar
        DATE={DATE}
        setDATE={setDATE}
        isExist={isExist}
        setIsExist={setIsExist}
      />
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
      </Div>
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
          <Img src={common3_1} className={"w-24 h-24 mt-n10 me-n10 pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}/>
        )}
      </PopUp>
    );
    // 7-6. empty (detail, save = empty x)
    // 7-7. fragment
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mb-40"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, "", i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("money-planIn")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.money_plan_in).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={money2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("money-endCurrency")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(Number(rawValue), 9999999999);
              setOBJECT((prev) => ({
                ...prev,
                money_plan_in: limitedValue
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            type={"text"}
            size={"small"}
            label={translate("money-planOut")}
            variant={"outlined"}
            className={"w-86vw"}
            value={numeral(OBJECT?.money_plan_out).format("0,0")}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Img src={money2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                translate("money-endCurrency")
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
              const limitedValue = Math.min(Number(rawValue), 9999999999);
              setOBJECT((prev) => ({
                ...prev,
                money_plan_out: limitedValue
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
