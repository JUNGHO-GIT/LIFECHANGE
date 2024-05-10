// FoodPlanSave.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {moment, axios, numeral, InputMask, NumericFormat} from "../../import/ImportLibs";
import {useDate, useStorage} from "../../import/ImportHooks";
import {percent} from "../../import/ImportLogics";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Btn, Loading, PopUp, PopDown} from "../../import/ImportComponents";
import {CustomIcons, CustomAdornment} from "../../import/ImportIcons";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const FoodPlanSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

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
    toList:"/food/plan/list"
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
    food_plan_number: 0,
    food_plan_demo: false,
    food_plan_startDt: "0000-00-00",
    food_plan_endDt: "0000-00-00",
    food_plan_kcal: 0,
    food_plan_carb: 0,
    food_plan_protein: 0,
    food_plan_fat: 0,
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/plan/detail`, {
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
    }));
    setLOADING(false);
  })()}, [user_id, DATE.startDt, DATE.endDt]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/plan/save`, {
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
          음식 계획 Save
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
            slotProps={{ field: { shouldRespectLeadingZeros: true } }}
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
              <Box className={"d-block p-10"}>
                <Box className={"d-left mt-10 mb-10"}>
                  <CustomIcons name={"MdOutlineContentCopy"} className={"w-24 h-24 dark"} />
                  <Typography variant={"inherit"}>기타</Typography>
                </Box>
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
            {dropdownSection(OBJECT?._id, "", 0)}
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={"목표 칼로리"}
              id={`food_plan_kcal-${i}`}
              name={`food_plan_kcal-${i}`}
              className={"me-10"}
              variant={"outlined"}
              value={OBJECT?.food_plan_kcal}
              InputProps={{
                readOnly: false,
              }}
              onChange={(e) => {
                const limitedValue = Math.min(9999, parseInt(e.target.value));
                setOBJECT((prev) => ({
                  ...prev,
                  food_plan_kcal: limitedValue
                }));
              }}
            />
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={"목표 탄수화물"}
              id={`food_plan_carb-${i}`}
              name={`food_plan_carb-${i}`}
              className={"me-10"}
              variant={"outlined"}
              value={OBJECT?.food_plan_carb}
              InputProps={{
                readOnly: false,
              }}
              onChange={(e) => {
                const limitedValue = Math.min(999, parseInt(e.target.value));
                setOBJECT((prev) => ({
                  ...prev,
                  food_plan_carb: limitedValue
                }));
              }}
            />
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={"목표 단백질"}
              id={`food_plan_protein-${i}`}
              name={`food_plan_protein-${i}`}
              className={"me-10"}
              variant={"outlined"}
              value={OBJECT?.food_plan_protein}
              InputProps={{
                readOnly: false,
              }}
              onChange={(e) => {
                const limitedValue = Math.min(999, parseInt(e.target.value));
                setOBJECT((prev) => ({
                  ...prev,
                  food_plan_protein: limitedValue
                }));
              }}
            />
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={false}
              type={"text"}
              size={"small"}
              label={"목표 지방"}
              id={`food_plan_fat-${i}`}
              name={`food_plan_fat-${i}`}
              className={"me-10"}
              variant={"outlined"}
              value={OBJECT?.food_plan_fat}
              InputProps={{
                readOnly: false,
              }}
              onChange={(e) => {
                const limitedValue = Math.min(999, parseInt(e.target.value));
                setOBJECT((prev) => ({
                  ...prev,
                  food_plan_fat: limitedValue
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
            {tableFragment()}
          </Box>
        </Box>
      </React.Fragment>
    );
    // 7-8. return
    return (
      <React.Fragment>
        <Paper className={"content-wrapper"} variant={"outlined"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"text-center"}>
                {tableSection()}
              </Grid2>
            </Grid2>
          </Container>
        </Paper>
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
      part={"food"} plan={"plan"} type={"save"}
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
