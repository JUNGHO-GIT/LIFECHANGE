// MoneySave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {moment, axios, numeral, InputMask, NumericFormat} from "../../import/ImportLibs";
import {useDate, useStorage} from "../../import/ImportHooks";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Btn, DaySave, Loading} from "../../import/ImportComponents";
import {CustomIcons} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, InputAdornment} from "../../import/ImportMuis";
import {IconButton, Button, Divider} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis";
import {Popover, bindPopover} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const MoneySave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "";
  const moneyArray = JSON.parse(session)?.money || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
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
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false,
  });

  // 2-2. useState -------------------------------------------------------------------------------->
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );

  // 2-3. useState -------------------------------------------------------------------------------->
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

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2.3 useEffect -------------------------------------------------------------------------------->
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
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(res.data.msg);
    }
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          재무 Save
        </Typography>
      </React.Fragment>
    );
    const dateSection = () => (
      <React.Fragment>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={"ko"}>
          <DesktopDatePicker
            label={"날짜"}
            value={moment(DATE.startDt, "YYYY-MM-DD")}
            format={"YYYY-MM-DD"}
            timezone={"Asia/Seoul"}
            onChange={(day) => {
              setDATE((prev) => ({
                ...prev,
                startDt: moment(day).format("YYYY-MM-DD"),
                endDt: moment(day).format("YYYY-MM-DD")
              }));
            }}
          ></DesktopDatePicker>
        </LocalizationProvider>
      </React.Fragment>
    );
    const adornment1 = () => (
      <InputAdornment position={"start"}><CustomIcons name={"BiListPlus"} className={"w-16 h-16 dark"} /></InputAdornment>
    );
    const adornment2 = () => (
      <InputAdornment position={"start"}><CustomIcons name={"BiWon"} className={"w-14 h-14 dark"} /></InputAdornment>
    );
    const countSection = () => {
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
          let updatedSection = Array(newCount).fill(null).map((_, idx) => (
            idx < OBJECT.money_section.length ? OBJECT.money_section[idx] : defaultSection
          ));
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
      return (
        <React.Fragment>
          <PopupState  variant={"popover"} popupId={"popupState"}>
            {(popupState) => (
              <Box>
                <TextField
                  type={"text"}
                  id={"sectionCnt"}
                  label={"항목수"}
                  variant={"outlined"}
                  size={"small"}
                  value={COUNT?.sectionCnt}
                  InputProps={{
                    readOnly: true,
                    startAdornment: adornment1()
                  }}
                  onChange={(e) => {
                    const newValInt = Number(e.target.value);
                    const newValStr = String(e.target.value);
                    if (newValInt < 0) {
                      popupState.open(e.currentTarget);
                      return;
                    }
                    else if (newValInt > 10) {
                      popupState.open(e.currentTarget);
                      return;
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
                      popupState.close();
                      handlerCount(newValStr);
                    }
                  }}
                  {...bindTrigger(popupState)}
                />
                <Popover
                  {...bindPopover(popupState)}
                  id={"popover"}
                  open={popupState.isOpen}
                  onClose={popupState.close}
                  anchorEl={popupState.anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  slotProps={{
                    paper: {
                      style: {
                        border: '2px solid red',
                        boxShadow: '0px 0px 10px rgba(255, 0, 0, 0.5)',
                        maxWidth: '210px',
                      }
                    }
                  }}
                >
                  <Box p={2}>
                    <Typography variant={"body1"}>0이상 10이하의 숫자만 입력하세요.</Typography>
                  </Box>
                </Popover>
              </Box>
            )}
          </PopupState>
        </React.Fragment>
      );
    };
    const totalSection = () => (
      <React.Fragment>
        <Box sx={{display: "grid", placeItems: "center"}}>
          <TextField
            label={"총 수입"}
            size={"small"}
            value={`${numeral(OBJECT.money_total_in).format('0,0')}`}
            variant={"outlined"}
            className={"mt-6 mb-6"}
            InputProps={{
              readOnly: true,
              startAdornment: adornment2()
            }}
          ></TextField>
          <TextField
            label={"총 지출"}
            size={"small"}
            value={`${numeral(OBJECT.money_total_out).format('0,0')}`}
            variant={"outlined"}
            className={"mt-6 mb-6"}
            InputProps={{
              readOnly: true,
              startAdornment: adornment2()
            }}
          ></TextField>
          <TextField
            label={"총 자산"}
            size={"small"}
            value={`${numeral(OBJECT.money_property).format('0,0')}`}
            variant={"outlined"}
            className={"mt-6 mb-6"}
            InputProps={{
              readOnly: true,
              startAdornment: adornment2()
            }}
          ></TextField>
        </Box>
      </React.Fragment>
    );
    const tableFragment = (i) => (
      <React.Fragment key={i}>
        <Card variant={"outlined"} className={"p-20"}>
          <Box className={"input-group"}>
            <span className={"input-group-text"}>파트</span>
            <select
              id={`money_part_idx-${i}`}
              name={`money_part_idx-${i}`}
              className={"form-select"}
              value={OBJECT?.money_section[i]?.money_part_idx}
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
              {moneyArray?.map((item, idx) => (
                <option key={idx} value={idx}>
                  {item.money_part}
                </option>
              ))}
            </select>
          </Box>
          <Box className={"input-group"}>
            <span className={"input-group-text"}>제목</span>
            <select
              id={`money_title_idx-${i}`}
              name={`money_title_idx-${i}`}
              className={"form-select"}
              value={OBJECT?.money_section[i]?.money_title_idx}
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
                <option key={idx} value={idx}>
                  {title}
                </option>
              ))}
            </select>
          </Box>
          <Box className={"input-group"}>
            <span className={"input-group-text"}>금액</span>
            <NumericFormat
              min={0}
              max={9999999999}
              minLength={1}
              maxLength={14}
              prefix={"₩  "}
              datatype={"number"}
              displayType={"input"}
              id={`money_amount-${i}`}
              name={`money_amount-${i}`}
              className={`form-control ${OBJECT?.money_section[i]?.money_part_val === "수입" ? "text-primary" : "text-danger"}`}
              disabled={false}
              allowNegative={false}
              thousandSeparator={true}
              fixedDecimalScale={true}
              value={OBJECT?.money_section[i]?.money_amount}
              onValueChange={(values) => {
                const limitedValue = Math.min(9999999999, parseInt(values?.value));
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
            ></NumericFormat>
          </Box>
          <Box className={"input-group"}>
            <span className={"input-group-text"}>메모</span>
            <InputMask
              mask={""}
              placeholder={"메모"}
              id={`money_content-${i}`}
              name={`money_content-${i}`}
              className={"form-control"}
              maskChar={null}
              value={OBJECT?.money_section[i]?.money_content}
              onChange={(e) => {
                const limitedContent = e.target.value.slice(0, 100);
                setOBJECT((prev) =>({
                  ...prev,
                  money_section: prev.money_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      money_content: limitedContent
                    } : item
                  ))
                }));
              }}
            ></InputMask>
          </Box>
        </Card>
      </React.Fragment>
    );
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <Box className={"d-center p-10"}>
            {titleSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"}></Divider>
          <Box className={"d-center mb-20"}>
            {dateSection()}
          </Box>
          <Box className={"d-center mb-20"}>
            {countSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"}></Divider>
          <Box className={"d-center mb-20"}>
            {totalSection()}
          </Box>
          {Array.from({length: COUNT.sectionCnt}, (_, i) => tableFragment(i))}
        </Box>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Card>
      </React.Fragment>
    );
  };

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 11. day -------------------------------------------------------------------------------------->
  const daySaveNode = () => (
    <DaySave DATE={DATE} setDATE={setDATE} DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER}
      part={"money"} plan={""} type={"save"}
    />
  );

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"money"} plan={""} type={"save"}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {headerNode()}
      {navBarNode()}
      {daySaveNode()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};
