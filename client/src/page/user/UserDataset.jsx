// UserDataset.jsx

import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {useStorage} from "../../assets/hooks/useStorage.jsx";
import axios from "axios";
import {ButtonNode} from "../../assets/fragments/ButtonNode.jsx";

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
      titleIdx: 0
    }
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const USER_WORK_DEFAULT = [{
    work_part: "",
    work_title: [""]
  }];
  const USER_MONEY_DEFAULT = [{
    money_part: "",
    money_title: [""]
  }];
  const [USER_WORK, setUSER_WORK] = useState(USER_WORK_DEFAULT);
  const [USER_MONEY, setUSER_MONEY] = useState(USER_MONEY_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    alert(JSON.stringify(idx));
  }, [idx]);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_USER}/dataset`, {
      params: {
        user_id: user_id,
        user_pw: "123"
      }
    });
    setUSER_WORK(response.data.result.work || USER_WORK_DEFAULT);
    setUSER_MONEY(response.data.result.money || USER_MONEY_DEFAULT);
  })()}, [user_id]);

  // 3. flow -------------------------------------------------------------------------------------->
  const flowSave = async () => {
    const response = await axios.post(`${URL_USER}/save`, {
      user_id: user_id,
      USER: USER_WORK
    });
    if (response.data === "success") {
      alert("Save successfully");
      SEND.startDt = DATE.startDt;
      SEND.endDt = DATE.endDt;
      navParam(SEND.toList, {
        state: SEND
      });
    }
    else {
      alert(`${response.data}error`);
    }
  };

  // 5. table ------------------------------------------------------------------------------------->
  const tableNode = () => {
    function addPart() {
      const newPart = prompt("새로운 이름을 입력하세요.");
      if (newPart) {
        setUSER_WORK((prev) => ([
          ...prev, {
            work_part: newPart,
            work_title: ["default"]
          }
        ]));
      }
    };
    function renamePart(index) {
      return function() {
        const newPart = prompt("새로운 이름을 입력하세요.");
        if (newPart) {
          setUSER_WORK((prev) => ([
            ...prev.slice(0, index), {
              ...prev[index],
              work_part: newPart
            },
            ...prev.slice(index + 1)
          ]));
        }
      };
    };
    function removePart(index) {
      return function() {
        setUSER_WORK((prev) => ([
          ...prev.slice(0, index),
          ...prev.slice(index + 1)
        ]));
      };
    };
    function addTitle () {
      const index = idx.partIdx;
      return function() {
        const newTitle = prompt("새로운 이름을 입력하세요.");
        if (newTitle) {
          setUSER_WORK((prev) => ([
            ...prev.slice(0, index), {
              ...prev[index],
              work_title: [
                ...prev[index].work_title,
                newTitle
              ]
            },
            ...prev.slice(index + 1)
          ]));
        }
      };
    };
    function removeTitle(index) {
      return function() {
        setUSER_WORK((prev) => ([
          ...prev.slice(0, idx.partIdx), {
            ...prev[idx.partIdx],
            work_title: [
              ...prev[idx.partIdx].work_title.slice(0, index),
              ...prev[idx.partIdx].work_title.slice(index + 1)
            ]
          },
          ...prev.slice(idx.partIdx + 1)
        ]));
      };
    };
    function renameTitle(index) {
      return function() {
        const newTitle = prompt("새로운 이름을 입력하세요.");
        if (newTitle) {
          setUSER_WORK((prev) => ([
            ...prev.slice(0, idx.partIdx), {
              ...prev[idx.partIdx],
              work_title: [
                ...prev[idx.partIdx].work_title.slice(0, index),
                newTitle,
                ...prev[idx.partIdx].work_title.slice(index + 1)
              ]
            },
            ...prev.slice(idx.partIdx + 1)
          ]));
        }
      };
    };
    return (
      <table className={"table bg-white table-hover"}>
        <thead className={"table-primary"}>
          <tr>
            <th>part</th>
            <th>title</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {USER_WORK.map((item, index) => (
                <React.Fragment key={index}>
                  <div className={"pointer"} onClick={() => {
                    setIdx((prev) => ({
                      ...prev,
                      partIdx: index,
                      titleIdx: 0
                    }));
                  }}>
                    {item.work_part}
                  </div>
                  <span className={"pointer"} onClick={removePart(index)}>
                    x
                  </span>
                  <span className={"pointer"} onClick={renamePart(index)}>
                    rename
                  </span>
                </React.Fragment>
              ))}
            </td>
            <td>
              {USER_WORK[idx.partIdx]?.work_title.map((item, index) => (
                <React.Fragment key={index}>
                  <div className={"pointer"} onClick={() => {
                    setIdx((prev) => ({
                      ...prev,
                      titleIdx: index
                    }));
                  }}>
                    {item}
                  </div>
                  <span className={"pointer"} onClick={removeTitle(index)}>
                    x
                  </span>
                  <span className={"pointer"} onClick={renameTitle(index)}>
                    rename
                  </span>
                </React.Fragment>
              ))}
            </td>
          </tr>
          <tr>
            <td className={"pointer"} onClick={addPart}>
              추가
            </td>
            <td className={"pointer"} onClick={addTitle()}>
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
        SEND={SEND} flowSave={""} navParam={navParam}
        part={"user"} plan={""} type={"detail"}
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