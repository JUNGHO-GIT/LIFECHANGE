// UserDataset.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios} from "../../import/ImportLibs.jsx";
import {Header, NavBar} from "../../import/ImportLayouts.jsx";
import {Loading, Btn} from "../../import/ImportComponents.jsx";
import {CustomIcons} from "../../import/ImportIcons.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {Box, Typography} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";
import {Divider} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataset = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const session = sessionStorage.getItem("dataset") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const foodArray = JSON.parse(session)?.food || [];
  const moneyArray = JSON.parse(session)?.money || [];
  const sleepArray = JSON.parse(session)?.sleep || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const datasetArray = ["calendar", "exercise", "food", "money", "sleep"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    startDt: "0000-00-00",
    endDt: "0000-00-00",
    toDataset: "/user/dataset",
  });
  const [DATE, setDATE] = useState({
    startDt: location_startDt,
    endDt: location_endDt
  });
  const [idx, setIdx] = useState({
    sectionIdx: 0,
    partIdx: 1,
    titleIdx: 1
  });
  const [selectedIdx, setSelectedIdx] = useState({
    sectionIdx: 0,
    partIdx: 1,
    titleIdx: 1
  });
  const [dataType, setDataType] = useState("calendar");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    user_id: user_id,
    user_number: 0,
    user_dataset: {
      calendar: [{
        calendar_part: ""
      }],
      exercise: [{
        exercise_part: "",
        exercise_title: [""]
      }],
      food: [{
        food_part: ""
      }],
      money: [{
        money_part: "",
        money_title: [""]
      }],
      sleep: [{
        sleep_part: ""
      }]
    }
  };
  const [OBJECT, setOBJECT] = useState(OBJECT_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const res = await axios.get(`${URL_OBJECT}/dataset`, {
      params: {
        user_id: user_id
      }
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setLOADING(false);
  })()}, [user_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: user_id,
      OBJECT: OBJECT
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      sessionStorage.setItem("dataset", JSON.stringify(res.data.result.user_dataset));
      navParam(SEND.toDataset);
    }
    else {
      alert(res.data.msg);
      sessionStorage.setItem("user_id", "false");
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handlerAdd = (type) => {
    if (type === "part") {
      setOBJECT((prev) => ({
        ...prev,
        user_dataset: {
          ...prev.user_dataset,
          [dataType]: [
            ...prev.user_dataset[dataType], {
              [`${dataType}_part`]: "",
              [`${dataType}_title`]: [""]
            }
          ]
        }
      }))
    }
    else if (type === "title") {
      setOBJECT((prev) => ({
        ...prev,
        user_dataset: {
          ...prev.user_dataset,
          [dataType]: [
            ...prev.user_dataset[dataType]?.slice(0, idx.partIdx), {
              ...prev.user_dataset[dataType]?.[idx.partIdx],
              [`${dataType}_title`]: [
                ...prev.user_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`],
                ""
              ]
            },
            ...prev.user_dataset[dataType]?.slice(idx.partIdx + 1)
          ]
        }
      }))
    }
  };

  // 4-2. handler --------------------------------------------------------------------------------->
  const handlerRename = (type, index) => {
    if (type === "part") {
      const newPart = prompt("새로운 이름을 입력하세요.");
      if (newPart) {
        setOBJECT((prev) => ({
          ...prev,
          user_dataset: {
            ...prev.user_dataset,
            [dataType]: [
              ...prev.user_dataset[dataType]?.slice(0, index), {
                ...prev.user_dataset[dataType]?.[index],
                [`${dataType}_part`]: newPart
              },
              ...prev.user_dataset[dataType]?.slice(index + 1)
            ]
          }
        }));
      }
    }
    else if (type === "title") {
      const newTitle = prompt("새로운 이름을 입력하세요.");
      if (newTitle) {
        setOBJECT((prev) => ({
          ...prev,
          user_dataset: {
            ...prev.user_dataset,
            [dataType]: [
              ...prev.user_dataset[dataType]?.slice(0, idx.partIdx), {
                ...prev.user_dataset[dataType]?.[idx.partIdx],
                [`${dataType}_title`]: [
                  ...prev.user_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                  newTitle,
                  ...prev.user_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
                ]
              },
              ...prev.user_dataset[dataType]?.slice(idx.partIdx + 1)
            ]
          }
        }));
      }
    }
  };

  // 4-3. handler --------------------------------------------------------------------------------->
  const handlerRemove = (type, index) => {
    if (type === "part") {
      setOBJECT((prev) => ({
        ...prev,
        user_dataset: {
          ...prev.user_dataset,
          [dataType]: [
            ...prev.user_dataset[dataType]?.slice(0, index),
            ...prev.user_dataset[dataType]?.slice(index + 1)
          ]
        }
      }));
    }
    else if (type === "title") {
      setOBJECT((prev) => ({
        ...prev,
        user_dataset: {
          ...prev.user_dataset,
          [dataType]: [
            ...prev.user_dataset[dataType]?.slice(0, idx.partIdx), {
              ...prev.user_dataset[dataType]?.[idx.partIdx],
              [`${dataType}_title`]: [
                ...prev.user_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                ...prev.user_dataset[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
              ]
            },
            ...prev.user_dataset[dataType]?.slice(idx.partIdx + 1)
          ]
        }
      }));
    }
  };

  // 4-4. handler --------------------------------------------------------------------------------->
  const handlerDefault = () => {
    const confirm = window.confirm("기본값으로 초기화하시겠습니까?");
    let defaultArray = [];
    if (dataType === "calendar") {
      defaultArray = calendarArray;
    }
    else if (dataType === "exercise") {
      defaultArray = exerciseArray;
    }
    else if (dataType === "food") {
      defaultArray = foodArray;
    }
    else if (dataType === "money") {
      defaultArray = moneyArray;
    }
    else if (dataType === "sleep") {
      defaultArray = sleepArray;
    }

    if (confirm) {
      setOBJECT((prev) => ({
        ...prev,
        user_dataset: {
          ...prev.user_dataset,
          [dataType]: defaultArray
        }
      }));
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <Typography variant={"h5"} fontWeight={500}>
        Dataset
      </Typography>
    );
    // 7-6-1. table
    const tableFragment1 = (i) => (
      <Card variant={"outlined"} className={"p-0 mb-20"} key={i}>
        <TableContainer className={"over-x-hidden"}>
          <Table className={"border"}>
            <TableHead>
              <TableRow className={"table-thead-tr"}>
                <TableCell>
                  <Box className={"d-center"}>
                    <Typography variant={"h6"} fontWeight={500}>
                      Section
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datasetArray.map((item, index) => (
                <TableRow
                  key={index}
                  className={selectedIdx.sectionIdx === index ? "table-secondary" : ""}
                  style={{border: "1px solid #dee2e6"}}
                  onClick={() => {
                    setDataType(item);
                    setSelectedIdx((prev) => ({
                      ...prev,
                      sectionIdx: index,
                      partIdx: 1,
                      titleIdx: 1
                    }));
                    setIdx((prev) => ({
                      ...prev,
                      partIdx: 1,
                      titleIdx: 1
                    }));
                  }}
                >
                  <TableCell>
                    <Box className={"dataset-title"}>
                      <Typography variant={"body1"}>
                        {item}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6-2. table
    const tableFragment2 = (i) => (
      <Card variant={"outlined"} className={"p-0 mb-20"} key={i}>
        <TableContainer className={"over-x-hidden"}>
          <Table className={"border"}>
            <TableHead>
              <TableRow className={"table-thead-tr"}>
                <TableCell>
                  <Box className={"d-center"}>
                    <Typography variant={"h6"} fontWeight={500}>
                      Part
                    </Typography>
                    <CustomIcons name={"BiPlus"} className={"w-24 h-24 dark"} onClick={() => {
                      handlerAdd("part");
                    }} />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {OBJECT?.user_dataset[dataType]?.map((item, index) => (index > 0) && (
                <TableRow key={index}
                  className={selectedIdx.partIdx === index ? "table-secondary" : ""}
                  style={{border: "1px solid #dee2e6"}}
                  onClick={() => {
                    setSelectedIdx((prev) => ({
                      ...prev,
                      partIdx: index
                    }));
                  }}
                >
                  <TableCell>
                    <Box className={"dataset-title"} onClick={() => {
                      setIdx((prev) => ({
                        ...prev,
                        partIdx: index
                      }));
                    }}>
                      <Typography variant={"body1"}>
                        {item[`${dataType}_part`]}
                      </Typography>
                      <CustomIcons name={"BiEdit"} className={"w-24 h-24 dark"} onClick={() => {
                        handlerRename("part", index);
                      }} />
                      <CustomIcons name={"BiTrash"} className={"w-24 h-24 dark"} onClick={() => {
                        handlerRemove("part", index);
                      }} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6-3. table
    const tableFragment3 = (i) => (
      <Card variant={"outlined"} className={"p-0 mb-20"} key={i}>
        <TableContainer className={"over-x-hidden"}>
          <Table className={"border"}>
            <TableHead>
              <TableRow className={"table-thead-tr"}>
                <TableCell>
                  <Box className={"d-center"}>
                    <Typography variant={"h6"} fontWeight={500}>
                      Title
                    </Typography>
                    <CustomIcons name={"BiPlus"} className={"w-24 h-24 dark"} onClick={() => {
                      handlerAdd("title");
                    }} />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {OBJECT?.user_dataset[dataType]?.[idx?.partIdx]?.[`${dataType}_title`]?.map((item, index) => (index > 0) && (
                <TableRow
                  key={index}
                  className={selectedIdx.titleIdx === index ? "table-secondary" : ""}
                  style={{border: "1px solid #dee2e6"}}
                  onClick={() => {
                    setSelectedIdx((prev) => ({
                      ...prev,
                      titleIdx: index
                    }));
                  }}
                >
                  <TableCell>
                    <Box className={"dataset-title"} onClick={() => {
                      setIdx((prev) => ({
                        ...prev,
                        titleIdx: index
                      }));
                    }}>
                      <Typography variant={"body1"}>
                        {item}
                      </Typography>
                      <CustomIcons name={"BiEdit"} className={"w-24 h-24 dark"} onClick={() => {
                        handlerRename("title", index);
                      }} />
                      <CustomIcons name={"BiTrash"} className={"w-24 h-24 dark"} onClick={() => {
                        handlerRemove("title", index);
                      }} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-7. table
    // list 는 높이, 너비 지정
    const tableSection = () => (
      <Box className={"block-wrapper h-min75vh"}>
        <Box className={"d-center p-10"}>
          {titleSection()}
        </Box>
        <Divider variant={"middle"} className={"mb-20"} />
        <Box className={"d-column"}>
          {tableFragment1(0)}
          {tableFragment2(0)}
          {tableFragment3(0)}
        </Box>
      </Box>
    );
    // 7-8. return
    return (
      <Paper className={"content-wrapper"} variant={"outlined"}>
        {tableSection()}
      </Paper>
    );
  };

  // 13. btn -------------------------------------------------------------------------------------->
  const btnNode = () => (
    <Btn DAYPICKER={""} setDAYPICKER={""} DATE={DATE} setDATE={setDATE} SEND={SEND}  FILTER={""}
      setFILTER={""} PAGING={""} setPAGING={""} flowSave={flowSave} navParam={navParam}
      part={"user"} plan={""} type={"dataset"} handler={handlerDefault}
    />
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      {Header()}
      {NavBar()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </>
  );
};