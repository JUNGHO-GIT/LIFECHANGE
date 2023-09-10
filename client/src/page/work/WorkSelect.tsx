// WorkSelect.tsx
import React, {useEffect} from "react";

// ------------------------------------------------------------------------------------------------>
interface WorkPartSelectProps {
  work_part: string;
  setWorkPart: (value : string) => any;
}
interface WorkTitleSelectProps {
  work_part: string;
  work_title: string;
  setWorkTitle: (value : string) => any;
}

// ------------------------------------------------------------------------------------------------>
const partOptions : string[] = [
  "등", "하체", "가슴", "어깨", "삼두", "이두", "유산소", "회복",
];
const titleOptions : any = {
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
  work_part,
  setWorkPart
}) => {

  return (
    <select className="form-select" value={work_part} onChange={(e) => {
      setWorkPart(e.target.value);
    }}>
      <option value="전체">전체</option>
      {partOptions.map((part) => (
        <option key={part} value={part}>
          {part}
        </option>
      ))}
    </select>
  );
};

// ------------------------------------------------------------------------------------------------>
export const WorkTitleSelect: React.FC<WorkTitleSelectProps> = ({
  work_part,
  work_title,
  setWorkTitle
}) => {

  useEffect(() => {
    if (work_part === "전체") {
      const allTitles:any = Object.values(titleOptions).flat();
      setWorkTitle(allTitles);
    }
    else if (titleOptions[work_part]) {
      setWorkTitle(titleOptions[work_part]);
    }
  }, [work_part]);

  const getCurrentTitles = () => {
    if (work_part === "전체") {
      return Object.values(titleOptions).flat();
    }
    else {
      return titleOptions[work_part];
    }
  }
  return (
    <select className="form-select" value={work_title} onChange={(e) => {
      const selectedValue = e.target.value;
      setWorkTitle(selectedValue === "전체" ? getCurrentTitles() : selectedValue);
    }}>
      <option value="전체">전체</option>
      {getCurrentTitles().map((title: string) => (
        <option key={title} value={title}>
          {title}
        </option>
      ))}
    </select>
  );
};
