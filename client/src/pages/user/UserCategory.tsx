// UserCategory.tsx

import { useState, useEffect, createRef, useRef } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreAlert, useStoreLoading } from "@importStores";
import { axios } from "@importLibs";
import { sync } from "@importScripts";
import { Category, CategoryType } from "@importSchemas";
import { Footer } from "@importLayouts";
import { PopUp, Input } from "@importContainers";
import { Div, Icons, Paper, Grid } from "@importComponents";
import { TableContainer, Table, TableFooter } from "@importMuis";
import { TableHead, TableBody, TableRow, TableCell } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const UserCategory = () => {

	// 1. common ----------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId } = useCommonValue();
  const { location_dateStart, location_dateEnd, location_dateType } = useCommonValue();
  const { getDayFmt } = useCommonDate();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();
  const { translate } = useStoreLanguage();

  // 2-1. useStorageLocal ------------------------------------------------------------------------
  const [DATE, setDATE] = useStorageLocal(
    "date", PATH, "", {
      dateType: location_dateType || "day",
      dateStart: location_dateStart || getDayFmt(),
      dateEnd: location_dateEnd || getDayFmt(),
    }
  );

	// 2-2. useState -------------------------------------------------------------------------------
  const REFS = useRef<any>({});
  const [OBJECT, setOBJECT] = useState<CategoryType>(Category);
  const [dataType, setDataType] = useState<keyof CategoryType>("exercise");
  const [isEditable, setIsEditable] = useState<string>("");
  const [selectedIdx, setSelectedIdx] = useState({
    category1Idx: 0,
    category2Idx: 1,
    category3Idx: 1,
  });
  const [SEND, setSEND] = useState({
    id: "",
    dateType: "",
    dateStart: "0000-00-00",
    dateEnd: "0000-00-00",
  });

	// 2-3. useEffect -----------------------------------------------------------------------------
  useEffect(() => {
    setLOADING(true);
    axios.get(`${URL_OBJECT}/category/detail`, {
      params: {
        user_id: sessionId
      }
    })
    .then((res: any) => {
      setLOADING(false);
      setOBJECT(res.data.result || Category);
      Object.keys(res.data.result).forEach((dataType: string) => {
        REFS.current = {
          ...REFS.current,
          [dataType]: res.data.result[dataType].map((item: any) => {
            const partRefs = {
              [`${dataType}_part`]: createRef(),
              [`${dataType}_title`]: item[`${dataType}_title`]?.map(() => createRef()) || []
            };
            return partRefs;
          })
        };
      });
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err?.response?.data?.msg || err.message),
        severity: "error",
      });
    })
    .finally(() => {
      setLOADING(false);
    });
  }, [URL_OBJECT, sessionId]);

	// 3. flow ------------------------------------------------------------------------------------
  const flowSave = async () => {
    setLOADING(true);
    axios.post(`${URL_OBJECT}/category/update`, {
      user_id: sessionId,
      OBJECT: OBJECT
    })
    .then((res: any) => {
      if (res.data.status === "success") {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "success",
        });
        sync("category");
      }
      else {
        setLOADING(false);
        setALERT({
          open: true,
          msg: translate(res.data.msg),
          severity: "error",
        });
      }
    })
    .catch((err: any) => {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err?.response?.data?.msg || err.message),
        severity: "error",
      });
      console.error(err);
    })
    .finally(() => {
      setLOADING(false);
    });
  };

  // 4-1. handle----------------------------------------------------------------------------------
  const handleAdd = (type: string) => {
    if (type === "part") {
      setOBJECT((prev) => {
        const updatedObject = {
          ...prev,
          [dataType]: [
            ...prev[dataType],
            {
              [`${dataType}_part`]: "",
              [`${dataType}_title`]: []
            }
          ]
        };
        REFS.current = {
          ...REFS.current,
          [dataType]: updatedObject[dataType].map((_: any, idx: number) =>
            REFS.current[dataType]?.[idx] || {
              [`${dataType}_part`]: createRef(),
              [`${dataType}_title`]: []
            }
          )
        };
        return updatedObject;
      });
    }
    else if (type === "title") {
      setOBJECT((prev) => {
        const updatedObject = {
          ...prev,
          [dataType]: prev[dataType].map((part: any, idx: number) => {
            if (idx === selectedIdx.category2Idx) {
              return {
                ...part,
                [`${dataType}_title`]: [
                  ...part[`${dataType}_title`], ""
                ]
              };
            }
            return part;
          })
        };
        REFS.current = {
          ...REFS.current,
          [dataType]: updatedObject[dataType].map((part: any, idx: number) => {
            if (idx === selectedIdx.category2Idx) {
              return {
                ...REFS.current[dataType]?.[idx],
                [`${dataType}_title`]: part[`${dataType}_title`].map((_: any, titleIdx: number) =>
                  REFS.current[dataType]?.[idx]?.[`${dataType}_title`]?.[titleIdx] || createRef()
                )
              };
            }
            return REFS.current[dataType]?.[idx] || {};
          })
        };

        return updatedObject;
      });
    }
  };

  // 4-2. handle----------------------------------------------------------------------------------
  const handleRename = (type: string, index: number) => {
    setIsEditable(`${dataType}_${type}_${index}`);

    if (type === "part") {
      setTimeout(() => {
        REFS?.current?.[dataType]?.[index]?.[`${dataType}_part`]?.current?.focus();
      }, 10);
    }
    else if (type === "title") {
      setTimeout(() => {
        REFS?.current?.[dataType]?.[selectedIdx.category2Idx]?.[`${dataType}_title`]?.[index]?.current?.focus();
      }, 10);
    }
  };

  // 4-3. handle --------------------------------------------------------------------------------
  const handleRemove = (type: string, index: number) => {
    if (type === "part") {
      if (OBJECT?.[dataType]?.length <= 1) {
        setALERT({
          open: true,
          msg: translate("cantBeDeletedLastItem"),
          severity: "error",
        });
        return;
      }
      setOBJECT((prev) => {
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
			// @ts-ignore
      if (OBJECT?.[dataType]?.[selectedIdx?.category2Idx]?.[`${dataType}_title`]?.length <= 2) {
        setALERT({
          open: true,
          msg: translate("cantBeDeletedLastItem"),
          severity: "error",
        });
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
    const popupSection = () => (
      <Grid container={true} spacing={0}>
        <Grid size={12} className={"w-85vw h-60vh d-row"}>
          <TableContainer className={"border-1 radius-2 over-x-hidden over-y-auto"}>
            <Table>
              <TableHead className={"table-thead"}>
                <TableRow className={"table-thead-tr p-sticky top-0px z-900"}>
                  <TableCell>
                    {translate("dataCategory2")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={"table-tbody"}>
                {OBJECT[dataType]?.map((item: any, index: number) => (index > 0) && (
                  <TableRow className={"table-tbody-tr border-bottom-1"} key={index}>
                    <TableCell className={selectedIdx.category2Idx === index ? "bg-light" : ""}>
                      <Div className={"d-center"}>
                        <Div className={"fs-0-9rem ml-auto"}>
                          <Input
                            variant={"standard"}
                            value={translate(item[`${dataType}_part`]) || ""}
                            readOnly={isEditable !== `${dataType}_part_${index}`}
                            inputclass={"fs-0-9rem"}
                            inputRef={REFS?.current?.[dataType]?.[index]?.[`${dataType}_part`]}
                            sx={{
                              "& .MuiInput-root::before": {
                                borderBottom: "none"
                              },
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
                              setOBJECT((prev) => ({
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
                        <Div className={"fs-0-9rem ml-auto d-row-right"}>
                          <Icons
                            name={"Search"}
                            className={"w-12px h-12px"}
                            onClick={() => {
                              setSelectedIdx((prev) => ({
                                ...prev,
                                category2Idx: index
                              }));
                            }}
                          />
                          <Icons
                            name={"Pencil"}
                            className={"w-12px h-12px navy"}
                            onClick={() => {
                              setSelectedIdx((prev) => ({
                                ...prev,
                                category2Idx: index
                              }));
                              handleRename("part", index);
                            }}
                          />
                          <Icons
                            name={"Trash"}
                            className={"w-12px h-12px burgundy"}
                            onClick={() => {
                              setSelectedIdx((prev) => ({
                                ...prev,
                                category2Idx: index
                              }));
                              handleRemove("part", index);
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
                        className={"w-12px h-12px"}
                        onClick={() => {
                          handleAdd("part");
                        }}
                      />
                    </Div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          {(dataType === "exercise" || dataType === "money") && (
            <TableContainer className={"border-1 radius-2 over-x-hidden"}>
              <Table>
                <TableHead className={"table-thead"}>
                  <TableRow className={"table-thead-tr p-sticky top-0px z-900"}>
                    <TableCell>
                      {translate("dataCategory3")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={"table-tbody"}>
                  {(dataType === "exercise"
                    ? OBJECT?.exercise?.[selectedIdx?.category2Idx]?.exercise_title
                    : OBJECT?.money?.[selectedIdx?.category2Idx]?.money_title
                  )?.map((item: any, index: number) => (index > 0) && (
                    <TableRow key={index} className={"table-tbody-tr border-bottom-1"}>
                      <TableCell>
                        <Div className={"d-center"}>
                          <Div className={"fs-0-9rem ml-auto"}>
                            <Input
                              variant={"standard"}
                              value={translate(item) || ""}
                              readOnly={isEditable !== `${dataType}_title_${index}`}
                              inputclass={"fs-0-9rem"}
                              inputRef={REFS?.current?.[dataType]?.[selectedIdx?.category2Idx]?.[`${dataType}_title`]?.[index]}
                              sx={{
                                "& .MuiInput-root::before": {
                                  borderBottom: "none"
                                },
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
                          <Div className={"fs-0-9rem ml-auto d-row-right"}>
                            <Icons
                              name={"Pencil"}
                              className={"w-12px h-12px navy"}
                              onClick={() => {
                                setSelectedIdx((prev) => ({
                                  ...prev,
                                  category3Idx: index
                                }));
                                handleRename("title", index);
                              }}
                            />
                            <Icons
                              name={"Trash"}
                              className={"w-12px h-12px burgundy"}
                              onClick={() => {
                                setSelectedIdx((prev) => ({
                                  ...prev,
                                  category3Idx: index
                                }));
                                handleRemove("title", index);
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
                          className={"w-12px h-12px"}
                          onClick={() => {
                            handleAdd("title");
                          }}
                        />
                      </Div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    );
    // 7-2. detail
    const detailSection = () => (
			<Grid container={true} spacing={2} className={`radius-2 border-0 shadow-2`}>
				{[OBJECT]?.map((item, i) => (
					<Grid size={12} key={`detail-${i}`}>
						<Grid container={true} spacing={1}>
							<TableContainer className={"border-1 radius-2 over-x-hidden"}>
								<Table>
									<TableHead className={"table-thead"}>
										<TableRow className={"table-thead-tr"}>
											<TableCell className={"fs-0-95rem"}>
												{translate("dataCategory1")}
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody className={"table-tbody"}>
										{Object.keys(item).map((item: any, idx: number) => (
											<TableRow className={"table-tbody-tr border-top-1"} key={idx}>
												<TableCell className={`${dataType === item ? "bg-light" : ""}`}>
													<Div className={"d-center"}>
														<Div className={"fs-0-95rem ml-0px"}>
															{translate(item)}
														</Div>
														<Div className={"fs-0-95rem ml-auto"}>
														<PopUp
															type={"innerCenter"}
															position={"center"}
															direction={"center"}
															contents={
																popupSection()
															}
															children={(popTrigger: any) => (
																<Icons
																	key={"Search"}
																	name={"Search"}
																	className={"w-18px h-18px black ml-auto"}
																	onClick={(e: any) => {
																		setDataType(item);
																		setSelectedIdx((prev) => ({
																			...prev,
																			category1Idx: idx,
																			category2Idx: 1,
																			category3Idx: 1
																		}));
																		popTrigger.openPopup(e.currentTarget)
																	}}
																/>
															)}
														/>
														</Div>
													</Div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Grid>
					</Grid>
				))}
			</Grid>
		);
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius-2 border-1 shadow-1 h-min-90vh"}>
        {detailSection()}
      </Paper>
    );
  };

	// 9. footer ----------------------------------------------------------------------------------
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

	// 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {userCategoryNode()}
      {footerNode()}
    </>
  );
};