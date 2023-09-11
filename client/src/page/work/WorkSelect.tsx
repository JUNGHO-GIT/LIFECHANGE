// WorkSelect.tsx
import React, {useEffect} from "react";

// ------------------------------------------------------------------------------------------------>
interface WorkSelectProps {
  work_renderAmount : any;
  work_part: string;
  work_title: string;
  setWorkRenderAmount: (value : any) => any;
  setWorkPart: (value : any) => any;
  setWorkTitle: (value : any) => any;
}

// ------------------------------------------------------------------------------------------------>
const selectOptions : any = {
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
export const WorkSelect: React.FC<WorkSelectProps> = ({
  work_renderAmount,
  work_part,
  work_title,
  setWorkRenderAmount,
  setWorkPart,
  setWorkTitle
}) => {
  useEffect(() => {
    if (work_part === "전체") {
      const allTitles: any = Object.values(selectOptions).flat();
      setWorkTitle(allTitles);
    } else if (selectOptions[work_part]) {
      setWorkTitle(selectOptions[work_part]);
    } else {
      setWorkTitle([]);
    }
  }, [work_part]);

  const renderAmount = () => {
    return (
      <input
        type="number"
        className="form-control"
        value={work_renderAmount}
        onChange={(e) => {
          const value = Number(e.target.value);
          if (value >= 0) {
            setWorkRenderAmount(value);
          }
        }}
      />
    );
  };

  const renderSelects = () => {
    return Array.from({ length: work_renderAmount }).map((_, index) => (
      <div className="row" key={index}>
        <div className="col-6">
          <div className="input-group mb-3">
            <span className="input-group-text">Part</span>
            <select className="form-select" value={work_part} onChange={(e) => {
              setWorkPart(e.target.value);
            }}>
              <option value="전체">전체</option>
              {Object.keys(selectOptions).map((part) => (
                <option key={part} value={part}>
                  {part}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-6">
          <div className="input-group mb-3">
            <span className="input-group-text">Title</span>
            <select className="form-select" value={work_title} onChange={(e) => {
              if (e.target.value === "전체" && work_part !== "전체") {
                setWorkTitle(selectOptions[work_part]);
              } else {
                setWorkTitle(e.target.value);
              }
            }}>
              <option value="전체">전체</option>
              {selectOptions[work_part]?.map((title: string) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div>
      <div className="row">
        <div className="col-6">
          <div className="input-group mb-3">
            <span className="input-group-text">Amount</span>
            {renderAmount()}
          </div>
        </div>
      </div>
      {renderSelects()}
    </div>
  );
};