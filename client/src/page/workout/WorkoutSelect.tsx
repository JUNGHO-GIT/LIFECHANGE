// WorkoutSelect.tsx
import React, {useState, useEffect} from "react";

// ------------------------------------------------------------------------------------------------>
interface WorkoutSelectProps {
  workoutPart: string;
  setWorkoutPart: (value: string) => void;
  workoutTitle: string;
  setWorkoutTitle: (value: string) => void;
}

// ------------------------------------------------------------------------------------------------>
export const WorkoutSelect : React.FC<WorkoutSelectProps> = ({
  workoutPart, setWorkoutPart,
  workoutTitle, setWorkoutTitle
}) => {

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

  // 2-1. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {
    if (partOptions.length > 0 && !workoutPart) {
      setWorkoutPart(partOptions[0]);
    }
  }, []);

  useEffect(() => {
    if (workoutPart && exerciseOptions[workoutPart].length > 0) {
      setWorkoutTitle(exerciseOptions[workoutPart][0]);
    }
  }, [workoutPart]);

  // 7. return ------------------------------------------------------------------------------------>
  return (
    <div>
      <select className="form-select" onChange={(e) => setWorkoutPart(e.target.value)}>
        {partOptions.map((part : any) => (
          <option key={part} value={part}>
            {part}
          </option>
        ))}
      </select>
      <select className="form-select" onChange={(e) => setWorkoutTitle(e.target.value)}>
        {workoutPart && exerciseOptions[workoutPart].map((exercise : any) => (
          <option key={exercise} value={exercise}>
            {exercise}
          </option>
        ))}
      </select>
    </div>
  );
};
