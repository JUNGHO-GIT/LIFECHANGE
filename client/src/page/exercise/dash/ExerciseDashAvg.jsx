// ExerciseDashAvg.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {ComposedChart, Bar} from "recharts";
import {Container, Row, Col, Card} from "react-bootstrap";
import {handlerY} from "../../../assets/js/handlerY.js";
import {useStorage} from "../../../hooks/useStorage.jsx";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();
  const array = ["횟수", "볼륨", "시간"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SECTION, set:setSECTION} = useStorage(
    `SECTION (avg) (${PATH})`, "week"
  );
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (avg) (${PATH})`, "volume"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_VOLUME_WEEK_DEFAULT = [
    {name:"", 볼륨: 0},
  ];
  const OBJECT_CARDIO_WEEK_DEFAULT = [
    {name:"", 시간: 0},
  ];
  const OBJECT_VOLUME_MONTH_DEFAULT = [
    {name:"", 볼륨: 0},
  ];
  const OBJECT_CARDIO_MONTH_DEFAULT = [
    {name:"", 시간: 0},
  ];
  const [OBJECT_VOLUME_WEEK, setOBJECT_VOLUME_WEEK] = useState(OBJECT_VOLUME_WEEK_DEFAULT);
  const [OBJECT_CARDIO_WEEK, setOBJECT_CARDIO_WEEK] = useState(OBJECT_CARDIO_WEEK_DEFAULT);
  const [OBJECT_VOLUME_MONTH, setOBJECT_VOLUME_MONTH] = useState(OBJECT_VOLUME_MONTH_DEFAULT);
  const [OBJECT_CARDIO_MONTH, setOBJECT_CARDIO_MONTH] = useState(OBJECT_CARDIO_MONTH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseWeek = await axios.get(`${URL_OBJECT}/dash/avg/week`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_VOLUME_WEEK(responseWeek.data.result.volume || OBJECT_VOLUME_WEEK_DEFAULT);
    setOBJECT_CARDIO_WEEK(responseWeek.data.result.cardio || OBJECT_CARDIO_WEEK_DEFAULT);

    const responseMonth = await axios.get(`${URL_OBJECT}/dash/avg/month`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_VOLUME_MONTH(responseMonth.data.result.volume || OBJECT_VOLUME_MONTH_DEFAULT);
    setOBJECT_CARDIO_MONTH(responseMonth.data.result.cardio || OBJECT_CARDIO_MONTH_DEFAULT);
  })()}, [customer_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodeVolumeWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_VOLUME_WEEK, array);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_VOLUME_WEEK} barGap={8} barCategoryGap={"20%"}
          margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Bar dataKey={"볼륨"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()} vol`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeCardioWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_CARDIO_WEEK, array);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_CARDIO_WEEK} barGap={8} barCategoryGap={"20%"}
          margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Bar dataKey={"시간"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()} vol`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartNodeVolumeMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_VOLUME_MONTH, array);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_VOLUME_MONTH} barGap={8} barCategoryGap={"20%"}
          margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Bar dataKey={"볼륨"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()} vol`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartNodeCardioMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_CARDIO_MONTH, array);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_CARDIO_MONTH} barGap={8} barCategoryGap={"20%"}
          margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Bar dataKey={"시간"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()} vol`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"border-0 border-bottom ms-2vw"}>
          <Container fluid>
            <Row>
              <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
                <select className={"form-select form-select-sm"}
                  onChange={(e) => (setSECTION(e.target.value))}
                  value={SECTION}
                >
                  <option value={"week"}>주간</option>
                  <option value={"month"}>월간</option>
                </select>
              </Col>
              <Col lg={6} md={6} sm={6} xs={6} className={"text-center"}>
                <span className={"dash-title"}>볼륨 / 유산소 평균</span>
              </Col>
              <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
                <select className={"form-select form-select-sm"}
                  onChange={(e) => (setLINE(e.target.value))}
                  value={LINE}
                >
                  <option value={"volume"}>볼륨</option>
                  <option value={"cardio"}>시간</option>
                </select>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                {SECTION === "week" && LINE === "volume" && chartNodeVolumeWeek()}
                {SECTION === "week" && LINE === "cardio" && chartNodeCardioWeek()}
                {SECTION === "month" && LINE === "volume" && chartNodeVolumeMonth()}
                {SECTION === "month" && LINE === "cardio" && chartNodeCardioMonth()}
              </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};