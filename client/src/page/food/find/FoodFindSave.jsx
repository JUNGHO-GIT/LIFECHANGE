// FoodFindSave.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {moment, axios, numeral} from "../../../import/ImportLibs.jsx";
import {log} from "../../../import/ImportLogics.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {percent} from "../../../import/ImportLogics.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {Div, Br20, Br40} from "../../../import/ImportComponents.jsx";
import {Img, Picker, Count, Delete} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Badge, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {food2, food3, food4, food5} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodFindSave = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCategory") || "{}";
  const foodArray = JSON.parse(session)?.food || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [EXIST, setEXIST] = useState([""]);
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
    dateType: "day",
    dateStart: moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
    dateEnd: moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    _id: "",
    food_number: 0,
    food_dummy: false,
    food_dateStart: "0000-00-00",
    food_dateEnd: "0000-00-00",
    food_total_kcal: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_total_fat: 0,
    food_section: [{
      food_part_idx: 1,
      food_part_val: "breakfast",
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

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/exist`, {
      params: {
        user_id: sessionId,
        DATE: {
          dateType: "",
          dateStart: moment(DATE.dateStart).startOf("month").format("YYYY-MM-DD"),
          dateEnd: moment(DATE.dateEnd).endOf("month").format("YYYY-MM-DD")
        },
      },
    })
    .then((res) => {
      setEXIST(res.data.result || []);
    })
    .catch((err) => {
      console.log(err, "err");
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId, DATE.dateStart, DATE.dateEnd]);

  // 2-3 useEffect ---------------------------------------------------------------------------------
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

  // 2-3. useEffect --------------------------------------------------------------------------------
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

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    await axios.post(`${URL_OBJECT}/find/save`, {
      user_id: sessionId,
      OBJECT: OBJECT,
      DATE: DATE,
    })
    .then((res) => {
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
    })
    .catch((err) => {
      console.log(err, "err");
    });
  };

  // 4-3. handler ----------------------------------------------------------------------------------
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
      newSectionCnt: prev.newSectionCnt - 1,
    }));
  };

  // 7. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. date
    const dateSection = () => (
      <Picker
        DATE={DATE}
        setDATE={setDATE}
        EXIST={EXIST}
        setEXIST={setEXIST}
      />
    );
    // 7-2. count
    const countSection = () => (
      <Count
        COUNT={COUNT}
        setCOUNT={setCOUNT}
        limit={10}
      />
    );
    // 7-3. badge
    const badgeSection = (index) => (
      <Badge
        badgeContent={index + 1}
        color={"primary"}
        showZero={true}
      />
    );
    // 7-4. delete
    const deleteSection = (id, sectionId, index) => (
      <Delete
        id={id}
        sectionId={sectionId}
        index={index}
        handlerDelete={handlerDelete}
      />
    );
    // 7-5. total
    const totalSection = () => (
      <Div className={"d-column"}>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalKcal")}
            size={"small"}
            value={numeral(OBJECT?.food_total_kcal).format('0,0.00')}
            variant={"outlined"}
            className={"w-76vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food2} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("k")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalCarb")}
            size={"small"}
            value={numeral(OBJECT?.food_total_carb).format('0,0.00')}
            variant={"outlined"}
            className={"w-76vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food3} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("g")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalProtein")}
            size={"small"}
            value={numeral(OBJECT?.food_total_protein).format('0,0.00')}
            variant={"outlined"}
            className={"w-76vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food4} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("g")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
        <Div className={"d-center"}>
          <TextField
            select={false}
            label={translate("totalFat")}
            size={"small"}
            value={numeral(OBJECT?.food_total_fat).format('0,0.00')}
            variant={"outlined"}
            className={"w-76vw"}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <Img src={food5} className={"w-16 h-16"} />
              ),
              endAdornment: (
                <Div className={"fs-0-6rem"}>
                  {translate("g")}
                </Div>
              )
            }}
          />
        </Div>
        <Br20/>
      </Div>
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      <Card className={"border p-20"} key={i}>
        <Div className={"d-column"}>
          <Div className={"d-between"}>
            {badgeSection(i)}
            {deleteSection(OBJECT?._id, OBJECT?.food_section[i]._id, i)}
          </Div>
          <Br40/>
          <Div className={"d-center"}>
            <TextField
              select={true}
              type={"text"}
              size={"small"}
              label={translate("part")}
              variant={"outlined"}
              className={"w-40vw me-3vw"}
              value={OBJECT?.food_section[i]?.food_part_idx}
              InputProps={{
                readOnly: false,
                startAdornment: null,
                endAdornment: null
              }}
              onChange={(e) => {
                const newPart = Number(e.target.value);
                setOBJECT((prev) => ({
                  ...prev,
                  food_section: prev.food_section.map((item, idx) => (
                    idx === i ? {
                      ...item,
                      food_part_idx: newPart,
                      food_part_val: foodArray[newPart].food_part,
                    } : item
                  ))
                }));
              }}
            >
              {foodArray.map((item, idx) => (
                <MenuItem key={idx} value={idx}>
                  <Div className={"fs-0-8rem"}>
                    {translate(item.food_part)}
                  </Div>
                </MenuItem>
              ))}
            </TextField>
            {(OBJECT?.food_section[i]?.food_gram === 0) ? (
              <TextField
                select={false}
                label={translate("foodCount")}
                size={"small"}
                type={"text"}
                value={Math.min(OBJECT?.food_section[i]?.food_count, 9999)}
                variant={"outlined"}
                className={"w-40vw ms-3vw"}
                InputProps={{
                  readOnly: false,
                  startAdornment: null,
                  endAdornment: null,
                }}
                onChange={(e) => {
                  const newCount = Number(e.target.value);
                  if (newCount > 9999) {
                    return;
                  }
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
                label={translate("gram")}
                size={"small"}
                type={"text"}
                value={Math.min(OBJECT?.food_section[i]?.food_gram, 9999)}
                variant={"outlined"}
                className={"w-40vw ms-3vw"}
                InputProps={{
                  readOnly: false,
                  startAdornment: null,
                  endAdornment: (
                    translate("g")
                  )
                }}
                onChange={(e) => {
                  const newGram = Number(e.target.value);
                  if (newGram > 9999) {
                    return;
                  }
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
          <Br20/>
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("foodTitle")}
              size={"small"}
              value={`${OBJECT?.food_section[i]?.food_title} (${OBJECT?.food_section[i]?.food_brand || ""})`}
              variant={"outlined"}
              className={"w-76vw"}
              InputProps={{
                readOnly: true,
                startAdornment: null,
                endAdornment: null
              }}
            />
          </Div>
          <Br20/>
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("kcal")}
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
                  <Div className={"fs-0-6rem"}>
                    {translate("k")}
                  </Div>
                )
              }}
            />
            <TextField
              select={false}
              label={translate("carb")}
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
                  <Div className={"fs-0-6rem"}>
                    {translate("g")}
                  </Div>
                )
              }}
            />
          </Div>
          <Br20/>
          <Div className={"d-center"}>
            <TextField
              select={false}
              label={translate("protein")}
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
                  <Div className={"fs-0-6rem"}>
                    {translate("g")}
                  </Div>
                )
              }}
            />
            <TextField
              select={false}
              label={translate("fat")}
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
                  <Div className={"fs-0-6rem"}>
                    {translate("g")}
                  </Div>
                )
              }}
            />
          </Div>
          <Br20/>
        </Div>
      </Card>
    );
    // 7-8. loading
    const loadingNode = () => (
      <Loading
        LOADING={LOADING}
        setLOADING={setLOADING}
      />
    );
    // 7-8. table
    const tableSection = () => (
      COUNT?.newSectionCnt > 0 && (
        LOADING ? loadingNode() : OBJECT?.food_section.map((_, i) => (tableFragment(i)))
      )
    );
    // 7-9. first
    const firstSection = () => (
      <Card className={"p-20"}>
        {dateSection()}
        <Br20/>
        {countSection()}
      </Card>
    );
    // 7-10. second
    const secondSection = () => (
      <Card className={"p-20"}>
        {totalSection()}
      </Card>
    );
    // 7-9. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min67vh"}>
          {firstSection()}
          {secondSection()}
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      strings={{
        first: firstStr,
        second: secondStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND, COUNT, EXIST
      }}
      functions={{
        setDATE, setSEND, setCOUNT, setEXIST
      }}
      handlers={{
        navigate, flowSave
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};