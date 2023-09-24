// TestSection.tsx
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

// 1. main ---------------------------------------------------------------------------------------->
export const TestSection = (
  testSectionProps : any
) => {

  // title
  const TITLE = "Work Section";
  // url
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  // date
  const koreanDate = moment.tz("Asia/Seoul").format("YYYY-MM-DD").toString();
  // val
  const user_id = window.sessionStorage.getItem("user_id");
  // useState
  const [workAmount, setWorkAmount] = useState<number>(1);
  const [work_part, setWork_part] = useState("전체");
  const [work_title, setWork_title] = useState("전체");
  const [selectNumber, setSelectNumber] = useState(0);
  const [testSection, setTestSection] = useState<any>([{testSectionProps}]);

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    setTestSection([{
      ...testSection[0],
      work_part : work_part,
      work_title : work_title
    }]);
  }, [work_part, work_title]);





  // 7. return ------------------------------------------------------------------------------------>
  return (

  );
};