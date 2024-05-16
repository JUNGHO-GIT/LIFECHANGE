// UserDataset.jsx

import {React, useState, useEffect, useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {axios, numeral, moment} from "../../import/ImportLibs.jsx";
import {Loading, Footer} from "../../import/ImportLayouts.jsx";
import {PopUp, Div} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {TableContainer, Table} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataset = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const session = sessionStorage.getItem("dataset") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const foodArray = JSON.parse(session)?.food || [];
  const moneyArray = JSON.parse(session)?.money || [];
  const sleepArray = JSON.parse(session)?.sleep || [];
  const navigate = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const partStr = PATH?.split("/")[1] ? PATH?.split("/")[1] : "";
  const typeStr = PATH?.split("/")[2] ? PATH?.split("/")[2] : "";
  const thirdStr = PATH?.split("/")[3] ? PATH?.split("/")[3] : "";
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
    startDt: location_startDt || moment().format("YYYY-MM-DD"),
    endDt: location_endDt || moment().format("YYYY-MM-DD"),
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
      navigate(SEND.toDataset);
    }
    else {
      alert(res.data.msg);
      sessionStorage.setItem("dataset", JSON.stringify(OBJECT_DEF.user_dataset));
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
    // 7-6-1. table
    const tableFragment1 = (i) => (
      <Card variant={"outlined"} className={"p-0 mb-20"} key={i}>
        <TableContainer className={"over-x-hidden"}>
          <Table>
            <TableHead>
              <TableRow className={"table-thead-tr"}>
                <TableCell>
                  <Div className={"d-center"}>
                    <Div className={"fs-1-0rem"}>Section</Div>
                  </Div>
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
                    <Div className={"dataset-title"}>
                      <Div className={"fs-1-0rem ms-0"}>{item}</Div>
                    </Div>
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
      <Card variant={"outlined"} className={"p-0 mb-20 w-50p"} key={i}>
        <TableContainer className={"over-x-hidden"}>
          <Table>
            <TableHead>
              <TableRow className={"table-thead-tr"}>
                <TableCell>
                  <Div className={"d-center"}>
                    <Div className={"fs-1-0rem ms-auto"}>Part</Div>
                    <Icons name={"BiPlus"} className={"w-18 h-18 white ms-auto"} onClick={() => {
                      handlerAdd("part");
                    }} />
                  </Div>
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
                    <Div className={"dataset-title"} onClick={() => {
                      setIdx((prev) => ({
                        ...prev,
                        partIdx: index
                      }));
                    }}>
                      <Div className={"fs-1-0rem ms-auto"}>{item[`${dataType}_part`]}</Div>
                      <Icons name={"BiEdit"} className={"w-18 h-18 icon ms-auto"} onClick={() => {
                        handlerRename("part", index);
                      }} />
                      <Icons name={"BiTrash"} className={"w-18 h-18 icon ms-10"} onClick={() => {
                        handlerRemove("part", index);
                      }} />
                    </Div>
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
      <Card variant={"outlined"} className={"p-0 mb-20 w-50p"} key={i}>
        <TableContainer className={"over-x-hidden"}>
          <Table>
            <TableHead>
              <TableRow className={"table-thead-tr"}>
                <TableCell>
                  <Div className={"d-center"}>
                    <Div className={"fs-1-0rem ms-auto"}>Title</Div>
                    <Icons name={"BiPlus"} className={"w-18 h-18 white ms-auto"} onClick={() => {
                      handlerAdd("title");
                    }} />
                  </Div>
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
                    <Div className={"dataset-title"} onClick={() => {
                      setIdx((prev) => ({
                        ...prev,
                        titleIdx: index
                      }));
                    }}>
                      <Div className={"fs-1-0rem ms-auto"}>
                        {item}
                      </Div>
                      <Icons name={"BiEdit"} className={"w-18 h-18 icon ms-auto"} onClick={() => {
                        handlerRename("title", index);
                      }} />
                      <Icons name={"BiTrash"} className={"w-18 h-18 icon ms-10"} onClick={() => {
                        handlerRemove("title", index);
                      }} />
                    </Div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-6-3. table
    const tableSection = () => (
      <Div className={"block-wrapper w-min90vw h-min68vh"}>
        <Div className={"d-column"}>
          {tableFragment1(0)}
        </Div>
        <Div className={"d-row align-start"}>
          {tableFragment2(0)}
          {tableFragment3(0)}
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
        part: partStr,
        type: typeStr,
        third: thirdStr,
      }}
      objects={{
        DATE, SEND
      }}
      functions={{
        setDATE, setSEND
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