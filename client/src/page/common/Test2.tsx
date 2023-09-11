import React, {useEffect, useState} from "react";

const workArray: Record<string, string[]> = {
  "전체": [
  ],
  "등" : [
    "데드리프트", "바벨로우", "덤벨로우", "시티드로우", "랫풀다운", "풀업"
  ],
  "하체" : [
    "백스쿼트", "프론트스쿼트", "핵스쿼트", "바벨런지", "덤벨런지", "레그프레스", "레그익스텐션", "레그컬"
  ],
  "가슴" : [
    "바벨벤치프레스", "덤벨벤치프레스", "머신벤치프레스", "인클라인벤치프레스", "디클라인벤치프레스", "덤벨플라이", "케이블플라이", "케이블크로스오버", "딥스", "푸쉬업"
  ],
  "어깨" : [
    "밀리터리프레스", "바벨프레스", "덤벨프레스", "머신프레스", "비하인드넥프레스", "프론트레터럴레이즈", "사이드레터럴레이즈", "벤트오버레터럴레이즈", "페이스풀"
  ],
  "삼두" : [
    "라잉트라이셉스익스텐션", "덤벨트라이셉스익스텐션", "오버헤드트라이셉스익스텐션", "클로즈그립벤치프레스", "케이블트라이셉스푸쉬다운", "케이블트라이셉스로프다운", "킥백"
  ],
  "이두" : [
    "바벨컬", "덤벨컬", "해머컬", "머신컬", "케이블컬", "바벨프리처컬", "덤벨프리처컬"
  ],
  "유산소" : [
    "걷기", "달리기", "스텝퍼", "자전거", "수영", "플랭크"
  ],
  "회복" : [
    "휴식"
  ],
};

// ------------------------------------------------------------------------------------------------>
export const Test2 = () => {

  // ---------------------------------------------------------------------------------------------->
  const [workRenderAmount, setWorkRenderAmount] = useState<number>(1);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(
    Array(workRenderAmount).fill("전체")
  );
  const [WORK, setWORK] = useState<Record<string, string[]>[]>([workArray]);
  const [selectedData, setSelectedData] = useState<{workType: string, work: string[]}[]>([]);

  // ---------------------------------------------------------------------------------------------->
  useEffect(() => {
    const allValues = Object.values(WORK[0])
    .flat()
    .filter((item) => item !== "전체");

    setWORK((prevState) => {
      return [{ ...prevState[0], "전체": [...new Set(allValues)] }];
    });
  }, []);

  // ---------------------------------------------------------------------------------------------->
  const handleInsert = () => {
    const data = selectedWorkTypes.map((type, index) => {
      const selectedWork = document.querySelectorAll("select")[index * 2 + 1].value;

      if (type === "전체") {
        const allWorkTypes = Object.keys(WORK[0]).filter(item => item !== "전체").join(", ");
        return {
          workType: allWorkTypes,
          work: WORK[0]["전체"]
        };
      }
      else {
        const works = selectedWork === "전체" ? WORK[0][type] : [selectedWork];
        return {
          workType: type,
          work: works
        };
      }
    });
    setSelectedData(data);
  };

  // ---------------------------------------------------------------------------------------------->
  const updateSelectedWorkType = (index: number, value: string) => {
    const updatedWorkTypes = [...selectedWorkTypes];
    updatedWorkTypes[index] = value;
    setSelectedWorkTypes(updatedWorkTypes);
  };

  // ---------------------------------------------------------------------------------------------->
  const setAmount = () => {
    return (
      <input
        type="number"
        className="form-control"
        defaultValue={1}
        value={workRenderAmount}
        min={1}
        onChange={(e) => {
          const newAmount = Number(e.target.value);

          setWorkRenderAmount(newAmount);

          setSelectedWorkTypes((prev) => {
            if (newAmount > prev.length) {
              return [...prev, ...Array(newAmount - prev.length).fill("전체")];
            }
            else {
              return prev.slice(0, newAmount);
            }
          });
        }}
      />
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const workRender = () => {
    let workRenderList = [];

    for (let i = 0; i < workRenderAmount; i++) {
      workRenderList.push(
        <div key={i}>
          <select
            value={selectedWorkTypes[i] || "전체"}
            onChange={(e) => {
              updateSelectedWorkType(i, e.target.value);
            }}
          >
            {Object.keys(WORK[0]).map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
          <select>
            <option value="전체">전체</option>
            {(WORK[0][selectedWorkTypes[i]] || []).map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
      );
    }
    return workRenderList;
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="container mt-20">
      <div className="row d-center">
        <div className="col-3">
          {setAmount()}
        </div>
        <div className="col-9">
          {workRender()}
          <button onClick={handleInsert}>Insert</button>
        </div>
      </div>
      <div className="mt-20">
        <h4>선택된 데이터:</h4>
        <div>
          {selectedData.map((data, index) => (
            <div key={index}>
              <span>{data.workType}</span> - <span>{data.work.join(', ')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};