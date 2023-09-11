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
    const data:any = selectedWorkTypes.map((type, index) => {
      const selectedWork = document.querySelectorAll("select")[index * 2 + 1].value;
      let works: string;
      let workType;

      if (type === "전체") {
        workType = Object.keys(WORK[0]).filter(item => item !== "전체").join(", ");
        works = WORK[0]["전체"].join(', ');
      }
      else {
        works = selectedWork === "전체" ? WORK[0][type].join(', ') : selectedWork;
        workType = type;
      }

      return {
        workType : workType,
        work : works
      };
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
      <div className="input-group">
        <span className="input-group-text">운동 총 갯수</span>
        <input type="number" className="form-control" defaultValue={1} value={workRenderAmount}
          min={1} onChange={(e) => {
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
      </div>
    );
  };

  // ---------------------------------------------------------------------------------------------->
  const workRender = () => {
    let workRenderList = [];

    for (let i = 0; i < workRenderAmount; i++) {
      workRenderList.push (
        <div className="input-group">
          <span className="input-group-text">부위 - 운동</span>
          <div key={i} className="d-flex">
            <select value={selectedWorkTypes[i] || "전체"} className="form-select"
            onChange={(e) => {
              updateSelectedWorkType(i, e.target.value);
            }}>
              {Object.keys(WORK[0]).map((item, index) => {
                return (
                  <option key={index} value={item}>
                    {item}
                  </option>
                );
              })}
            </select>
            <select className="form-select">
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
        </div>
      );
    }
    return workRenderList;
  };

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="row d-center">
      <div className="col-3">
        {setAmount()}
      </div>
      <div className="col-9">
        {workRender()}
      </div>
    </div>
  );
};

