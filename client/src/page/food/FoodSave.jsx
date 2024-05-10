// FoodSave.jsx

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
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {LocalizationProvider, AdapterMoment} from "../../import/ImportMuis";
import {DesktopDatePicker, DesktopTimePicker} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "";
  const foodArray = JSON.parse(session)?.food || [];
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
    toList:"/food/list",
    toSave:"/food/save",
    toSearch:"/food/search",
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
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  };
  const [OBJECT_BEFORE, setOBJECT_BEFORE] = useState(OBJECT_DEF);
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {

    // 스토리지 데이터 가져오기
    const getItem = localStorage.getItem("food_section");
    let storageSection = getItem ? JSON.parse(getItem) : null;

    // 상세 데이터 가져오기
    setLOADING(true);
    const fetchDetail = async () => {
      const res = await axios.get(`${URL_OBJECT}/detail`, {
        params: {
          _id: "",
          user_id: user_id,
          duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });

      // 결과 있는경우 OBJECT 상태 업데이트
      if (res.data.result !== null && !storageSection) {
        setOBJECT((prev) => ({
          ...prev,
          ...res.data.result,
        }));
      }

      // 결과가 null or !null 이면서 스토리지 데이터가 있는 경우, OBJECT 상태 업데이트
      else if (
        (res.data.result !== null && storageSection) ||
        (res.data.result === null && storageSection)
      ) {
        if (storageSection) {
          setOBJECT((prev) => {
            let newFoodSection = [...prev.food_section];

            // 첫 번째 항목이 빈 값 객체인지 확인하고, 조건에 맞으면 제거
            if (
              newFoodSection.length > 0 &&
              Object.values(newFoodSection[0]).every((value) => (value === ""))
            ) {
              newFoodSection.shift();
            }

            // 새로운 데이터가 배열인 경우 배열, 단일 객체인 경우 단일 객체를 추가
            Array.isArray(storageSection)
            ? newFoodSection.push(...storageSection)
            : newFoodSection.push(storageSection);

            return {
              ...prev,
              food_section: newFoodSection,
            };
          })
        }
      }

      // 결과가 null 일 경우, OBJECT 상태를 명시적으로 초기화
      else {
        setOBJECT(OBJECT_DEF);
      }

      setCOUNT((prev) => ({
        ...prev,
        totalCnt: res.data.totalCnt || 0,
        sectionCnt: res.data.sectionCnt || 0
      }));
    };
    fetchDetail();
    setLOADING(false);
  }, [user_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 초기 영양소 값 설정
    setOBJECT_BEFORE((prev) => ({
      ...prev,
      food_section: [...OBJECT?.food_section],
    }));
  }, [OBJECT]);

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

  // 4-1. handler --------------------------------------------------------------------------------->
  const handleCountChange = (index, newValue) => {
    const newCountValue = Number(newValue);

    setOBJECT((prev) => {
      const newFoodSection = [...prev.food_section];
      const section = newFoodSection[index];
      const defaultSection = OBJECT_BEFORE.food_section[index];
      const ratio = newCountValue / (defaultSection.food_count || 1);

      if (defaultSection) {
        newFoodSection[index] = {
          ...section,
          food_count: newCountValue,
          food_gram: Number(((defaultSection?.food_gram) * ratio).toFixed(1)),
          food_kcal: Number(((defaultSection?.food_kcal) * ratio).toFixed(1)),
          food_carb: Number(((defaultSection?.food_carb) * ratio).toFixed(1)),
          food_protein: Number(((defaultSection?.food_protein) * ratio).toFixed(1)),
          food_fat: Number(((defaultSection?.food_fat) * ratio).toFixed(1)),
        };
      }
      return {
        ...prev,
        food_section: newFoodSection,
      };
    });
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handlerFoodDelete = (index) => {
    setOBJECT((prev) => {
      const newFoodSection = [...prev.food_section];
      newFoodSection.splice(index, 1);
      return {
        ...prev,
        food_section: newFoodSection,
      };
    });
  };

  // 7. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          음식 Save
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
            views={["day"]}
            slotProps={{
              textField: {
                sx: {
                  width: "220px",
                },
              },
              layout: {
                sx: {
                  "& .MuiPickersLayout-contentWrapper": {
                    width: "220px",
                    height: "280px",
                  },
                  "& .MuiDateCalendar-root": {
                    width: "210px",
                    height: "270px",
                  },
                  "& .MuiDayCalendar-slideTransition": {
                    width: "210px",
                    height: "270px",
                  },
                  "& .MuiPickersDay-root": {
                    width: "30px",
                    height: "28px",
                  },
                },
              },
            }}
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
        };
        setCOUNT((prev) => ({
          ...prev,
          sectionCnt: newCount
        }));
        if (newCount > 0) {
          let updatedSection = Array(newCount).fill(null).map((_, idx) => (
            idx < OBJECT?.food_section.length ? OBJECT?.food_section[idx] : defaultSection
          ));
          setOBJECT((prev) => ({
            ...prev,
            food_section: updatedSection
          }));
        }
        else {
          setOBJECT((prev) => ({
            ...prev,
            food_section: []
          }));
        }
      };
      return (
        <React.Fragment>
          <PopUp
            elementId={"sectionCnt"}
            contents={
              <Typography variant={"body2"} className={"p-10"}>
                0이상 10이하의 숫자만 입력하세요.
              </Typography>
            }
          >
            {popProps => (
              <TextField
                type={"text"}
                id={"sectionCnt"}
                label={"항목수"}
                variant={"outlined"}
                size={"small"}
                className={"w-220"}
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
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 수입"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_in).format('0,0')}`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 지출"}
            size={"small"}
            value={`${numeral(OBJECT?.food_total_out).format('0,0')}`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Box>
        <Box className={"d-center mb-20"}>
          <TextField
            select={false}
            label={"총 자산"}
            size={"small"}
            value={`${numeral(OBJECT?.food_property).format('0,0')}`}
            variant={"outlined"}
            className={"w-220"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <CustomIcons name={"BiWon"} className={"w-16 h-16 dark"} position={"start"} />
              )
            }}
          />
        </Box>
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
      <React.Fragment>
        <Card variant={"outlined"} className={"p-20"} key={i}>
          <Box className={"d-between mt-n15 mb-20"}>
            {dropdownSection(OBJECT?._id, OBJECT?.food_section[i]._id, i)}
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              label={"파트"}
              id={`food_part_val-${i}`}
              name={`food_part_val-${i}`}
              variant={"outlined"}
              className={"w-100 me-10"}
              value={OBJECT?.food_section[i]?.food_part_idx}
              InputProps={{
                readOnly: false
              }}
              onChange={(e) => {
                const newIndex = Number(e.target.value);
                setOBJECT((prev) => ({
                  ...prev,
                  food_section: prev.food_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      food_part_idx: newIndex,
                      food_part_val: foodArray[newIndex]?.food_part,
                      food_title_idx: 0,
                      food_title_val: foodArray[newIndex]?.food_title[0],
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
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              label={"타이틀"}
              id={`food_title_val-${i}`}
              name={`food_title_val-${i}`}
              variant={"outlined"}
              className={"w-100 ms-10"}
              value={OBJECT?.food_section[i]?.food_title_idx}
              InputProps={{
                readOnly: false
              }}
              onChange={(e) => {
                const newTitleIdx = Number(e.target.value);
                const newTitleVal = foodArray[OBJECT?.food_section[i]?.food_part_idx]?.food_title[newTitleIdx];
                if (newTitleIdx >= 0 && newTitleVal) {
                  setOBJECT((prev) => ({
                    ...prev,
                    food_section: prev.food_section.map((item, idx) => (
                      idx === i ? {
                        ...item,
                        food_title_idx: newTitleIdx,
                        food_title_val: newTitleVal,
                      } : item
                    ))
                  }));
                }
              }}
            >
              {foodArray[OBJECT?.food_section[i]?.food_part_idx]?.food_title?.map((title, idx) => (
                <MenuItem key={idx} value={idx}>
                  {title}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              label={"금액"}
              type={"text"}
              variant={"outlined"}
              size={"small"}
              value={`${numeral(OBJECT?.food_section[i]?.food_amount).format('0,0')}`}
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
                  food_section: prev.food_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      food_amount: limitedValue
                    } : item
                  ))
                }));
              }}
            />
          </Box>
          <Box className={"d-center mb-20"}>
            <TextField
              label={"메모"}
              type={"text"}
              variant={"outlined"}
              size={"small"}
              value={OBJECT?.food_section[i]?.food_content}
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
                  food_section: prev.food_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      food_content: limitedContent
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
    /* const tableSec = () => (
      <React.Fragment>
        <Box className={"block-wrapper"}>
          <TableContainer>
            <Table className={"border"}>
              <TableHead>
                <TableRow className={"table-thead-tr"}>
                  <TableCell>분류</TableCell>
                  <TableCell>음식명</TableCell>
                  <TableCell>수량</TableCell>
                  <TableCell>g</TableCell>
                  <TableCell>kcal</TableCell>
                  <TableCell>fat</TableCell>
                  <TableCell>carb</TableCell>
                  <TableCell>protein</TableCell>
                  <TableCell>x</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {OBJECT?.food_section?.map((item, index) => (
                  <React.Fragment key={index}>
                    <TableRow className={"table-tbody-tr"}>
                      <TableCell>
                        <select
                          id={"food_part_idx"}
                          name={"food_part_idx"}
                          className={"form-select"}
                          value={item.food_part_idx}
                          onChange={(e) => {
                            const newIndex = Number(e.target.value);
                            setOBJECT((prev) => ({
                              ...prev,
                              food_section: prev.food_section.map((item, idx) => (
                                idx === index ? {
                                  ...item,
                                  food_part_idx: newIndex,
                                  food_part_val: foodArray[newIndex]?.food_part
                                } : item
                              ))
                            }));
                          }}
                        >
                          {foodArray?.map((item, idx) => (
                            <option key={idx} value={idx}>
                              {item.food_part}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>{`${item.food_title}(${item.food_brand})`}</TableCell>
                      <TableCell>
                        <Box className={"d-flex"}>
                          <NumericFormat
                            min={0}
                            max={99}
                            minLength={1}
                            maxLength={2}
                            id={"food_plan_count"}
                            name={"food_plan_count"}
                            datatype={"number"}
                            displayType={"input"}
                            className={"form-control"}
                            disabled={false}
                            allowNegative={false}
                            fixedDecimalScale={true}
                            thousandSeparator={true}
                            value={Math.min(99, Number(item.food_count))}
                            onValueChange={(values) => {
                              const limitedValue = Math.min(99, parseInt(values.value));
                              handleCountChange(index, limitedValue);
                            }}
                          />
                          <span>{item.food_serv}</span>
                        </Box>
                      </TableCell>
                      <TableCell>{item.food_gram}</TableCell>
                      <TableCell>{item.food_kcal}</TableCell>
                      <TableCell>{item.food_fat}</TableCell>
                      <TableCell>{item.food_carb}</TableCell>
                      <TableCell>{item.food_protein}</TableCell>
                      <TableCell>
                        <p className={"del-btn"} onClick={() => (
                          handlerFoodDelete(index)
                        )}>
                          x
                        </p>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                <TableRow className={"table-tbody-tr"}>
                  <TableCell>합계</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>{OBJECT?.food_total_kcal}</TableCell>
                  <TableCell>{OBJECT?.food_total_fat}</TableCell>
                  <TableCell>{OBJECT?.food_total_carb}</TableCell>
                  <TableCell>{OBJECT?.food_total_protein}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </React.Fragment>
    ); */
    // 7-7. table
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper"}>
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
          <Box className={"d-column mb-20"}>
            {totalSection()}
          </Box>
          <Box className={"d-column"}>
            {OBJECT?.food_section.map((item, i) => tableFragment(i))}
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

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={DAYPICKER} setDAYPICKER={setDAYPICKER} DATE={DATE} setDATE={setDATE}
      SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
      flowSave={flowSave} navParam={navParam}
      part={"food"} plan={""} type={"search"}
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
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};