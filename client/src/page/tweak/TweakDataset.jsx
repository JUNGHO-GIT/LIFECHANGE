// TweakDataset.jsx

import axios from "axios";
import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {Header} from "../../layout/Header.jsx";
import {NavBar} from "../../layout/NavBar.jsx";
import {Btn} from "../../fragments/Btn.jsx";
import {Loading} from "../../fragments/Loading.jsx";
import {Container, Card, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, Grid, Button} from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';

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

  // 2-1. useState -------------------------------------------------------------------------------->
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

  // 2-3. useState -------------------------------------------------------------------------------->
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

  // 6. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    const addPart = () => (
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
    );
    const renamePart = (index) => (() => {
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
    });
    const rmPart = (index) => (() => {
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
    });
    const addTitle = () => (
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
    );
    const renameTitle = (index) => (() => {
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
    });
    const rmTitle = (index) => (() => {
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
    });
    const tableSection1 = () => (
      <React.Fragment>
        <Table className={"block-wrapper h-80vh"}>
          <thead>
            <tr>
              <th className={"table-thead"}>
                <Grid2 container spacing={3}>
                  <Grid2 xl={9} lg={9} md={9} sm={9} xs={9} className={"d-center"}>
                    <div>
                      Dataset
                    </div>
                  </Grid2>
                </Grid2>
              </th>
            </tr>
          </thead>
          <tbody>
            {datasetArray.map((item, index) => (
              <tr
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
                <td>
                  <Grid2 container spacing={3}>
                    <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"p-5"}>
                      <div className={"dataset-title"}>
                        {item}
                      </div>
                    </Grid2>
                  </Grid2>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const tableSection2 = () => (
      <React.Fragment>
        <Table className={"block-wrapper h-80vh"}>
          <thead>
            <tr>
              <th className={"table-thead"}>
                <Grid2 container spacing={3}>
                  <Grid2 xl={9} lg={9} md={9} sm={9} xs={9} className={"d-center"}>
                    <div>
                      Part
                    </div>
                  </Grid2>
                  <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-center"}>
                    <div className={"dataset-add"} onClick={addPart}>
                      +
                    </div>
                  </Grid2>
                </Grid2>
              </th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.user_dataset[dataType]?.map((item, index) => (index > 0) && (
              <tr key={index}
                className={selectedIdx.partIdx === index ? "table-secondary" : ""}
                style={{border: "1px solid #dee2e6"}}
                onClick={() => {
                  setSelectedIdx((prev) => ({
                    ...prev,
                    partIdx: index
                  }));
                }}
              >
                <td>
                  <Grid2 container spacing={3}>
                    <Grid2 xl={7} lg={7} md={7} sm={7} xs={7} className={"p-5 d-center"}>
                      <div className={"dataset-title"} onClick={() => (setIdx((prev) => ({
                        ...prev,
                        partIdx: index
                      })))}>
                        {item[`${dataType}_part`]}
                      </div>
                    </Grid2>
                    <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"p-5 d-center"}>
                      <div className={"dataset-rename"} onClick={renamePart(index)}>
                        re
                      </div>
                    </Grid2>
                    <Grid2 xl={2} lg={2} md={2} sm={2} xs={2} className={"p-5 d-center"}>
                      <div className={"dataset-delete"} onClick={rmPart(index)}>
                        x
                      </div>
                    </Grid2>
                  </Grid2>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    const tableSection3 = () => (
      <React.Fragment>
        <Table className={"block-wrapper h-80vh"}>
          <thead>
            <tr>
              <th className={"table-thead"}>
                <Grid2 container spacing={3}>
                  <Grid2 xl={9} lg={9} md={9} sm={9} xs={9} className={"d-center"}>
                    <div>
                      Title
                    </div>
                  </Grid2>
                  <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-center"}>
                    <div className={"dataset-add"} onClick={addTitle}>
                      +
                    </div>
                  </Grid2>
                </Grid2>
              </th>
            </tr>
          </thead>
          <tbody>
            {OBJECT?.user_dataset[dataType]?.[idx?.partIdx]?.[`${dataType}_title`]?.map((item, index) => (index > 0) && (
              <tr
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
                <td>
                  <Grid2 container spacing={3}>
                    <Grid2 xl={7} lg={7} md={7} sm={7} xs={7} className={"p-5 d-center"}>
                      <div className={"dataset-title"} onClick={() => (setIdx((prev) => ({
                        ...prev,
                        titleIdx: index
                      })))}>
                        {item}
                      </div>
                    </Grid2>
                    <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"p-5 d-center"}>
                      <div className={"dataset-rename"} onClick={renameTitle(index)}>
                        re
                      </div>
                    </Grid2>
                    <Grid2 xl={2} lg={2} md={2} sm={2} xs={2} className={"p-5 d-center"}>
                      <div className={"dataset-delete"} onClick={rmTitle(index)}>
                        x
                      </div>
                    </Grid2>
                  </Grid2>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={4} lg={4} md={4} sm={4} xs={4} className={"text-center"}>
                {tableSection1()}
              </Grid2>
              <Grid2 xl={4} lg={4} md={4} sm={4} xs={4} className={"text-center"}>
                {tableSection2()}
              </Grid2>
              <Grid2 xl={4} lg={4} md={4} sm={4} xs={4} className={"text-center"}>
                {(dataType !== "calendar" && dataType !== "food" && dataType !== "sleep")
                  && (tableSection3())}
              </Grid2>
            </Grid2>
          </Container>
        </Card>
      </React.Fragment>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 9. header ------------------------------------------------------------------------------------>
  const headerNode = () => (
    <Header />
  );

  // 10. navBar ----------------------------------------------------------------------------------->
  const navBarNode = () => (
    <NavBar />
  );

  // 14. btn -------------------------------------------------------------------------------------->
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

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {headerNode()}
      {navBarNode()}
      {LOADING ? loadingNode() : tableNode()}
      {btnNode()}
    </React.Fragment>
  );
};