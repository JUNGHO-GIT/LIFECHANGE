// MoneySave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar, Loading, Footer} from "../../import/ImportLayouts.jsx";
import {Adornment, Icons, PopUp} from "../../import/ImportComponents.jsx";
import {Div, Hr10, Br10} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {Badge, Menu, MenuItem} from "../../import/ImportMuis.jsx";
import {TextField, Button, DateCalendar, DigitalClock} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneySave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const session = sessionStorage.getItem("dataset") || "";
  const moneyArray = JSON.parse(session)?.money || [];
  const navigate = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();
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
    toList: "/money/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    money_number: 0,
    money_demo: false,
    money_startDt: "0000-00-00",
    money_endDt: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
    money_property: 0,
    money_section: [{
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: "",
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
      sectionCnt: res.data.sectionCnt || 0
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // money_part_val 가 수입인경우, 지출인 경우
    const totals = OBJECT?.money_section.reduce((acc, cur) => {
      return {
        totalIn: acc.totalIn + (cur.money_part_val === "수입" ? cur.money_amount : 0),
        totalOut: acc.totalOut + (cur.money_part_val === "지출" ? cur.money_amount : 0)
      };
    }, {totalIn: 0, totalOut: 0});

    setOBJECT((prev) => ({
      ...prev,
      money_total_in: Math.round(totals.totalIn),
      money_total_out: Math.round(totals.totalOut)
    }));

  }, [OBJECT?.money_section]);

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
      navigate(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handlerCount = (e) => {
    const newCount = Number(e);
    const defaultSection = {
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: ""
    };
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: newCount
    }));
    if (newCount > 0) {
      let updatedSection = Array(newCount).fill(null).map((_, idx) =>
        idx < OBJECT?.money_section.length ? OBJECT?.money_section[idx] : defaultSection
      );
      setOBJECT((prev) => ({
        ...prev,
        money_section: updatedSection
      }));
    }
    else {
      setOBJECT((prev) => ({
        ...prev,
        money_section: []
      }));
    }
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handlerValidate = (e, popTrigger) => {
    const newValInt = Number(e.target.value);
    const newValStr = String(e.target.value);
    if (newValInt < 0) {
      popTrigger.openPopup(e.currentTarget);
    }
    else if (newValInt > 10) {
      popTrigger.openPopup(e.currentTarget);
    }
    else if (newValStr === "") {
      handlerCount("");
    }
    else if (isNaN(newValInt) || newValStr === "NaN") {
      handlerCount("0");
    }
    else if (newValStr.startsWith("0")) {
      handlerCount(newValStr.replace(/^0+/, ""));
    }
    else {
      handlerCount(newValStr);
    }
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerDelete = (i) =>{
    if (i > -1) {
      OBJECT.money_section.splice(i, 1);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <PopUp
        type={"calendar"}
        className={""}
        position={"bottom"}
        direction={"center"}
        contents={
          <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
            <DateCalendar
              timezone={"Asia/Seoul"}
              views={["day"]}
              className={"ms-n5"}
              readOnly={false}
              value={moment(DATE.startDt)}
              sx={{
                width: "280px",
                height: "330px"
              }}
              onChange={(date) => {
                setDATE((prev) => ({
                  ...prev,
                  startDt: moment(date).format("YYYY-MM-DD"),
                  endDt: moment(date).format("YYYY-MM-DD"),
                }));
              }}
            />
          </LocalizationProvider>
        }>
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
              <Adornment name={"TbCalendarEvent"} className={"w-16 h-16 dark"} position={"start"}/>
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
        className={""}
        position={"bottom"}
        direction={"left"}
        contents={
          <Div className={"d-center"}>
            0이상 10이하의 숫자만 입력하세요.
          </Div>
        }>
        {(popTrigger={}) => (
          <TextField
            type={"text"}
            id={"sectionCnt"}
            label={"항목수"}
            variant={"outlined"}
            size={"small"}
            className={"w-60vw"}
            value={COUNT?.sectionCnt}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"TbTextPlus"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
            onChange={(e) => {
              handlerValidate(e, popTrigger);
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
        <TextField
          select={false}
          label={"총 수입"}
          size={"small"}
          value={`${numeral(OBJECT?.money_total_in).format('0,0')}`}
          variant={"outlined"}
          className={"w-60vw mb-20"}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Adornment name={"BiWon"} className={"w-16 h-16 dark"} position={"start"}/>
            )
          }}
        />
        <TextField
          select={false}
          label={"총 지출"}
          size={"small"}
          value={`${numeral(OBJECT?.money_total_out).format('0,0')}`}
          variant={"outlined"}
          className={"w-60vw mb-20"}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Adornment name={"BiWon"} className={"w-16 h-16 dark"} position={"start"}/>
            )
          }}
        />
        <TextField
          select={false}
          label={"총 자산"}
          size={"small"}
          value={`${numeral(OBJECT?.money_property).format('0,0')}`}
          variant={"outlined"}
          className={"w-60vw mb-20"}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <Adornment name={"BiWon"} className={"w-16 h-16 dark"} position={"start"}/>
            )
          }}
        />
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
        className={""}
        position={"bottom"}
        direction={"left"}
        contents={
          <>
          <Icons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"}>
            <Div className={"fs-14"}>복사</Div>
          </Icons>
          <Icons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"}>
            <Div className={"fs-14"}>복사</Div>
          </Icons>
          </>
        }>
        {(popTrigger={}) => (
          <Icons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark mt-n10 me-n10"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-20"} key={i}>
        <Div className={"d-between mb-40"}>
          {badgeSection(i)}
          {dropdownSection(OBJECT?._id, OBJECT?.money_section[i]?._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"파트"}
            id={`money_part_val-${i}`}
            name={`money_part_val-${i}`}
            variant={"outlined"}
            className={"w-25vw me-10"}
            value={OBJECT?.money_section[i]?.money_part_idx}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              const newIndex = Number(e.target.value);
              setOBJECT((prev) => ({
                ...prev,
                money_section: prev.money_section.map((item, idx) => (
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
            {moneyArray.map((item, idx) => (
              <MenuItem key={idx} value={idx}>
                {item.money_part}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={"타이틀"}
            id={`money_title_val-${i}`}
            name={`money_title_val-${i}`}
            variant={"outlined"}
            className={"w-25vw ms-10"}
            value={OBJECT?.money_section[i]?.money_title_idx}
            InputProps={{
              readOnly: false
            }}
            onChange={(e) => {
              const newTitleIdx = Number(e.target.value);
              const newTitleVal = moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title[newTitleIdx];
              if (newTitleIdx >= 0 && newTitleVal) {
                setOBJECT((prev) => ({
                  ...prev,
                  money_section: prev.money_section.map((item, idx) => (
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
            {moneyArray[OBJECT?.money_section[i]?.money_part_idx]?.money_title?.map((title, idx) => (
              <MenuItem key={idx} value={idx}>
                {title}
              </MenuItem>
            ))}
          </TextField>
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"금액"}
            size={"small"}
            variant={"outlined"}
            id={`money_amount-${i}`}
            name={`money_amount-${i}`}
            className={"w-60vw"}
            value={`${numeral(OBJECT?.money_section[i]?.money_amount).format('0,0')}`}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"BiWon"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/,/g, "");
              const limitedValue = Math.min(Number(rawValue), 9999999999);
              setOBJECT((prev) => ({
                ...prev,
                money_section: prev.money_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    money_amount: limitedValue
                  } : item
                ))
              }));
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"메모"}
            size={"small"}
            variant={"outlined"}
            id={`money_content-${i}`}
            name={`money_content-${i}`}
            className={"w-60vw"}
            value={OBJECT?.money_section[i]?.money_content}
            InputProps={{
              readOnly: false,
              startAdornment: (
                <Adornment name={"BiEditAlt"} className={"w-16 h-16 dark"} position={"start"}/>
              )
            }}
            onChange={(e) => {
              const rawValue = e.target.value;
              const limitedContent = rawValue.slice(0, 100);
              setOBJECT((prev) => ({
                ...prev,
                money_section: prev.money_section.map((item, idx) => (
                  idx === i ? {
                    ...item,
                    money_content: limitedContent
                  } : item
                ))
              }));
            }}
          />
        </Div>
      </Card>
    );
    // 7-7. table
    const tableSection = () => (
      <Div className={"block-wrapper h-min110vh"}>
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
          {OBJECT?.money_section.map((_, i) => (tableFragment(i)))}
        </Div>
      </Div>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
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
        navigate, flowSave
      }}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {footerNode()}
    </>
  );
};
