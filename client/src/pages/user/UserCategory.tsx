// UserCategory.tsx
// Node -> Section -> Fragment

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate, useStorage } from "@imports/ImportHooks";
import { useValidateUser } from "@imports/ImportValidates";
import { Category } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportLibs";
import { Loading, Footer } from "@imports/ImportLayouts";
import { Div, Icons, Input } from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { Card, Paper, Grid } from "@imports/ImportMuis";
import { TableContainer, Table, TableFooter } from "@imports/ImportMuis";
import { TableHead, TableBody, TableRow, TableCell } from "@imports/ImportMuis";

// -------------------------------------------------------------------------------------------------
export const UserCategory = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt
  } = useCommonDate();
  const {
    navigate, location_dateStart, location_dateEnd, PATH, dataCategoryArray,
    URL_OBJECT, sessionId, TITLE, location_dateType, firstStr
  } = useCommonValue();
  const {
    ERRORS, REFS, validate
  } = useValidateUser();

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
  const [dataType, setDataType] = useState<string>("exercise");

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT, setOBJECT] = useState<any>(Category);
  const [SEND, setSEND] = useState<any>({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
    toDataCategory: `/${firstStr}/category`,
  });
  const [idx, setIdx] = useState<any>({
    category1Idx: 0,
    category2Idx: 1,
    category3Idx: 1,
  });
  const [selectedIdx, setSelectedIdx] = useState<any>({
    category1Idx: 0,
    category2Idx: 1,
    category3Idx: 1,
  });
  const [isEditable, setIsEditable] = useState<string>("");

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    if (isEditable.startsWith(`${dataType}_part_`)) {
      REFS.current.category2?.focus();
    }
    else if (isEditable.startsWith(`${dataType}_title_`)) {
      REFS.current.category3?.focus();
    }
  }, [isEditable]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/category/list`, {
      params: {
        user_id: sessionId
      }
    })
    .then((res: any) => {
      setOBJECT(res.data.result || Category);
    })
    .catch((err: any) => {
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [sessionId]);

  // 3. flow ---------------------------------------------------------------------------------------
  const flowSave = async () => {
    axios.post(`${URL_OBJECT}/category/save`, {
      user_id: sessionId,
      OBJECT: OBJECT
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        alert(translate(res.data.msg));
        sessionStorage.setItem(`${TITLE}_category`, JSON.stringify(res.data.result.dataCategory));
      }
      else {
        alert(translate(res.data.msg));
      }
    })
    .catch((err: any) => {
      console.error(err);
    })
  };

  // 4-1. handler ----------------------------------------------------------------------------------
  const handlerAdd = (type: string) => {
    if (type === "part") {
      setOBJECT((prev: any) => {
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
      setOBJECT((prev: any) => {
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
  const handlerRename = (type: string, index: number) => {
    if (type === "part") {
      setIsEditable(`${dataType}_${type}_${index}`);
    }
    else if (type === "title") {
      setIsEditable(`${dataType}_${type}_${index}`);
    }
  };

  // 4-3. handler ----------------------------------------------------------------------------------
  const handlerRemove = (type: string, index: number) => {
    if (type === "part") {
      setOBJECT((prev: any) => {
        const newCategory1 = [
          ...prev.dataCategory[dataType]?.slice(0, index),
          ...prev.dataCategory[dataType]?.slice(index + 1)
        ];
        // 하나만 남았을 때 삭제 시도 시 경고
        if (newCategory1.length <= 1) {
          alert("cantBeDeletedLastItem");
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
      setOBJECT((prev: any) => {
        const currentTitles = prev.dataCategory?.[dataType]?.[idx.category2Idx]?.[`${dataType}_title`];
        const newTitles = [
          ...currentTitles.slice(0, index),
          ...currentTitles.slice(index + 1)
        ];
        // 하나만 남았을 때 삭제 시도 시 경고
        if (currentTitles.length <= 2) {
          alert("cantBeDeletedLastItem");
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

  // 7. userCategory -------------------------------------------------------------------------------
  const userCategoryNode = () => {
    // 7-1. popup
    const popupSection = (i: number, closePopup: any) => (
      <Card key={i} className={"w-85vw h-60vh d-row border radius p-0"}>
        <TableContainer className={"border-right over-x-hidden"}>
          <Table>
            <TableHead className={"table-thead"}>
              <TableRow className={"table-thead-tr p-sticky top-0 z-900"}>
                <TableCell>
                  {translate("dataCategory2")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={"table-tbody"}>
              {OBJECT?.dataCategory[dataType]?.map((item: any, index: number) => (index > 0) && (
                <TableRow key={index} className={"table-tbody-tr border-bottom"}
                  onClick={() => {
                    setSelectedIdx((prev: any) => ({
                      ...prev,
                      category2Idx: index
                    }));
                  }}>
                  <TableCell className={selectedIdx.category2Idx === index ? "bg-light" : ""}>
                    <Div className={"d-center"} onClick={() => {
                      setIdx((prev: any) => ({
                        ...prev,
                        category2Idx: index
                      }));
                    }}>
                      <Div className={"fs-0-9rem ms-auto"}>
                        <Input
                          variant={"standard"}
                          value={translate(item[`${dataType}_part`])}
                          sx={{
                            ".MuiInput-root::after": {
                              borderBottom: isEditable === `${dataType}_part_${index}`
                              ? "2px solid #1976d2"
                              : "2px solid #000000"
                            }
                          }}
                          readOnly={
                            isEditable !== `${dataType}_part_${index}`
                          }
                          inputclass={"fs-0-9rem"}
                          inputRef={(el: any) => {
                            if (isEditable === `${dataType}_part_${index}`) {
                              REFS.current.category2 = el;
                            }
                          }}
                          onChange={(e: any) => {
                            setOBJECT((prev: any) => {
                              return {
                                ...prev,
                                dataCategory: {
                                  ...prev.dataCategory,
                                  [dataType]: [
                                    ...prev.dataCategory[dataType]?.slice(0, index),
                                    {
                                      ...prev.dataCategory[dataType]?.[index],
                                      [`${dataType}_part`]: e.target.value
                                    },
                                    ...prev.dataCategory[dataType]?.slice(index + 1)
                                  ]
                                }
                              };
                            });
                          }}
                        />
                      </Div>
                      <Div className={"fs-0-9rem ms-auto d-row"}>
                        <Icons
                          name={"Pencil"}
                          className={"w-14 h-14 navy"}
                          onClick={() => {
                            handlerRename("part", index);
                          }}
                        />
                        <Icons
                          name={"Trash"}
                          className={"w-14 h-14 burgundy"}
                          onClick={() => {
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
                  <Div className={"d-center"} onClick={() => {
                    handlerAdd("part");
                  }}>
                    <Icons
                      name={"Plus"}
                      className={"w-14 h-14"}
                    />
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
                <TableRow className={"table-thead-tr p-sticky top-0 z-900"}>
                  <TableCell>
                    {translate("dataCategory3")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                {OBJECT?.dataCategory[dataType]?.[idx?.category2Idx]?.[`${dataType}_title`]?.map((item: any, index: number) => (index > 0) && (
                  <TableRow key={index} className={"table-tbody-tr border-bottom"}
                    onClick={() => {
                      setSelectedIdx((prev: any) => ({
                        ...prev,
                        category3Idx: index
                      }));
                    }}>
                    <TableCell>
                      <Div className={"d-center"} onClick={() => {
                        setIdx((prev: any) => ({
                          ...prev,
                          category3Idx: index
                        }));
                      }}>
                        <Div className={"fs-0-9rem ms-auto"}>
                          <Input
                            variant={"standard"}
                            value={translate(item)}
                            sx={{
                              ".MuiInput-root::after": {
                                borderBottom: isEditable === `${dataType}_title_${index}`
                                ? "2px solid #1976d2"
                                : "2px solid #000000"
                              }
                            }}
                            readOnly={
                              isEditable !== `${dataType}_title_${index}`
                            }
                            inputclass={"fs-0-9rem"}
                            inputRef={(el: any) => {
                              if (isEditable === `${dataType}_title_${index}`) {
                                REFS.current.category3 = el;
                              }
                            }}
                            onChange={(e: any) => {
                              setOBJECT((prev: any) => {
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
                                          e.target.value,
                                          ...prev.dataCategory[dataType]?.[idx.category2Idx]?.[`${dataType}_title`]?.slice(index + 1)
                                        ]
                                      },
                                      ...prev.dataCategory[dataType]?.slice(idx.category2Idx + 1)
                                    ]
                                  }
                                };
                              });
                            }}
                          />
                        </Div>
                        <Div className={"fs-0-9rem ms-auto d-row"}>
                          <Icons
                            name={"Pencil"}
                            className={"w-14 h-14 navy"}
                            onClick={() => {
                              handlerRename("title", index);
                            }}
                          />
                          <Icons
                            name={"Trash"}
                            className={"w-14 h-14 burgundy"}
                            onClick={() => {
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
                    <Div className={"d-center"} onClick={() => {
                      handlerAdd("title");
                    }}>
                      <Icons
                        key={"TbPlus"}
                        name={"Plus"}
                        className={"w-14 h-14"}
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
    const cardSection = () => {
      const cardFragment = (i: number) => (
        <Card className={"border radius p-0"} key={i}>
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
                {dataCategoryArray?.map((item: any, index: number) => (
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
                          contents={({closePopup}: any) => (
                            popupSection(i, closePopup)
                          )}>
                          {(popTrigger: any) => (
                            <Icons
                              key={"TbPencil"}
                              name={"Pencil"}
                              className={"w-18 h-18 navy ms-auto"}
                              onClick={(e: any) => {
                                setDataType(item);
                                setSelectedIdx((prev: any) => ({
                                  ...prev,
                                  category1Idx: index,
                                  category2Idx: 1,
                                  category3Idx: 1
                                }));
                                setIdx((prev: any) => ({
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
        LOADING ? <Loading /> : cardFragment(0)
      );
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min95vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {cardSection()}
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