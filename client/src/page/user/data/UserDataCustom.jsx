// UserDataCustom.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../../import/ImportReacts.jsx";
import {useCallback, useRef} from "../../../import/ImportReacts.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {Loading, Footer} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Icons, Br20} from "../../../import/ImportComponents.jsx";
import {Card, Paper, Button} from "../../../import/ImportMuis.jsx";
import {TableContainer, Table, TableFooter} from "../../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../../import/ImportMuis.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataCustom = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const session = sessionStorage.getItem("dataCustom") || "{}";
  const calendarArray = JSON.parse(session)?.calendar || [];
  const exerciseArray = JSON.parse(session)?.exercise || [];
  const foodArray = JSON.parse(session)?.food || [];
  const moneyArray = JSON.parse(session)?.money || [];
  const sleepArray = JSON.parse(session)?.sleep || [];
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const dataCustomArray = ["exercise", "food", "calendar", "money", "sleep"];

  // 2-2. useState -------------------------------------------------------------------------------->
  /** @type {React.MutableRefObject<IntersectionObserver|null>} **/
  const observer = useRef(null);
  const [LOADING, setLOADING] = useState(false);
  const [MORE, setMORE] = useState(true);
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState -------------------------------------------------------------------------------->
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toDataCustom: "/user/data/custom",
  });
  const [DATE, setDATE] = useState({
    dateType: "day",
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
    dataCustom: {
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
    setLOADING(true);
    const res = await axios.get(`${URL_OBJECT}/data/custom`, {
      params: {
        user_id: sessionId
      }
    });
    // 첫번째 객체를 제외하고 데이터 추가
    setOBJECT((prev) => {
      if (prev.length === 1 && prev[0]._id === "") {
        return res.data.result;
      }
      else {
        return {...prev, ...res.data.result};
      }
    });
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
      sessionStorage.setItem("dataCustom", JSON.stringify(res.data.result.dataCustom));
      navigate(SEND.toDataCustom);
    }
    else {
      alert(res.data.msg);
    }
  };

  // 4-1. handler --------------------------------------------------------------------------------->
  const handlerAdd = (type) => {
    if (type === "part") {
      setOBJECT((prev) => ({
        ...prev,
        dataCustom: {
          ...prev.dataCustom,
          [dataType]: [
            ...prev.dataCustom[dataType], {
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
        dataCustom: {
          ...prev.dataCustom,
          [dataType]: [
            ...prev.dataCustom[dataType]?.slice(0, idx.partIdx), {
              ...prev.dataCustom[dataType]?.[idx.partIdx],
              [`${dataType}_title`]: [
                ...prev.dataCustom[dataType]?.[idx.partIdx]?.[`${dataType}_title`],
                ""
              ]
            },
            ...prev.dataCustom[dataType]?.slice(idx.partIdx + 1)
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
          dataCustom: {
            ...prev.dataCustom,
            [dataType]: [
              ...prev.dataCustom[dataType]?.slice(0, index), {
                ...prev.dataCustom[dataType]?.[index],
                [`${dataType}_part`]: newPart
              },
              ...prev.dataCustom[dataType]?.slice(index + 1)
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
          dataCustom: {
            ...prev.dataCustom,
            [dataType]: [
              ...prev.dataCustom[dataType]?.slice(0, idx.partIdx), {
                ...prev.dataCustom[dataType]?.[idx.partIdx],
                [`${dataType}_title`]: [
                  ...prev.dataCustom[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                  newTitle,
                  ...prev.dataCustom[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
                ]
              },
              ...prev.dataCustom[dataType]?.slice(idx.partIdx + 1)
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
        dataCustom: {
          ...prev.dataCustom,
          [dataType]: [
            ...prev.dataCustom[dataType]?.slice(0, index),
            ...prev.dataCustom[dataType]?.slice(index + 1)
          ]
        }
      }));
    }
    else if (type === "title") {
      setOBJECT((prev) => ({
        ...prev,
        dataCustom: {
          ...prev.dataCustom,
          [dataType]: [
            ...prev.dataCustom[dataType]?.slice(0, idx.partIdx), {
              ...prev.dataCustom[dataType]?.[idx.partIdx],
              [`${dataType}_title`]: [
                ...prev.dataCustom[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(0, index),
                ...prev.dataCustom[dataType]?.[idx.partIdx]?.[`${dataType}_title`]?.slice(index + 1)
              ]
            },
            ...prev.dataCustom[dataType]?.slice(idx.partIdx + 1)
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
        dataCustom: {
          ...prev.dataCustom,
          [dataType]: defaultArray
        }
      }));
    }
  };

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    // 7-6. popup
    const popupSection = (i, closePopup) => (
      <Card key={i} variant={"outlined"} className={"w-85vw h-60vh d-row border radius p-0"}>
        <TableContainer className={"border-right over-x-hidden"}>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr p-sticky top-0"}>
                <TableCell>
                  Part
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {OBJECT?.dataCustom[dataType]?.map((item, index) => (index > 0) && (
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
                        <Icons name={"TbPencil"} className={"w-14 h-14 navy"} onClick={() => {
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
                    <Icons name={"BiPlus"} className={"w-14 h-14"} onClick={() => {}} />
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
                    Title
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                {OBJECT?.dataCustom[dataType]?.[idx?.partIdx]?.[`${dataType}_title`]?.map((item, index) => (index > 0) && (
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
                          <Icons name={"TbPencil"} className={"w-14 h-14 navy"} onClick={() => {
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
                      <Icons name={"BiPlus"} className={"w-14 h-14"} onClick={() => {}} />
                    </Div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </Card>
    );
    // 7-7. fragment
    const tableFragment = (i=0) => (
      <Card className={"p-0 radius"} key={i}>
        <TableContainer>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr"}>
                <TableCell>
                  Section
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {dataCustomArray.map((item, index) => (
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
                          <Icons name={"TbPencil"} className={"w-18 h-18 navy ms-auto"}
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
    // 7-9. third
    const thirdSection = () => (
      tableSection()
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper"}>
        <Div className={"block-wrapper h-min85vh"}>
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

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
      {tableNode()}
      {footerNode()}
    </>
  );
};