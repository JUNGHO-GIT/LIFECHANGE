// FoodSave.jsx

import axios from "axios";
import React, {useState, useEffect, forwardRef} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {NumericFormat} from "react-number-format";
import {useDate} from "../../assets/hooks/useDate.jsx";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import {DateNode} from "../../assets/fragments/DateNode.jsx";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {Container, Row, Col, Card, Table, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodSave = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_FOOD;
  const customer_id = window.sessionStorage.getItem("customer_id");
  const session = window.sessionStorage.getItem("dataset") || "";
  const foodArray = JSON.parse(session)?.food || [];
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      refresh: 0,
      startDt: "0000-00-00",
      endDt: "0000-00-00",
      toList:"/food/list",
      toSave:"/food/save",
      toSearch:"/food/search",
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:COUNT, set:setCOUNT} = useStorage(
    `COUNT(${PATH})`, {
      totalCnt: 0,
      sectionCnt: 0
    }
  );
  const {val:CALENDAR, set:setCALENDAR} = useStorage(
    `CALENDAR(${PATH})`, {
      calStartOpen: false,
      calEndOpen: false,
      calOpen: false,
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = {
    _id: "",
    food_number: 0,
    food_startDt: "0000-00-00",
    food_endDt: "0000-00-00",
    food_total_kcal: 0,
    food_total_fat: 0,
    food_total_carb: 0,
    food_total_protein: 0,
    food_section: [{
      food_part_val: "아침",
      food_title_val: "기타",
      food_count: 0,
      food_serv: "회",
      food_gram:  0,
      food_kcal: 0,
      food_fat: 0,
      food_carb: 0,
      food_protein: 0,
    }],
  };
  const {val:OBJECT_BEFORE, set:setOBJECT_BEFORE} = useStorage(
    `OBJECT_BEFORE(${PATH})`, OBJECT_DEFAULT
  );
  const {val:OBJECT, set:setOBJECT} = useStorage(
    `OBJECT(${PATH})`, OBJECT_DEFAULT
  );

  // 2.3 useEffect -------------------------------------------------------------------------------->
  useDate(location_startDt, location_endDt, DATE, setDATE);

  // 2-3 useEffect -------------------------------------------------------------------------------->
  useEffect(() => {

    // 스토리지 데이터 가져오기
    const getItem = localStorage.getItem("food_section");
    let storageSection = getItem ? JSON.parse(getItem) : null;

    // 상세 데이터 가져오기
    const fetchDetail = async () => {
      const response = await axios.get(`${URL_OBJECT}/detail`, {
        params: {
          _id: "",
          customer_id: customer_id,
          duration: `${DATE.startDt} ~ ${DATE.endDt}`,
        },
      });

      // 결과 있는경우 OBJECT 상태 업데이트
      if (response.data.result !== null && !storageSection) {
        setOBJECT((prev) => ({
          ...prev,
          ...response.data.result,
        }));
      }

      // 결과가 null or !null 이면서 스토리지 데이터가 있는 경우, OBJECT 상태 업데이트
      else if (
        (response.data.result !== null && storageSection) ||
        (response.data.result === null && storageSection)
      ) {
        if (storageSection) {
          setOBJECT((prev) => {
            let newFoodSection = [...prev.food_section];

            // 첫 번째 항목이 빈 값 객체인지 확인하고, 조건에 맞으면 제거
            if (
              newFoodSection.length > 0 &&
              Object.values(newFoodSection[0]).every((value) => (value === ""))
            ) {
              newFoodSection.shift();
            }

            // 새로운 데이터가 배열인 경우 배열, 단일 객체인 경우 단일 객체를 추가
            Array.isArray(storageSection)
            ? newFoodSection.push(...storageSection)
            : newFoodSection.push(storageSection);

            return {
              ...prev,
              food_section: newFoodSection,
            };
          })
        }
      }

      // 결과가 null 일 경우, OBJECT 상태를 명시적으로 초기화
      else {
        setOBJECT(OBJECT_DEFAULT);
      }

      setCOUNT((prev) => ({
        ...prev,
        totalCnt: response.data.totalCnt || 0,
        sectionCnt: response.data.sectionCnt || 0
      }));
    };

    fetchDetail();
  }, [customer_id, DATE.startDt, DATE.endDt]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    // 초기 영양소 값 설정
    setOBJECT_BEFORE((prev) => ({
      ...prev,
      food_section: [...OBJECT?.food_section],
    }));
  }, [OBJECT]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    const totals = OBJECT?.food_section?.reduce((acc, current) => {
      return {
        totalKcal: acc.totalKcal + Number(current.food_kcal),
        totalFat: acc.totalFat + Number(current.food_fat),
        totalCarb: acc.totalCarb + Number(current.food_carb),
        totalProtein: acc.totalProtein + Number(current.food_protein),
      };
    }, { totalKcal: 0, totalFat: 0, totalCarb: 0, totalProtein: 0 });

    setOBJECT((prev) => ({
      ...prev,
      food_total_kcal: Number(totals.totalKcal.toFixed(1)),
      food_total_fat: Number(totals.totalFat.toFixed(1)),
      food_total_carb: Number(totals.totalCarb.toFixed(1)),
      food_total_protein: Number(totals.totalProtein.toFixed(1)),
    }));
  }, [OBJECT?.food_section]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_OBJECT}/save`, {
      customer_id: customer_id,
      OBJECT: OBJECT,
      duration: `${DATE.startDt} ~ ${DATE.endDt}`,
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(response.data.msg);
    }
  };

  // 4. date -------------------------------------------------------------------------------------->
  const dateNode = () => {
    return (
      <DateNode DATE={DATE} setDATE={setDATE} part={"food"} plan={""} type={"save"} />
    );
  };

  // 4. handle ------------------------------------------------------------------------------------>
  const handleCountChange = (index, newValue) => {
    const newCountValue = Number(newValue);

    setOBJECT((prev) => {
      const newFoodSection = [...prev.food_section];
      const section = newFoodSection[index];
      const defaultSection = OBJECT_BEFORE.food_section[index];
      const ratio = newCountValue / (defaultSection.food_count || 1);

      if (defaultSection) {
        newFoodSection[index] = {
          ...section,
          food_count: newCountValue,
          food_gram: Number(((defaultSection?.food_gram) * ratio).toFixed(1)),
          food_kcal: Number(((defaultSection?.food_kcal) * ratio).toFixed(1)),
          food_carb: Number(((defaultSection?.food_carb) * ratio).toFixed(1)),
          food_protein: Number(((defaultSection?.food_protein) * ratio).toFixed(1)),
          food_fat: Number(((defaultSection?.food_fat) * ratio).toFixed(1)),
        };
      }
      return {
        ...prev,
        food_section: newFoodSection,
      };
    });
  };

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerFoodDelete = (index) => {
    setOBJECT((prev) => {
      const newFoodSection = [...prev.food_section];
      newFoodSection.splice(index, 1);
      return {
        ...prev,
        food_section: newFoodSection,
      };
    });
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <Table hover responsive variant={"light"} border={1}>
          <thead className={"table-primary"}>
          <tr>
            <th>part</th>
            <th>title</th>
            <th>brand</th>
            <th>serving</th>
            <th>gram</th>
            <th>kcal</th>
            <th>fat</th>
            <th>carb</th>
            <th>protein</th>
            <th>x</th>
          </tr>
        </thead>
        <tbody className={"text-start"}>
          {OBJECT?.food_section?.map((item, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>
                  <select
                    id={"food_part_val"}
                    name={"food_part_val"}
                    className={"form-select"}
                    value={item.food_part_val}
                    onChange={(e) => {
                      const newVal = parseInt(e.target.value);
                      setOBJECT((prev) => {
                        const newFoodSection = [...prev.food_section];
                        newFoodSection[index] = {
                          ...item,
                          food_part_val: newVal
                        };
                        return {
                          ...prev,
                          food_section: newFoodSection,
                        };
                      });
                    }}
                  >
                    {foodArray?.map((item, idx) => (
                      <option key={idx} value={idx}>
                        {item.food_part}
                      </option>
                    ))}
                  </select>
                </td>
                <td>{item.food_title_val}</td>
                <td>{item.food_brand}</td>
                <td>
                  <div className={"d-flex"}>
                    <NumericFormat
                      min={0}
                      max={99}
                      minLength={1}
                      maxLength={2}
                      id={"food_plan_count"}
                      name={"food_plan_count"}
                      datatype={"number"}
                      displayType={"input"}
                      className={"form-control"}
                      disabled={false}
                      allowNegative={false}
                      fixedDecimalScale={true}
                      thousandSeparator={true}
                      value={Math.min(99, parseInt(item.food_count))}
                      onValueChange={(values) => {
                        const limitedValue = Math.min(99, parseInt(values.value));
                        handleCountChange(index, limitedValue);
                      }}
                    ></NumericFormat>
                    <span>{item.food_serv}</span>
                  </div>
                </td>
                <td>{item.food_gram}</td>
                <td>{item.food_kcal}</td>
                <td>{item.food_fat}</td>
                <td>{item.food_carb}</td>
                <td>{item.food_protein}</td>
                <td><span className={"btn btn-sm btn-danger"} onClick={() => (
                    handlerFoodDelete(index)
                  )}>
                    x
                  </span></td>
              </tr>
            </React.Fragment>
          ))}
          <tr>
            <td>합계</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{OBJECT?.food_total_kcal}</td>
            <td>{OBJECT?.food_total_fat}</td>
            <td>{OBJECT?.food_total_carb}</td>
            <td>{OBJECT?.food_total_protein}</td>
            <td></td>
          </tr>
        </tbody>
        </Table>
      </React.Fragment>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={CALENDAR} setCALENDAR={setCALENDAR} DATE={DATE} setDATE={setDATE}
        SEND={SEND} FILTER={""} setFILTER={""} flowSave={flowSave} navParam={navParam}
        part={"food"} plan={""} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row className={"d-center"}>
              <Col xs={12} className={"mb-20"}>
                <h1>Save</h1>
              </Col>
              <Col xs={12} className={"mb-20"}>
                {dateNode()}
              </Col>
              <Col xs={12} className={"mb-20"}>
                {tableNode()}
              </Col>
              <Col xs={12} className={"mb-20"}>
                {buttonNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};