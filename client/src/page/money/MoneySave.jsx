// MoneySave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../import/ImportLibs.jsx";
import {useDate, useStorage, useTranslate} from "../../import/ImportHooks.jsx";
import {percent} from "../../import/ImportLogics";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {PopUp, Div, Icons} from "../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem, Button} from "../../import/ImportMuis.jsx";
import {TextField, TextArea, DateCalendar} from "../../import/ImportMuis.jsx";
import {AdapterMoment, LocalizationProvider} from "../../import/ImportMuis.jsx";
import {common1, common2, common3, money2, money3, common5} from "../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneySave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const session = sessionStorage.getItem("dataSet") || "{}";
  const moneyArray = JSON.parse(session)?.money || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart?.trim()?.toString();
  const location_dateEnd = location?.state?.dateEnd?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "전체",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toList: "/money/list"
  });
  const [COUNT, setCOUNT] = useState({
    totalCnt: 0,
    sectionCnt: 0,
    newSectionCnt: 0
  });
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: location_dateStart,
    dateEnd: location_dateEnd
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    _id: "",
    money_number: 0,
    money_demo: false,
    money_dateType: "",
    money_dateStart: "0000-00-00",
    money_dateEnd: "0000-00-00",
    money_total_in: 0,
    money_total_out: 0,
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
  useDate(location_dateStart, location_dateEnd, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/detail`, {
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

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const totals = OBJECT?.money_section.reduce((acc, cur) => {
      return {
        // money_part_val 가 수입인경우
        totalIn: acc.totalIn + (cur.money_part_val === "수입" ? cur.money_amount : 0),

        // money_part_val 가 지출인경우
        totalOut: acc.totalOut + (cur.money_part_val === "지출" ? cur.money_amount : 0)
      };
    }, {totalIn: 0, totalOut: 0});

    setOBJECT((prev) => ({
      ...prev,
      money_total_in: Math.round(totals.totalIn),
      money_total_out: Math.round(totals.totalOut)
    }));

  }, [OBJECT?.money_section]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const defaultSection = {
      money_part_idx: 0,
      money_part_val: "전체",
      money_title_idx: 0,
      money_title_val: "전체",
      money_amount: 0,
      money_content: ""
    };
    let updatedSection = Array(COUNT?.newSectionCnt).fill(null).map((_, idx) =>
      idx < OBJECT?.money_section.length ? OBJECT?.money_section[idx] : defaultSection
    );
    setOBJECT((prev) => ({
      ...prev,
      money_section: updatedSection
    }));

  },[COUNT?.newSectionCnt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
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
      money_section: prev.money_section.filter((_, idx) => (idx !== index))
    }));
    setCOUNT((prev) => ({
      ...prev,
      sectionCnt: prev.sectionCnt - 1,
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
              readOnly: true,
              className: "fw-bold",
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
                className={"w-63vw"}
                InputProps={{
                  readOnly: true,
                  className: "fw-bold",
                  startAdornment: (
                    <img src={common1} className={"w-16 h-16 me-10"} alt={"common1"} />
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
              className: "fw-bold",
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
            label={translate("money-totalIn")}
            size={"small"}
            value={`${numeral(OBJECT?.money_total_in).format('0,0')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>{translate("money-endCurrency")}</Div>
              )
            }}
          />
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={false}
            label={translate("money-totalOut")}
            size={"small"}
            value={`${numeral(OBJECT?.money_total_out).format('0,0')}`}
            variant={"outlined"}
            className={"w-86vw"}
            InputProps={{
              readOnly: true,
              className: "fw-bold",
              startAdornment: (
                <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>{translate("money-endCurrency")}</Div>
              )
            }}
          />
        </Div>
      </Div>
    );
    // 7-3. total (x)
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
            <img src={common5} className={"w-16 h-16 icon pointer"} alt={"common5"}
              onClick={() => {
                handlerDelete(index);
                closePopup();
              }}
            />
            <Div className={"fs-0-8rem"}>{translate("common-delete")}</Div>
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
          {dropdownSection(OBJECT?._id, OBJECT?.money_section[i]?._id, i)}
        </Div>
        <Div className={"d-center mb-20"}>
          <TextField
            select={true}
            type={"text"}
            size={"small"}
            label={translate("money-part")}
            variant={"outlined"}
            className={"w-40vw me-3vw"}
            value={OBJECT?.money_section[i]?.money_part_idx}
            InputProps={{
              readOnly: false,
              startAdornment: null,
              endAdornment: null
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
            label={translate("money-title")}
            variant={"outlined"}
            className={"w-40vw ms-3vw"}
            value={OBJECT?.money_section[i]?.money_title_idx}
            InputProps={{
              readOnly: false,
              startAdornment: null,
              endAdornment: null
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
            label={translate("money-amount")}
            size={"small"}
            variant={"outlined"}
            className={"w-86vw"}
            value={`${numeral(OBJECT?.money_section[i]?.money_amount).format('0,0')}`}
            InputProps={{
              readOnly: false,
              className: "fw-bold",
              startAdornment: (
                <img src={money2} className={"w-16 h-16 me-10"} alt={"money2"}/>
              ),
              endAdornment: (
                <Div className={"fw-normal"}>{translate("money-endCurrency")}</Div>
              )
            }}
            onChange={(e) => {
              const regex = /,/g;
              const match = e.target.value.match(regex);
              const rawValue = match ? e.target.value.replace(regex, "") : e.target.value;
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
          <PopUp
            key={i}
            type={"innerCenter"}
            position={"top"}
            direction={"center"}
            contents={({closePopup}) => (
            <Div className={"d-column"}>
              <Div className={"d-center mb-20"}>
                <TextArea
                  readOnly={false}
                  className={"w-70vw h-55vh border p-10"}
                  value={OBJECT?.money_section[i]?.money_content}
                  onChange={(e) => {
                    setOBJECT((prev) => ({
                      ...prev,
                      money_section: prev.money_section.map((item, idx) => (
                        idx === i ? {
                          ...item,
                          money_content: e.target.value
                        } : item
                      ))
                    }));
                  }}
                />
              </Div>
              <Div className={"d-center"}>
                <Button size={"small"} type={"button"} color={"primary"} variant={"contained"}
                  className={"primary-btn me-5"} onClick={() => {
                    closePopup();
                  }}>
                  저장
                </Button>
              </Div>
            </Div>
            )}>
            {(popTrigger={}) => (
              <TextField
                select={false}
                label={translate("money-content")}
                size={"small"}
                variant={"outlined"}
                className={"w-86vw pointer"}
                value={OBJECT?.money_section[i]?.money_content}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <img src={money3} className={"w-16 h-16 me-10"} alt={"money3"}/>
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
          {COUNT?.newSectionCnt > 0 && (OBJECT?.money_section.map((_, i) => (tableFragment(i))))}
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
