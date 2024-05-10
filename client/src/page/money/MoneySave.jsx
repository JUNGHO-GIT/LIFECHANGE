// MoneySave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {moment, axios, numeral, InputMask, NumericFormat} from "../../import/ImportLibs";
import {useDate, useStorage} from "../../import/ImportHooks";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Btn, DaySave, Loading, PopDown, PopUp} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper, Icon} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";
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
  const [DAYPICKER, setDAYPICKER] = useState({
    dayStartOpen: false,
    dayEndOpen: false,
    dayOpen: false,
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
    // 7-1. title
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          재무 Save
        </Typography>
      </React.Fragment>
    );
    // 7-2. date
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
          />
        </LocalizationProvider>
      </React.Fragment>
    );
    // 7-3. count
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
            idx < OBJECT?.money_section.length ? OBJECT?.money_section[idx] : defaultSection
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
          <PopUp elementId={"sectionCnt"} contents={
            <Typography variant={"body2"} className={"p-10"}>
              0이상 10이하의 숫자만 입력하세요.
            </Typography>
          }>
            {popProps => (
              <TextField
                type={"text"}
                id={"sectionCnt"}
                label={"항목수"}
                variant={"outlined"}
                size={"small"}
                value={COUNT?.sectionCnt}
                InputProps={{
                  readOnly: false,
                  startAdornment: (
                    <CustomIcons name={"BiListPlus"} className={"w-18 h-18 dark"} position={"start"} />
                  )
                }}
                onChange={(e) => {
                  const newValInt = Number(e.target.value);
                  const newValStr = String(e.target.value);
                  if (newValInt < 0) {
                    popProps.openPopup(e.currentTarget);
                  }
                  else if (newValInt > 10) {
                    popProps.openPopup(e.currentTarget);
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
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            )}
          </PopUp>
        </React.Fragment>
      );
    };
    // 7-4. total
    const totalSection = () => (
      <React.Fragment>
        <Card variant={"outlined"} className={"p-20"}>
          <TextField
            select={false}
            label={"총 수입"}
            size={"small"}
            value={`${numeral(OBJECT?.money_total_in).format('0,0')}`}
            variant={"outlined"}
            className={"mt-6 mb-6"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
          <TextField
            select={false}
            label={"총 지출"}
            size={"small"}
            value={`${numeral(OBJECT?.money_total_out).format('0,0')}`}
            variant={"outlined"}
            className={"mt-6 mb-6"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
          <TextField
            select={false}
            label={"총 자산"}
            size={"small"}
            value={`${numeral(OBJECT?.money_property).format('0,0')}`}
            variant={"outlined"}
            className={"mt-6 mb-6"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Card>
      </React.Fragment>
    );
    // 7-5. dropdown
    const dropdownSection = (id, sectionId, index) => (
      <React.Fragment>
        <IconButton size={"small"} color={"primary"}>
          <Badge
            badgeContent={index + 1}
            color={"primary"}
            showZero={true}
          />
        </IconButton>
        <PopDown
          elementId={`pop-${index}`}
          contents={
            <React.Fragment>
              <Box className={"d-center p-10"}>
                <CustomIcons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"} />
                <Typography variant={"inherit"}>기타</Typography>
              </Box>
            </React.Fragment>
          }
        >
        {popProps => (
          <React.Fragment>
            <IconButton size={"small"} color={"primary"} className={"me-n20"} onClick={(e) => {
              popProps.openPopup(e.currentTarget)
            }}>
              <CustomIcons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark"} />
            </IconButton>
          </React.Fragment>
        )}
        </PopDown>
      </React.Fragment>
    );
    // 7-6. table
    const tableFragment = (i) => (
      <React.Fragment key={i}>
        <Card variant={"outlined"} className={"p-20"} key={`${i}`}>
          <Box className={"d-between mt-n15 mb-20"}>
            {dropdownSection(OBJECT?._id, OBJECT?.money_section[i]._id, i)}
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              label={"파트"}
              id={`money_part_val-${i}`}
              name={`money_part_val-${i}`}
              className={"me-10"}
              variant={"outlined"}
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
              className={"ms-10"}
              variant={"outlined"}
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
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              label={"금액"}
              type={"text"}
              variant={"outlined"}
              size={"small"}
              value={`${numeral(OBJECT?.money_section[i]?.money_amount).format('0,0')}`}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <CustomIcons name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
                )
              }}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/,/g, "");
                const limitedValue = Math.min(Number(rawValue), 1000000000);
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
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              label={"메모"}
              type={"text"}
              variant={"outlined"}
              size={"small"}
              value={OBJECT?.money_section[i]?.money_content}
              InputProps={{
                readOnly: false,
                startAdornment: (
                  <CustomIcons name={"BiChat"} className={"w-16 h-16 dark"} position={"start"} />
                )
              }}
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
            />
          </Box>
        </Card>
      </React.Fragment>
    );
    // 7-7. table
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper h-75vh"}>
          <Box className={"d-center p-10"}>
            {titleSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"} />
          <Box className={"d-center mb-20"}>
            {dateSection()}
          </Box>
          <Box className={"d-center mb-20"}>
            {countSection()}
          </Box>
          <Box className={"d-center mb-20"}>
            {totalSection()}
          </Box>
          <Box className={"d-column"}>
            {OBJECT?.money_section.map((item, i) => tableFragment(i))}
          </Box>
        </Box>
      </React.Fragment>
    );
    // 7-8. return
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

  // 8. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 9. navBar ------------------------------------------------------------------------------------>
  const navBarNode = () => (
    <NavBar />
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
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};
