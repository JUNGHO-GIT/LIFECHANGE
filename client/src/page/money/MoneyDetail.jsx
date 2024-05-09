// MoneyDetail.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {moment, axios, numeral, InputMask, NumericFormat} from "../../import/ImportLibs";
import {useDate, useStorage} from "../../import/ImportHooks";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Btn, Loading} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, InputAdornment, InputLabel} from "../../import/ImportMuis";
import {IconButton, Button, Divider} from "../../import/ImportMuis";
import {PopupState, bindTrigger, bindMenu} from "../../import/ImportMuis";
import {Popover, bindPopover} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";
import {FormGroup, FormControlLabel, FormControl, Select, Switch} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const MoneyDetail = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_id = location?.state?.id?.trim()?.toString();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDetail: "/money/detail",
    toList: "/money/list",
    toUpdate: "/money/save",
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
        _id: location_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setCOUNT((prev) => ({
      ...prev,
      totalCnt: res.data.totalCnt || 0,
      sectionCnt: res.data.sectionCnt || 0,
    }));
    setLOADING(false);
  })()}, [location_id, user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowDelete = async (id, section_id) => {
    const res = await axios.delete(`${URL_OBJECT}/delete`, {
      params: {
        user_id: user_id,
        _id: id,
        section_id: section_id,
        duration: `${DATE.startDt} ~ ${DATE.endDt}`,
      },
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      percent();
      if (Object.keys(res.data.result).length > 0) {
        setOBJECT(res.data.result);
      }
      else {
        navParam(SEND.toList);
      }
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
          재무 Detail
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
          ></DesktopDatePicker>
        </LocalizationProvider>
      </React.Fragment>
    );
    const countSection = () => (
      <React.Fragment>
        <TextField
          type={"text"}
          id={"sectionCnt"}
          label={"항목수"}
          variant={"outlined"}
          size={"small"}
          value={COUNT?.sectionCnt}
          InputProps={{
            readOnly: true,
            startAdornment: (
              <CustomIcons name={"BiListPlus"} className={"w-18 h-18 dark"} position={"start"} />
            )
          }}
        ></TextField>
      </React.Fragment>
    );
    const totalSection = () => (
      <React.Fragment>
        <Card variant={"outlined"} className={"p-20"}>
          <TextField
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
          ></TextField>
          <TextField
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
          ></TextField>
          <TextField
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
          ></TextField>
        </Card>
      </React.Fragment>
    );
    const badgeSection = (i) => (
      <React.Fragment>
        <Badge
          badgeContent={i + 1}
          color={"primary"}
          showZero={true}
        ></Badge>
      </React.Fragment>
    );
    const dropdownSection = (id, sectionId, index) => (
      <React.Fragment>
        <PopupState variant={"popover"} popupId={"popup"}>
          {(popupState) => (
            <Box className={"mt-n10 me-n10"}>
              <CustomIcons name={"MdOutlineMoreVert"} className={"w-24 h-24 dark"} {...bindTrigger(popupState)} />
              <Menu {...bindMenu(popupState)}>
                <MenuItem onClick={() => {
                  flowDelete(id, sectionId)
                }}>
                  <CustomIcons name={"MdOutlineDelete"} className={"w-24 h-24 dark"} />
                  삭제
                </MenuItem>
                <MenuItem onClick={() => {
                  SEND.startDt = DATE.startDt;
                  SEND.endDt = DATE.endDt;
                  navParam(SEND.toUpdate, {
                    state: SEND,
                  });
                }}>
                  <CustomIcons name={"MdOutlineEdit"} className={"w-24 h-24 dark"} />
                  수정
                </MenuItem>
                <MenuItem>
                  <CustomIcons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"} />
                  기타
                </MenuItem>
              </Menu>
            </Box>
          )}
        </PopupState>
      </React.Fragment>
    );
    const tableFragment = (i) => (
      <React.Fragment key={i}>
        <Card variant={"outlined"} className={"p-20"}>
          <Box className={"d-between mb-20"}>
            {badgeSection(i)}
            {dropdownSection(OBJECT?._id, OBJECT?.money_section[i]._id, i)}
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              label={"파트"}
              type={"text"}
              variant={"outlined"}
              size={"small"}
              className={"w-m90 me-10"}
              value={OBJECT?.money_section[i]?.money_part_val}
              InputProps={{
                readOnly: true,
              }}
            ></TextField>
            <TextField
              label={"타이틀"}
              type={"text"}
              variant={"outlined"}
              size={"small"}
              className={"w-m90 ms-10"}
              value={OBJECT?.money_section[i]?.money_title_val}
              InputProps={{
                readOnly: true,
              }}
            ></TextField>
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              label={"금액"}
              type={"text"}
              variant={"outlined"}
              size={"small"}
              className={"w-m220"}
              value={`${numeral(OBJECT?.money_section[i]?.money_amount).format('0,0')}`}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <CustomIcons name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
                )
              }}
            ></TextField>
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              label={"메모"}
              type={"text"}
              variant={"outlined"}
              size={"small"}
              className={"w-m220"}
              value={OBJECT?.money_section[i]?.money_content}
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <CustomIcons name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
                )
              }}
            ></TextField>
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

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND} FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={""} navParam={navParam}
      part={"money"} plan={""} type={"detail"}
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