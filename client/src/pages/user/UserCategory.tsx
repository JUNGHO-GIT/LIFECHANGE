// UserCategory.tsx

import { useState, useEffect, createRef, useRef } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useStorage } from "@imports/ImportHooks";
import { Category } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportLibs";
import { sync } from "@imports/ImportUtils";
import { Loading, Footer } from "@imports/ImportLayouts";
import { PopUp, Input } from "@imports/ImportContainers";
import { Div, Icons } from "@imports/ImportComponents";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { TableContainer, Table, TableFooter } from "@imports/ImportMuis";
import { TableHead, TableBody, TableRow, TableCell } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserCategory = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    location_dateStart, location_dateEnd, PATH, URL_OBJECT, sessionId, TITLE, location_dateType
  } = useCommonValue();
  const {
    dayFmt
  } = useCommonDate();
  const {
    translate,
  } = useTranslate();

  // 2-2. useStorage -------------------------------------------------------------------------------
  // 리스트에서만 사용
  const [DATE, setDATE] = useStorage(
    `${TITLE}_date_(${PATH})`, {
      dateType: location_dateType || "day",
      dateStart: location_dateStart || dayFmt,
      dateEnd: location_dateEnd || dayFmt,
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(false);

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState<any>(Category);
  const REFS = useRef<any>();
  const [dataType, setDataType] = useState<string>("exercise");
  const [isEditable, setIsEditable] = useState<string>("");
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });
  const [selectedIdx, setSelectedIdx] = useState<any>({
    category1Idx: 0,
    category2Idx: 1,
    category3Idx: 1,
  });

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/category/detail`, {
      params: {
        user_id: sessionId
      }
    })
    .then((res: any) => {
      setOBJECT(res.data.result || Category);
      Object.keys(res.data.result).map((dataType: string) => (
        REFS.current = {
          ...REFS.current,
          [dataType]: Array.from({ length: res.data.result[dataType].length }, (_, _idx) => (
            Object.keys(res.data.result[dataType][_idx]).reduce((acc: any, cur: string) => ({
              ...acc,
              [cur]: createRef()
            }), {})
          ))
        }
      ));
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = () => {
    setLOADING(true);
    axios.post(`${URL_OBJECT}/category/update`, {
      user_id: sessionId,
      OBJECT: OBJECT
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sync();
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 4-1. handler ----------------------------------------------------------------------------------
  const handlerAdd = (type: string) => {
    if (type === "part") {
      setOBJECT((prev: any) => {
        const updatedObject = {
          ...prev,
          [dataType]: [
            ...prev[dataType],
            {
              [`${dataType}_part`]: ""
            }
          ]
        };
        REFS.current = {
          ...REFS.current,
          [dataType]: updatedObject[dataType].map((_: any, idx: number) =>
            REFS.current[dataType]?.[idx] || {
              [`${dataType}_part`]: createRef()
            }
          )
        };
        return updatedObject;
      });
    }
    else if (type === "title") {
      setOBJECT((prev: any) => {
        const updatedObject = {
          ...prev,
          [dataType]: [
            ...prev[dataType]?.slice(0, selectedIdx.category2Idx),
            {
              ...prev[dataType]?.[selectedIdx.category2Idx],
              [`${dataType}_title`]: [
                ...prev[dataType]?.[selectedIdx.category2Idx]?.[`${dataType}_title`],
                ""
              ]
            },
            ...prev[dataType]?.slice(selectedIdx.category2Idx + 1)
          ]
        };
        REFS.current = {
          ...REFS.current,
          [dataType]: updatedObject[dataType].map((part: any, idx: number) => ({
            ...REFS.current[dataType]?.[idx],
            [`${dataType}_title`]: part[`${dataType}_title`].map((_: any, titleIdx: number) =>
              REFS.current[dataType]?.[idx]?.[`${dataType}_title`]?.[titleIdx] || {}
            )
          }))
        };
        return updatedObject;
      });
    }
  };

  // 4-2. handler ----------------------------------------------------------------------------------
  const handlerRename = (type: string, index: number) => {
    setIsEditable(`${dataType}_${type}_${index}`);
    setTimeout(() => {
      REFS?.current?.[dataType]?.[index]?.[`${dataType}_${type}`]?.current?.focus();
    }, 10);
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerRemove = (type: string, index: number) => {
    if (type === "part") {
      if (OBJECT[dataType].length <= 1) {
        alert(translate("cantBeDeletedLastItem"));
        return;
      }
      setOBJECT((prev: any) => {
        const updatedObject = {
          ...prev,
          [dataType]: [
            ...prev[dataType]?.slice(0, index),
            ...prev[dataType]?.slice(index + 1)
          ]
        };
        REFS.current = {
          ...REFS.current,
          [dataType]: updatedObject[dataType].map((_: any, idx: number) => REFS.current[dataType]?.[idx] || {})
        };
        return updatedObject;
      });
    }
    else if (type === "title") {
      if (OBJECT[dataType]?.[selectedIdx.category2Idx]?.[`${dataType}_title`]?.length <= 2) {
        alert(translate("cantBeDeletedLastItem"));
        return;
      }
      setOBJECT((prev: any) => {
        const updatedObject = {
          ...prev,
          [dataType]: [
            ...prev[dataType]?.slice(0, selectedIdx.category2Idx),
            {
              ...prev[dataType]?.[selectedIdx.category2Idx],
              [`${dataType}_title`]: [
                ...prev[dataType]?.[selectedIdx.category2Idx]?.[`${dataType}_title`]?.slice(0, index),
                ...prev[dataType]?.[selectedIdx.category2Idx]?.[`${dataType}_title`]?.slice(index + 1)
              ]
            },
            ...prev[dataType]?.slice(selectedIdx.category2Idx + 1)
          ]
        };
        REFS.current = {
          ...REFS.current,
          [dataType]: updatedObject[dataType].map((part: any, idx: number) => ({
            ...REFS.current[dataType]?.[idx],
            [`${dataType}_title`]: part[`${dataType}_title`].map((_: any, titleIdx: number) =>
              REFS.current[dataType]?.[idx]?.[`${dataType}_title`]?.[titleIdx] || {}
            )
          }))
        };
        return updatedObject;
      });
    }
  };

  // 7. userCategory -------------------------------------------------------------------------------
  const userCategoryNode = () => {
    // 7-1. popup
    const popupSection = (i: number) => (
      <Card className={"w-85vw h-60vh d-row border-1 radius-1 p-0"} key={`${i}`}>
        <TableContainer className={"border-right-1 over-x-hidden"} key={`category2-${i}`}>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr p-sticky top-0 z-900"}>
                <TableCell>
                  {translate("dataCategory2")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {OBJECT[dataType]?.map((item: any, index: number) => (index > 0) && (
                <TableRow key={index} className={"table-tbody-tr border-bottom-1"}>
                  <TableCell className={selectedIdx.category2Idx === index ? "bg-light" : ""}>
                    <Div className={"d-center"}>
                      <Div className={"fs-0-9rem ms-auto"}>
                        <Input
                          variant={"standard"}
                          value={translate(item[`${dataType}_part`]) || ""}
                          readOnly={isEditable !== `${dataType}_part_${index}`}
                          inputclass={"fs-0-9rem"}
                          inputRef={REFS?.current?.[dataType]?.[index]?.[`${dataType}_part`]}
                          sx={{
                            "& .MuiInput-root::after": {
                              borderBottom: isEditable === `${dataType}_part_${index}` ? (
                                "2px solid #1976d2"
                              ) : (
                                "2px solid #000000"
                              )
                            }
                          }}
                          onClick={(e: any) => {
                            if (isEditable !== `${dataType}_part_${index}`) {
                              e.preventDefault();
                              e.stopPropagation();
                              const target = e.currentTarget;
                              target.classList.add('shake');
                              setTimeout(() => {
                                target.classList.remove('shake');
                              }, 700);
                            }
                          }}
                          onChange={(e: any) => {
                            setOBJECT((prev: any) => ({
                              ...prev,
                              [dataType]: [
                                ...prev[dataType]?.slice(0, index),
                                {
                                  ...prev[dataType]?.[index],
                                  [`${dataType}_part`]: e.target.value
                                },
                                ...prev[dataType]?.slice(index + 1)
                              ]
                            }));
                          }}
                        />
                      </Div>
                      <Div className={"fs-0-9rem ms-auto d-row-right"}>
                        <Icons
                          name={"Search"}
                          className={"w-12 h-12"}
                          onClick={() => {
                            setSelectedIdx((prev: any) => ({
                              ...prev,
                              category2Idx: index
                            }));
                          }}
                        />
                        <Icons
                          name={"Pencil"}
                          className={"w-12 h-12 navy"}
                          onClick={() => {
                            setSelectedIdx((prev: any) => ({
                              ...prev,
                              category2Idx: index
                            }));
                            handlerRename("part", index);
                          }}
                        />
                        <Icons
                          name={"Trash"}
                          className={"w-12 h-12 burgundy"}
                          onClick={() => {
                            setSelectedIdx((prev: any) => ({
                              ...prev,
                              category2Idx: index
                            }));
                            handlerRemove("part", index);
                          }}
                        />
                      </Div>
                    </Div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className={"table-tfoot"}>
              <TableRow className={"table-tfoot-tr"}>
                <TableCell>
                  <Div className={"d-center"}>
                    <Icons
                      key={"Plus"}
                      name={"Plus"}
                      className={"w-12 h-12"}
                      onClick={() => {
                        handlerAdd("part");
                      }}
                    />
                  </Div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
        {(dataType === "exercise" || dataType === "money") && (
          <TableContainer className={"border-left-1 over-x-hidden"} key={`category3-${i}`}>
            <Table>
              <TableHead className={"table-thead"}>
                <TableRow className={"table-thead-tr p-sticky top-0 z-900"}>
                  <TableCell>
                    {translate("dataCategory3")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                {OBJECT[dataType]?.[selectedIdx?.category2Idx]?.[`${dataType}_title`]?.map((item: any, index: number) => (index > 0) && (
                  <TableRow key={index} className={"table-tbody-tr border-bottom-1"}>
                    <TableCell>
                      <Div className={"d-center"}>
                        <Div className={"fs-0-9rem ms-auto"}>
                          <Input
                            variant={"standard"}
                            value={translate(item) || ""}
                            readOnly={isEditable !== `${dataType}_title_${index}`}
                            inputclass={"fs-0-9rem"}
                            inputRef={REFS?.current?.[dataType]?.[selectedIdx?.category2Idx]?.[`${dataType}_title`]?.[index]}
                            sx={{
                              "& .MuiInput-root::after": {
                                borderBottom: isEditable === `${dataType}_title_${index}` ? (
                                  "2px solid #1976d2"
                                ) : (
                                  "2px solid #000000"
                                )
                              }
                            }}
                            onClick={(e: any) => {
                              if (isEditable !== `${dataType}_title_${index}`) {
                                e.preventDefault();
                                e.stopPropagation();
                                const target = e.currentTarget;
                                target.classList.add('shake');
                                setTimeout(() => {
                                  target.classList.remove('shake');
                                }, 700);
                              }
                            }}
                            onChange={(e: any) => {
                              setOBJECT((prev: any) => ({
                                ...prev,
                                [dataType]: [
                                  ...prev[dataType]?.slice(0, selectedIdx.category2Idx),
                                  {
                                    ...prev[dataType]?.[selectedIdx.category2Idx],
                                    [`${dataType}_title`]: [
                                      ...prev[dataType]?.[selectedIdx.category2Idx]?.[`${dataType}_title`]?.slice(0, index),
                                      e.target.value,
                                      ...prev[dataType]?.[selectedIdx.category2Idx]?.[`${dataType}_title`]?.slice(index + 1)
                                    ]
                                  },
                                  ...prev[dataType]?.slice(selectedIdx.category2Idx + 1)
                                ]
                              }));
                            }}
                          />
                        </Div>
                        <Div className={"fs-0-9rem ms-auto d-row-right"}>
                          <Icons
                            name={"Pencil"}
                            className={"w-12 h-12 navy"}
                            onClick={() => {
                              setSelectedIdx((prev: any) => ({
                                ...prev,
                                category3Idx: index
                              }));
                              handlerRename("title", index);
                            }}
                          />
                          <Icons
                            name={"Trash"}
                            className={"w-12 h-12 burgundy"}
                            onClick={() => {
                              setSelectedIdx((prev: any) => ({
                                ...prev,
                                category3Idx: index
                              }));
                              handlerRemove("title", index);
                            }}
                          />
                        </Div>
                      </Div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className={"table-tfoot"}>
                <TableRow className={"table-tfoot-tr"}>
                  <TableCell>
                    <Div className={"d-center"}>
                      <Icons
                        key={"Plus"}
                        name={"Plus"}
                        className={"w-12 h-12"}
                        onClick={() => {
                          handlerAdd("part");
                        }}
                      />
                    </Div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </Card>
    );

    // 7-2. card
    const detailSection = () => {
      const detailFragment = (i: number) => (
        <Card className={"border-1 radius-1 p-0"} key={`category1-${i}`}>
          <TableContainer>
            <Table>
              <TableHead className={"table-thead"}>
                <TableRow className={"table-thead-tr"}>
                  <TableCell className={"fs-1-0rem"}>
                    {translate("dataCategory1")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                {Object.keys(OBJECT).map((item: any, index: number) => (
                  <TableRow key={index} className={"table-tbody-tr border-top-1"}>
                    <TableCell className={`${dataType === item ? "bg-light" : ""}`}>
                      <Div className={"d-center"}>
                        <Div className={"fs-1-0rem ms-0"}>
                          {translate(item)}
                        </Div>
                        <Div className={"fs-1-0rem ms-auto"}>
                        <PopUp
                          key={i}
                          type={"innerCenter"}
                          position={"center"}
                          direction={"center"}
                          contents={
                            popupSection(i)
                          }
                        >
                          {(popTrigger: any) => (
                            <Icons
                              key={"Search"}
                              name={"Search"}
                              className={"w-18 h-18 black ms-auto"}
                              onClick={(e: any) => {
                                setDataType(item);
                                setSelectedIdx((prev: any) => ({
                                  ...prev,
                                  category1Idx: index,
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
        LOADING ? <Loading /> : detailFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 h-min95vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {detailSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 9. footer -------------------------------------------------------------------------------------
  const footerNode = () => (
    <Footer
      state={{
        DATE, SEND
      }}
      setState={{
        setDATE, setSEND
      }}
      flow={{
        flowSave
      }}
    />
  );

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {userCategoryNode()}
      {footerNode()}
    </>
  );
};