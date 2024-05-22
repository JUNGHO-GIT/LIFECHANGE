// UserDataSet.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useStorage, useTranslate} from "../../../import/ImportHooks.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Icons, Br20} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Button} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table, TableFooter} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataSet = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const session = sessionStorage.getItem("dataSet") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const foodArray = JSON.parse(session)?.food || [];
  const moneyArray = JSON.parse(session)?.money || [];
  const sleepArray = JSON.parse(session)?.sleep || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart?.trim()?.toString();
  const location_dateEnd = location?.state?.dateEnd?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const dataSetArray = ["exercise", "food", "calendar", "money", "sleep"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toDataSet: "/user/data/set",
  });
  const [DATE, setDATE] = useState({
    dateStart: location_dateStart,
    dateEnd: location_dateEnd,
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
  const [dataType, setDataType] = useState("exercise");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEF = {
    user_id: sessionId,
    user_number: 0,
    dataSet: {
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
    const res = await axios.get(`${URL_OBJECT}/data/set`, {
      params: {
        user_id: sessionId
      }
    });
    setOBJECT(res.data.result || OBJECT_DEF);
    setLOADING(false);
  })()}, [sessionId]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const res = await axios.post(`${URL_OBJECT}/save`, {
      user_id: sessionId,
      OBJECT: OBJECT
    });
    if (res.data.status === "success") {
      alert(res.data.msg);
      sessionStorage.setItem("dataSet", JSON.stringify(res.data.result.dataSet));
      navigate(SEND.toDataSet);
    }
    else {
      alert(res.data.msg);
      sessionStorage.setItem("dataSet", JSON.stringify(OBJECT_DEF.dataSet));
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handlerAdd = (type) => {
    if (type === "part") {
      setOBJECT((prev) => ({
        ...prev,
        dataSet: {
          ...prev.dataSet,
          [dataType]: [
            ...prev.dataSet[dataType], {
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
        dataSet: {
          ...prev.dataSet,
          [dataType]: [
            ...prev.dataSet[dataType]?.slice(0, idx.partIdx), {
              ...prev.dataSet[dataType]?.[idx.partIdx],
              [`${dataType}_title`]: [
                ...prev.dataSet[dataType]?.[idx.partIdx]?.[`${dataType}_title`],
                ""
              ]
            },
            ...prev.dataSet[dataType]?.slice(idx.partIdx + 1)
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
          dataSet: {
            ...prev.dataSet,
            [dataType]: [
              ...prev.dataSet[dataType]?.slice(0, index), {
                ...prev.dataSet[dataType]?.[index],
                [`${dataType}_part`]: newPart
              },
              ...prev.dataSet[dataType]?.slice(index + 1)
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
          dataSet: {
            ...prev.dataSet,
            [dataType]: [
              ...prev.dataSet[dataType]?.slice(0, idx.partIdx), {
                ...prev.dataSet[dataType]?.[idx.partIdx],
                [`${dataType}_title`]: [
                  ...prev.dataSet[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                  newTitle,
                  ...prev.dataSet[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
                ]
              },
              ...prev.dataSet[dataType]?.slice(idx.partIdx + 1)
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
        dataSet: {
          ...prev.dataSet,
          [dataType]: [
            ...prev.dataSet[dataType]?.slice(0, index),
            ...prev.dataSet[dataType]?.slice(index + 1)
          ]
        }
      }));
    }
    else if (type === "title") {
      setOBJECT((prev) => ({
        ...prev,
        dataSet: {
          ...prev.dataSet,
          [dataType]: [
            ...prev.dataSet[dataType]?.slice(0, idx.partIdx), {
              ...prev.dataSet[dataType]?.[idx.partIdx],
              [`${dataType}_title`]: [
                ...prev.dataSet[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                ...prev.dataSet[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
              ]
            },
            ...prev.dataSet[dataType]?.slice(idx.partIdx + 1)
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
        dataSet: {
          ...prev.dataSet,
          [dataType]: defaultArray
        }
      }));
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. popup
    const popupSection = (i, closePopup) => (
      <Div className={"d-column"}>
        <Div className={"d-center mb-20"}>
          <Card key={i} variant={"outlined"} className={"w-85vw h-60vh border d-row"}>
            <TableContainer className={"border-right over-x-hidden"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className={"table-thead-tr p-sticky top-0"}>
                    <TableCell>
                      <Div className={"d-center"}>
                        <Div className={"fs-1-0rem m-auto"}>
                          Part
                        </Div>
                      </Div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {OBJECT?.dataSet[dataType]?.map((item, index) => (index > 0) && (
                    <TableRow key={index} className={`table-tbody-tr`}
                      onClick={() => {
                        setSelectedIdx((prev) => ({
                          ...prev,
                          partIdx: index
                        }));
                      }}>
                      <TableCell className={selectedIdx.partIdx === index ? "bg-light" : ""}>
                        <Div className={"d-center"} onClick={() => {
                          setIdx((prev) => ({
                            ...prev,
                            partIdx: index
                          }));
                        }}>
                          <Div className={"fs-0-9rem ms-auto"}>
                            {item[`${dataType}_part`]}
                          </Div>
                          <Div className={"fs-0-9rem ms-auto me-n10"}>
                            <Icons name={"BiEdit"} className={"w-14 h-14 navy"} onClick={() => {
                              handlerRename("part", index);
                            }} />
                            <Icons name={"BiTrash"} className={"w-14 h-14 red"} onClick={() => {
                              handlerRemove("part", index);
                            }} />
                          </Div>
                        </Div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className={"table-tfoot"}>
                  <TableRow className={"table-tfoot-tr"}>
                    <TableCell>
                      <Div className={"d-center"} onClick={() => {
                        handlerAdd("part");
                      }}>
                        <Icons name={"BiPlus"} className={"w-14 h-14"} />
                      </Div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            {(dataType === "exercise" || dataType === "money") && (
              <TableContainer className={"border-left over-x-hidden"}>
                <Table>
                  <TableHead className={"table-thead"}>
                    <TableRow className={"table-thead-tr p-sticky top-0"}>
                      <TableCell>
                        <Div className={"d-center"}>
                          <Div className={"fs-1-0rem m-auto"}>
                            Title
                          </Div>
                        </Div>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody className={"table-tbody"}>
                    {OBJECT?.dataSet[dataType]?.[idx?.partIdx]?.[`${dataType}_title`]?.map((item, index) => (index > 0) && (
                      <TableRow key={index} className={`table-tbody-tr`}
                        onClick={() => {
                          setSelectedIdx((prev) => ({
                            ...prev,
                            titleIdx: index
                          }));
                        }}>
                        <TableCell>
                          <Div className={"d-center"} onClick={() => {
                            setIdx((prev) => ({
                              ...prev,
                              titleIdx: index
                            }));
                          }}>
                            <Div className={"fs-0-9rem ms-auto"}>
                              {item}
                            </Div>
                            <Div className={"fs-0-9rem ms-auto d-row me-n10"}>
                              <Icons name={"BiEdit"} className={"w-14 h-14 navy"} onClick={() => {
                                handlerRename("title", index);
                              }} />
                              <Icons name={"BiTrash"} className={"w-14 h-14 red"} onClick={() => {
                                handlerRemove("title", index);
                              }} />
                            </Div>
                          </Div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className={"table-tfoot"}>
                    <TableRow className={"table-tfoot-tr"}>
                      <TableCell>
                        <Div className={"d-center"} onClick={() => {
                          handlerAdd("title");
                        }}>
                          <Icons name={"BiPlus"} className={"w-14 h-14"} />
                        </Div>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Div>
        <Div className={"d-center"}>
          <Button size={"small"} type={"button"} color={"primary"} variant={"contained"} className={"primary-btn"} onClick={() => {
            closePopup();
          }}>
            O
          </Button>
        </Div>
      </Div>
    );
    // 7-7. fragment
    const tableFragment = (i) => (
      <Card variant={"outlined"} className={"p-0"} key={i}>
        <TableContainer>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr"}>
                <TableCell>
                  <Div className={"d-center"}>
                    <Div className={"fs-1-0rem"}>Section</Div>
                  </Div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {dataSetArray.map((item, index) => (
                <TableRow key={index} className={"table-tbody-tr"}>
                  <TableCell className={`${dataType === item ? "bg-light" : ""}`}>
                    <Div className={"d-center"}>
                      <Div className={"fs-1-0rem ms-0"}>
                        {item}
                      </Div>
                      <Div className={"fs-1-0rem ms-auto"}>
                      <PopUp
                        key={i}
                        type={"innerCenter"}
                        position={"bottom"}
                        direction={"center"}
                        contents={({closePopup}) => (
                          popupSection(i, closePopup)
                        )}>
                        {(popTrigger={}) => (
                          <Icons name={"BiEdit"} className={"w-18 h-18 navy ms-auto"}
                            onClick={(e={}) => {
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
                              popTrigger.openPopup(e.currentTarget)
                            }}
                          />
                        )}
                        </PopUp>
                      </Div>
                    </Div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    );
    // 7-8. table
    const tableSection = () => (
      tableFragment(0)
    );
    // 7-9. first (x)
    // 7-10. second (x)
    // 7-11. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min65vh"}>
          {thirdSection()}
        </Div>
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
        DATE, SEND
      }}
      functions={{
        setDATE, setSEND
      }}
      handlers={{
        navigate, flowSave, handlerDefault
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