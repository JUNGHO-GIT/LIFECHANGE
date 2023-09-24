// WorkSection.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment-timezone";

// 0. etc ----------------------------------------------------------------------------------------->
const workArray = [
  {
    workPart: ["전체"],
    workTitle: ["전체"],
  },
  {
    workPart: ["등"],
    workTitle: [
      "전체",
      "데드리프트",
      "바벨로우",
      "덤벨로우",
      "시티드로우",
      "랫풀다운",
      "풀업",
    ],
  },
  {
    workPart: ["하체"],
    workTitle: [
      "전체",
      "백스쿼트",
      "프론트스쿼트",
      "핵스쿼트",
      "바벨런지",
      "덤벨런지",
      "레그프레스",
      "레그익스텐션",
      "레그컬",
    ],
  },
  {
    workPart: ["가슴"],
    workTitle: [
      "전체",
      "바벨벤치프레스",
      "덤벨벤치프레스",
      "머신벤치프레스",
      "인클라인벤치프레스",
      "디클라인벤치프레스",
      "덤벨플라이",
      "케이블플라이",
      "케이블크로스오버",
      "딥스",
      "푸쉬업",
    ],
  },
  {
    workPart: ["어깨"],
    workTitle: [
      "전체",
      "밀리터리프레스",
      "바벨프레스",
      "덤벨프레스",
      "머신프레스",
      "비하인드넥프레스",
      "프론트레터럴레이즈",
      "사이드레터럴레이즈",
      "벤트오버레터럴레이즈",
      "페이스풀",
    ],
  },
  {
    workPart: ["삼두"],
    workTitle: [
      "전체",
      "라잉트라이셉스익스텐션",
      "덤벨트라이셉스익스텐션",
      "오버헤드트라이셉스익스텐션",
      "클로즈그립벤치프레스",
      "케이블트라이셉스푸쉬다운",
      "케이블트라이셉스로프다운",
      "킥백",
    ],
  },
  {
    workPart: ["이두"],
    workTitle: [
      "전체",
      "바벨컬",
      "덤벨컬",
      "해머컬",
      "머신컬",
      "케이블컬",
      "바벨프리처컬",
      "덤벨프리처컬",
    ],
  },
  {
    workPart: ["유산소"],
    workTitle: [
      "전체",
      "걷기",
      "달리기",
      "스텝퍼",
      "자전거",
      "수영",
      "플랭크"
    ],
  },
  {
    workPart: ["휴식"],
    workTitle: ["휴식"],
  },
];

interface WorkSectionProps {
  work_part: string;
  work_title: string;
  work_set: string;
  work_count: string;
  work_kg: string;
  work_rest: string;
}

// 1. main ---------------------------------------------------------------------------------------->
export const WorkSection : React.FC<{ workSectionProps: WorkSectionProps[] }> = (
  { workSectionProps }
) => {

  // title
  const TITLE = "Work Section";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // hook
  const navParam = useNavigate();
  const location = useLocation();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // useState
  const [workAmount, setWorkAmount] = useState<number>(1);
  const [work_part, setWorkPart] = useState("전체");
  const [work_title, setWorkTitle] = useState("전체");
  const [selectNumber, setSelectNumber] = useState(0);
  const [workSection, setWorkSection] = useState<any>([{}]);

  // 2-2. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    let workPartAll:any = [];
    let resultPart;

    let workTitleAll:any = [];
    let resultTitle;

    Object.values(workArray).flatMap((value, index) => {
      if (work_part == "전체") {
        if (work_part == "전체" && work_title == "전체") {
          workPartAll.push(value.workPart[0]);
          resultPart = workPartAll.join(",").slice(3);
          setWorkPart(resultPart);

          workTitleAll.push(value.workTitle);
          resultTitle = workTitleAll.join(",").slice(3);
          setWorkTitle(resultTitle);
        }
      }
      else if (work_part != "전체") {
        if (work_part == workArray[index].workPart[0] && work_title == "전체") {
          workTitleAll.push(workArray[index].workTitle);
          resultTitle = workTitleAll.join(",").slice(3);
          setWorkTitle(resultTitle);
        }
        else if (work_part == workArray[index].workPart[0] && work_title != "전체") {
          setSelectNumber(index);
        }
      }
    })
  }, [work_part, work_title]);

  // 5-1. table ----------------------------------------------------------------------------------->
  const tableWorkSection = (i:number) => {

    const updateWorkSection = (index: number, value: any) => {
      const newWorkSection = [...workSection];
      newWorkSection[index] = value;
      setWorkSection(newWorkSection);
    };

    return (
      <div key={i}>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동파트</span>
              <select
                className="form-control"
                id={`work_part-${i}`}
                onChange={(e) => {
                  setWorkPart(e.target.value);
                  setWorkTitle("전체");
                  updateWorkSection(i, { ...workSection[i], work_part: e.target.value });
                }}>
                {Object.keys(workArray).flatMap((key) =>
                  Object.values(workArray[key].workPart).flatMap((value, index) => (
                    <option value={value} key={`${key}-${index}`}>
                      {value}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">운동종목</span>
              <select
                className="form-control"
                id={`work_title-${i}`}
                onChange={(e) => {
                  setWorkTitle(e.target.value);
                  updateWorkSection(i, { ...workSection[i], work_title: e.target.value });
                }}>
                {Object.values(workArray[selectNumber].workTitle).flatMap((value, index) => (
                  <option value={value} key={`${selectNumber}-${index}`}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Set</span>
              <input
                type="text"
                className="form-control"
                placeholder="Set"
                id={`work_set-${i}`}
                value={workSection[i]?.work_set}
                onChange={(e) => {
                  updateWorkSection(i, { ...workSection[i], work_set: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Count</span>
              <input
                type="text"
                className="form-control"
                placeholder="Count"
                id={`work_count-${i}`}
                value={workSection[i]?.work_count}
                onChange={(e) => {
                  updateWorkSection(i, { ...workSection[i], work_count: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
        <div className="row d-center">
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Kg</span>
              <input
                type="text"
                className="form-control"
                placeholder="Kg"
                id={`work_kg-${i}`}
                value={workSection[i]?.work_kg}
                onChange={(e) => {
                  updateWorkSection(i, { ...workSection[i], work_kg: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="col-5">
            <div className="input-group mb-3">
              <span className="input-group-text">Rest</span>
              <input
                type="text"
                className="form-control"
                placeholder="Rest"
                id={`work_rest-${i}`}
                value={workSection[i]?.work_rest}
                onChange={(e) => {
                  updateWorkSection(i, { ...workSection[i], work_rest: e.target.value });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div>
      <input
        type="number"
        value={workAmount}
        onChange={(e) => {
          setWorkAmount(parseInt(e.target.value));
        }}
      />
      {Array.from({ length: workAmount }, (_, i) => tableWorkSection(i))}
    </div>
  );
};