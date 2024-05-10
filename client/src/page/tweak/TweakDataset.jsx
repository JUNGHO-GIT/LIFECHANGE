// TweakDataset.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts";
import {axios, numeral, NumericFormat} from "../../import/ImportLibs";
import {Header, NavBar} from "../../import/ImportLayouts";
import {Paging, Loading, Btn} from "../../import/ImportComponents";
import {Grid2, Container, Card, Paper} from "../../import/ImportMuis";
import {Box, Badge, Menu, MenuItem} from "../../import/ImportMuis";
import {TableContainer, Table} from "../../import/ImportMuis";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis";
import {TextField, Typography, IconButton, Button, Divider} from "../../import/ImportMuis";

// ------------------------------------------------------------------------------------------------>
export const TweakDataset = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_TWEAK || "";
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

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-1. title
    const titleSection = () => (
      <React.Fragment>
        <Typography variant={"h5"} fontWeight={500}>
          Dataset
        </Typography>
      </React.Fragment>
    );
    // 7-6-1. table
    const tableFragment1 = (i) => (
      <React.Fragment>
        <Card variant={"outlined"} className={"p-20"} key={i}>
          <TableContainer>
            <Table className={"border"}>
              <TableHead>
                <TableRow className={"table-thead-tr"}>
                  <TableCell>
                    <Grid2 container spacing={3}>
                      <Grid2 xl={9} lg={9} md={9} sm={9} xs={9} className={"d-center"}>
                        <Box>
                          DataType
                        </Box>
                      </Grid2>
                    </Grid2>
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
                      <Grid2 container spacing={3}>
                        <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"p-5"}>
                          <Box className={"dataset-title"}>
                            {item}
                          </Box>
                        </Grid2>
                      </Grid2>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </React.Fragment>
    );
    // 7-6-2. table
    const tableFragment2 = (i) => (
      <React.Fragment>
        <Card variant={"outlined"} className={"p-20"} key={i}>
          <TableContainer>
            <Table className={"border"}>
              <TableHead>
                <TableRow className={"table-thead-tr"}>
                  <TableCell>
                    <Grid2 container spacing={3}>
                      <Grid2 xl={9} lg={9} md={9} sm={9} xs={9} className={"d-center"}>
                        <Box>
                          Part
                        </Box>
                      </Grid2>
                      <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-center"}>
                        <Box className={"dataset-add"} onClick={() => {
                          handlerAdd("part");
                        }}>
                          +
                        </Box>
                      </Grid2>
                    </Grid2>
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
                      <Grid2 container spacing={3}>
                        <Grid2 xl={7} lg={7} md={7} sm={7} xs={7} className={"p-5 d-center"}>
                          <Box className={"dataset-title"} onClick={() => {
                            setIdx((prev) => ({
                              ...prev,
                              partIdx: index
                            }));
                          }}>
                            {item[`${dataType}_part`]}
                          </Box>
                        </Grid2>
                        <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"p-5 d-center"}>
                          <Box className={"dataset-rename"} onClick={() => {
                            handlerRename("part", index);
                          }}>
                            o
                          </Box>
                        </Grid2>
                        <Grid2 xl={2} lg={2} md={2} sm={2} xs={2} className={"p-5 d-center"}>
                          <Box className={"dataset-delete"} onClick={() => {
                            handlerRemove("part", index);
                          }}>
                            x
                          </Box>
                        </Grid2>
                      </Grid2>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </React.Fragment>
    );
    // 7-6-3. table
    const tableFragment3 = (i) => (
      <React.Fragment>
        <Card variant={"outlined"} className={"p-20"} key={i}>
          <TableContainer>
            <Table className={"border"}>
              <TableHead>
                <TableRow className={"table-thead-tr"}>
                  <TableCell>
                    <Grid2 container spacing={3}>
                      <Grid2 xl={9} lg={9} md={9} sm={9} xs={9} className={"d-center"}>
                        <Box>
                          Title
                        </Box>
                      </Grid2>
                      <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-center"}>
                        <Box className={"dataset-add"} onClick={() => {
                          handlerAdd("title");
                        }}>
                          +
                        </Box>
                      </Grid2>
                    </Grid2>
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
                      <Grid2 container spacing={3}>
                        <Grid2 xl={7} lg={7} md={7} sm={7} xs={7} className={"p-5 d-center"}>
                          <Box className={"dataset-title"} onClick={() => {
                            setIdx((prev) => ({
                              ...prev,
                              titleIdx: index
                            }));
                          }}>
                            {item}
                          </Box>
                        </Grid2>
                        <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"p-5 d-center"}>
                          <Box className={"dataset-rename"} onClick={() => {
                            handlerRename("title", index);
                          }}>
                            o
                          </Box>
                        </Grid2>
                        <Grid2 xl={2} lg={2} md={2} sm={2} xs={2} className={"p-5 d-center"}>
                          <Box className={"dataset-delete"} onClick={() => {
                            handlerRemove("title", index);
                          }}>
                            x
                          </Box>
                        </Grid2>
                      </Grid2>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </React.Fragment>
    );
    // 7-7. table
    const tableSection = () => (
      <React.Fragment>
        <Box className={"block-wrapper"}>
          <Box className={"d-center p-10"}>
            {titleSection()}
          </Box>
          <Divider variant={"middle"} className={"mb-20"} />
          <Box className={"d-column"}>
            <Box className={"d-center"}>
              {tableFragment1(0)}
            </Box>
            <Box className={"d-center"}>
              {tableFragment2(0)}
            </Box>
            <Box className={"d-center"}>
              {tableFragment3(0)}
            </Box>
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
  const btnNode = () => {
    const confirmDefault = () => {
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
    return (
      <React.Fragment>
        <Btn DAYPICKER={""} setDAYPICKER={""} DATE={DATE} setDATE={setDATE}
          SEND={SEND}  FILTER={""} setFILTER={""} PAGING={""} setPAGING={""}
          flowSave={flowSave} navParam={navParam}
          part={"user"} plan={""} type={"dataset"}
        />
        <Button size={"small"} className={"danger-btn"} color={"error"} variant={"contained"}
        onClick={confirmDefault}>
          기본값
        </Button>
      </React.Fragment>
    );
  };

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