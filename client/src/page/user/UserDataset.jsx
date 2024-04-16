// UserDataset.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";
import {foodArray} from "../../assets/data/FoodArray.jsx";
import {moneyArray} from "../../assets/data/MoneyArray.jsx";
import {workArray} from "../../assets/data/WorkArray.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDataset = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_USER = process.env.REACT_APP_URL_USER;
  const user_id = window.sessionStorage.getItem("user_id");
  const navParam = useNavigate();
  const location = useLocation();
  const location_startDt = location?.state?.startDt?.trim()?.toString();
  const location_endDt = location?.state?.endDt?.trim()?.toString();
  const PATH = location?.pathname.trim().toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SEND, set:setSEND} = useStorage(
    `SEND(${PATH})`, {
      id: "",
      startDt: "",
      endDt: "",
      refresh: 0,
      toDetail:"/user/detail"
    }
  );
  const {val:DATE, set:setDATE} = useStorage(
    `DATE(${PATH})`, {
      startDt: location_startDt,
      endDt: location_endDt
    }
  );
  const {val:idx, set:setIdx} = useStorage(
    `idx(${PATH})`, {
      partIdx: 0,
      titleIdx: 0,
    }
  );
  const {val:dataType, set:setDataType} = useStorage(
    `dataType(${PATH})`, "food"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const USER_DEFAULT = {
    user_dataset: {
      food: [{
        food_part: "",
        food_title: [""]
      }],
      money: [{
        money_part: "",
        money_title: [""]
      }],
      work: [{
        work_part: "",
        work_title: [""]
      }]
    }
  };
  const [USER, setUSER] = useState(USER_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_USER}/dataset`, {
      params: {
        user_id: user_id
      }
    });
    setUSER(response.data.result || USER_DEFAULT);
  })()}, [user_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_USER}/save`, {
      user_id: user_id,
      USER: USER
    });
    if (response.data.status === "success") {
      alert(response.data.msg);
      window.sessionStorage.setItem("dataset", JSON.stringify(response.data.result.user_dataset));
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(response.data.msg);
      window.sessionStorage.setItem("user_id", "false");
    }
  };

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerSetDefault = () => {
    const confirm = window.confirm("기본값으로 초기화하시겠습니까?");

    let defaultArray = [];
    if (dataType === "food") {
      defaultArray = foodArray;
    }
    else if (dataType === "money") {
      defaultArray = moneyArray;
    }
    else if (dataType === "work") {
      defaultArray = workArray;
    }

    if (confirm) {
      setUSER((prev) => ({
        ...prev,
        user_dataset: {
          ...prev.user_dataset,
          [dataType]: defaultArray
        }
      }));
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function addPart() {
      setUSER((prev) => ({
        ...prev,
        user_dataset: {
          ...prev.user_dataset,
          [dataType]: [
            ...prev.user_dataset[dataType],
            {
              [`${dataType}_part`]: "",
              [`${dataType}_title`]: [""]
            }
          ]
        }
      }));
    };
    function addTitle () {
      const index = idx.partIdx;
      return function() {
        setUSER((prev) => ({
          ...prev,
          user_dataset: {
            ...prev.user_dataset,
            [dataType]: [
              ...prev.user_dataset[dataType]?.slice(0, index), {
                ...prev.user_dataset[dataType]?.[index],
                [`${dataType}_title`]: [
                  ...prev.user_dataset[dataType]?.[index]?.[`${dataType}_title`],
                  ""
                ]
              },
              ...prev.user_dataset[dataType]?.slice(index + 1)
            ]
          }
        }));
      };
    };
    function renamePart(index) {
      return function() {
        const newPart = prompt("새로운 이름을 입력하세요.");
        if (newPart) {
          setUSER((prev) => ({
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
      };
    };
    function renameTitle(index) {
      return function() {
        const newTitle = prompt("새로운 이름을 입력하세요.");
        if (newTitle) {
          setUSER((prev) => ({
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
      };
    };
    function rmPart(index) {
      return function() {
        setUSER((prev) => ({
          ...prev,
          user_dataset: {
            ...prev.user_dataset,
            [dataType]: [
              ...prev.user_dataset[dataType].slice(0, index),
              ...prev.user_dataset[dataType].slice(index + 1)
            ]
          }
        }));
      };
    };
    function rmTitle(index) {
      return function() {
        setUSER((prev) => ({
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
      };
    };
    return (
      <table className={"table bg-white table-hover table-bordered"}>
        <thead className={"table-primary"}>
          <tr>
            <th colSpan={2} className={"pointer"} onClick={() => setDataType("food")}>
              food
            </th>
            <th colSpan={2} className={"pointer"} onClick={() => setDataType("money")}>
              money
            </th>
            <th colSpan={2} className={"pointer"} onClick={() => setDataType("work")}>
              work
            </th>
          </tr>
          <tr>
            <th colSpan={3}>part</th>
            <th colSpan={3}>title</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={3}>
              {USER?.user_dataset[dataType]?.map((item, index) => (
                (index > 0) && (
                  <React.Fragment key={index}>
                    <div className={"pointer"} onClick={() => {
                      setIdx((prev) => ({
                        ...prev,
                        partIdx: index,
                        titleIdx: 0
                      }));
                    }}>
                      {item[`${dataType}_part`]}
                    </div>
                    <span className={"pointer"} onClick={rmPart(index)}>
                      x
                    </span>
                    <span className={"pointer"} onClick={renamePart(index)}>
                      rename
                    </span>
                  </React.Fragment>
                )
              ))}
            </td>
            <td colSpan={3}>
              {USER?.user_dataset[dataType]?.[idx?.partIdx]?.[`${dataType}_title`]?.map((item, index) => (
                (index > 0) && (
                  <React.Fragment key={index}>
                    <div className={"pointer"} onClick={() => {
                      setIdx((prev) => ({
                        ...prev,
                        titleIdx: index
                      }));
                    }}>
                      {item}
                    </div>
                    <span className={"pointer"} onClick={rmTitle(index)}>
                      x
                    </span>
                    <span className={"pointer"} onClick={renameTitle(index)}>
                      rename
                    </span>
                  </React.Fragment>
                )
              ))}
            </td>
          </tr>
          <tr>
            <td colSpan={3} className={"pointer"} onClick={addPart}>
              추가
            </td>
            <td colSpan={3} className={"pointer"} onClick={addTitle()}>
              추가
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  // 9. button ------------------------------------------------------------------------------------>
  const buttonNode = () => {
    return (
      <ButtonNode CALENDAR={""} setCALENDAR={""} DATE={DATE} setDATE={setDATE}
        SEND={SEND} flowSave={flowSave} navParam={navParam}
        part={"user"} plan={""} type={"save"}
      />
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className={"container-wrapper"}>
        <div className={"row d-center"}>
          <div className={"col-12 mb-20"}>
            <h1>List</h1>
            <button onClick={handlerSetDefault}>기본값으로 초기화</button>
          </div>
          <div className={"col-12 mb-20"}>
            {tableNode()}
          </div>
          <div className={"col-12 mb-20"}>
            {buttonNode()}
          </div>
        </div>
      </div>
    </div>
  );
};