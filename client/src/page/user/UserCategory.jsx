// UserCategory.jsx

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {useNavigate, useLocation} from "../../import/ImportReacts.jsx";
import {useTranslate} from "../../import/ImportHooks.jsx";
import {axios, moment} from "../../import/ImportLibs.jsx";
import {log} from "../../import/ImportUtils.jsx";
import {Loading, Footer, Empty} from "../../import/ImportLayouts.jsx";
import {PopUp, Div, Icons, Br20} from "../../import/ImportComponents.jsx";
import {Card, Paper} from "../../import/ImportMuis.jsx";
import {TableContainer, Table, TableFooter} from "../../import/ImportMuis.jsx";
import {TableHead, TableBody, TableRow, TableCell} from "../../import/ImportMuis.jsx";

// -------------------------------------------------------------------------------------------------
export const UserCategory = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_USER || "";
  const URL_OBJECT = URL + SUBFIX;
  const navigate = useNavigate();
  const location = useLocation();
  const {translate} = useTranslate();
  const location_dateStart = location?.state?.dateStart;
  const location_dateEnd = location?.state?.dateEnd;
  const PATH = location?.pathname;
  const firstStr = PATH?.split("/")[1] || "";
  const secondStr = PATH?.split("/")[2] || "";
  const thirdStr = PATH?.split("/")[3] || "";
  const dataCategoryArray = ["exercise", "food", "calendar", "money", "sleep"];
  const sessionId = sessionStorage.getItem("sessionId");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(false);
  const [dataType, setDataType] = useState("exercise");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toDataCategory: "/user/category",
  });
  const [DATE, setDATE] = useState({
    dateType: "day",
    dateStart: location_dateStart || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
    dateEnd: location_dateEnd || moment.tz("Asia/Seoul").format("YYYY-MM-DD"),
  });
  const [idx, setIdx] = useState({
    category1Idx: 0,
    category2Idx: 1,
    category3Idx: 1
  });
  const [selectedIdx, setSelectedIdx] = useState({
    category1Idx: 0,
    category2Idx: 1,
    category3Idx: 1
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_DEF = {
    user_id: sessionId,
    user_number: 0,
    dataCategory: {
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

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    await axios.get(`${URL_OBJECT}/category/list`, {
      params: {
        user_id: sessionId
      }
    })
    .then((res) => {
      // 첫번째 객체를 제외하고 데이터 추가
      setOBJECT((prev) => {
        if (prev.length === 1 && prev[0]?._id === "") {
          return res.data.result;
        }
        else {
          return {...prev, ...res.data.result};
        }
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  })()}, [sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    await axios.post(`${URL_OBJECT}/category/save`, {
      user_id: sessionId,
      OBJECT: OBJECT
    })
    .then((res) => {
      if (res.data.status === "success") {
        alert(res.data.msg);
        sessionStorage.setItem("dataCategory", JSON.stringify(res.data.result.dataCategory));
      }
      else {
        alert(res.data.msg);
      }
    })
    .catch((err) => {
      console.error(err);
    })
  };

  // 4-1. handler ----------------------------------------------------------------------------------
  const handlerAdd = (type) => {
    if (type === "part") {
      setOBJECT((prev) => {
        const newPart = {
          [`${dataType}_part`]: "",
          [`${dataType}_title`]: [""]
        };
        return {
          ...prev,
          dataCategory: {
            ...prev.dataCategory,
            [dataType]: [
              ...prev.dataCategory[dataType],
              newPart
            ]
          }
        };
      });
    }
    else if (type === "title") {
      setOBJECT((prev) => {
        const newTitle = "";
        return {
          ...prev,
          dataCategory: {
            ...prev.dataCategory,
            [dataType]: [
              ...prev.dataCategory[dataType]?.slice(0, idx.category2Idx),
              {
                ...prev.dataCategory[dataType]?.[idx.category2Idx],
                [`${dataType}_title`]: [
                  ...prev.dataCategory[dataType]?.[idx.category2Idx]?.[`${dataType}_title`],
                  newTitle
                ]
              },
              ...prev.dataCategory[dataType]?.slice(idx.category2Idx + 1)
            ]
          }
        };
      });
    }
  };

  // 4-2. handler ----------------------------------------------------------------------------------
  const handlerRename = (type, index) => {
    if (type === "part") {
      const newCategory2 = prompt("새로운 이름을 입력하세요.");
      if (newCategory2) {
        setOBJECT((prev) => {
          return {
            ...prev,
            dataCategory: {
              ...prev.dataCategory,
              [dataType]: [
                ...prev.dataCategory[dataType]?.slice(0, index),
                {
                  ...prev.dataCategory[dataType]?.[index],
                  [`${dataType}_part`]: newCategory2
                },
                ...prev.dataCategory[dataType]?.slice(index + 1)
              ]
            }
          };
        });
      }
    }
    else if (type === "title") {
      const newCategory3 = prompt("새로운 이름을 입력하세요.");
      if (newCategory3) {
        setOBJECT((prev) => {
          return {
            ...prev,
            dataCategory: {
              ...prev.dataCategory,
              [dataType]: [
                ...prev.dataCategory[dataType]?.slice(0, idx.category2Idx),
                {
                  ...prev.dataCategory[dataType]?.[idx.category2Idx],
                  [`${dataType}_title`]: [
                    ...prev.dataCategory[dataType]?.[idx.category2Idx]?.[`${dataType}_title`]?.slice(0, index),
                    newCategory3,
                    ...prev.dataCategory[dataType]?.[idx.category2Idx]?.[`${dataType}_title`]?.slice(index + 1)
                  ]
                },
                ...prev.dataCategory[dataType]?.slice(idx.category2Idx + 1)
              ]
            }
          };
        });
      }
    }
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerRemove = (type, index) => {
    if (type === "part") {
      setOBJECT((prev) => {
        const newCategory1 = [
          ...prev.dataCategory[dataType]?.slice(0, index),
          ...prev.dataCategory[dataType]?.slice(index + 1)
        ];
        // 하나만 남았을 때 삭제 시도 시 경고
        if (newCategory1.length <= 1) {
          alert("마지막 항목은 삭제할 수 없습니다.");
          return prev;
        }

        return {
          ...prev,
          dataCategory: {
            ...prev.dataCategory,
            [dataType]: newCategory1
          }
        };
      });
    }
    else if (type === "title") {
      setOBJECT((prev) => {
        const currentTitles = prev.dataCategory?.[dataType]?.[idx.category2Idx]?.[`${dataType}_title`];
        const newTitles = [
          ...currentTitles.slice(0, index),
          ...currentTitles.slice(index + 1)
        ];
        // 하나만 남았을 때 삭제 시도 시 경고
        if (currentTitles.length <= 2) {
          alert("마지막 항목은 삭제할 수 없습니다.");
          return prev;
        }

        return {
          ...prev,
          dataCategory: {
            ...prev.dataCategory,
            [dataType]: [
              ...prev.dataCategory[dataType]?.slice(0, idx.category2Idx),
              {
                ...prev.dataCategory[dataType]?.[idx.category2Idx],
                [`${dataType}_title`]: newTitles
              },
              ...prev.dataCategory[dataType]?.slice(idx.category2Idx + 1)
            ]
          }
        };
      });
    }
  };

  // 6. table --------------------------------------------------------------------------------------
  const tableNode = () => {
    // 7-1. popup
    const popupSection = (i, closePopup) => (
      <Card key={i} variant={"outlined"} className={"w-85vw h-60vh d-row border radius p-0"}>
        <TableContainer className={"border-right over-x-hidden"}>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr p-sticky top-0"}>
                <TableCell>
                  {translate("dataCategory2")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {OBJECT?.dataCategory[dataType]?.map((item, index) => (index > 0) && (
                <TableRow key={index} className={"table-tbody-tr border-bottom"}
                  onClick={() => {
                    setSelectedIdx((prev) => ({
                      ...prev,
                      category2Idx: index
                    }));
                  }}>
                  <TableCell className={selectedIdx.category2Idx === index ? "bg-light" : ""}>
                    <Div className={"d-center"} onClick={() => {
                      setIdx((prev) => ({
                        ...prev,
                        category2Idx: index
                      }));
                    }}>
                      <Div className={"fs-0-9rem ms-auto"}>
                        {translate(item[`${dataType}_part`])}
                      </Div>
                      <Div className={"fs-0-9rem ms-auto"}>
                        <Icons name={"TbPencil"} className={"w-14 h-14 navy"} onClick={() => {
                          handlerRename("part", index);
                        }} />
                        <Icons name={"TbTrash"} className={"w-14 h-14 red"} onClick={() => {
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
                    <Icons name={"TbPlus"} className={"w-14 h-14"} onClick={() => {}} />
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
                    {translate("dataCategory3")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                {OBJECT?.dataCategory[dataType]?.[idx?.category2Idx]?.[`${dataType}_title`]?.map((item, index) => (index > 0) && (
                  <TableRow key={index} className={"table-tbody-tr border-bottom"}
                    onClick={() => {
                      setSelectedIdx((prev) => ({
                        ...prev,
                        category3Idx: index
                      }));
                    }}>
                    <TableCell>
                      <Div className={"d-center"} onClick={() => {
                        setIdx((prev) => ({
                          ...prev,
                          category3Idx: index
                        }));
                      }}>
                        <Div className={"fs-0-9rem ms-auto"}>
                          {translate(item)}
                        </Div>
                        <Div className={"fs-0-9rem ms-auto d-row"}>
                          <Icons name={"TbPencil"} className={"w-14 h-14 navy"} onClick={() => {
                            handlerRename("title", index);
                          }} />
                          <Icons name={"TbTrash"} className={"w-14 h-14 red"} onClick={() => {
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
                      <Icons name={"TbPlus"} className={"w-14 h-14"} onClick={() => {}} />
                    </Div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </Card>
    );
    // 7-2. table
    const tableSection = () => {
      const tableFragment = (i) => (
        <Card className={"border radius shadow-none p-0"} key={i}>
          <TableContainer>
            <Table>
              <TableHead className={"table-thead"}>
                <TableRow className={"table-thead-tr"}>
                  <TableCell>
                    {translate("dataCategory1")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                {dataCategoryArray?.map((item, index) => (
                  <TableRow key={index} className={"table-tbody-tr border-top"}>
                    <TableCell className={`${dataType === item ? "bg-light" : ""}`}>
                      <Div className={"d-center"}>
                        <Div className={"fs-1-0rem ms-0"}>
                          {translate(item)}
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
                                  category1Idx: index,
                                  category2Idx: 1,
                                  category3Idx: 1
                                }));
                                setIdx((prev) => ({
                                  ...prev,
                                  category2Idx: 1,
                                  category3Idx: 1
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
      return (
        LOADING ? <Loading /> : tableFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min75vh"}>
          {tableSection()}
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

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {tableNode()}
      {footerNode()}
    </>
  );
};