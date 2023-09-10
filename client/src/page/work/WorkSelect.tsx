// WorkSelect.tsx
import React, {useState, useEffect} from "react";

// ------------------------------------------------------------------------------------------------>
interface WorkPartSelectProps {
  work_part: string;
  setWorkPart: (value: string) => void;
}
interface WorkTitleSelectProps {
  work_part: string;
  work_title: string;
  setWorkTitle: (value: string) => void;
}

// ------------------------------------------------------------------------------------------------>
const partOptions : string[] = [
  "등", "하체", "가슴", "어깨", "삼두", "이두", "유산소", "회복",
];
const exerciseOptions : any = {
  등: [
    "데드리프트", "바벨로우", "덤벨로우", "시티드로우", "랫풀다운", "풀업",
  ],
  하체: [
    "백스쿼트", "프론트스쿼트", "핵스쿼트", "바벨런지", "덤벨런지", "레그프레스", "레그익스텐션", "레그컬",
  ],
  가슴: [
    "바벨벤치프레스", "덤벨벤치프레스", "머신벤치프레스", "인클라인벤치프레스", "디클라인벤치프레스", "덤벨플라이", "케이블플라이", "케이블크로스오버", "딥스", "푸쉬업",
  ],
  어깨: [
    "밀리터리프레스", "바벨프레스", "덤벨프레스", "머신프레스", "비하인드넥프레스", "프론트레터럴레이즈", "사이드레터럴레이즈", "벤트오버레터럴레이즈", "페이스풀",
  ],
  삼두: [
    "라잉트라이셉스익스텐션", "덤벨트라이셉스익스텐션", "오버헤드트라이셉스익스텐션", "클로즈그립벤치프레스", "케이블트라이셉스푸쉬다운", "케이블트라이셉스로프다운", "킥백",
  ],
  이두: [
    "바벨컬", "덤벨컬", "해머컬", "머신컬", "케이블컬", "바벨프리처컬", "덤벨프리처컬",
  ],
  유산소: [
    "걷기", "달리기", "스텝퍼", "자전거", "수영", "플랭크"
  ],
  회복: [
    "휴식"
  ],
};

// ------------------------------------------------------------------------------------------------>
export const WorkPartSelect : React.FC<WorkPartSelectProps> = ({
  work_part, setWorkPart
}) => {

  useEffect(() => {
    if (partOptions.length > 0 && !work_part) {
      setWorkPart(partOptions[0]);
    }
  }, []);

  return (
    <select className="form-select" onChange={(e) => setWorkPart(e.target.value)}>
      {partOptions.map((part: any) => (
        <option key={part} value={part}>
          {part}
        </option>
      ))}
    </select>
  );
};

// ------------------------------------------------------------------------------------------------>
export const WorkTitleSelect: React.FC<WorkTitleSelectProps> = ({
  work_part, work_title, setWorkTitle
}) => {

  useEffect(() => {
    if (work_part && exerciseOptions[work_part] && exerciseOptions[work_part].length > 0 && !work_title) {
      setWorkTitle(exerciseOptions[work_part][0]);
    }
  }, [work_part]);

  return (
    <select className="form-select" value={work_title} onChange={(e) => setWorkTitle(e.target.value)}>
      {work_part && exerciseOptions[work_part].map((exercise: any) => (
        <option key={exercise} value={exercise}>
          {exercise}
        </option>
      ))}
    </select>
  );
};
